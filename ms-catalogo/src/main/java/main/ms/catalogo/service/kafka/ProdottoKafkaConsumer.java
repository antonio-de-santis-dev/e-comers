package main.ms.catalogo.service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import main.ms.catalogo.service.ProdottoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Consumer funzionale Spring Cloud Stream per l'evento "ordine-confermato".
 *
 * Il bean si chiama "kafkaConsumer" → Spring Cloud Stream lo collega al binding
 * "kafkaConsumer-in-0" → topic "ordine-confermato" (configurato in application.yml).
 *
 * Payload atteso (JSON):
 *   { "ordineId": "...", "righe": [ { "prodottoId": "UUID", "quantita": 2 }, ... ] }
 */
@Component("kafkaConsumer")
public class ProdottoKafkaConsumer implements Consumer<String> {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoKafkaConsumer.class);

    private final ProdottoService prodottoService;
    private final ObjectMapper objectMapper;

    public ProdottoKafkaConsumer(ProdottoService prodottoService, ObjectMapper objectMapper) {
        this.prodottoService = prodottoService;
        this.objectMapper = objectMapper;
    }

    @Override
    @SuppressWarnings("unchecked")
    public void accept(String messaggio) {
        LOG.info("Ricevuto evento ordine-confermato: {}", messaggio);
        try {
            Map<String, Object> payload = objectMapper.readValue(messaggio, Map.class);
            String ordineId = (String) payload.get("ordineId");
            List<Map<String, Object>> righe = (List<Map<String, Object>>) payload.get("righe");

            if (righe == null || righe.isEmpty()) {
                LOG.warn("Evento ordine-confermato senza righe per ordineId={}", ordineId);
                return;
            }

            for (Map<String, Object> riga : righe) {
                UUID prodottoId = UUID.fromString((String) riga.get("prodottoId"));
                Integer quantita = (Integer) riga.get("quantita");

                if (prodottoId == null || quantita == null || quantita <= 0) {
                    LOG.warn("Riga non valida in ordine {}: {}", ordineId, riga);
                    continue;
                }

                prodottoService.decrementaScorte(prodottoId, quantita);
                prodottoService.incrementaTotalePurchased(prodottoId, quantita);
            }

            LOG.info("Scorte aggiornate per ordine {}: {} righe processate", ordineId, righe.size());

        } catch (Exception e) {
            LOG.error("Errore elaborazione evento ordine-confermato: {}", e.getMessage(), e);
        }
    }
}
