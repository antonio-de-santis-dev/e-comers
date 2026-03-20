package main.ms.pagamenti.service;

import main.ms.pagamenti.domain.*; // for static metamodels
import main.ms.pagamenti.domain.Pagamento;
import main.ms.pagamenti.repository.PagamentoRepository;
import main.ms.pagamenti.service.criteria.PagamentoCriteria;
import main.ms.pagamenti.service.dto.PagamentoDTO;
import main.ms.pagamenti.service.mapper.PagamentoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Pagamento} entities in the database.
 */
@Service
@Transactional(readOnly = true)
public class PagamentoQueryService extends QueryService<Pagamento> {

    private static final Logger LOG = LoggerFactory.getLogger(PagamentoQueryService.class);

    private final PagamentoRepository pagamentoRepository;
    private final PagamentoMapper pagamentoMapper;

    public PagamentoQueryService(PagamentoRepository pagamentoRepository, PagamentoMapper pagamentoMapper) {
        this.pagamentoRepository = pagamentoRepository;
        this.pagamentoMapper = pagamentoMapper;
    }

    @Transactional(readOnly = true)
    public Page<PagamentoDTO> findByCriteria(PagamentoCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Pagamento> specification = createSpecification(criteria);
        return pagamentoRepository.findAll(specification, page).map(pagamentoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public long countByCriteria(PagamentoCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Pagamento> specification = createSpecification(criteria);
        return pagamentoRepository.count(specification);
    }

    protected Specification<Pagamento> createSpecification(PagamentoCriteria criteria) {
        Specification<Pagamento> specification = Specification.where(null);
        if (criteria != null) {
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildSpecification(criteria.getId(), Pagamento_.id),
                buildSpecification(criteria.getOrdineId(), Pagamento_.ordineId),
                buildSpecification(criteria.getMetodoPagamento(), Pagamento_.metodoPagamento),
                buildRangeSpecification(criteria.getImporto(), Pagamento_.importo),
                buildSpecification(criteria.getStato(), Pagamento_.stato),
                buildStringSpecification(criteria.getTransazioneId(), Pagamento_.transazioneId),
                buildRangeSpecification(criteria.getDataOperazione(), Pagamento_.dataOperazione)
            );
        }
        return specification;
    }
}
