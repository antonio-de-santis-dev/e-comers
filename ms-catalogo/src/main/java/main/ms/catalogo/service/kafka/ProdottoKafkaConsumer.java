package main.ms.catalogo.service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import main.ms.catalogo.service.ProdottoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;


@Component
public class ProdottoKafkaConsumer {

    private final Logger log = LoggerFactory.getLogger(ProdottoKafkaConsumer.class);

    private final ProdottoService prodottoService;
    private final ObjectMapper objectMapper;

    public ProdottoKafkaConsumer(ProdottoService prodottoService,
                                 ObjectMapper objectMapper) {
        this.prodottoService = prodottoService;
        this.objectMapper = objectMapper;
    }


    @KafkaListener(
        topics = "ordine-confermato",
        groupId = "ms-catalogo-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void onOrdineConfermato(String messaggio) {
        log.info("Ricevuto evento ordine-confermato: {}", messaggio);

        try {
            // Deserializza il JSON del messaggio
            Map<String, Object> payload = objectMapper.readValue(messaggio, Map.class);

            String ordineId = (String) payload.get("ordineId");
            List<Map<String, Object>> righe = (List<Map<String, Object>>) payload.get("righe");

            if (righe == null || righe.isEmpty()) {
                log.warn("Evento ordine-confermato senza righe per ordineId={}", ordineId);
                return;
            }

            // Per ogni riga d'ordine: decrementa scorte + incrementa totalePurchased
            for (Map<String, Object> riga : righe) {
                UUID prodottoId = UUID.fromString((String) riga.get("prodottoId"));
                Integer quantita = (Integer) riga.get("quantita");

                if (prodottoId == null || quantita == null || quantita <= 0) {
                    log.warn("Riga non valida in ordine {}: {}", ordineId, riga);
                    continue;
                }

                // Decrementa scorte — se arriva a 0, disponibile=false automatico
                prodottoService.decrementaScorte(prodottoId, quantita);

                // Incrementa contatore acquisti (per carosello top venduti)
                prodottoService.incrementaTotalePurchased(prodottoId, quantita);
            }

            log.info("Scorte aggiornate per ordine {}: {} righe processate",
                ordineId, righe.size());

        } catch (Exception e) {
            // NON rilancia l'eccezione: un errore di parsing non deve
            // bloccare il consumer Kafka. Logghiamo e andiamo avanti.
            log.error("Errore elaborazione evento ordine-confermato: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
        topics = "recensione-approvata",
        groupId = "ms-catalogo-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void onRecensioneApprovata(String messaggio) {
        log.info("Ricevuto evento recensione-approvata: {}", messaggio);

        try {
            Map<String, Object> payload = objectMapper.readValue(messaggio, Map.class);

            UUID prodottoId = UUID.fromString((String) payload.get("prodottoId"));

            // La media può arrivare come Double o Integer a seconda del JSON
            Double nuovaMedia = ((Number) payload.get("nuovaMediaVoti")).doubleValue();

            if (prodottoId == null || nuovaMedia == null) {
                log.warn("Evento recensione-approvata con dati mancanti: {}", messaggio);
                return;
            }

            prodottoService.aggiornaVotoTotale(prodottoId, nuovaMedia);

            log.info("VotoTotale aggiornato per prodotto {}: nuovaMedia={}",
                prodottoId, nuovaMedia);

        } catch (Exception e) {
            log.error("Errore elaborazione evento recensione-approvata: {}", e.getMessage(), e);
        }
    }
}
