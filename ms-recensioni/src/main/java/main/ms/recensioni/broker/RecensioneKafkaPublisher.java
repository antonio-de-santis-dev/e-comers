package main.ms.recensioni.broker;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Bean separato per la pubblicazione asincrona di eventi Kafka.
 *
 * NOTA: il metodo publish() deve stare in un bean DIVERSO da RecensioneService
 * perché @Async funziona solo su chiamate che passano per il proxy Spring AOP.
 * Se il metodo stesse in RecensioneService e venisse chiamato con this.publish(),
 * Spring bypasserebbe il proxy e @Async sarebbe ignorato, causando un potenziale 500
 * quando Kafka non è raggiungibile.
 */
@Component
public class RecensioneKafkaPublisher {

    private static final Logger LOG = LoggerFactory.getLogger(RecensioneKafkaPublisher.class);

    private final StreamBridge streamBridge;
    private final ObjectMapper objectMapper;

    public RecensioneKafkaPublisher(StreamBridge streamBridge, ObjectMapper objectMapper) {
        this.streamBridge = streamBridge;
        this.objectMapper = objectMapper;
    }

    /**
     * Pubblica l'evento "recensione-approvata" su Kafka in modo asincrono.
     * Viene eseguito su un thread del pool — un errore Kafka non causa mai un 500 HTTP.
     */
    @Async("taskExecutor")
    public void pubblicaRecensioneApprovata(String recensioneId, UUID prodottoId, Integer votoSingolo) {
        try {
            RecensioneApprovataEvent event = new RecensioneApprovataEvent(recensioneId, prodottoId, votoSingolo);
            String payload = objectMapper.writeValueAsString(event);
            streamBridge.send("kafkaProducer-out-0", payload);
            LOG.info("Evento recensione-approvata pubblicato per prodotto: {}", prodottoId);
        } catch (Exception e) {
            LOG.error(
                "Errore pubblicazione evento Kafka per recensione {}: {}",
                recensioneId,
                e.getMessage()
            );
        }
    }

    public record RecensioneApprovataEvent(String recensioneId, UUID prodottoId, Integer votoSingolo) {}
}
