package main.ms.admin.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import main.ms.admin.domain.StatisticaOrdine;
import main.ms.admin.repository.StatisticaOrdineRepository;
import main.ms.admin.service.dto.StatisticaOrdineDTO;
import main.ms.admin.service.mapper.StatisticaOrdineMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StatisticaOrdineService {

    private static final Logger LOG = LoggerFactory.getLogger(StatisticaOrdineService.class);

    private final StatisticaOrdineRepository statisticaOrdineRepository;
    private final StatisticaOrdineMapper statisticaOrdineMapper;

    public StatisticaOrdineService(
        StatisticaOrdineRepository statisticaOrdineRepository,
        StatisticaOrdineMapper statisticaOrdineMapper
    ) {
        this.statisticaOrdineRepository = statisticaOrdineRepository;
        this.statisticaOrdineMapper = statisticaOrdineMapper;
    }

    public StatisticaOrdineDTO save(StatisticaOrdineDTO dto) {
        LOG.debug("Request to save StatisticaOrdine : {}", dto);
        StatisticaOrdine entity = statisticaOrdineMapper.toEntity(dto);

        // Auto-genera dataRegistrazione se non fornita
        if (entity.getDataRegistrazione() == null) {
            entity.setDataRegistrazione(Instant.now());
        }

        entity = statisticaOrdineRepository.save(entity);
        return statisticaOrdineMapper.toDto(entity);
    }

    @Transactional(readOnly = true)
    public Page<StatisticaOrdineDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all StatisticheOrdine");
        return statisticaOrdineRepository.findAll(pageable).map(statisticaOrdineMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<StatisticaOrdineDTO> findOne(UUID id) {
        LOG.debug("Request to get StatisticaOrdine : {}", id);
        return statisticaOrdineRepository.findById(id).map(statisticaOrdineMapper::toDto);
    }

    public void delete(UUID id) {
        LOG.debug("Request to delete StatisticaOrdine : {}", id);
        statisticaOrdineRepository.deleteById(id);
    }

    /**
     * Registra una statistica da evento Kafka.
     */
    public void registraStatistica(UUID ordineId, UUID pagamentoId, UUID clienteId,
                                    Double totale, String statoOrdine, String statoPagamento) {
        StatisticaOrdineDTO dto = new StatisticaOrdineDTO();
        dto.setOrdineId(ordineId);
        dto.setPagamentoId(pagamentoId);
        dto.setClienteId(clienteId);
        dto.setTotale(totale);
        dto.setStatoOrdine(statoOrdine);
        dto.setStatoPagamento(statoPagamento);
        dto.setDataRegistrazione(Instant.now());
        save(dto);
        LOG.info("Statistica registrata — ordineId: {}, stato: {}", ordineId, statoOrdine);
    }
}
