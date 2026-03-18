package main.ms.catalogo.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import main.ms.catalogo.repository.ProdottoRepository;
import main.ms.catalogo.service.ProdottoQueryService;
import main.ms.catalogo.service.ProdottoService;
import main.ms.catalogo.service.criteria.ProdottoCriteria;
import main.ms.catalogo.service.dto.ProdottoDTO;
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

    public ProdottoResource(
        ProdottoService prodottoService,
        ProdottoRepository prodottoRepository,
        ProdottoQueryService prodottoQueryService
    ) {
        this.prodottoService = prodottoService;
        this.prodottoRepository = prodottoRepository;
        this.prodottoQueryService = prodottoQueryService;
    }

    /**
     * {@code POST  /prodottos} : Create a new prodotto.
     *
     * @param prodottoDTO the prodottoDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prodottoDTO, or with status {@code 400 (Bad Request)} if the prodotto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
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

    /**
     * {@code PUT  /prodottos/:id} : Updates an existing prodotto.
     *
     * @param id the id of the prodottoDTO to save.
     * @param prodottoDTO the prodottoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prodottoDTO,
     * or with status {@code 400 (Bad Request)} if the prodottoDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prodottoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProdottoDTO> updateProdotto(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProdottoDTO prodottoDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Prodotto : {}, {}", id, prodottoDTO);
        if (prodottoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodottoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prodottoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        prodottoDTO = prodottoService.update(prodottoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodottoDTO.getId().toString()))
            .body(prodottoDTO);
    }

    /**
     * {@code PATCH  /prodottos/:id} : Partial updates given fields of an existing prodotto, field will ignore if it is null
     *
     * @param id the id of the prodottoDTO to save.
     * @param prodottoDTO the prodottoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prodottoDTO,
     * or with status {@code 400 (Bad Request)} if the prodottoDTO is not valid,
     * or with status {@code 404 (Not Found)} if the prodottoDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the prodottoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProdottoDTO> partialUpdateProdotto(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProdottoDTO prodottoDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Prodotto partially : {}, {}", id, prodottoDTO);
        if (prodottoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prodottoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!prodottoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProdottoDTO> result = prodottoService.partialUpdate(prodottoDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prodottoDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /prodottos} : get all the prodottos.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of prodottos in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProdottoDTO>> getAllProdottos(
        ProdottoCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Prodottos by criteria: {}", criteria);

        Page<ProdottoDTO> page = prodottoQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /prodottos/count} : count all the prodottos.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countProdottos(ProdottoCriteria criteria) {
        LOG.debug("REST request to count Prodottos by criteria: {}", criteria);
        return ResponseEntity.ok().body(prodottoQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /prodottos/:id} : get the "id" prodotto.
     *
     * @param id the id of the prodottoDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prodottoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProdottoDTO> getProdotto(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Prodotto : {}", id);
        Optional<ProdottoDTO> prodottoDTO = prodottoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(prodottoDTO);
    }

    /**
     * {@code DELETE  /prodottos/:id} : delete the "id" prodotto.
     *
     * @param id the id of the prodottoDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdotto(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Prodotto : {}", id);
        prodottoService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
