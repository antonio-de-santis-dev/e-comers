package main.ms.pagamenti.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import main.ms.pagamenti.domain.enumeration.MetodoPagamento;
import main.ms.pagamenti.domain.enumeration.StatoPagamento;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link main.ms.pagamenti.domain.Pagamento} entity. This class is used
 * in {@link main.ms.pagamenti.web.rest.PagamentoResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /pagamentos?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PagamentoCriteria implements Serializable, Criteria {

    /**
     * Class for filtering MetodoPagamento
     */
    public static class MetodoPagamentoFilter extends Filter<MetodoPagamento> {

        public MetodoPagamentoFilter() {}

        public MetodoPagamentoFilter(MetodoPagamentoFilter filter) {
            super(filter);
        }

        @Override
        public MetodoPagamentoFilter copy() {
            return new MetodoPagamentoFilter(this);
        }
    }

    /**
     * Class for filtering StatoPagamento
     */
    public static class StatoPagamentoFilter extends Filter<StatoPagamento> {

        public StatoPagamentoFilter() {}

        public StatoPagamentoFilter(StatoPagamentoFilter filter) {
            super(filter);
        }

        @Override
        public StatoPagamentoFilter copy() {
            return new StatoPagamentoFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private UUIDFilter ordineId;

    private MetodoPagamentoFilter metodoPagamento;

    private BigDecimalFilter importo;

    private StatoPagamentoFilter stato;

    private StringFilter transazioneId;

    private InstantFilter dataOperazione;

    private Boolean distinct;

    public PagamentoCriteria() {}

    public PagamentoCriteria(PagamentoCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.ordineId = other.optionalOrdineId().map(UUIDFilter::copy).orElse(null);
        this.metodoPagamento = other.optionalMetodoPagamento().map(MetodoPagamentoFilter::copy).orElse(null);
        this.importo = other.optionalImporto().map(BigDecimalFilter::copy).orElse(null);
        this.stato = other.optionalStato().map(StatoPagamentoFilter::copy).orElse(null);
        this.transazioneId = other.optionalTransazioneId().map(StringFilter::copy).orElse(null);
        this.dataOperazione = other.optionalDataOperazione().map(InstantFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public PagamentoCriteria copy() {
        return new PagamentoCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public UUIDFilter getOrdineId() {
        return ordineId;
    }

    public Optional<UUIDFilter> optionalOrdineId() {
        return Optional.ofNullable(ordineId);
    }

    public UUIDFilter ordineId() {
        if (ordineId == null) {
            setOrdineId(new UUIDFilter());
        }
        return ordineId;
    }

    public void setOrdineId(UUIDFilter ordineId) {
        this.ordineId = ordineId;
    }

    public MetodoPagamentoFilter getMetodoPagamento() {
        return metodoPagamento;
    }

    public Optional<MetodoPagamentoFilter> optionalMetodoPagamento() {
        return Optional.ofNullable(metodoPagamento);
    }

    public MetodoPagamentoFilter metodoPagamento() {
        if (metodoPagamento == null) {
            setMetodoPagamento(new MetodoPagamentoFilter());
        }
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamentoFilter metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public BigDecimalFilter getImporto() {
        return importo;
    }

    public Optional<BigDecimalFilter> optionalImporto() {
        return Optional.ofNullable(importo);
    }

    public BigDecimalFilter importo() {
        if (importo == null) {
            setImporto(new BigDecimalFilter());
        }
        return importo;
    }

    public void setImporto(BigDecimalFilter importo) {
        this.importo = importo;
    }

    public StatoPagamentoFilter getStato() {
        return stato;
    }

    public Optional<StatoPagamentoFilter> optionalStato() {
        return Optional.ofNullable(stato);
    }

    public StatoPagamentoFilter stato() {
        if (stato == null) {
            setStato(new StatoPagamentoFilter());
        }
        return stato;
    }

    public void setStato(StatoPagamentoFilter stato) {
        this.stato = stato;
    }

    public StringFilter getTransazioneId() {
        return transazioneId;
    }

    public Optional<StringFilter> optionalTransazioneId() {
        return Optional.ofNullable(transazioneId);
    }

    public StringFilter transazioneId() {
        if (transazioneId == null) {
            setTransazioneId(new StringFilter());
        }
        return transazioneId;
    }

    public void setTransazioneId(StringFilter transazioneId) {
        this.transazioneId = transazioneId;
    }

    public InstantFilter getDataOperazione() {
        return dataOperazione;
    }

    public Optional<InstantFilter> optionalDataOperazione() {
        return Optional.ofNullable(dataOperazione);
    }

    public InstantFilter dataOperazione() {
        if (dataOperazione == null) {
            setDataOperazione(new InstantFilter());
        }
        return dataOperazione;
    }

    public void setDataOperazione(InstantFilter dataOperazione) {
        this.dataOperazione = dataOperazione;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PagamentoCriteria that = (PagamentoCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(ordineId, that.ordineId) &&
            Objects.equals(metodoPagamento, that.metodoPagamento) &&
            Objects.equals(importo, that.importo) &&
            Objects.equals(stato, that.stato) &&
            Objects.equals(transazioneId, that.transazioneId) &&
            Objects.equals(dataOperazione, that.dataOperazione) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, ordineId, metodoPagamento, importo, stato, transazioneId, dataOperazione, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PagamentoCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalOrdineId().map(f -> "ordineId=" + f + ", ").orElse("") +
            optionalMetodoPagamento().map(f -> "metodoPagamento=" + f + ", ").orElse("") +
            optionalImporto().map(f -> "importo=" + f + ", ").orElse("") +
            optionalStato().map(f -> "stato=" + f + ", ").orElse("") +
            optionalTransazioneId().map(f -> "transazioneId=" + f + ", ").orElse("") +
            optionalDataOperazione().map(f -> "dataOperazione=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
