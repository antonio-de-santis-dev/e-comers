package main.ms.recensioni.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import main.ms.recensioni.broker.RecensioneKafkaPublisher;
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
    private final RecensioneKafkaPublisher kafkaPublisher;

    public RecensioneService(
        RecensioneRepository recensioneRepository,
        RecensioneMapper recensioneMapper,
        RecensioneKafkaPublisher kafkaPublisher
    ) {
        this.recensioneRepository = recensioneRepository;
        this.recensioneMapper = recensioneMapper;
        this.kafkaPublisher = kafkaPublisher;
    }

    /**
     * Save a recensione.
     * Imposta dataRecensione e approvata automaticamente se non forniti.
     */
    public RecensioneDTO save(RecensioneDTO recensioneDTO) {
        LOG.debug("Request to save Recensione : {}", recensioneDTO);
        Recensione recensione = recensioneMapper.toEntity(recensioneDTO);

        if (recensione.getDataRecensione() == null) {
            recensione.setDataRecensione(Instant.now());
        }
        if (recensione.getApprovata() == null) {
            recensione.setApprovata(false);
        }

        recensione = recensioneRepository.save(recensione);

        // Kafka pubblicato in modo asincrono dal bean separato — non causa mai 500
        if (Boolean.TRUE.equals(recensione.getApprovata())) {
            kafkaPublisher.pubblicaRecensioneApprovata(
                recensione.getId(),
                recensione.getProdottoId(),
                recensione.getVotoSingolo()
            );
        }

        return recensioneMapper.toDto(recensione);
    }

    /**
     * Update a recensione.
     */
    public RecensioneDTO update(RecensioneDTO recensioneDTO) {
        LOG.debug("Request to update Recensione : {}", recensioneDTO);
        Recensione recensione = recensioneMapper.toEntity(recensioneDTO);
        recensione = recensioneRepository.save(recensione);

        if (Boolean.TRUE.equals(recensione.getApprovata())) {
            kafkaPublisher.pubblicaRecensioneApprovata(
                recensione.getId(),
                recensione.getProdottoId(),
                recensione.getVotoSingolo()
            );
        }

        return recensioneMapper.toDto(recensione);
    }

    /**
     * Partially update a recensione.
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
            .map(saved -> {
                if (Boolean.TRUE.equals(saved.getApprovata())) {
                    kafkaPublisher.pubblicaRecensioneApprovata(
                        saved.getId(),
                        saved.getProdottoId(),
                        saved.getVotoSingolo()
                    );
                }
                return saved;
            })
            .map(recensioneMapper::toDto);
    }

    /**
     * Get all the recensiones.
     */
    public Page<RecensioneDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Recensiones");
        return recensioneRepository.findAll(pageable).map(recensioneMapper::toDto);
    }

    /**
     * Get recensioni per prodotto, opzionalmente filtrate per approvazione.
     */
    public Page<RecensioneDTO> findByProdottoIdAndApprovata(UUID prodottoId, Boolean approvata, Pageable pageable) {
        LOG.debug("Request to get Recensiones for prodottoId: {}, approvata: {}", prodottoId, approvata);
        if (approvata != null) {
            return recensioneRepository.findByProdottoIdAndApprovata(prodottoId, approvata, pageable)
                .map(recensioneMapper::toDto);
        }
        // approvata non specificata → tutte le recensioni del prodotto, non di tutti i prodotti
        return recensioneRepository.findByProdottoId(prodottoId, pageable)
            .map(recensioneMapper::toDto);
    }

    /**
     * Get one recensione by id.
     */
    public Optional<RecensioneDTO> findOne(String id) {
        LOG.debug("Request to get Recensione : {}", id);
        return recensioneRepository.findById(id).map(recensioneMapper::toDto);
    }

    /**
     * Delete the recensione by id.
     */
    public void delete(String id) {
        LOG.debug("Request to delete Recensione : {}", id);
        recensioneRepository.deleteById(id);
    }
}
