package main.ms.catalogo.repository;

import java.util.List;
import java.util.Optional;
import main.ms.catalogo.domain.Prodotto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Prodotto entity.
 */
@Repository
public interface ProdottoRepository extends JpaRepository<Prodotto, Long>, JpaSpecificationExecutor<Prodotto> {
    default Optional<Prodotto> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Prodotto> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Prodotto> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select prodotto from Prodotto prodotto left join fetch prodotto.categoria",
        countQuery = "select count(prodotto) from Prodotto prodotto"
    )
    Page<Prodotto> findAllWithToOneRelationships(Pageable pageable);

    @Query("select prodotto from Prodotto prodotto left join fetch prodotto.categoria")
    List<Prodotto> findAllWithToOneRelationships();

    @Query("select prodotto from Prodotto prodotto left join fetch prodotto.categoria where prodotto.id =:id")
    Optional<Prodotto> findOneWithToOneRelationships(@Param("id") Long id);
}
