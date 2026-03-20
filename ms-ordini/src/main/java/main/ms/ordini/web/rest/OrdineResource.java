package main.ms.ordini.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import main.ms.ordini.repository.OrdineRepository;
import main.ms.ordini.service.OrdineQueryService;
import main.ms.ordini.service.OrdineService;
import main.ms.ordini.service.criteria.OrdineCriteria;
import main.ms.ordini.service.dto.OrdineDTO;
import main.ms.ordini.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link main.ms.ordini.domain.Ordine}.
 */
@RestController
@RequestMapping("/api/ordines")
public class OrdineResource {

    private static final Logger LOG = LoggerFactory.getLogger(OrdineResource.class);

    private static final String ENTITY_NAME = "msOrdiniOrdine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrdineService ordineService;
    private final OrdineRepository ordineRepository;
    private final OrdineQueryService ordineQueryService;

    public OrdineResource(OrdineService ordineService, OrdineRepository ordineRepository, OrdineQueryService ordineQueryService) {
        this.ordineService = ordineService;
        this.ordineRepository = ordineRepository;
        this.ordineQueryService = ordineQueryService;
    }

    /**
     * {@code POST  /ordines} : Create a new ordine.
     */
    @PostMapping("")
    public ResponseEntity<OrdineDTO> createOrdine(@Valid @RequestBody OrdineDTO ordineDTO) throws URISyntaxException {
        LOG.debug("REST request to save Ordine : {}", ordineDTO);
        if (ordineDTO.getId() != null) {
            throw new BadRequestAlertException("A new ordine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ordineDTO = ordineService.save(ordineDTO);
        return ResponseEntity.created(new URI("/api/ordines/" + ordineDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ordineDTO.getId().toString()))
            .body(ordineDTO);
    }

    /**
     * {@code PUT  /ordines/:id} : Updates an existing ordine.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrdineDTO> updateOrdine(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody OrdineDTO ordineDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Ordine : {}, {}", id, ordineDTO);
        if (ordineDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ordineDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!ordineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ordineDTO = ordineService.update(ordineDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ordineDTO.getId().toString()))
            .body(ordineDTO);
    }

    /**
     * {@code PATCH  /ordines/:id} : Partial updates given fields of an existing ordine.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrdineDTO> partialUpdateOrdine(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody OrdineDTO ordineDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Ordine partially : {}, {}", id, ordineDTO);
        if (ordineDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ordineDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!ordineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrdineDTO> result = ordineService.partialUpdate(ordineDTO);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ordineDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /ordines} : get all the ordines.
     */
    @GetMapping("")
    public ResponseEntity<List<OrdineDTO>> getAllOrdines(
        OrdineCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Ordines by criteria: {}", criteria);
        Page<OrdineDTO> page = ordineQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /ordines/count} : count all the ordines.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countOrdines(OrdineCriteria criteria) {
        LOG.debug("REST request to count Ordines by criteria: {}", criteria);
        return ResponseEntity.ok().body(ordineQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /ordines/:id} : get the "id" ordine.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrdineDTO> getOrdine(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Ordine : {}", id);
        Optional<OrdineDTO> ordineDTO = ordineService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ordineDTO);
    }

    /**
     * {@code DELETE  /ordines/:id} : delete the "id" ordine.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrdine(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Ordine : {}", id);
        ordineService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
