package main.ms.ordini.repository;

import java.util.UUID;
import main.ms.ordini.domain.Ordine;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Ordine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrdineRepository extends JpaRepository<Ordine, UUID>, JpaSpecificationExecutor<Ordine> {}
