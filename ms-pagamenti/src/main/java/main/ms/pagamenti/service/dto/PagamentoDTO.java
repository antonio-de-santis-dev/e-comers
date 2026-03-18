package main.ms.pagamenti.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import main.ms.pagamenti.domain.enumeration.MetodoPagamento;
import main.ms.pagamenti.domain.enumeration.StatoPagamento;

/**
 * A DTO for the {@link main.ms.pagamenti.domain.Pagamento} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PagamentoDTO implements Serializable {

    private Long id;

    @NotNull
    private UUID ordineId;

    @NotNull
    private MetodoPagamento metodoPagamento;

    @NotNull
    private BigDecimal importo;

    @NotNull
    private StatoPagamento stato;

    private String transazioneId;

    @NotNull
    private Instant dataOperazione;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getOrdineId() {
        return ordineId;
    }

    public void setOrdineId(UUID ordineId) {
        this.ordineId = ordineId;
    }

    public MetodoPagamento getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public BigDecimal getImporto() {
        return importo;
    }

    public void setImporto(BigDecimal importo) {
        this.importo = importo;
    }

    public StatoPagamento getStato() {
        return stato;
    }

    public void setStato(StatoPagamento stato) {
        this.stato = stato;
    }

    public String getTransazioneId() {
        return transazioneId;
    }

    public void setTransazioneId(String transazioneId) {
        this.transazioneId = transazioneId;
    }

    public Instant getDataOperazione() {
        return dataOperazione;
    }

    public void setDataOperazione(Instant dataOperazione) {
        this.dataOperazione = dataOperazione;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PagamentoDTO)) {
            return false;
        }

        PagamentoDTO pagamentoDTO = (PagamentoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, pagamentoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PagamentoDTO{" +
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
