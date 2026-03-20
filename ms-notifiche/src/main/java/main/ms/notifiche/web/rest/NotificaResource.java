package main.ms.notifiche.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import main.ms.notifiche.service.NotificaService;
import main.ms.notifiche.service.dto.NotificaDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class NotificaResource {

    private static final Logger LOG = LoggerFactory.getLogger(NotificaResource.class);

    private final NotificaService notificaService;

    public NotificaResource(NotificaService notificaService) {
        this.notificaService = notificaService;
    }

    @PostMapping("/notificas")
    public ResponseEntity<NotificaDTO> createNotifica(@RequestBody NotificaDTO notificaDTO) throws URISyntaxException {
        LOG.debug("REST request to save Notifica : {}", notificaDTO);
        NotificaDTO result = notificaService.save(notificaDTO);
        return ResponseEntity.created(new URI("/api/notificas/" + result.getId())).body(result);
    }

    @GetMapping("/notificas")
    public ResponseEntity<List<NotificaDTO>> getAllNotifiche(Pageable pageable) {
        LOG.debug("REST request to get all Notifiche");
        Page<NotificaDTO> page = notificaService.findAll(pageable);
        return ResponseEntity.ok(page.getContent());
    }

    @GetMapping("/notificas/{id}")
    public ResponseEntity<NotificaDTO> getNotifica(@PathVariable String id) {
        LOG.debug("REST request to get Notifica : {}", id);
        Optional<NotificaDTO> notificaDTO = notificaService.findOne(id);
        return notificaDTO.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/notificas/{id}")
    public ResponseEntity<Void> deleteNotifica(@PathVariable String id) {
        LOG.debug("REST request to delete Notifica : {}", id);
        notificaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
