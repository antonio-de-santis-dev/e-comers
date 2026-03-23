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
     * Topic ordine-confermato — payload da OrdineService:
     * { ordineId, clienteId, emailCliente, nomeCliente, cognomeCliente, numeroOrdine }
     */
    @Bean
    public Consumer<String> ordineConfermato() {
        return payload -> {
            LOG.info("Ricevuto evento ordine-confermato: {}", payload);
            try {
                JsonNode node = objectMapper.readTree(payload);
                String ordineId      = node.has("ordineId")      ? node.get("ordineId").asText()      : payload;
                String emailCliente  = node.has("emailCliente")  ? node.get("emailCliente").asText()  : "";
                String nomeCliente   = node.has("nomeCliente")   ? node.get("nomeCliente").asText()   : "";
                String numeroOrdine  = node.has("numeroOrdine")  ? node.get("numeroOrdine").asText()  : ordineId;

                String messaggio = String.format(
                    "Ciao %s, il tuo ordine %s è stato confermato e pagato con successo.",
                    nomeCliente, numeroOrdine
                );

                notificaService.creaNotifica("ORDINE_CONFERMATO", messaggio, ordineId, emailCliente);

            } catch (Exception e) {
                LOG.error("Errore parsing evento ordine-confermato: {}", e.getMessage());
                notificaService.creaNotifica("ORDINE_CONFERMATO", "Ordine confermato.", payload, "");
            }
        };
    }

    /**
     * Topic pagamento-approvato — payload da PagamentoService:
     * { pagamentoId, ordineId, importo, metodoPagamento }
     */
    @Bean
    public Consumer<String> pagamentoApprovato() {
        return payload -> {
            LOG.info("Ricevuto evento pagamento-approvato: {}", payload);
            try {
                JsonNode node = objectMapper.readTree(payload);
                String pagamentoId = node.has("pagamentoId") ? node.get("pagamentoId").asText() : payload;
                String ordineId    = node.has("ordineId")    ? node.get("ordineId").asText()    : "";
                String importo     = node.has("importo")     ? node.get("importo").asText()     : "";

                String messaggio = String.format(
                    "Pagamento di €%s approvato per l'ordine %s.", importo, ordineId
                );

                notificaService.creaNotifica("PAGAMENTO_APPROVATO", messaggio, pagamentoId, "");

            } catch (Exception e) {
                LOG.error("Errore parsing evento pagamento-approvato: {}", e.getMessage());
                notificaService.creaNotifica("PAGAMENTO_APPROVATO", "Pagamento approvato.", payload, "");
            }
        };
    }

    /**
     * Topic recensione-approvata — payload da RecensioneService
     */
    @Bean
    public Consumer<String> recensioneApprovata() {
        return payload -> {
            LOG.info("Ricevuto evento recensione-approvata: {}", payload);
            try {
                JsonNode node = objectMapper.readTree(payload);
                String recensioneId = node.has("recensioneId") ? node.get("recensioneId").asText() : payload;
                String nomeCliente  = node.has("nomeCliente")  ? node.get("nomeCliente").asText()  : "";

                String messaggio = String.format(
                    "Ciao %s, la tua recensione è stata approvata e pubblicata.", nomeCliente
                );

                notificaService.creaNotifica("RECENSIONE_APPROVATA", messaggio, recensioneId, "");

            } catch (Exception e) {
                LOG.error("Errore parsing evento recensione-approvata: {}", e.getMessage());
                notificaService.creaNotifica("RECENSIONE_APPROVATA", "Recensione approvata.", payload, "");
            }
        };
    }
}
