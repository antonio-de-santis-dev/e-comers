package main.ms.catalogo.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import main.ms.catalogo.repository.ProdottoRepository;
import main.ms.catalogo.service.ProdottoQueryService;
import main.ms.catalogo.service.ProdottoService;
import main.ms.catalogo.service.criteria.ProdottoCriteria;
import main.ms.catalogo.service.dto.ProdottoDTO;
import main.ms.catalogo.service.mapper.ProdottoMapper;
import main.ms.catalogo.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link main.ms.catalogo.domain.Prodotto}.
 */
@RestController
@RequestMapping("/api/prodottos")
public class ProdottoResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoResource.class);

    private static final String ENTITY_NAME = "msCatalogoProdotto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProdottoService prodottoService;
    private final ProdottoRepository prodottoRepository;
    private final ProdottoQueryService prodottoQueryService;
    private final ProdottoMapper prodottoMapper;

    public ProdottoResource(
        ProdottoService prodottoService,
        ProdottoRepository prodottoRepository,
        ProdottoQueryService prodottoQueryService,
        ProdottoMapper prodottoMapper
    ) {
        this.prodottoService = prodottoService;
        this.prodottoRepository = prodottoRepository;
        this.prodottoQueryService = prodottoQueryService;
        this.prodottoMapper = prodottoMapper;
    }

    @PostMapping("")
    public ResponseEntity<ProdottoDTO> createProdotto(@Valid @RequestBody ProdottoDTO prodottoDTO) throws URISyntaxException {
        LOG.debug("REST request to save Prodotto : {}", prodottoDTO);
        if (prodottoDTO.getId() != null) {
            throw new BadRequestAlertException("A new prodotto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        prodottoDTO = prodottoService.save(prodottoDTO);
        return ResponseEntity.created(new URI("/api/prodottos/" + prodottoDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, prodottoDTO.getId().toString()))
            .body(prodottoDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdottoDTO> updateProdotto(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody ProdottoDTO prodottoDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Prodotto : {}, {}", id, prodottoDTO);
        if (prodottoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodottoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!prodottoRepository.findByProdottoUuid(id).isPresent()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        prodottoDTO = prodottoService.update(prodottoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodottoDTO.getId().toString()))
            .body(prodottoDTO);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProdottoDTO> partialUpdateProdotto(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody ProdottoDTO prodottoDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Prodotto partially : {}, {}", id, prodottoDTO);
        if (prodottoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodottoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!prodottoRepository.findByProdottoUuid(id).isPresent()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Optional<ProdottoDTO> result = prodottoService.partialUpdate(prodottoDTO);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodottoDTO.getId().toString())
        );
    }

    /**
     * GET /prodottos : restituisce la lista paginata con tutti i filtri applicati.
     *
     * FIX: il parametro eagerload non bypassa più i criteri.
     * Prima con eagerload=true si chiamava findAllWithEagerRelationships()
     * che ignorava completamente ProdottoCriteria (nome, categoria, prezzo, ecc.).
     * Ora si usa sempre findByCriteria() che applica tutti i filtri correttamente.
     */
    @GetMapping("")
    public ResponseEntity<List<ProdottoDTO>> getAllProdottos(
        ProdottoCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "false") boolean eagerload
    ) {
        LOG.debug("REST request to get Prodottos by criteria: {}", criteria);

        // Applica sempre i criteri — eagerload non bypassa più i filtri
        Page<ProdottoDTO> page = prodottoQueryService.findByCriteria(criteria, pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(), page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countProdottos(ProdottoCriteria criteria) {
        LOG.debug("REST request to count Prodottos by criteria: {}", criteria);
        return ResponseEntity.ok().body(prodottoQueryService.countByCriteria(criteria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdottoDTO> getProdotto(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Prodotto : {}", id);
        Optional<ProdottoDTO> prodottoDTO = prodottoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(prodottoDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdotto(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Prodotto : {}", id);
        prodottoService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    // ── Endpoint custom ──────────────────────────────────────────────────────

    /** Prodotti marcati inEvidenza=true — usato dal carosello home */
    @GetMapping("/in-evidenza")
    public ResponseEntity<List<ProdottoDTO>> getProdottiInEvidenza() {
        LOG.debug("GET /api/prodottos/in-evidenza");
        return ResponseEntity.ok(prodottoService.findInEvidenza());
    }

    /** Top 10 per totalePurchased — usato dal carosello home */
    @GetMapping("/top-venduti")
    public ResponseEntity<List<ProdottoDTO>> getTopVenduti() {
        LOG.debug("GET /api/prodottos/top-venduti");
        return ResponseEntity.ok(prodottoService.findTopVenduti());
    }

    /** Prodotti correlati per la pagina dettaglio */
    @GetMapping("/{id}/correlati")
    public ResponseEntity<List<ProdottoDTO>> getCorrelati(@PathVariable UUID id) {
        LOG.debug("GET /api/prodottos/{}/correlati", id);
        return ResponseEntity.ok(prodottoService.findCorrelati(id));
    }
}
