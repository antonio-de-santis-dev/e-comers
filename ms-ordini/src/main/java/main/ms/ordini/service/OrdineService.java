package main.ms.ordini.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import main.ms.ordini.domain.Ordine;
import main.ms.ordini.domain.enumeration.StatoOrdine;
import main.ms.ordini.repository.OrdineRepository;
import main.ms.ordini.service.dto.OrdineDTO;
import main.ms.ordini.service.mapper.OrdineMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.ms.ordini.domain.Ordine}.
 */
@Service
@Transactional
public class OrdineService {

    private static final Logger LOG = LoggerFactory.getLogger(OrdineService.class);

    private static final DateTimeFormatter NUMERO_ORDINE_FMT =
        DateTimeFormatter.ofPattern("yyyyMMdd").withZone(ZoneId.of("Europe/Rome"));

    private final OrdineRepository ordineRepository;
    private final OrdineMapper ordineMapper;
    private final StreamBridge streamBridge;
    private final ObjectMapper objectMapper;

    public OrdineService(
        OrdineRepository ordineRepository,
        OrdineMapper ordineMapper,
        StreamBridge streamBridge,
        ObjectMapper objectMapper
    ) {
        this.ordineRepository = ordineRepository;
        this.ordineMapper = ordineMapper;
        this.streamBridge = streamBridge;
        this.objectMapper = objectMapper;
    }

    /**
     * Save a ordine.
     */
    public OrdineDTO save(OrdineDTO ordineDTO) {
        LOG.debug("Request to save Ordine : {}", ordineDTO);
        Ordine ordine = ordineMapper.toEntity(ordineDTO);

        // Auto-genera numeroOrdine se non presente
        if (ordine.getNumeroOrdine() == null || ordine.getNumeroOrdine().isBlank()) {
            String data   = NUMERO_ORDINE_FMT.format(Instant.now());
            String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            ordine.setNumeroOrdine("ORD-" + data + "-" + random);
        }

        // Auto-genera dataCreazione se non presente (il @NotNull è stato rimosso dal DTO)
        if (ordine.getDataCreazione() == null) {
            ordine.setDataCreazione(Instant.now());
        }

        // Stato iniziale default
        if (ordine.getStatoOrdine() == null) {
            ordine.setStatoOrdine(StatoOrdine.IN_ELABORAZIONE);
        }

        ordine = ordineRepository.save(ordine);
        OrdineDTO result = ordineMapper.toDto(ordine);

        if (StatoOrdine.PAGATO.equals(ordine.getStatoOrdine())) {
            pubblicaOrdineConfermato(ordine);
        }

        return result;
    }

    /**
     * Update a ordine.
     */
    public OrdineDTO update(OrdineDTO ordineDTO) {
        LOG.debug("Request to update Ordine : {}", ordineDTO);
        Ordine ordine = ordineMapper.toEntity(ordineDTO);
        ordine = ordineRepository.save(ordine);
        OrdineDTO result = ordineMapper.toDto(ordine);

        if (StatoOrdine.PAGATO.equals(ordine.getStatoOrdine())) {
            pubblicaOrdineConfermato(ordine);
        }

        return result;
    }

    /**
     * Partially update a ordine.
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
            .map(saved -> {
                if (StatoOrdine.PAGATO.equals(saved.getStatoOrdine())) {
                    pubblicaOrdineConfermato(saved);
                }
                return saved;
            })
            .map(ordineMapper::toDto);
    }

    /**
     * Get one ordine by id.
     */
    @Transactional(readOnly = true)
    public Optional<OrdineDTO> findOne(UUID id) {
        LOG.debug("Request to get Ordine : {}", id);
        return ordineRepository.findById(id).map(ordineMapper::toDto);
    }

    /**
     * Delete the ordine by id.
     */
    public void delete(UUID id) {
        LOG.debug("Request to delete Ordine : {}", id);
        ordineRepository.deleteById(id);
    }

    /**
     * Pubblica evento Kafka ordine-confermato.
     * Incluso email del cliente — usato da ms-notifiche come destinatario.
     */
    private void pubblicaOrdineConfermato(Ordine ordine) {
        try {
            String payload = objectMapper.writeValueAsString(new OrdineConfermatoEvent(
                ordine.getId(),
                ordine.getNumeroOrdine(),
                ordine.getClienteId(),
                ordine.getEmail(),           // <-- aggiunto: destinatario per ms-notifiche
                ordine.getNomeCliente(),      // <-- aggiunto: utile per il messaggio notifica
                ordine.getCognomeCliente()    // <-- aggiunto: utile per il messaggio notifica
            ));
            streamBridge.send("kafkaProducer-out-0", payload);
            LOG.info("Evento ordine-confermato pubblicato per ordine: {} cliente: {}",
                ordine.getNumeroOrdine(), ordine.getEmail());
        } catch (Exception e) {
            LOG.error("Errore pubblicazione evento Kafka per ordine {}: {}",
                ordine.getId(), e.getMessage());
        }
    }

    /**
     * Evento Kafka ordine-confermato.
     * Consumato da: ms-catalogo (scorte), ms-notifiche (email), ms-admin (statistiche).
     */
    public record OrdineConfermatoEvent(
        UUID ordineId,
        String numeroOrdine,
        UUID clienteId,
        String emailCliente,
        String nomeCliente,
        String cognomeCliente
    ) {}
}
