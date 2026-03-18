package main.ms.ordini.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RigaOrdine.
 */
@Entity
@Table(name = "riga_ordine")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RigaOrdine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "prodotto_id", nullable = false)
    private UUID prodottoId;

    @NotNull
    @Column(name = "nome_prodotto", nullable = false)
    private String nomeProdotto;

    @NotNull
    @Column(name = "prezzo_unitario", precision = 21, scale = 2, nullable = false)
    private BigDecimal prezzoUnitario;

    @NotNull
    @Min(value = 1)
    @Column(name = "quantita", nullable = false)
    private Integer quantita;

    @NotNull
    @Column(name = "prezzo_totale", precision = 21, scale = 2, nullable = false)
    private BigDecimal prezzoTotale;

    @NotNull
    @Column(name = "aliquota_iva", precision = 21, scale = 2, nullable = false)
    private BigDecimal aliquotaIva;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "righeOrdines" }, allowSetters = true)
    private Ordine ordine;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RigaOrdine id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getProdottoId() {
        return this.prodottoId;
    }

    public RigaOrdine prodottoId(UUID prodottoId) {
        this.setProdottoId(prodottoId);
        return this;
    }

    public void setProdottoId(UUID prodottoId) {
        this.prodottoId = prodottoId;
    }

    public String getNomeProdotto() {
        return this.nomeProdotto;
    }

    public RigaOrdine nomeProdotto(String nomeProdotto) {
        this.setNomeProdotto(nomeProdotto);
        return this;
    }

    public void setNomeProdotto(String nomeProdotto) {
        this.nomeProdotto = nomeProdotto;
    }

    public BigDecimal getPrezzoUnitario() {
        return this.prezzoUnitario;
    }

    public RigaOrdine prezzoUnitario(BigDecimal prezzoUnitario) {
        this.setPrezzoUnitario(prezzoUnitario);
        return this;
    }

    public void setPrezzoUnitario(BigDecimal prezzoUnitario) {
        this.prezzoUnitario = prezzoUnitario;
    }

    public Integer getQuantita() {
        return this.quantita;
    }

    public RigaOrdine quantita(Integer quantita) {
        this.setQuantita(quantita);
        return this;
    }

    public void setQuantita(Integer quantita) {
        this.quantita = quantita;
    }

    public BigDecimal getPrezzoTotale() {
        return this.prezzoTotale;
    }

    public RigaOrdine prezzoTotale(BigDecimal prezzoTotale) {
        this.setPrezzoTotale(prezzoTotale);
        return this;
    }

    public void setPrezzoTotale(BigDecimal prezzoTotale) {
        this.prezzoTotale = prezzoTotale;
    }

    public BigDecimal getAliquotaIva() {
        return this.aliquotaIva;
    }

    public RigaOrdine aliquotaIva(BigDecimal aliquotaIva) {
        this.setAliquotaIva(aliquotaIva);
        return this;
    }

    public void setAliquotaIva(BigDecimal aliquotaIva) {
        this.aliquotaIva = aliquotaIva;
    }

    public Ordine getOrdine() {
        return this.ordine;
    }

    public void setOrdine(Ordine ordine) {
        this.ordine = ordine;
    }

    public RigaOrdine ordine(Ordine ordine) {
        this.setOrdine(ordine);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RigaOrdine)) {
            return false;
        }
        return getId() != null && getId().equals(((RigaOrdine) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RigaOrdine{" +
            "id=" + getId() +
            ", prodottoId='" + getProdottoId() + "'" +
            ", nomeProdotto='" + getNomeProdotto() + "'" +
            ", prezzoUnitario=" + getPrezzoUnitario() +
            ", quantita=" + getQuantita() +
            ", prezzoTotale=" + getPrezzoTotale() +
            ", aliquotaIva=" + getAliquotaIva() +
            "}";
    }
}
