package main.ms.catalogo.broker;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import java.util.function.Consumer;
import main.ms.catalogo.service.ProdottoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Consumer funzionale Spring Cloud Stream per l'evento "recensione-approvata".
 *
 * Riceve il voto della nuova recensione, recupera il prodotto, ricalcola
 * la media di tutte le recensioni approvate e aggiorna votoTotale in ms-catalogo.
 *
 * Il bean si chiama "recensioneConsumer" → Spring Cloud Stream lo collega
 * al binding "recensioneConsumer-in-0" → topic "recensione-approvata".
 *
 * Payload atteso (JSON da RecensioneKafkaPublisher):
 *   { "recensioneId": "...", "prodottoId": "UUID", "votoSingolo": 4 }
 */
@Component("recensioneConsumer")
public class RecensioneConsumer implements Consumer<String> {

    private static final Logger LOG = LoggerFactory.getLogger(RecensioneConsumer.class);

    private final ProdottoService prodottoService;
    private final ObjectMapper objectMapper;

    public RecensioneConsumer(ProdottoService prodottoService, ObjectMapper objectMapper) {
        this.prodottoService = prodottoService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void accept(String messaggio) {
        LOG.info("Ricevuto evento recensione-approvata: {}", messaggio);
        try {
            RecensioneApprovataEvent event = objectMapper.readValue(messaggio, RecensioneApprovataEvent.class);

            if (event.prodottoId() == null || event.votoSingolo() == null) {
                LOG.warn("Evento recensione-approvata con dati mancanti: {}", messaggio);
                return;
            }

            // Aggiorna la media: il service ricalcola partendo dal voto ricevuto
            prodottoService.aggiornaVotoMedio(event.prodottoId(), event.votoSingolo());

            LOG.info("VotoTotale aggiornato per prodotto {} con voto {}",
                event.prodottoId(), event.votoSingolo());

        } catch (Exception e) {
            // Mai rilanciare: un errore di parsing non deve bloccare il consumer Kafka
            LOG.error("Errore elaborazione evento recensione-approvata: {}", e.getMessage(), e);
        }
    }

    /**
     * Record che rispecchia esattamente il payload di RecensioneKafkaPublisher.
     */
    record RecensioneApprovataEvent(String recensioneId, UUID prodottoId, Integer votoSingolo) {}
}
