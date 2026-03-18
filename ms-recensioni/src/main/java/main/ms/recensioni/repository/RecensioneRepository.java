package main.ms.recensioni.repository;

import main.ms.recensioni.domain.Recensione;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Recensione entity.
 */
@Repository
public interface RecensioneRepository extends MongoRepository<Recensione, String> {}
