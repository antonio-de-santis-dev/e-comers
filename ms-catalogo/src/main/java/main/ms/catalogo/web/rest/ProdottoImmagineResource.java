package main.ms.catalogo.web.rest;

import main.ms.catalogo.service.ProdottoImmagineService;
import main.ms.catalogo.service.dto.ProdottoImmagineDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

/**
 * REST controller per la gestione delle immagini del carosello di un prodotto.
 *
 * GET    /api/prodottos/{prodottoId}/immagini         → lista immagini
 * POST   /api/prodottos/{prodottoId}/immagini         → aggiunge immagine
 * DELETE /api/prodottos/{prodottoId}/immagini/{id}    → elimina immagine
 */
@RestController
@RequestMapping("/api/prodottos/{prodottoId}/immagini")
public class ProdottoImmagineResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoImmagineResource.class);

    private final ProdottoImmagineService immagineService;

    public ProdottoImmagineResource(ProdottoImmagineService immagineService) {
        this.immagineService = immagineService;
    }

    /**
     * GET /api/prodottos/{prodottoId}/immagini
     * Restituisce tutte le immagini carosello del prodotto, ordinate per ordine ASC.
     */
    @GetMapping
    public ResponseEntity<List<ProdottoImmagineDTO>> getImmagini(
            @PathVariable UUID prodottoId) {
        LOG.debug("REST GET immagini prodotto: {}", prodottoId);
        List<ProdottoImmagineDTO> immagini = immagineService.findByProdottoId(prodottoId);
        return ResponseEntity.ok(immagini);
    }

    /**
     * POST /api/prodottos/{prodottoId}/immagini
     * Aggiunge una nuova immagine al carosello del prodotto.
     */
    @PostMapping
    public ResponseEntity<ProdottoImmagineDTO> addImmagine(
            @PathVariable UUID prodottoId,
            @RequestBody ProdottoImmagineDTO dto) throws URISyntaxException {
        LOG.debug("REST POST immagine prodotto: {}", prodottoId);
        ProdottoImmagineDTO result = immagineService.save(prodottoId, dto);
        return ResponseEntity
            .created(new URI("/api/prodottos/" + prodottoId + "/immagini/" + result.getId()))
            .body(result);
    }

    /**
     * DELETE /api/prodottos/{prodottoId}/immagini/{id}
     * Elimina una specifica immagine del carosello.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImmagine(
            @PathVariable UUID prodottoId,
            @PathVariable UUID id) {
        LOG.debug("REST DELETE immagine: {} del prodotto: {}", id, prodottoId);
        immagineService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
