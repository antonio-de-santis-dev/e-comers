package main.ms.ordini.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;
import main.ms.ordini.domain.Ordine;
import main.ms.ordini.domain.RigaOrdine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import tech.jhipster.config.JHipsterProperties;

/**
 * Invia email di conferma ordine al cliente in modo asincrono.
 * Non blocca mai il thread HTTP — un errore SMTP viene loggato e ignorato.
 */
@Service
public class OrdineMailService {

    private static final Logger LOG = LoggerFactory.getLogger(OrdineMailService.class);

    private static final DateTimeFormatter DATA_FMT =
        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.of("Europe/Rome"));

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final JHipsterProperties jHipsterProperties;

    public OrdineMailService(JavaMailSender mailSender,
                             SpringTemplateEngine templateEngine,
                             JHipsterProperties jHipsterProperties) {
        this.mailSender        = mailSender;
        this.templateEngine    = templateEngine;
        this.jHipsterProperties = jHipsterProperties;
    }

    /**
     * Manda l'email di conferma ordine al cliente.
     * @param ordine     entità ordine appena salvata
     * @param righe      righe ordine associate
     * @param metodo     metodo pagamento (es. "CARTA_CREDITO")
     */
    @Async("taskExecutor")
    public void inviaConfermaOrdine(Ordine ordine, List<RigaOrdine> righe, String metodo) {
        if (ordine.getEmail() == null || ordine.getEmail().isBlank()) {
            LOG.warn("Email assente per ordine {} — conferma non inviata", ordine.getNumeroOrdine());
            return;
        }

        try {
            Context ctx = new Context();
            ctx.setVariable("ordine",   ordine);
            ctx.setVariable("righe",    righe);
            ctx.setVariable("metodo",   formattaMetodo(metodo));
            ctx.setVariable("data",     ordine.getDataCreazione() != null
                                            ? DATA_FMT.format(ordine.getDataCreazione())
                                            : "—");
            ctx.setVariable("baseUrl",  jHipsterProperties.getMail().getBaseUrl());

            String html    = templateEngine.process("mail/confermaOrdine", ctx);
            String subject = "✅ Conferma ordine " + ordine.getNumeroOrdine();

            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                msg, false, StandardCharsets.UTF_8.name());
            helper.setFrom(jHipsterProperties.getMail().getFrom());
            helper.setTo(ordine.getEmail());
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(msg);
            LOG.info("Email conferma ordine inviata a {} per ordine {}",
                ordine.getEmail(), ordine.getNumeroOrdine());

        } catch (MailException | MessagingException e) {
            LOG.error("Impossibile inviare email conferma ordine {}: {}",
                ordine.getNumeroOrdine(), e.getMessage());
        }
    }

    private String formattaMetodo(String metodo) {
        if (metodo == null) return "—";
        return switch (metodo) {
            case "CARTA_CREDITO" -> "Carta di credito";
            case "CARTA_DEBITO"  -> "Carta di debito";
            case "PAYPAL"        -> "PayPal";
            default              -> metodo;
        };
    }
}
