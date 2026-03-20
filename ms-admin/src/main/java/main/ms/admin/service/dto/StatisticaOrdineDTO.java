package main.ms.admin.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public class StatisticaOrdineDTO implements Serializable {

    private UUID id;

    private UUID ordineId;

    private UUID pagamentoId;

    private UUID clienteId;

    private Double totale;

    private String statoOrdine;

    private String statoPagamento;

    // Auto-generata nel service — NO @NotNull
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
        if (!(o instanceof StatisticaOrdineDTO)) return false;
        StatisticaOrdineDTO that = (StatisticaOrdineDTO) o;
        if (this.id == null) return false;
        return Objects.equals(this.id, that.id);
    }

    @Override
    public int hashCode() { return Objects.hash(this.id); }

    @Override
    public String toString() {
        return "StatisticaOrdineDTO{id=" + id + ", ordineId=" + ordineId + ", statoOrdine='" + statoOrdine + "'}";
    }
}
