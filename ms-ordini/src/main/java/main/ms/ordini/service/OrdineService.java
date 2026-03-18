package main.ms.ordini.service;

import java.util.Optional;
import main.ms.ordini.domain.Ordine;
import main.ms.ordini.repository.OrdineRepository;
import main.ms.ordini.service.dto.OrdineDTO;
import main.ms.ordini.service.mapper.OrdineMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.ms.ordini.domain.Ordine}.
 */
@Service
@Transactional
public class OrdineService {

    private static final Logger LOG = LoggerFactory.getLogger(OrdineService.class);

    private final OrdineRepository ordineRepository;

    private final OrdineMapper ordineMapper;

    public OrdineService(OrdineRepository ordineRepository, OrdineMapper ordineMapper) {
        this.ordineRepository = ordineRepository;
        this.ordineMapper = ordineMapper;
    }

    /**
     * Save a ordine.
     *
     * @param ordineDTO the entity to save.
     * @return the persisted entity.
     */
    public OrdineDTO save(OrdineDTO ordineDTO) {
        LOG.debug("Request to save Ordine : {}", ordineDTO);
        Ordine ordine = ordineMapper.toEntity(ordineDTO);
        ordine = ordineRepository.save(ordine);
        return ordineMapper.toDto(ordine);
    }

    /**
     * Update a ordine.
     *
     * @param ordineDTO the entity to save.
     * @return the persisted entity.
     */
    public OrdineDTO update(OrdineDTO ordineDTO) {
        LOG.debug("Request to update Ordine : {}", ordineDTO);
        Ordine ordine = ordineMapper.toEntity(ordineDTO);
        ordine = ordineRepository.save(ordine);
        return ordineMapper.toDto(ordine);
    }

    /**
     * Partially update a ordine.
     *
     * @param ordineDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OrdineDTO> partialUpdate(OrdineDTO ordineDTO) {
        LOG.debug("Request to partially update Ordine : {}", ordineDTO);

        return ordineRepository
            .findById(ordineDTO.getId())
            .map(existingOrdine -> {
                ordineMapper.partialUpdate(existingOrdine, ordineDTO);

                return existingOrdine;
            })
            .map(ordineRepository::save)
            .map(ordineMapper::toDto);
    }

    /**
     * Get one ordine by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OrdineDTO> findOne(Long id) {
        LOG.debug("Request to get Ordine : {}", id);
        return ordineRepository.findById(id).map(ordineMapper::toDto);
    }

    /**
     * Delete the ordine by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Ordine : {}", id);
        ordineRepository.deleteById(id);
    }
}
