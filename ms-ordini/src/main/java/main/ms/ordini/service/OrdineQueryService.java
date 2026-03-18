package main.ms.ordini.service;

import jakarta.persistence.criteria.JoinType;
import main.ms.ordini.domain.*; // for static metamodels
import main.ms.ordini.domain.Ordine;
import main.ms.ordini.repository.OrdineRepository;
import main.ms.ordini.service.criteria.OrdineCriteria;
import main.ms.ordini.service.dto.OrdineDTO;
import main.ms.ordini.service.mapper.OrdineMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Ordine} entities in the database.
 * The main input is a {@link OrdineCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link OrdineDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class OrdineQueryService extends QueryService<Ordine> {

    private static final Logger LOG = LoggerFactory.getLogger(OrdineQueryService.class);

    private final OrdineRepository ordineRepository;

    private final OrdineMapper ordineMapper;

    public OrdineQueryService(OrdineRepository ordineRepository, OrdineMapper ordineMapper) {
        this.ordineRepository = ordineRepository;
        this.ordineMapper = ordineMapper;
    }

    /**
     * Return a {@link Page} of {@link OrdineDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<OrdineDTO> findByCriteria(OrdineCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Ordine> specification = createSpecification(criteria);
        return ordineRepository.findAll(specification, page).map(ordineMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(OrdineCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Ordine> specification = createSpecification(criteria);
        return ordineRepository.count(specification);
    }

    /**
     * Function to convert {@link OrdineCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Ordine> createSpecification(OrdineCriteria criteria) {
        Specification<Ordine> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), Ordine_.id),
                buildStringSpecification(criteria.getNumeroOrdine(), Ordine_.numeroOrdine),
                buildSpecification(criteria.getClienteId(), Ordine_.clienteId),
                buildStringSpecification(criteria.getNomeCliente(), Ordine_.nomeCliente),
                buildStringSpecification(criteria.getCognomeCliente(), Ordine_.cognomeCliente),
                buildStringSpecification(criteria.getEmail(), Ordine_.email),
                buildStringSpecification(criteria.getTelefono(), Ordine_.telefono),
                buildStringSpecification(criteria.getIndirizzo(), Ordine_.indirizzo),
                buildStringSpecification(criteria.getCitta(), Ordine_.citta),
                buildStringSpecification(criteria.getProvincia(), Ordine_.provincia),
                buildStringSpecification(criteria.getCap(), Ordine_.cap),
                buildStringSpecification(criteria.getStatoPaese(), Ordine_.statoPaese),
                buildStringSpecification(criteria.getNoteSpedizione(), Ordine_.noteSpedizione),
                buildSpecification(criteria.getTipoSpedizione(), Ordine_.tipoSpedizione),
                buildRangeSpecification(criteria.getCostoSpedizione(), Ordine_.costoSpedizione),
                buildRangeSpecification(criteria.getTotaleImponibile(), Ordine_.totaleImponibile),
                buildRangeSpecification(criteria.getTotaleIva(), Ordine_.totaleIva),
                buildRangeSpecification(criteria.getTotaleFinal(), Ordine_.totaleFinal),
                buildStringSpecification(criteria.getBuonoSconto(), Ordine_.buonoSconto),
                buildRangeSpecification(criteria.getScontoApplicato(), Ordine_.scontoApplicato),
                buildSpecification(criteria.getStatoOrdine(), Ordine_.statoOrdine),
                buildRangeSpecification(criteria.getDataCreazione(), Ordine_.dataCreazione),
                buildSpecification(criteria.getRigheOrdineId(), root -> root.join(Ordine_.righeOrdines, JoinType.LEFT).get(RigaOrdine_.id))
            );
        }
        return specification;
    }
}
