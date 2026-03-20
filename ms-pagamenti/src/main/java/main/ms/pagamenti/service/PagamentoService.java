package main.ms.pagamenti.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import main.ms.pagamenti.domain.Pagamento;
import main.ms.pagamenti.domain.enumeration.StatoPagamento;
import main.ms.pagamenti.repository.PagamentoRepository;
import main.ms.pagamenti.service.dto.PagamentoDTO;
import main.ms.pagamenti.service.mapper.PagamentoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
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
    private final StreamBridge streamBridge;
    private final ObjectMapper objectMapper;

    public PagamentoService(PagamentoRepository pagamentoRepository, PagamentoMapper pagamentoMapper, StreamBridge streamBridge, ObjectMapper objectMapper) {
        this.pagamentoRepository = pagamentoRepository;
        this.pagamentoMapper = pagamentoMapper;
        this.streamBridge = streamBridge;
        this.objectMapper = objectMapper;
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

        if (pagamento.getDataOperazione() == null) {
            pagamento.setDataOperazione(Instant.now());
        }

        if (pagamento.getStato() == null) {
            pagamento.setStato(StatoPagamento.IN_ATTESA);
        }

        pagamento = pagamentoRepository.save(pagamento);
         PagamentoDTO result = pagamentoMapper.toDto(pagamento);

        if (StatoPagamento.APPROVATO.equals(pagamento.getStato())) {
            pubblicaPagamentoApprovato(pagamento);
        }

        return result;
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
        PagamentoDTO result = pagamentoMapper.toDto(pagamento);

        if (StatoPagamento.APPROVATO.equals(pagamento.getStato())) {
            pubblicaPagamentoApprovato(pagamento);
        }

        return result;
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
            .map(saved -> {
                if (StatoPagamento.APPROVATO.equals(saved.getStato())) {
                    pubblicaPagamentoApprovato(saved);
                }
                return saved;
            })
            .map(pagamentoMapper::toDto);
    }

    /**
     * Get one pagamento by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PagamentoDTO> findOne(UUID id) {
        LOG.debug("Request to get Pagamento : {}", id);
        return pagamentoRepository.findById(id).map(pagamentoMapper::toDto);
    }

    /**
     * Delete the pagamento by id.
     *
     * @param id the id of the entity.
     */
    public void delete(UUID id) {
        LOG.debug("Request to delete Pagamento : {}", id);
        pagamentoRepository.deleteById(id);
    }

    //evento pagamento-approvato su Kafka per agiornare lo sato orine a PAGATO
    private void pubblicaPagamentoApprovato(Pagamento pagamento) {
        try {
            String payload = objectMapper.writeValueAsString(new PagamentoApprovatoEvent(
                pagamento.getId(),
                pagamento.getOrdineId(),
                pagamento.getImporto()
            ));
            streamBridge.send("kafkaProducer-out-0", payload);
            LOG.info("Evento pagamento-approvato pubblicato per ordine: {}", pagamento.getOrdineId());
        } catch (Exception e) {
            LOG.error("Errore pubblicazione evento Kafka per pagamento {}: {}", pagamento.getId(), e.getMessage());
        }
    }


      //Evento Kafka emesso quando un pagamento viene approvato.

    public record PagamentoApprovatoEvent(UUID pagamentoId, UUID ordineId, java.math.BigDecimal importo) {}

}
