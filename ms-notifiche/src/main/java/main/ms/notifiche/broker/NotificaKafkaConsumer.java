package main.ms.notifiche.broker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import main.ms.notifiche.service.NotificaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class NotificaKafkaConsumer {

    private static final Logger LOG = LoggerFactory.getLogger(NotificaKafkaConsumer.class);

    private final NotificaService notificaService;
    private final ObjectMapper objectMapper;

    public NotificaKafkaConsumer(NotificaService notificaService, ObjectMapper objectMapper) {
        this.notificaService = notificaService;
        this.objectMapper = objectMapper;
    }

    /**
     * Ascolta topic ordine-confermato (prodotto da ms-ordini quando stato=PAGATO)
     */
    @Bean
    public Consumer<String> ordineConfermato() {
        return payload -> {
            LOG.info("Ricevuto evento ordine-confermato: {}", payload);
            try {
                JsonNode node = objectMapper.readTree(payload);
                String ordineId = node.has("ordineId") ? node.get("ordineId").asText() : payload;
                notificaService.creaNotifica(
                    "ORDINE_CONFERMATO",
                    "Il tuo ordine è stato confermato e pagato.",
                    ordineId
                );
            } catch (Exception e) {
                LOG.error("Errore parsing evento ordine-confermato: {}", e.getMessage());
                notificaService.creaNotifica("ORDINE_CONFERMATO", "Ordine confermato.", payload);
            }
        };
    }

    /**
     * Ascolta topic pagamento-approvato (prodotto da ms-pagamenti quando stato=APPROVATO)
     */
    @Bean
    public Consumer<String> pagamentoApprovato() {
        return payload -> {
            LOG.info("Ricevuto evento pagamento-approvato: {}", payload);
            try {
                JsonNode node = objectMapper.readTree(payload);
                String pagamentoId = node.has("pagamentoId") ? node.get("pagamentoId").asText() : payload;
                notificaService.creaNotifica(
                    "PAGAMENTO_APPROVATO",
                    "Il tuo pagamento è stato approvato.",
                    pagamentoId
                );
            } catch (Exception e) {
                LOG.error("Errore parsing evento pagamento-approvato: {}", e.getMessage());
                notificaService.creaNotifica("PAGAMENTO_APPROVATO", "Pagamento approvato.", payload);
            }
        };
    }

    /**
     * Ascolta topic recensione-approvata (prodotto da ms-recensioni quando approvata=true)
     */
    @Bean
    public Consumer<String> recensioneApprovata() {
        return payload -> {
            LOG.info("Ricevuto evento recensione-approvata: {}", payload);
            try {
                JsonNode node = objectMapper.readTree(payload);
                String recensioneId = node.has("recensioneId") ? node.get("recensioneId").asText() : payload;
                notificaService.creaNotifica(
                    "RECENSIONE_APPROVATA",
                    "La tua recensione è stata approvata.",
                    recensioneId
                );
            } catch (Exception e) {
                LOG.error("Errore parsing evento recensione-approvata: {}", e.getMessage());
                notificaService.creaNotifica("RECENSIONE_APPROVATA", "Recensione approvata.", payload);
            }
        };
    }
}
