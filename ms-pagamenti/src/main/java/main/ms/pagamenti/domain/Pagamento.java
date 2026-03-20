package main.ms.pagamenti.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import main.ms.pagamenti.domain.enumeration.MetodoPagamento;
import main.ms.pagamenti.domain.enumeration.StatoPagamento;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pagamento.
 */
@Entity
@Table(name = "pagamento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pagamento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", unique = true)
    private UUID id;

    @NotNull
    @Column(name = "ordine_id", nullable = false)
    private UUID ordineId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pagamento", nullable = false)
    private MetodoPagamento metodoPagamento;

    @NotNull
    @Column(name = "importo", precision = 21, scale = 2, nullable = false)
    private BigDecimal importo;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false)
    private StatoPagamento stato;

    @Column(name = "transazione_id")
    private String transazioneId;

    @NotNull
    @Column(name = "data_operazione", nullable = false)
    private Instant dataOperazione;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Pagamento id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getOrdineId() {
        return this.ordineId;
    }

    public Pagamento ordineId(UUID ordineId) {
        this.setOrdineId(ordineId);
        return this;
    }

    public void setOrdineId(UUID ordineId) {
        this.ordineId = ordineId;
    }

    public MetodoPagamento getMetodoPagamento() {
        return this.metodoPagamento;
    }

    public Pagamento metodoPagamento(MetodoPagamento metodoPagamento) {
        this.setMetodoPagamento(metodoPagamento);
        return this;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public BigDecimal getImporto() {
        return this.importo;
    }

    public Pagamento importo(BigDecimal importo) {
        this.setImporto(importo);
        return this;
    }

    public void setImporto(BigDecimal importo) {
        this.importo = importo;
    }

    public StatoPagamento getStato() {
        return this.stato;
    }

    public Pagamento stato(StatoPagamento stato) {
        this.setStato(stato);
        return this;
    }

    public void setStato(StatoPagamento stato) {
        this.stato = stato;
    }

    public String getTransazioneId() {
        return this.transazioneId;
    }

    public Pagamento transazioneId(String transazioneId) {
        this.setTransazioneId(transazioneId);
        return this;
    }

    public void setTransazioneId(String transazioneId) {
        this.transazioneId = transazioneId;
    }

    public Instant getDataOperazione() {
        return this.dataOperazione;
    }

    public Pagamento dataOperazione(Instant dataOperazione) {
        this.setDataOperazione(dataOperazione);
        return this;
    }

    public void setDataOperazione(Instant dataOperazione) {
        this.dataOperazione = dataOperazione;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Pagamento)) return false;
        return getId() != null && getId().equals(((Pagamento) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Pagamento{" +
            "id=" + getId() +
            ", ordineId='" + getOrdineId() + "'" +
            ", metodoPagamento='" + getMetodoPagamento() + "'" +
            ", importo=" + getImporto() +
            ", stato='" + getStato() + "'" +
            ", transazioneId='" + getTransazioneId() + "'" +
            ", dataOperazione='" + getDataOperazione() + "'" +
            "}";
    }
}
