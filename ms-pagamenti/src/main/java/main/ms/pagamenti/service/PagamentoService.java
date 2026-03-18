package main.ms.pagamenti.service;

import java.util.Optional;
import main.ms.pagamenti.domain.Pagamento;
import main.ms.pagamenti.repository.PagamentoRepository;
import main.ms.pagamenti.service.dto.PagamentoDTO;
import main.ms.pagamenti.service.mapper.PagamentoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.ms.pagamenti.domain.Pagamento}.
 */
@Service
@Transactional
public class PagamentoService {

    private static final Logger LOG = LoggerFactory.getLogger(PagamentoService.class);

    private final PagamentoRepository pagamentoRepository;

    private final PagamentoMapper pagamentoMapper;

    public PagamentoService(PagamentoRepository pagamentoRepository, PagamentoMapper pagamentoMapper) {
        this.pagamentoRepository = pagamentoRepository;
        this.pagamentoMapper = pagamentoMapper;
    }

    /**
     * Save a pagamento.
     *
     * @param pagamentoDTO the entity to save.
     * @return the persisted entity.
     */
    public PagamentoDTO save(PagamentoDTO pagamentoDTO) {
        LOG.debug("Request to save Pagamento : {}", pagamentoDTO);
        Pagamento pagamento = pagamentoMapper.toEntity(pagamentoDTO);
        pagamento = pagamentoRepository.save(pagamento);
        return pagamentoMapper.toDto(pagamento);
    }

    /**
     * Update a pagamento.
     *
     * @param pagamentoDTO the entity to save.
     * @return the persisted entity.
     */
    public PagamentoDTO update(PagamentoDTO pagamentoDTO) {
        LOG.debug("Request to update Pagamento : {}", pagamentoDTO);
        Pagamento pagamento = pagamentoMapper.toEntity(pagamentoDTO);
        pagamento = pagamentoRepository.save(pagamento);
        return pagamentoMapper.toDto(pagamento);
    }

    /**
     * Partially update a pagamento.
     *
     * @param pagamentoDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PagamentoDTO> partialUpdate(PagamentoDTO pagamentoDTO) {
        LOG.debug("Request to partially update Pagamento : {}", pagamentoDTO);

        return pagamentoRepository
            .findById(pagamentoDTO.getId())
            .map(existingPagamento -> {
                pagamentoMapper.partialUpdate(existingPagamento, pagamentoDTO);

                return existingPagamento;
            })
            .map(pagamentoRepository::save)
            .map(pagamentoMapper::toDto);
    }

    /**
     * Get one pagamento by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PagamentoDTO> findOne(Long id) {
        LOG.debug("Request to get Pagamento : {}", id);
        return pagamentoRepository.findById(id).map(pagamentoMapper::toDto);
    }

    /**
     * Delete the pagamento by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Pagamento : {}", id);
        pagamentoRepository.deleteById(id);
    }
}
