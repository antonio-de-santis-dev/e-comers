package main.ms.catalogo.repository;

import main.ms.catalogo.domain.ProdottoImmagine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProdottoImmagineRepository extends JpaRepository<ProdottoImmagine, UUID> {

    @Query("SELECT pi FROM ProdottoImmagine pi WHERE pi.prodotto.prodottoUuid = :prodottoId ORDER BY pi.ordine ASC")
    List<ProdottoImmagine> findByProdottoIdOrderByOrdine(@Param("prodottoId") UUID prodottoId);

    @Modifying
    @Query("DELETE FROM ProdottoImmagine pi WHERE pi.prodotto.prodottoUuid = :prodottoId")
    void deleteByProdottoId(@Param("prodottoId") UUID prodottoId);
}
