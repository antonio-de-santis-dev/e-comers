package main.ms.admin.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "statistica_ordine")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StatisticaOrdine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "ordine_id")
    private UUID ordineId;

    @Column(name = "pagamento_id")
    private UUID pagamentoId;

    @Column(name = "cliente_id")
    private UUID clienteId;

    @Column(name = "totale")
    private Double totale;

    @Column(name = "stato_ordine")
    private String statoOrdine;

    @Column(name = "stato_pagamento")
    private String statoPagamento;

    @Column(name = "data_registrazione")
    private Instant dataRegistrazione;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getOrdineId() { return ordineId; }
    public void setOrdineId(UUID ordineId) { this.ordineId = ordineId; }

    public UUID getPagamentoId() { return pagamentoId; }
    public void setPagamentoId(UUID pagamentoId) { this.pagamentoId = pagamentoId; }

    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }

    public Double getTotale() { return totale; }
    public void setTotale(Double totale) { this.totale = totale; }

    public String getStatoOrdine() { return statoOrdine; }
    public void setStatoOrdine(String statoOrdine) { this.statoOrdine = statoOrdine; }

    public String getStatoPagamento() { return statoPagamento; }
    public void setStatoPagamento(String statoPagamento) { this.statoPagamento = statoPagamento; }

    public Instant getDataRegistrazione() { return dataRegistrazione; }
    public void setDataRegistrazione(Instant dataRegistrazione) { this.dataRegistrazione = dataRegistrazione; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StatisticaOrdine)) return false;
        return id != null && id.equals(((StatisticaOrdine) o).id);
    }

    @Override
    public int hashCode() { return getClass().hashCode(); }

    @Override
    public String toString() {
        return "StatisticaOrdine{id=" + id + ", ordineId=" + ordineId + ", statoOrdine='" + statoOrdine + "'}";
    }
}
