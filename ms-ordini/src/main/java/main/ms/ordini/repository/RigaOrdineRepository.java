package main.ms.ordini.repository;

import java.util.UUID;
import main.ms.ordini.domain.RigaOrdine;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RigaOrdine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RigaOrdineRepository extends JpaRepository<RigaOrdine, UUID> {}
