package main.ms.catalogo.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link main.ms.catalogo.domain.Prodotto} entity. This class is used
 * in {@link main.ms.catalogo.web.rest.ProdottoResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /prodottos?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProdottoCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter nome;

    private BigDecimalFilter prezzo;

    private IntegerFilter aliquotaIva;

    private BooleanFilter disponibile;

    private IntegerFilter quantitaDisponibile;

    private DoubleFilter votoTotale;

    private BooleanFilter inEvidenza;

    private IntegerFilter totalePurchased;

    private LongFilter categoriaId;

    private Boolean distinct;

    public ProdottoCriteria() {}

    public ProdottoCriteria(ProdottoCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.nome = other.optionalNome().map(StringFilter::copy).orElse(null);
        this.prezzo = other.optionalPrezzo().map(BigDecimalFilter::copy).orElse(null);
        this.aliquotaIva = other.optionalAliquotaIva().map(IntegerFilter::copy).orElse(null);
        this.disponibile = other.optionalDisponibile().map(BooleanFilter::copy).orElse(null);
        this.quantitaDisponibile = other.optionalQuantitaDisponibile().map(IntegerFilter::copy).orElse(null);
        this.votoTotale = other.optionalVotoTotale().map(DoubleFilter::copy).orElse(null);
        this.inEvidenza = other.optionalInEvidenza().map(BooleanFilter::copy).orElse(null);
        this.totalePurchased = other.optionalTotalePurchased().map(IntegerFilter::copy).orElse(null);
        this.categoriaId = other.optionalCategoriaId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ProdottoCriteria copy() {
        return new ProdottoCriteria(this);
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

    public StringFilter getNome() {
        return nome;
    }

    public Optional<StringFilter> optionalNome() {
        return Optional.ofNullable(nome);
    }

    public StringFilter nome() {
        if (nome == null) {
            setNome(new StringFilter());
        }
        return nome;
    }

    public void setNome(StringFilter nome) {
        this.nome = nome;
    }

    public BigDecimalFilter getPrezzo() {
        return prezzo;
    }

    public Optional<BigDecimalFilter> optionalPrezzo() {
        return Optional.ofNullable(prezzo);
    }

    public BigDecimalFilter prezzo() {
        if (prezzo == null) {
            setPrezzo(new BigDecimalFilter());
        }
        return prezzo;
    }

    public void setPrezzo(BigDecimalFilter prezzo) {
        this.prezzo = prezzo;
    }

    public IntegerFilter getAliquotaIva() {
        return aliquotaIva;
    }

    public Optional<IntegerFilter> optionalAliquotaIva() {
        return Optional.ofNullable(aliquotaIva);
    }

    public IntegerFilter aliquotaIva() {
        if (aliquotaIva == null) {
            setAliquotaIva(new IntegerFilter());
        }
        return aliquotaIva;
    }

    public void setAliquotaIva(IntegerFilter aliquotaIva) {
        this.aliquotaIva = aliquotaIva;
    }

    public BooleanFilter getDisponibile() {
        return disponibile;
    }

    public Optional<BooleanFilter> optionalDisponibile() {
        return Optional.ofNullable(disponibile);
    }

    public BooleanFilter disponibile() {
        if (disponibile == null) {
            setDisponibile(new BooleanFilter());
        }
        return disponibile;
    }

    public void setDisponibile(BooleanFilter disponibile) {
        this.disponibile = disponibile;
    }

    public IntegerFilter getQuantitaDisponibile() {
        return quantitaDisponibile;
    }

    public Optional<IntegerFilter> optionalQuantitaDisponibile() {
        return Optional.ofNullable(quantitaDisponibile);
    }

    public IntegerFilter quantitaDisponibile() {
        if (quantitaDisponibile == null) {
            setQuantitaDisponibile(new IntegerFilter());
        }
        return quantitaDisponibile;
    }

    public void setQuantitaDisponibile(IntegerFilter quantitaDisponibile) {
        this.quantitaDisponibile = quantitaDisponibile;
    }

    public DoubleFilter getVotoTotale() {
        return votoTotale;
    }

    public Optional<DoubleFilter> optionalVotoTotale() {
        return Optional.ofNullable(votoTotale);
    }

    public DoubleFilter votoTotale() {
        if (votoTotale == null) {
            setVotoTotale(new DoubleFilter());
        }
        return votoTotale;
    }

    public void setVotoTotale(DoubleFilter votoTotale) {
        this.votoTotale = votoTotale;
    }

    public BooleanFilter getInEvidenza() {
        return inEvidenza;
    }

    public Optional<BooleanFilter> optionalInEvidenza() {
        return Optional.ofNullable(inEvidenza);
    }

    public BooleanFilter inEvidenza() {
        if (inEvidenza == null) {
            setInEvidenza(new BooleanFilter());
        }
        return inEvidenza;
    }

    public void setInEvidenza(BooleanFilter inEvidenza) {
        this.inEvidenza = inEvidenza;
    }

    public IntegerFilter getTotalePurchased() {
        return totalePurchased;
    }

    public Optional<IntegerFilter> optionalTotalePurchased() {
        return Optional.ofNullable(totalePurchased);
    }

    public IntegerFilter totalePurchased() {
        if (totalePurchased == null) {
            setTotalePurchased(new IntegerFilter());
        }
        return totalePurchased;
    }

    public void setTotalePurchased(IntegerFilter totalePurchased) {
        this.totalePurchased = totalePurchased;
    }

    public LongFilter getCategoriaId() {
        return categoriaId;
    }

    public Optional<LongFilter> optionalCategoriaId() {
        return Optional.ofNullable(categoriaId);
    }

    public LongFilter categoriaId() {
        if (categoriaId == null) {
            setCategoriaId(new LongFilter());
        }
        return categoriaId;
    }

    public void setCategoriaId(LongFilter categoriaId) {
        this.categoriaId = categoriaId;
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
        final ProdottoCriteria that = (ProdottoCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(nome, that.nome) &&
            Objects.equals(prezzo, that.prezzo) &&
            Objects.equals(aliquotaIva, that.aliquotaIva) &&
            Objects.equals(disponibile, that.disponibile) &&
            Objects.equals(quantitaDisponibile, that.quantitaDisponibile) &&
            Objects.equals(votoTotale, that.votoTotale) &&
            Objects.equals(inEvidenza, that.inEvidenza) &&
            Objects.equals(totalePurchased, that.totalePurchased) &&
            Objects.equals(categoriaId, that.categoriaId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            nome,
            prezzo,
            aliquotaIva,
            disponibile,
            quantitaDisponibile,
            votoTotale,
            inEvidenza,
            totalePurchased,
            categoriaId,
            distinct
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProdottoCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalNome().map(f -> "nome=" + f + ", ").orElse("") +
            optionalPrezzo().map(f -> "prezzo=" + f + ", ").orElse("") +
            optionalAliquotaIva().map(f -> "aliquotaIva=" + f + ", ").orElse("") +
            optionalDisponibile().map(f -> "disponibile=" + f + ", ").orElse("") +
            optionalQuantitaDisponibile().map(f -> "quantitaDisponibile=" + f + ", ").orElse("") +
            optionalVotoTotale().map(f -> "votoTotale=" + f + ", ").orElse("") +
            optionalInEvidenza().map(f -> "inEvidenza=" + f + ", ").orElse("") +
            optionalTotalePurchased().map(f -> "totalePurchased=" + f + ", ").orElse("") +
            optionalCategoriaId().map(f -> "categoriaId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
