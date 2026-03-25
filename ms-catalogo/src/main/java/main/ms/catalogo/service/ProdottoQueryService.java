package main.ms.catalogo.service;

import jakarta.persistence.criteria.JoinType;
import main.ms.catalogo.domain.*;
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
import tech.jhipster.service.filter.StringFilter;

/**
 * Service for executing complex queries for {@link Prodotto} entities in the database.
 *
 * MODIFICA:
 * - id gestito come UUIDFilter + Prodotto_.prodottoUuid
 * - ricerca per nome CASE-INSENSITIVE: usa LOWER() su entrambi i lati
 *   cosi "airpods" trova "AirPods Pro 2", "AIRPODS", "Airpods" ecc.
 *   Ispirata dal pattern .toLowerCase() di ng2-ui/auto-complete.
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

    @Transactional(readOnly = true)
    public Page<ProdottoDTO> findByCriteria(ProdottoCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Prodotto> specification = createSpecification(criteria);
        return prodottoRepository.findAll(specification, page).map(prodottoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public long countByCriteria(ProdottoCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Prodotto> specification = createSpecification(criteria);
        return prodottoRepository.count(specification);
    }

    protected Specification<Prodotto> createSpecification(ProdottoCriteria criteria) {
        Specification<Prodotto> specification = Specification.where(null);
        if (criteria != null) {
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildSpecification(criteria.getId(), Prodotto_.prodottoUuid),
                // Ricerca nome CASE-INSENSITIVE
                // buildStringSpecification usa LIKE case-sensitive su PostgreSQL.
                // Sostituito con specifica manuale che fa LOWER(nome) LIKE LOWER('%valore%')
                nomeContainsCaseInsensitive(criteria.getNome()),
                buildRangeSpecification(criteria.getPrezzo(), Prodotto_.prezzo),
                buildRangeSpecification(criteria.getAliquotaIva(), Prodotto_.aliquotaIva),
                buildSpecification(criteria.getDisponibile(), Prodotto_.disponibile),
                buildRangeSpecification(criteria.getQuantitaDisponibile(), Prodotto_.quantitaDisponibile),
                buildRangeSpecification(criteria.getVotoTotale(), Prodotto_.votoTotale),
                buildSpecification(criteria.getInEvidenza(), Prodotto_.inEvidenza),
                buildRangeSpecification(criteria.getTotalePurchased(), Prodotto_.totalePurchased),
                buildSpecification(
                    criteria.getCategoriaId(),
                    root -> root.join(Prodotto_.categoria, JoinType.LEFT).get(Categoria_.id)
                )
            );
        }
        return specification;
    }

    /**
     * Specifica JPA per ricerca case-insensitive sul campo nome.
     *
     * Genera: LOWER(nome) LIKE LOWER('%keyword%')
     *
     * Funziona sia con StringFilter.contains che con StringFilter.equals,
     * ignorando completamente maiuscole/minuscole su entrambi i lati.
     * Se il filtro e' null o vuoto, restituisce null (nessuna condizione aggiunta).
     */
    private Specification<Prodotto> nomeContainsCaseInsensitive(StringFilter filter) {
        if (filter == null) {
            return null;
        }

        // contains: "airpods" → LOWER(nome) LIKE '%airpods%'
        if (filter.getContains() != null) {
            String pattern = "%" + filter.getContains().toLowerCase() + "%";
            return (root, query, cb) ->
                cb.like(cb.lower(root.get(Prodotto_.nome)), pattern);
        }

        // equals: "AirPods Pro 2" → LOWER(nome) = 'airpods pro 2'
        if (filter.getEquals() != null) {
            String value = filter.getEquals().toLowerCase();
            return (root, query, cb) ->
                cb.equal(cb.lower(root.get(Prodotto_.nome)), value);
        }

        // doesNotContain: esclude i risultati che contengono il testo
        if (filter.getDoesNotContain() != null) {
            String pattern = "%" + filter.getDoesNotContain().toLowerCase() + "%";
            return (root, query, cb) ->
                cb.notLike(cb.lower(root.get(Prodotto_.nome)), pattern);
        }

        // Per tutti gli altri operatori (in, notIn, specified) usa il comportamento standard
        return buildStringSpecification(filter, Prodotto_.nome);
    }
}
