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

    public OrdineService(OrdineRepository ordineRepository, OrdineMapper ordineMapper,
                         StreamBridge streamBridge, ObjectMapper objectMapper) {
        this.ordineRepository = ordineRepository;
        this.ordineMapper = ordineMapper;
        this.streamBridge = streamBridge;
        this.objectMapper = objectMapper;
    }

    public OrdineDTO save(OrdineDTO ordineDTO) {
        LOG.debug("Request to save Ordine : {}", ordineDTO);
        Ordine ordine = ordineMapper.toEntity(ordineDTO);

        // Auto-genera numeroOrdine
        if (ordine.getNumeroOrdine() == null || ordine.getNumeroOrdine().isBlank()) {
            String data   = NUMERO_ORDINE_FMT.format(Instant.now());
            String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            ordine.setNumeroOrdine("ORD-" + data + "-" + random);
        }

        // Auto-genera dataCreazione
        if (ordine.getDataCreazione() == null) {
            ordine.setDataCreazione(Instant.now());
        }

        // Stato iniziale di default
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

    @Transactional(readOnly = true)
    public Optional<OrdineDTO> findOne(UUID id) {
        LOG.debug("Request to get Ordine : {}", id);
        return ordineRepository.findById(id).map(ordineMapper::toDto);
    }

    public void delete(UUID id) {
        LOG.debug("Request to delete Ordine : {}", id);
        ordineRepository.deleteById(id);
    }

    /**
     * Pubblica evento ordine-confermato su Kafka.
     * Il payload include emailCliente e nomeCliente così ms-notifiche
     * può popolare il campo destinatario.
     */
    private void pubblicaOrdineConfermato(Ordine ordine) {
        try {
            String payload = objectMapper.writeValueAsString(new OrdineConfermatoEvent(
                ordine.getId(),
                ordine.getNumeroOrdine(),
                ordine.getClienteId(),
                ordine.getEmail(),
                ordine.getNomeCliente(),
                ordine.getCognomeCliente()
            ));
            streamBridge.send("kafkaProducer-out-0", payload);
            LOG.info("Evento ordine-confermato pubblicato per ordine: {} destinatario: {}",
                ordine.getNumeroOrdine(), ordine.getEmail());
        } catch (Exception e) {
            LOG.error("Errore pubblicazione evento Kafka per ordine {}: {}", ordine.getId(), e.getMessage());
        }
    }

    // Record evento Kafka — ora include email e nome per le notifiche
    public record OrdineConfermatoEvent(
        UUID ordineId,
        String numeroOrdine,
        UUID clienteId,
        String emailCliente,
        String nomeCliente,
        String cognomeCliente
    ) {}
}
