package main.ms.catalogo.service;

import jakarta.persistence.criteria.JoinType;
import main.ms.catalogo.domain.*; // for static metamodels
import main.ms.catalogo.domain.Prodotto;
import main.ms.catalogo.repository.ProdottoRepository;
import main.ms.catalogo.service.criteria.ProdottoCriteria;
import main.ms.catalogo.service.dto.ProdottoDTO;
import main.ms.catalogo.service.mapper.ProdottoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Prodotto} entities in the database.
 * The main input is a {@link ProdottoCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ProdottoDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ProdottoQueryService extends QueryService<Prodotto> {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoQueryService.class);

    private final ProdottoRepository prodottoRepository;

    private final ProdottoMapper prodottoMapper;

    public ProdottoQueryService(ProdottoRepository prodottoRepository, ProdottoMapper prodottoMapper) {
        this.prodottoRepository = prodottoRepository;
        this.prodottoMapper = prodottoMapper;
    }

    /**
     * Return a {@link Page} of {@link ProdottoDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProdottoDTO> findByCriteria(ProdottoCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Prodotto> specification = createSpecification(criteria);
        return prodottoRepository.findAll(specification, page).map(prodottoMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ProdottoCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Prodotto> specification = createSpecification(criteria);
        return prodottoRepository.count(specification);
    }

    /**
     * Function to convert {@link ProdottoCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Prodotto> createSpecification(ProdottoCriteria criteria) {
        Specification<Prodotto> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), Prodotto_.id),
                buildStringSpecification(criteria.getNome(), Prodotto_.nome),
                buildRangeSpecification(criteria.getPrezzo(), Prodotto_.prezzo),
                buildRangeSpecification(criteria.getAliquotaIva(), Prodotto_.aliquotaIva),
                buildSpecification(criteria.getDisponibile(), Prodotto_.disponibile),
                buildRangeSpecification(criteria.getQuantitaDisponibile(), Prodotto_.quantitaDisponibile),
                buildRangeSpecification(criteria.getVotoTotale(), Prodotto_.votoTotale),
                buildSpecification(criteria.getInEvidenza(), Prodotto_.inEvidenza),
                buildRangeSpecification(criteria.getTotalePurchased(), Prodotto_.totalePurchased),
                buildSpecification(criteria.getCategoriaId(), root -> root.join(Prodotto_.categoria, JoinType.LEFT).get(Categoria_.id))
            );
        }
        return specification;
    }
}
