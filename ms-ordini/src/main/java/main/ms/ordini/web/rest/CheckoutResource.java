package main.ms.ordini.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import main.ms.ordini.domain.Ordine;
import main.ms.ordini.domain.RigaOrdine;
import main.ms.ordini.domain.enumeration.StatoOrdine;
import main.ms.ordini.domain.enumeration.TipoSpedizione;
import main.ms.ordini.repository.OrdineRepository;
import main.ms.ordini.repository.RigaOrdineRepository;
import main.ms.ordini.service.OrdineMailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint unico per il checkout — crea ordine + righe + invia email di conferma.
 * POST /api/checkout — accessibile senza autenticazione.
 */
@RestController
@RequestMapping("/api/checkout")
public class CheckoutResource {

    private static final Logger LOG = LoggerFactory.getLogger(CheckoutResource.class);

    private static final DateTimeFormatter FMT =
        DateTimeFormatter.ofPattern("yyyyMMdd").withZone(ZoneId.of("Europe/Rome"));

    private final OrdineRepository ordineRepository;
    private final RigaOrdineRepository rigaOrdineRepository;
    private final OrdineMailService ordineMailService;

    public CheckoutResource(
        OrdineRepository ordineRepository,
        RigaOrdineRepository rigaOrdineRepository,
        OrdineMailService ordineMailService
    ) {
        this.ordineRepository     = ordineRepository;
        this.rigaOrdineRepository = rigaOrdineRepository;
        this.ordineMailService    = ordineMailService;
    }

    // ── Request / Response record ─────────────────────────

    public record RigaRequest(
        @NotNull UUID prodottoId,
        @NotBlank String nomeProdotto,
        @NotNull BigDecimal prezzoUnitario,
        @NotNull @Min(1) Integer quantita,
        @NotNull BigDecimal aliquotaIva
    ) {}

    public record CheckoutRequest(
        UUID clienteId,
        @NotBlank String nomeCliente,
        @NotBlank String cognomeCliente,
        @NotBlank String email,
        String telefono,
        @NotBlank String indirizzo,
        @NotBlank String citta,
        @NotBlank @Size(max = 2) String provincia,
        @NotBlank @Size(max = 5) String cap,
        String noteSpedizione,
        @NotNull TipoSpedizione tipoSpedizione,
        @NotNull BigDecimal costoSpedizione,
        @NotNull BigDecimal totaleImponibile,
        @NotNull BigDecimal totaleIva,
        @NotNull BigDecimal totaleFinal,
        @NotEmpty List<RigaRequest> righe,
        String metodoPagamento
    ) {}

    public record CheckoutResponse(UUID ordineId, String numeroOrdine) {}

    // ── Endpoint ──────────────────────────────────────────

    @PostMapping
    @Transactional
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest req) {
        LOG.info("Checkout avviato da {} — {} articoli", req.email(), req.righe().size());

        // 1. Costruisce e salva l'Ordine
        Ordine ordine = new Ordine();
        ordine.setClienteId(req.clienteId() != null
            ? req.clienteId()
            : UUID.fromString("00000000-0000-0000-0000-000000000000"));
        ordine.setNomeCliente(req.nomeCliente());
        ordine.setCognomeCliente(req.cognomeCliente());
        ordine.setEmail(req.email());
        ordine.setTelefono(req.telefono());
        ordine.setIndirizzo(req.indirizzo());
        ordine.setCitta(req.citta());
        ordine.setProvincia(req.provincia().toUpperCase());
        ordine.setCap(req.cap());
        ordine.setStatoPaese("Italia");
        ordine.setNoteSpedizione(req.noteSpedizione());
        ordine.setTipoSpedizione(req.tipoSpedizione());
        ordine.setCostoSpedizione(req.costoSpedizione());
        ordine.setTotaleImponibile(req.totaleImponibile());
        ordine.setTotaleIva(req.totaleIva());
        ordine.setTotaleFinal(req.totaleFinal());
        ordine.setBuonoSconto(null);
        ordine.setScontoApplicato(BigDecimal.ZERO);
        ordine.setStatoOrdine(StatoOrdine.IN_ELABORAZIONE);
        ordine.setNumeroOrdine("ORD-" + FMT.format(Instant.now()) + "-"
            + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        ordine.setDataCreazione(Instant.now());

        ordine = ordineRepository.save(ordine);

        // 2. Salva le righe ordine
        List<RigaOrdine> righe = new ArrayList<>();
        for (RigaRequest r : req.righe()) {
            RigaOrdine riga = new RigaOrdine();
            riga.setProdottoId(r.prodottoId());
            riga.setNomeProdotto(r.nomeProdotto());
            riga.setPrezzoUnitario(r.prezzoUnitario());
            riga.setQuantita(r.quantita());
            riga.setPrezzoTotale(r.prezzoUnitario().multiply(BigDecimal.valueOf(r.quantita())));
            riga.setAliquotaIva(r.aliquotaIva());
            riga.setOrdine(ordine);
            righe.add(riga);
        }
        rigaOrdineRepository.saveAll(righe);

        // 3. Invia email di conferma (asincrono — non blocca la risposta)
        ordineMailService.inviaConfermaOrdine(ordine, righe, req.metodoPagamento());

        LOG.info("Checkout completato: {} → {}", ordine.getNumeroOrdine(), ordine.getEmail());
        return ResponseEntity.ok(new CheckoutResponse(ordine.getId(), ordine.getNumeroOrdine()));
    }
}
