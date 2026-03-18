package main.ms.catalogo.service;

import java.util.Optional;
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
import java.util.List;

/**
 * Service Implementation for managing {@link main.ms.catalogo.domain.Prodotto}.
 */
@Service
@Transactional
public class ProdottoService {

    private static final Logger LOG = LoggerFactory.getLogger(ProdottoService.class);

    private final ProdottoRepository prodottoRepository;
    private final ProdottoMapper prodottoMapper;

    private final int TOP_VENDUTI_LIMIT= 10;
    private final int CORRELATI_LIMIT= 5;

    public ProdottoService(ProdottoRepository prodottoRepository,
                           ProdottoMapper prodottoMapper) {
        this.prodottoRepository = prodottoRepository;
        this.prodottoMapper = prodottoMapper;
    }

    /**
     * Save a prodotto.
     *
     * @param prodottoDTO the entity to save.
     * @return the persisted entity.
     */
    public ProdottoDTO save(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to save Prodotto : {}", prodottoDTO);
        Prodotto prodotto = prodottoMapper.toEntity(prodottoDTO);

        sincronizzaDisponibilita(prodotto);

        prodotto = prodottoRepository.save(prodotto);
        return prodottoMapper.toDto(prodotto);
    }

    /**
     * Update a prodotto.
     *
     * @param prodottoDTO the entity to save.
     * @return the persisted entity.
     */
    public ProdottoDTO update(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to update Prodotto : {}", prodottoDTO);
        Prodotto prodotto = prodottoMapper.toEntity(prodottoDTO);

        sincronizzaDisponibilita(prodotto);

        prodotto = prodottoRepository.save(prodotto);
        return prodottoMapper.toDto(prodotto);
    }

    /**
     * Partially update a prodotto.
     *
     * @param prodottoDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProdottoDTO> partialUpdate(ProdottoDTO prodottoDTO) {
        LOG.debug("Request to partially update Prodotto : {}", prodottoDTO);

        return prodottoRepository
            .findById(prodottoDTO.getId())
            .map(existingProdotto -> {
                prodottoMapper.partialUpdate(existingProdotto, prodottoDTO);
                sincronizzaDisponibilita(existingProdotto);
                return existingProdotto;
            })
            .map(prodottoRepository::save)
            .map(prodottoMapper::toDto);
    }

    /**
     * Get all the prodottos with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProdottoDTO> findAllWithEagerRelationships(Pageable pageable) {
        return prodottoRepository.findAllWithEagerRelationships(pageable).map(prodottoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ProdottoDTO> findAll(Pageable pageable) {
        return prodottoRepository.findAll(pageable).map(prodottoMapper::toDto);
    }

    /**
     * Get one prodotto by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProdottoDTO> findOne(Long id) {
        LOG.debug("Request to get Prodotto : {}", id);
        return prodottoRepository.findOneWithEagerRelationships(id).map(prodottoMapper::toDto);
    }

    /**
     * Delete the prodotto by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Prodotto : {}", id);
        prodottoRepository.deleteById(id);
    }

    //API PER ENDPOINT CUSTOM

    //RESTITUISCE I PRODOTTI IN EVIDENZA DEL CAROSELO
    @Transactional(readOnly = true)
    public List<ProdottoDTO> findInEvidenza() {
        LOG.debug("Recupero prodotti in evidenza");
        return prodottoRepository
            .findByInEvidenzaTrueAndDisponibileTrue()
            .stream()
            .map(prodottoMapper::toDto)
            .toList();
    }

    // RESTITUISCE I TOP 10 PRODOTTI PIU VENDUTI
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

    // RESTITUISCE FINO A 5 PRODOTTI COREALRI AL PRODOTTO SECIFICO
    @Transactional(readOnly = true)
    public List<ProdottoDTO> findCorrelati(Long prodottoId) {
        LOG.debug("Recupero prodotti correlati a id={}", prodottoId);

        return prodottoRepository
            .findById(prodottoId)
            .map(prodotto -> {
                Pageable pageable = PageRequest.of(0, CORRELATI_LIMIT);
                return prodottoRepository
                    .findByCategoria_IdAndIdNotAndDisponibileTrue(
                        prodotto.getCategoria().getId(),
                        prodottoId,
                        pageable
                    )
                    .stream()
                    .map(prodottoMapper::toDto)
                    .toList();
            })
            .orElse(List.of()); // prodotto non trovato → lista vuota
    }

    // METODI PRIVATI

    private void sincronizzaDisponibilita(Prodotto prodotto) {
        if (prodotto.getQuantitaDisponibile() != null
            && prodotto.getQuantitaDisponibile() == 0) {
            prodotto.setDisponibile(false);
            LOG.debug("Prodotto id={} impostato non disponibile (quantità zero)",
                prodotto.getProdottoUuid());
        }
    }

}
