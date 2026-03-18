package main.ms.ordini.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import main.ms.ordini.repository.RigaOrdineRepository;
import main.ms.ordini.service.RigaOrdineService;
import main.ms.ordini.service.dto.RigaOrdineDTO;
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
 * REST controller for managing {@link main.ms.ordini.domain.RigaOrdine}.
 */
@RestController
@RequestMapping("/api/riga-ordines")
public class RigaOrdineResource {

    private static final Logger LOG = LoggerFactory.getLogger(RigaOrdineResource.class);

    private static final String ENTITY_NAME = "msOrdiniRigaOrdine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RigaOrdineService rigaOrdineService;

    private final RigaOrdineRepository rigaOrdineRepository;

    public RigaOrdineResource(RigaOrdineService rigaOrdineService, RigaOrdineRepository rigaOrdineRepository) {
        this.rigaOrdineService = rigaOrdineService;
        this.rigaOrdineRepository = rigaOrdineRepository;
    }

    /**
     * {@code POST  /riga-ordines} : Create a new rigaOrdine.
     *
     * @param rigaOrdineDTO the rigaOrdineDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rigaOrdineDTO, or with status {@code 400 (Bad Request)} if the rigaOrdine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RigaOrdineDTO> createRigaOrdine(@Valid @RequestBody RigaOrdineDTO rigaOrdineDTO) throws URISyntaxException {
        LOG.debug("REST request to save RigaOrdine : {}", rigaOrdineDTO);
        if (rigaOrdineDTO.getId() != null) {
            throw new BadRequestAlertException("A new rigaOrdine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        rigaOrdineDTO = rigaOrdineService.save(rigaOrdineDTO);
        return ResponseEntity.created(new URI("/api/riga-ordines/" + rigaOrdineDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, rigaOrdineDTO.getId().toString()))
            .body(rigaOrdineDTO);
    }

    /**
     * {@code PUT  /riga-ordines/:id} : Updates an existing rigaOrdine.
     *
     * @param id the id of the rigaOrdineDTO to save.
     * @param rigaOrdineDTO the rigaOrdineDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rigaOrdineDTO,
     * or with status {@code 400 (Bad Request)} if the rigaOrdineDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rigaOrdineDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RigaOrdineDTO> updateRigaOrdine(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RigaOrdineDTO rigaOrdineDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update RigaOrdine : {}, {}", id, rigaOrdineDTO);
        if (rigaOrdineDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rigaOrdineDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rigaOrdineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        rigaOrdineDTO = rigaOrdineService.update(rigaOrdineDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rigaOrdineDTO.getId().toString()))
            .body(rigaOrdineDTO);
    }

    /**
     * {@code PATCH  /riga-ordines/:id} : Partial updates given fields of an existing rigaOrdine, field will ignore if it is null
     *
     * @param id the id of the rigaOrdineDTO to save.
     * @param rigaOrdineDTO the rigaOrdineDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rigaOrdineDTO,
     * or with status {@code 400 (Bad Request)} if the rigaOrdineDTO is not valid,
     * or with status {@code 404 (Not Found)} if the rigaOrdineDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the rigaOrdineDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RigaOrdineDTO> partialUpdateRigaOrdine(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RigaOrdineDTO rigaOrdineDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update RigaOrdine partially : {}, {}", id, rigaOrdineDTO);
        if (rigaOrdineDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rigaOrdineDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rigaOrdineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RigaOrdineDTO> result = rigaOrdineService.partialUpdate(rigaOrdineDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rigaOrdineDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /riga-ordines} : get all the rigaOrdines.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rigaOrdines in body.
     */
    @GetMapping("")
    public ResponseEntity<List<RigaOrdineDTO>> getAllRigaOrdines(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of RigaOrdines");
        Page<RigaOrdineDTO> page = rigaOrdineService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /riga-ordines/:id} : get the "id" rigaOrdine.
     *
     * @param id the id of the rigaOrdineDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rigaOrdineDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RigaOrdineDTO> getRigaOrdine(@PathVariable("id") Long id) {
        LOG.debug("REST request to get RigaOrdine : {}", id);
        Optional<RigaOrdineDTO> rigaOrdineDTO = rigaOrdineService.findOne(id);
        return ResponseUtil.wrapOrNotFound(rigaOrdineDTO);
    }

    /**
     * {@code DELETE  /riga-ordines/:id} : delete the "id" rigaOrdine.
     *
     * @param id the id of the rigaOrdineDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRigaOrdine(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete RigaOrdine : {}", id);
        rigaOrdineService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
