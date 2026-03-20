package main.ms.notifiche.service;

import java.time.Instant;
import java.util.Optional;
import main.ms.notifiche.domain.Notifica;
import main.ms.notifiche.repository.NotificaRepository;
import main.ms.notifiche.service.dto.NotificaDTO;
import main.ms.notifiche.service.mapper.NotificaMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class NotificaService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificaService.class);

    private final NotificaRepository notificaRepository;
    private final NotificaMapper notificaMapper;

    public NotificaService(NotificaRepository notificaRepository, NotificaMapper notificaMapper) {
        this.notificaRepository = notificaRepository;
        this.notificaMapper = notificaMapper;
    }

    public NotificaDTO save(NotificaDTO notificaDTO) {
        LOG.debug("Request to save Notifica : {}", notificaDTO);
        Notifica notifica = notificaMapper.toEntity(notificaDTO);

        // Auto-genera dataNotifica se non fornita
        if (notifica.getDataNotifica() == null) {
            notifica.setDataNotifica(Instant.now());
        }

        // Default letta = false
        if (notifica.getLetta() == null) {
            notifica.setLetta(false);
        }

        notifica = notificaRepository.save(notifica);
        return notificaMapper.toDto(notifica);
    }

    public Page<NotificaDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Notifiche");
        return notificaRepository.findAll(pageable).map(notificaMapper::toDto);
    }

    public Optional<NotificaDTO> findOne(String id) {
        LOG.debug("Request to get Notifica : {}", id);
        return notificaRepository.findById(id).map(notificaMapper::toDto);
    }

    public void delete(String id) {
        LOG.debug("Request to delete Notifica : {}", id);
        notificaRepository.deleteById(id);
    }

    /**
     * Crea e salva una notifica da un evento Kafka.
     */
    public void creaNotifica(String tipo, String messaggio, String entitaId) {
        NotificaDTO dto = new NotificaDTO();
        dto.setTipo(tipo);
        dto.setMessaggio(messaggio);
        dto.setEntitaId(entitaId);
        dto.setDataNotifica(Instant.now());
        dto.setLetta(false);
        save(dto);
        LOG.info("Notifica creata — tipo: {}, entitaId: {}", tipo, entitaId);
    }
}
