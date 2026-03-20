package main.ms.ordini.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

/**
 * A DTO for the {@link main.ms.ordini.domain.RigaOrdine} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RigaOrdineDTO implements Serializable {

    private UUID id;

    @NotNull
    private UUID prodottoId;

    @NotNull
    private String nomeProdotto;

    @NotNull
    private BigDecimal prezzoUnitario;

    @NotNull
    @Min(value = 1)
    private Integer quantita;

    @NotNull
    private BigDecimal prezzoTotale;

    @NotNull
    private BigDecimal aliquotaIva;

    @NotNull
    private OrdineDTO ordine;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProdottoId() {
        return prodottoId;
    }

    public void setProdottoId(UUID prodottoId) {
        this.prodottoId = prodottoId;
    }

    public String getNomeProdotto() {
        return nomeProdotto;
    }

    public void setNomeProdotto(String nomeProdotto) {
        this.nomeProdotto = nomeProdotto;
    }

    public BigDecimal getPrezzoUnitario() {
        return prezzoUnitario;
    }

    public void setPrezzoUnitario(BigDecimal prezzoUnitario) {
        this.prezzoUnitario = prezzoUnitario;
    }

    public Integer getQuantita() {
        return quantita;
    }

    public void setQuantita(Integer quantita) {
        this.quantita = quantita;
    }

    public BigDecimal getPrezzoTotale() {
        return prezzoTotale;
    }

    public void setPrezzoTotale(BigDecimal prezzoTotale) {
        this.prezzoTotale = prezzoTotale;
    }

    public BigDecimal getAliquotaIva() {
        return aliquotaIva;
    }

    public void setAliquotaIva(BigDecimal aliquotaIva) {
        this.aliquotaIva = aliquotaIva;
    }

    public OrdineDTO getOrdine() {
        return ordine;
    }

    public void setOrdine(OrdineDTO ordine) {
        this.ordine = ordine;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RigaOrdineDTO)) {
            return false;
        }

        RigaOrdineDTO rigaOrdineDTO = (RigaOrdineDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, rigaOrdineDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RigaOrdineDTO{" +
            "id=" + getId() +
            ", prodottoId='" + getProdottoId() + "'" +
            ", nomeProdotto='" + getNomeProdotto() + "'" +
            ", prezzoUnitario=" + getPrezzoUnitario() +
            ", quantita=" + getQuantita() +
            ", prezzoTotale=" + getPrezzoTotale() +
            ", aliquotaIva=" + getAliquotaIva() +
            ", ordine=" + getOrdine() +
            "}";
    }
}
