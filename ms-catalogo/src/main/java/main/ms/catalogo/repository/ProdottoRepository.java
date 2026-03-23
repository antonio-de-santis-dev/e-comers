package main.ms.catalogo.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
public interface ProdottoRepository extends JpaRepository<Prodotto, UUID>, JpaSpecificationExecutor<Prodotto> {
    default Optional<Prodotto> findOneWithEagerRelationships(UUID id) {
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

    @Query("select prodotto from Prodotto prodotto left join fetch prodotto.categoria where prodotto.prodottoUuid  =:id")
    Optional<Prodotto> findOneWithToOneRelationships(@Param("id") UUID id);

    //prodotti in evidenza caroselo home
    List<Prodotto> findByInEvidenzaTrueAndDisponibileTrue();

    //Prodotti disponibili con paginazione e ordinamento
    List<Prodotto> findByDisponibileTrue(Pageable pageable);

    //Prodotti correlati: stessa categoria, prodotto diverso,
    List<Prodotto> findByCategoria_IdAndProdottoUuidNotAndDisponibileTrue(
        Long categoriaId,
        UUID rodottoUuid,
        Pageable pageable
    );

    //Ricerca per UUID
    Optional<Prodotto> findByProdottoUuid(UUID prodottoUuid);


}
