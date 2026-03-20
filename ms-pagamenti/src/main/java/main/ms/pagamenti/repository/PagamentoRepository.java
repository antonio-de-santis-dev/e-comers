package main.ms.pagamenti.repository;

import java.util.UUID;
import main.ms.pagamenti.domain.Pagamento;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Pagamento entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, UUID>, JpaSpecificationExecutor<Pagamento> {}
