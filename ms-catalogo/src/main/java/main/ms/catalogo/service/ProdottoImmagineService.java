package main.ms.catalogo.service;

import main.ms.catalogo.domain.Prodotto;
import main.ms.catalogo.domain.ProdottoImmagine;
import main.ms.catalogo.repository.ProdottoImmagineRepository;
import main.ms.catalogo.repository.ProdottoRepository;
import main.ms.catalogo.service.dto.ProdottoImmagineDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProdottoImmagineService {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoImmagineService.class);

    private final ProdottoImmagineRepository immagineRepository;
    private final ProdottoRepository prodottoRepository;

    public ProdottoImmagineService(ProdottoImmagineRepository immagineRepository,
                                   ProdottoRepository prodottoRepository) {
        this.immagineRepository = immagineRepository;
        this.prodottoRepository = prodottoRepository;
    }

    /**
     * Restituisce tutte le immagini carosello di un prodotto, ordinate per ordine ASC.
     */
    @Transactional(readOnly = true)
    public List<ProdottoImmagineDTO> findByProdottoId(UUID prodottoId) {
        LOG.debug("Caricamento immagini per prodotto: {}", prodottoId);
        return immagineRepository.findByProdottoIdOrderByOrdine(prodottoId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    /**
     * Aggiunge una nuova immagine al carosello di un prodotto.
     * Il frontend invia immagine come stringa Base64; la convertiamo in byte[] per il DB.
     */
    public ProdottoImmagineDTO save(UUID prodottoId, ProdottoImmagineDTO dto) {
        LOG.debug("Salvataggio immagine per prodotto: {}", prodottoId);
        Prodotto prodotto = prodottoRepository.findById(prodottoId)
            .orElseThrow(() -> new IllegalArgumentException("Prodotto non trovato: " + prodottoId));

        ProdottoImmagine entity = new ProdottoImmagine();
        entity.setProdotto(prodotto);
        // Converte Base64 string → byte[] per salvataggio nel DB
        if (dto.getImmagine() != null && !dto.getImmagine().isEmpty()) {
            entity.setImmagine(Base64.getDecoder().decode(dto.getImmagine()));
        }
        entity.setImmagineContentType(dto.getImmagineContentType());
        entity.setOrdine(dto.getOrdine() != null ? dto.getOrdine() : 0);

        return toDTO(immagineRepository.save(entity));
    }

    /**
     * Elimina un'immagine specifica.
     */
    public void delete(UUID immagineId) {
        LOG.debug("Eliminazione immagine: {}", immagineId);
        immagineRepository.deleteById(immagineId);
    }

    /**
     * Elimina tutte le immagini di un prodotto.
     */
    public void deleteByProdottoId(UUID prodottoId) {
        immagineRepository.deleteByProdottoId(prodottoId);
    }

    // ---- Mapping ----

    private ProdottoImmagineDTO toDTO(ProdottoImmagine entity) {
        ProdottoImmagineDTO dto = new ProdottoImmagineDTO();
        dto.setId(entity.getId() != null ? entity.getId().toString() : null);
        dto.setProdottoId(entity.getProdotto() != null ? entity.getProdotto().getProdottoUuid() : null);
        // Converte byte[] → Base64 string per il frontend
        if (entity.getImmagine() != null) {
            dto.setImmagine(Base64.getEncoder().encodeToString(entity.getImmagine()));
        }
        dto.setImmagineContentType(entity.getImmagineContentType());
        dto.setOrdine(entity.getOrdine());
        return dto;
    }
}
