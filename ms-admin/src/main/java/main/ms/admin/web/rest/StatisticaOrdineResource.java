package main.ms.admin.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import main.ms.admin.service.StatisticaOrdineService;
import main.ms.admin.service.dto.StatisticaOrdineDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class StatisticaOrdineResource {

    private static final Logger LOG = LoggerFactory.getLogger(StatisticaOrdineResource.class);

    private final StatisticaOrdineService statisticaOrdineService;

    public StatisticaOrdineResource(StatisticaOrdineService statisticaOrdineService) {
        this.statisticaOrdineService = statisticaOrdineService;
    }

    @PostMapping("/statistica-ordines")
    public ResponseEntity<StatisticaOrdineDTO> createStatisticaOrdine(
        @RequestBody StatisticaOrdineDTO dto) throws URISyntaxException {
        LOG.debug("REST request to save StatisticaOrdine : {}", dto);
        StatisticaOrdineDTO result = statisticaOrdineService.save(dto);
        return ResponseEntity.created(new URI("/api/statistica-ordines/" + result.getId())).body(result);
    }

    @GetMapping("/statistica-ordines")
    public ResponseEntity<List<StatisticaOrdineDTO>> getAllStatisticheOrdine(Pageable pageable) {
        LOG.debug("REST request to get all StatisticheOrdine");
        Page<StatisticaOrdineDTO> page = statisticaOrdineService.findAll(pageable);
        return ResponseEntity.ok(page.getContent());
    }

    @GetMapping("/statistica-ordines/{id}")
    public ResponseEntity<StatisticaOrdineDTO> getStatisticaOrdine(@PathVariable UUID id) {
        LOG.debug("REST request to get StatisticaOrdine : {}", id);
        Optional<StatisticaOrdineDTO> dto = statisticaOrdineService.findOne(id);
        return dto.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/statistica-ordines/{id}")
    public ResponseEntity<Void> deleteStatisticaOrdine(@PathVariable UUID id) {
        LOG.debug("REST request to delete StatisticaOrdine : {}", id);
        statisticaOrdineService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
