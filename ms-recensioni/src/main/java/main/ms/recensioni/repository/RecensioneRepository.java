package main.ms.recensioni.repository;

import java.util.List;
import java.util.UUID;
import main.ms.recensioni.domain.Recensione;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Recensione entity.
 */
@Repository
public interface RecensioneRepository extends MongoRepository<Recensione, String> {
    /**
     * Trova tutte le recensioni per un prodotto specifico (approvate o meno).
     */
    List<Recensione> findByProdottoId(UUID prodottoId);

    /**
     * Trova le recensioni per un prodotto filtrate per stato approvazione, con paginazione.
     */
    Page<Recensione> findByProdottoIdAndApprovata(UUID prodottoId, Boolean approvata, Pageable pageable);

    /**
     * Trova tutte le recensioni per un prodotto filtrate per stato approvazione (senza paginazione).
     */
    List<Recensione> findByProdottoIdAndApprovata(UUID prodottoId, Boolean approvata);
}
