package main.ms.recensioni.service;

import java.util.Optional;
import main.ms.recensioni.domain.Recensione;
import main.ms.recensioni.repository.RecensioneRepository;
import main.ms.recensioni.service.dto.RecensioneDTO;
import main.ms.recensioni.service.mapper.RecensioneMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link main.ms.recensioni.domain.Recensione}.
 */
@Service
public class RecensioneService {

    private static final Logger LOG = LoggerFactory.getLogger(RecensioneService.class);

    private final RecensioneRepository recensioneRepository;

    private final RecensioneMapper recensioneMapper;

    public RecensioneService(RecensioneRepository recensioneRepository, RecensioneMapper recensioneMapper) {
        this.recensioneRepository = recensioneRepository;
        this.recensioneMapper = recensioneMapper;
    }

    /**
     * Save a recensione.
     *
     * @param recensioneDTO the entity to save.
     * @return the persisted entity.
     */
    public RecensioneDTO save(RecensioneDTO recensioneDTO) {
        LOG.debug("Request to save Recensione : {}", recensioneDTO);
        Recensione recensione = recensioneMapper.toEntity(recensioneDTO);
        recensione = recensioneRepository.save(recensione);
        return recensioneMapper.toDto(recensione);
    }

    /**
     * Update a recensione.
     *
     * @param recensioneDTO the entity to save.
     * @return the persisted entity.
     */
    public RecensioneDTO update(RecensioneDTO recensioneDTO) {
        LOG.debug("Request to update Recensione : {}", recensioneDTO);
        Recensione recensione = recensioneMapper.toEntity(recensioneDTO);
        recensione = recensioneRepository.save(recensione);
        return recensioneMapper.toDto(recensione);
    }

    /**
     * Partially update a recensione.
     *
     * @param recensioneDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<RecensioneDTO> partialUpdate(RecensioneDTO recensioneDTO) {
        LOG.debug("Request to partially update Recensione : {}", recensioneDTO);

        return recensioneRepository
            .findById(recensioneDTO.getId())
            .map(existingRecensione -> {
                recensioneMapper.partialUpdate(existingRecensione, recensioneDTO);

                return existingRecensione;
            })
            .map(recensioneRepository::save)
            .map(recensioneMapper::toDto);
    }

    /**
     * Get all the recensiones.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<RecensioneDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Recensiones");
        return recensioneRepository.findAll(pageable).map(recensioneMapper::toDto);
    }

    /**
     * Get one recensione by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<RecensioneDTO> findOne(String id) {
        LOG.debug("Request to get Recensione : {}", id);
        return recensioneRepository.findById(id).map(recensioneMapper::toDto);
    }

    /**
     * Delete the recensione by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        LOG.debug("Request to delete Recensione : {}", id);
        recensioneRepository.deleteById(id);
    }
}
