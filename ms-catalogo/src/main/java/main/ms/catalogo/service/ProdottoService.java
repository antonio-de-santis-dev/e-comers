package main.ms.catalogo.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import main.ms.catalogo.domain.Prodotto;
import main.ms.catalogo.repository.ProdottoRepository;
import main.ms.catalogo.service.dto.ProdottoDTO;
import main.ms.catalogo.service.mapper.ProdottoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link main.ms.catalogo.domain.Prodotto}.
 */
@Service
@Transactional
public class ProdottoService {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoService.class);

    private final ProdottoRepository prodottoRepository;
    private final ProdottoMapper prodottoMapper;

    private static final int TOP_VENDUTI_LIMIT = 10;
    private static final int CORRELATI_LIMIT = 5;

    public ProdottoService(ProdottoRepository prodottoRepository, ProdottoMapper prodottoMapper) {
        this.prodottoRepository = prodottoRepository;
        this.prodottoMapper = prodottoMapper;
    }

    // =========================================================================
    // CRUD BASE
    // =========================================================================

    public ProdottoDTO save(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to save Prodotto : {}", prodottoDTO);
        Prodotto prodotto = prodottoMapper.toEntity(prodottoDTO);
        sincronizzaDisponibilita(prodotto);
        prodotto = prodottoRepository.save(prodotto);
        return prodottoMapper.toDto(prodotto);
    }

    public ProdottoDTO update(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to update Prodotto : {}", prodottoDTO);
        Prodotto prodotto = prodottoMapper.toEntity(prodottoDTO);
        sincronizzaDisponibilita(prodotto);
        prodotto = prodottoRepository.save(prodotto);
        return prodottoMapper.toDto(prodotto);
    }

    public Optional<ProdottoDTO> partialUpdate(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to partially update Prodotto : {}", prodottoDTO);
        // FIX: getId() ora è UUID — usiamo findByProdottoUuid invece di findById(Long)
        return prodottoRepository
            .findByProdottoUuid(prodottoDTO.getId())
            .map(existingProdotto -> {
                prodottoMapper.partialUpdate(existingProdotto, prodottoDTO);
                sincronizzaDisponibilita(existingProdotto);
                return existingProdotto;
            })
            .map(prodottoRepository::save)
            .map(prodottoMapper::toDto);
    }

    public Page<ProdottoDTO> findAllWithEagerRelationships(Pageable pageable) {
        return prodottoRepository.findAllWithEagerRelationships(pageable).map(prodottoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ProdottoDTO> findAll(Pageable pageable) {
        return prodottoRepository.findAll(pageable).map(prodottoMapper::toDto);
    }

    // FIX: id cambiato da Long a UUID
    @Transactional(readOnly = true)
    public Optional<ProdottoDTO> findOne(UUID id) {
        LOG.debug("Request to get Prodotto : {}", id);
        return prodottoRepository.findOneWithEagerRelationships(id).map(prodottoMapper::toDto);
    }

    // FIX: id cambiato da Long a UUID — deleteById usa findByProdottoUuid
    public void delete(UUID id) {
        LOG.debug("Request to delete Prodotto : {}", id);
        prodottoRepository
            .findByProdottoUuid(id)
            .ifPresent(prodottoRepository::delete);
    }

    // =========================================================================
    // API SPECIALI — endpoint custom per il frontend
    // =========================================================================

    @Transactional(readOnly = true)
    public List<ProdottoDTO> findInEvidenza() {
        LOG.debug("Recupero prodotti in evidenza");
        return prodottoRepository
            .findByInEvidenzaTrueAndDisponibileTrue()
            .stream()
            .map(prodottoMapper::toDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ProdottoDTO> findTopVenduti() {
        LOG.debug("Recupero top {} prodotti più venduti", TOP_VENDUTI_LIMIT);
        Pageable pageable = PageRequest.of(0, TOP_VENDUTI_LIMIT,
            Sort.by(Sort.Direction.DESC, "totalePurchased"));
        return prodottoRepository
            .findByDisponibileTrue(pageable)
            .stream()
            .map(prodottoMapper::toDto)
            .toList();
    }

    // FIX: prodottoId cambiato da Long a UUID
    @Transactional(readOnly = true)
    public List<ProdottoDTO> findCorrelati(UUID prodottoId) {
        LOG.debug("Recupero prodotti correlati a uuid={}", prodottoId);
        return prodottoRepository
            .findByProdottoUuid(prodottoId)
            .map(prodotto -> {
                Pageable pageable = PageRequest.of(0, CORRELATI_LIMIT);
                return prodottoRepository
                    .findByCategoria_IdAndProdottoUuidNotAndDisponibileTrue(
                    prodotto.getCategoria().getId(),
                    prodottoId,
                    pageable
                )
                    .stream()
                    .map(prodottoMapper::toDto)
                    .toList();
            })
            .orElse(List.of());
    }

    // =========================================================================
    // METODI KAFKA
    // =========================================================================

    @Transactional
    public void aggiornaVotoTotale(UUID prodottoUuid, Double nuovaMedia) {
        LOG.debug("Aggiornamento votoTotale per prodottoUuid={}, nuovaMedia={}", prodottoUuid, nuovaMedia);
        prodottoRepository
            .findByProdottoUuid(prodottoUuid)
            .ifPresentOrElse(
                prodotto -> {
                    prodotto.setVotoTotale(nuovaMedia);
                    prodottoRepository.save(prodotto);
                    LOG.info("VotoTotale aggiornato a {} per uuid={}", nuovaMedia, prodottoUuid);
                },
                () -> LOG.warn("Prodotto uuid={} non trovato — votoTotale non aggiornato", prodottoUuid)
            );
    }

    @Transactional
    public void decrementaScorte(UUID prodottoUuid, Integer quantitaAcquistata) {
        LOG.debug("Decremento scorte prodottoUuid={}, quantita={}", prodottoUuid, quantitaAcquistata);
        prodottoRepository
            .findByProdottoUuid(prodottoUuid)
            .ifPresentOrElse(
                prodotto -> {
                    int nuovaQuantita = prodotto.getQuantitaDisponibile() - quantitaAcquistata;
                    if (nuovaQuantita < 0) {
                        LOG.warn("Scorte insufficienti per uuid={}: disponibili={}, richieste={}",
                            prodottoUuid, prodotto.getQuantitaDisponibile(), quantitaAcquistata);
                        nuovaQuantita = 0;
                    }
                    prodotto.setQuantitaDisponibile(nuovaQuantita);
                    sincronizzaDisponibilita(prodotto);
                    prodottoRepository.save(prodotto);
                    LOG.info("Scorte aggiornate: uuid={}, nuovaQuantita={}", prodottoUuid, nuovaQuantita);
                },
                () -> LOG.warn("Prodotto uuid={} non trovato — scorte non decrementate", prodottoUuid)
            );
    }

    @Transactional
    public void incrementaTotalePurchased(UUID prodottoUuid, Integer quantitaAcquistata) {
        LOG.debug("Incremento totalePurchased prodottoUuid={}, quantita={}", prodottoUuid, quantitaAcquistata);
        prodottoRepository
            .findByProdottoUuid(prodottoUuid)
            .ifPresentOrElse(
                prodotto -> {
                    int nuovoTotale = (prodotto.getTotalePurchased() != null
                        ? prodotto.getTotalePurchased() : 0) + quantitaAcquistata;
                    prodotto.setTotalePurchased(nuovoTotale);
                    prodottoRepository.save(prodotto);
                    LOG.info("TotalePurchased aggiornato a {} per uuid={}", nuovoTotale, prodottoUuid);
                },
                () -> LOG.warn("Prodotto uuid={} non trovato — totalePurchased non incrementato", prodottoUuid)
            );
    }

    // =========================================================================
    // METODI PRIVATI
    // =========================================================================

    private void sincronizzaDisponibilita(Prodotto prodotto) {
        if (prodotto.getQuantitaDisponibile() != null && prodotto.getQuantitaDisponibile() == 0) {
            prodotto.setDisponibile(false);
            LOG.debug("Prodotto uuid={} impostato non disponibile (quantità zero)",
                prodotto.getProdottoUuid());
        }
    }
}
