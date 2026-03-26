package main.ms.recensioni.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import main.ms.recensioni.domain.Recensione;
import main.ms.recensioni.repository.RecensioneRepository;
import main.ms.recensioni.service.dto.RecensioneDTO;
import main.ms.recensioni.service.mapper.RecensioneMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
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
    private final StreamBridge streamBridge;
    private final ObjectMapper objectMapper;

    public RecensioneService(
        RecensioneRepository recensioneRepository,
        RecensioneMapper recensioneMapper,
        StreamBridge streamBridge,
        ObjectMapper objectMapper
    ) {
        this.recensioneRepository = recensioneRepository;
        this.recensioneMapper = recensioneMapper;
        this.streamBridge = streamBridge;
        this.objectMapper = objectMapper;
    }

    /**
     * Save a recensione. Imposta dataRecensione automaticamente se non fornita.
     */
    public RecensioneDTO save(RecensioneDTO recensioneDTO) {
        LOG.debug("Request to save Recensione : {}", recensioneDTO);
        Recensione recensione = recensioneMapper.toEntity(recensioneDTO);

        // Imposta dataRecensione automaticamente se non fornita
        if (recensione.getDataRecensione() == null) {
            recensione.setDataRecensione(Instant.now());
        }

        // Imposta approvata = false di default se non fornito
        if (recensione.getApprovata() == null) {
            recensione.setApprovata(false);
        }

        recensione = recensioneRepository.save(recensione);
        RecensioneDTO result = recensioneMapper.toDto(recensione);

        // Pubblica evento Kafka se recensione approvata
        if (Boolean.TRUE.equals(recensione.getApprovata())) {
            pubblicaRecensioneApprovata(recensione);
        }

        return result;
    }

    /**
     * Update a recensione.
     */
    public RecensioneDTO update(RecensioneDTO recensioneDTO) {
        LOG.debug("Request to update Recensione : {}", recensioneDTO);
        Recensione recensione = recensioneMapper.toEntity(recensioneDTO);
        recensione = recensioneRepository.save(recensione);
        RecensioneDTO result = recensioneMapper.toDto(recensione);

        // Pubblica evento Kafka se recensione approvata
        if (Boolean.TRUE.equals(recensione.getApprovata())) {
            pubblicaRecensioneApprovata(recensione);
        }

        return result;
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
                    pubblicaRecensioneApprovata(saved);
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
     * Get all recensioni for a product, optionally filtered by approval status.
     */
    public Page<RecensioneDTO> findByProdottoIdAndApprovata(UUID prodottoId, Boolean approvata, Pageable pageable) {
        LOG.debug("Request to get Recensiones for prodottoId: {}, approvata: {}", prodottoId, approvata);
        if (approvata != null) {
            return recensioneRepository.findByProdottoIdAndApprovata(prodottoId, approvata, pageable)
                .map(recensioneMapper::toDto);
        }
        return recensioneRepository.findAll(pageable).map(recensioneMapper::toDto);
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

    /**
     * Pubblica evento recensione-approvata su Kafka.
     * ms-catalogo consumerà questo evento per aggiornare il votoTotale del prodotto.
     */
    private void pubblicaRecensioneApprovata(Recensione recensione) {
        try {
            String payload = objectMapper.writeValueAsString(new RecensioneApprovataEvent(
                recensione.getId(),
                recensione.getProdottoId(),
                recensione.getVotoSingolo()
            ));
            streamBridge.send("kafkaProducer-out-0", payload);
            LOG.info("Evento recensione-approvata pubblicato per prodotto: {}", recensione.getProdottoId());
        } catch (Exception e) {
            LOG.error("Errore pubblicazione evento Kafka per recensione {}: {}", recensione.getId(), e.getMessage());
        }
    }

    /**
     * Evento Kafka emesso quando una recensione viene approvata.
     */
    public record RecensioneApprovataEvent(String recensioneId, UUID prodottoId, Integer votoSingolo) {}
}
