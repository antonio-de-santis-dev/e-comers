package main.ms.ordini.service;

import java.util.Optional;
import main.ms.ordini.domain.RigaOrdine;
import main.ms.ordini.repository.RigaOrdineRepository;
import main.ms.ordini.service.dto.RigaOrdineDTO;
import main.ms.ordini.service.mapper.RigaOrdineMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.ms.ordini.domain.RigaOrdine}.
 */
@Service
@Transactional
public class RigaOrdineService {

    private static final Logger LOG = LoggerFactory.getLogger(RigaOrdineService.class);

    private final RigaOrdineRepository rigaOrdineRepository;

    private final RigaOrdineMapper rigaOrdineMapper;

    public RigaOrdineService(RigaOrdineRepository rigaOrdineRepository, RigaOrdineMapper rigaOrdineMapper) {
        this.rigaOrdineRepository = rigaOrdineRepository;
        this.rigaOrdineMapper = rigaOrdineMapper;
    }

    /**
     * Save a rigaOrdine.
     *
     * @param rigaOrdineDTO the entity to save.
     * @return the persisted entity.
     */
    public RigaOrdineDTO save(RigaOrdineDTO rigaOrdineDTO) {
        LOG.debug("Request to save RigaOrdine : {}", rigaOrdineDTO);
        RigaOrdine rigaOrdine = rigaOrdineMapper.toEntity(rigaOrdineDTO);
        rigaOrdine = rigaOrdineRepository.save(rigaOrdine);
        return rigaOrdineMapper.toDto(rigaOrdine);
    }

    /**
     * Update a rigaOrdine.
     *
     * @param rigaOrdineDTO the entity to save.
     * @return the persisted entity.
     */
    public RigaOrdineDTO update(RigaOrdineDTO rigaOrdineDTO) {
        LOG.debug("Request to update RigaOrdine : {}", rigaOrdineDTO);
        RigaOrdine rigaOrdine = rigaOrdineMapper.toEntity(rigaOrdineDTO);
        rigaOrdine = rigaOrdineRepository.save(rigaOrdine);
        return rigaOrdineMapper.toDto(rigaOrdine);
    }

    /**
     * Partially update a rigaOrdine.
     *
     * @param rigaOrdineDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<RigaOrdineDTO> partialUpdate(RigaOrdineDTO rigaOrdineDTO) {
        LOG.debug("Request to partially update RigaOrdine : {}", rigaOrdineDTO);

        return rigaOrdineRepository
            .findById(rigaOrdineDTO.getId())
            .map(existingRigaOrdine -> {
                rigaOrdineMapper.partialUpdate(existingRigaOrdine, rigaOrdineDTO);

                return existingRigaOrdine;
            })
            .map(rigaOrdineRepository::save)
            .map(rigaOrdineMapper::toDto);
    }

    /**
     * Get all the rigaOrdines.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<RigaOrdineDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all RigaOrdines");
        return rigaOrdineRepository.findAll(pageable).map(rigaOrdineMapper::toDto);
    }

    /**
     * Get one rigaOrdine by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<RigaOrdineDTO> findOne(Long id) {
        LOG.debug("Request to get RigaOrdine : {}", id);
        return rigaOrdineRepository.findById(id).map(rigaOrdineMapper::toDto);
    }

    /**
     * Delete the rigaOrdine by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete RigaOrdine : {}", id);
        rigaOrdineRepository.deleteById(id);
    }
}
