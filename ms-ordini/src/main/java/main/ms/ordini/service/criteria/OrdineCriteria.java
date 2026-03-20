package main.ms.ordini.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import main.ms.ordini.domain.enumeration.StatoOrdine;
import main.ms.ordini.domain.enumeration.TipoSpedizione;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link main.ms.ordini.domain.Ordine} entity. This class is used
 * in {@link main.ms.ordini.web.rest.OrdineResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /ordines?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrdineCriteria implements Serializable, Criteria {

    /**
     * Class for filtering TipoSpedizione
     */
    public static class TipoSpedizioneFilter extends Filter<TipoSpedizione> {

        public TipoSpedizioneFilter() {}

        public TipoSpedizioneFilter(TipoSpedizioneFilter filter) {
            super(filter);
        }

        @Override
        public TipoSpedizioneFilter copy() {
            return new TipoSpedizioneFilter(this);
        }
    }

    /**
     * Class for filtering StatoOrdine
     */
    public static class StatoOrdineFilter extends Filter<StatoOrdine> {

        public StatoOrdineFilter() {}

        public StatoOrdineFilter(StatoOrdineFilter filter) {
            super(filter);
        }

        @Override
        public StatoOrdineFilter copy() {
            return new StatoOrdineFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private UUIDFilter id;

    private StringFilter numeroOrdine;

    private UUIDFilter clienteId;

    private StringFilter nomeCliente;

    private StringFilter cognomeCliente;

    private StringFilter email;

    private StringFilter telefono;

    private StringFilter indirizzo;

    private StringFilter citta;

    private StringFilter provincia;

    private StringFilter cap;

    private StringFilter statoPaese;

    private StringFilter noteSpedizione;

    private TipoSpedizioneFilter tipoSpedizione;

    private BigDecimalFilter costoSpedizione;

    private BigDecimalFilter totaleImponibile;

    private BigDecimalFilter totaleIva;

    private BigDecimalFilter totaleFinal;

    private StringFilter buonoSconto;

    private BigDecimalFilter scontoApplicato;

    private StatoOrdineFilter statoOrdine;

    private InstantFilter dataCreazione;

    private UUIDFilter righeOrdineId;

    private Boolean distinct;

    public OrdineCriteria() {}

    public OrdineCriteria(OrdineCriteria other) {
        this.id = other.optionalId().map(UUIDFilter::copy).orElse(null);
        this.numeroOrdine = other.optionalNumeroOrdine().map(StringFilter::copy).orElse(null);
        this.clienteId = other.optionalClienteId().map(UUIDFilter::copy).orElse(null);
        this.nomeCliente = other.optionalNomeCliente().map(StringFilter::copy).orElse(null);
        this.cognomeCliente = other.optionalCognomeCliente().map(StringFilter::copy).orElse(null);
        this.email = other.optionalEmail().map(StringFilter::copy).orElse(null);
        this.telefono = other.optionalTelefono().map(StringFilter::copy).orElse(null);
        this.indirizzo = other.optionalIndirizzo().map(StringFilter::copy).orElse(null);
        this.citta = other.optionalCitta().map(StringFilter::copy).orElse(null);
        this.provincia = other.optionalProvincia().map(StringFilter::copy).orElse(null);
        this.cap = other.optionalCap().map(StringFilter::copy).orElse(null);
        this.statoPaese = other.optionalStatoPaese().map(StringFilter::copy).orElse(null);
        this.noteSpedizione = other.optionalNoteSpedizione().map(StringFilter::copy).orElse(null);
        this.tipoSpedizione = other.optionalTipoSpedizione().map(TipoSpedizioneFilter::copy).orElse(null);
        this.costoSpedizione = other.optionalCostoSpedizione().map(BigDecimalFilter::copy).orElse(null);
        this.totaleImponibile = other.optionalTotaleImponibile().map(BigDecimalFilter::copy).orElse(null);
        this.totaleIva = other.optionalTotaleIva().map(BigDecimalFilter::copy).orElse(null);
        this.totaleFinal = other.optionalTotaleFinal().map(BigDecimalFilter::copy).orElse(null);
        this.buonoSconto = other.optionalBuonoSconto().map(StringFilter::copy).orElse(null);
        this.scontoApplicato = other.optionalScontoApplicato().map(BigDecimalFilter::copy).orElse(null);
        this.statoOrdine = other.optionalStatoOrdine().map(StatoOrdineFilter::copy).orElse(null);
        this.dataCreazione = other.optionalDataCreazione().map(InstantFilter::copy).orElse(null);
        this.righeOrdineId = other.optionalRigheOrdineId().map(UUIDFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public OrdineCriteria copy() {
        return new OrdineCriteria(this);
    }

    public UUIDFilter getId() {
        return id;
    }

    public Optional<UUIDFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public UUIDFilter id() {
        if (id == null) {
            setId(new UUIDFilter());
        }
        return id;
    }

    public void setId(UUIDFilter id) {
        this.id = id;
    }

    public StringFilter getNumeroOrdine() {
        return numeroOrdine;
    }

    public Optional<StringFilter> optionalNumeroOrdine() {
        return Optional.ofNullable(numeroOrdine);
    }

    public StringFilter numeroOrdine() {
        if (numeroOrdine == null) {
            setNumeroOrdine(new StringFilter());
        }
        return numeroOrdine;
    }

    public void setNumeroOrdine(StringFilter numeroOrdine) {
        this.numeroOrdine = numeroOrdine;
    }

    public UUIDFilter getClienteId() {
        return clienteId;
    }

    public Optional<UUIDFilter> optionalClienteId() {
        return Optional.ofNullable(clienteId);
    }

    public UUIDFilter clienteId() {
        if (clienteId == null) {
            setClienteId(new UUIDFilter());
        }
        return clienteId;
    }

    public void setClienteId(UUIDFilter clienteId) {
        this.clienteId = clienteId;
    }

    public StringFilter getNomeCliente() {
        return nomeCliente;
    }

    public Optional<StringFilter> optionalNomeCliente() {
        return Optional.ofNullable(nomeCliente);
    }

    public StringFilter nomeCliente() {
        if (nomeCliente == null) {
            setNomeCliente(new StringFilter());
        }
        return nomeCliente;
    }

    public void setNomeCliente(StringFilter nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public StringFilter getCognomeCliente() {
        return cognomeCliente;
    }

    public Optional<StringFilter> optionalCognomeCliente() {
        return Optional.ofNullable(cognomeCliente);
    }

    public StringFilter cognomeCliente() {
        if (cognomeCliente == null) {
            setCognomeCliente(new StringFilter());
        }
        return cognomeCliente;
    }

    public void setCognomeCliente(StringFilter cognomeCliente) {
        this.cognomeCliente = cognomeCliente;
    }

    public StringFilter getEmail() {
        return email;
    }

    public Optional<StringFilter> optionalEmail() {
        return Optional.ofNullable(email);
    }

    public StringFilter email() {
        if (email == null) {
            setEmail(new StringFilter());
        }
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public StringFilter getTelefono() {
        return telefono;
    }

    public Optional<StringFilter> optionalTelefono() {
        return Optional.ofNullable(telefono);
    }

    public StringFilter telefono() {
        if (telefono == null) {
            setTelefono(new StringFilter());
        }
        return telefono;
    }

    public void setTelefono(StringFilter telefono) {
        this.telefono = telefono;
    }

    public StringFilter getIndirizzo() {
        return indirizzo;
    }

    public Optional<StringFilter> optionalIndirizzo() {
        return Optional.ofNullable(indirizzo);
    }

    public StringFilter indirizzo() {
        if (indirizzo == null) {
            setIndirizzo(new StringFilter());
        }
        return indirizzo;
    }

    public void setIndirizzo(StringFilter indirizzo) {
        this.indirizzo = indirizzo;
    }

    public StringFilter getCitta() {
        return citta;
    }

    public Optional<StringFilter> optionalCitta() {
        return Optional.ofNullable(citta);
    }

    public StringFilter citta() {
        if (citta == null) {
            setCitta(new StringFilter());
        }
        return citta;
    }

    public void setCitta(StringFilter citta) {
        this.citta = citta;
    }

    public StringFilter getProvincia() {
        return provincia;
    }

    public Optional<StringFilter> optionalProvincia() {
        return Optional.ofNullable(provincia);
    }

    public StringFilter provincia() {
        if (provincia == null) {
            setProvincia(new StringFilter());
        }
        return provincia;
    }

    public void setProvincia(StringFilter provincia) {
        this.provincia = provincia;
    }

    public StringFilter getCap() {
        return cap;
    }

    public Optional<StringFilter> optionalCap() {
        return Optional.ofNullable(cap);
    }

    public StringFilter cap() {
        if (cap == null) {
            setCap(new StringFilter());
        }
        return cap;
    }

    public void setCap(StringFilter cap) {
        this.cap = cap;
    }

    public StringFilter getStatoPaese() {
        return statoPaese;
    }

    public Optional<StringFilter> optionalStatoPaese() {
        return Optional.ofNullable(statoPaese);
    }

    public StringFilter statoPaese() {
        if (statoPaese == null) {
            setStatoPaese(new StringFilter());
        }
        return statoPaese;
    }

    public void setStatoPaese(StringFilter statoPaese) {
        this.statoPaese = statoPaese;
    }

    public StringFilter getNoteSpedizione() {
        return noteSpedizione;
    }

    public Optional<StringFilter> optionalNoteSpedizione() {
        return Optional.ofNullable(noteSpedizione);
    }

    public StringFilter noteSpedizione() {
        if (noteSpedizione == null) {
            setNoteSpedizione(new StringFilter());
        }
        return noteSpedizione;
    }

    public void setNoteSpedizione(StringFilter noteSpedizione) {
        this.noteSpedizione = noteSpedizione;
    }

    public TipoSpedizioneFilter getTipoSpedizione() {
        return tipoSpedizione;
    }

    public Optional<TipoSpedizioneFilter> optionalTipoSpedizione() {
        return Optional.ofNullable(tipoSpedizione);
    }

    public TipoSpedizioneFilter tipoSpedizione() {
        if (tipoSpedizione == null) {
            setTipoSpedizione(new TipoSpedizioneFilter());
        }
        return tipoSpedizione;
    }

    public void setTipoSpedizione(TipoSpedizioneFilter tipoSpedizione) {
        this.tipoSpedizione = tipoSpedizione;
    }

    public BigDecimalFilter getCostoSpedizione() {
        return costoSpedizione;
    }

    public Optional<BigDecimalFilter> optionalCostoSpedizione() {
        return Optional.ofNullable(costoSpedizione);
    }

    public BigDecimalFilter costoSpedizione() {
        if (costoSpedizione == null) {
            setCostoSpedizione(new BigDecimalFilter());
        }
        return costoSpedizione;
    }

    public void setCostoSpedizione(BigDecimalFilter costoSpedizione) {
        this.costoSpedizione = costoSpedizione;
    }

    public BigDecimalFilter getTotaleImponibile() {
        return totaleImponibile;
    }

    public Optional<BigDecimalFilter> optionalTotaleImponibile() {
        return Optional.ofNullable(totaleImponibile);
    }

    public BigDecimalFilter totaleImponibile() {
        if (totaleImponibile == null) {
            setTotaleImponibile(new BigDecimalFilter());
        }
        return totaleImponibile;
    }

    public void setTotaleImponibile(BigDecimalFilter totaleImponibile) {
        this.totaleImponibile = totaleImponibile;
    }

    public BigDecimalFilter getTotaleIva() {
        return totaleIva;
    }

    public Optional<BigDecimalFilter> optionalTotaleIva() {
        return Optional.ofNullable(totaleIva);
    }

    public BigDecimalFilter totaleIva() {
        if (totaleIva == null) {
            setTotaleIva(new BigDecimalFilter());
        }
        return totaleIva;
    }

    public void setTotaleIva(BigDecimalFilter totaleIva) {
        this.totaleIva = totaleIva;
    }

    public BigDecimalFilter getTotaleFinal() {
        return totaleFinal;
    }

    public Optional<BigDecimalFilter> optionalTotaleFinal() {
        return Optional.ofNullable(totaleFinal);
    }

    public BigDecimalFilter totaleFinal() {
        if (totaleFinal == null) {
            setTotaleFinal(new BigDecimalFilter());
        }
        return totaleFinal;
    }

    public void setTotaleFinal(BigDecimalFilter totaleFinal) {
        this.totaleFinal = totaleFinal;
    }

    public StringFilter getBuonoSconto() {
        return buonoSconto;
    }

    public Optional<StringFilter> optionalBuonoSconto() {
        return Optional.ofNullable(buonoSconto);
    }

    public StringFilter buonoSconto() {
        if (buonoSconto == null) {
            setBuonoSconto(new StringFilter());
        }
        return buonoSconto;
    }

    public void setBuonoSconto(StringFilter buonoSconto) {
        this.buonoSconto = buonoSconto;
    }

    public BigDecimalFilter getScontoApplicato() {
        return scontoApplicato;
    }

    public Optional<BigDecimalFilter> optionalScontoApplicato() {
        return Optional.ofNullable(scontoApplicato);
    }

    public BigDecimalFilter scontoApplicato() {
        if (scontoApplicato == null) {
            setScontoApplicato(new BigDecimalFilter());
        }
        return scontoApplicato;
    }

    public void setScontoApplicato(BigDecimalFilter scontoApplicato) {
        this.scontoApplicato = scontoApplicato;
    }

    public StatoOrdineFilter getStatoOrdine() {
        return statoOrdine;
    }

    public Optional<StatoOrdineFilter> optionalStatoOrdine() {
        return Optional.ofNullable(statoOrdine);
    }

    public StatoOrdineFilter statoOrdine() {
        if (statoOrdine == null) {
            setStatoOrdine(new StatoOrdineFilter());
        }
        return statoOrdine;
    }

    public void setStatoOrdine(StatoOrdineFilter statoOrdine) {
        this.statoOrdine = statoOrdine;
    }

    public InstantFilter getDataCreazione() {
        return dataCreazione;
    }

    public Optional<InstantFilter> optionalDataCreazione() {
        return Optional.ofNullable(dataCreazione);
    }

    public InstantFilter dataCreazione() {
        if (dataCreazione == null) {
            setDataCreazione(new InstantFilter());
        }
        return dataCreazione;
    }

    public void setDataCreazione(InstantFilter dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    public UUIDFilter getRigheOrdineId() {
        return righeOrdineId;
    }

    public Optional<UUIDFilter> optionalRigheOrdineId() {
        return Optional.ofNullable(righeOrdineId);
    }

    public UUIDFilter righeOrdineId() {
        if (righeOrdineId == null) {
            setRigheOrdineId(new UUIDFilter());
        }
        return righeOrdineId;
    }

    public void setRigheOrdineId(UUIDFilter righeOrdineId) {
        this.righeOrdineId = righeOrdineId;
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
        final OrdineCriteria that = (OrdineCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(numeroOrdine, that.numeroOrdine) &&
            Objects.equals(clienteId, that.clienteId) &&
            Objects.equals(nomeCliente, that.nomeCliente) &&
            Objects.equals(cognomeCliente, that.cognomeCliente) &&
            Objects.equals(email, that.email) &&
            Objects.equals(telefono, that.telefono) &&
            Objects.equals(indirizzo, that.indirizzo) &&
            Objects.equals(citta, that.citta) &&
            Objects.equals(provincia, that.provincia) &&
            Objects.equals(cap, that.cap) &&
            Objects.equals(statoPaese, that.statoPaese) &&
            Objects.equals(noteSpedizione, that.noteSpedizione) &&
            Objects.equals(tipoSpedizione, that.tipoSpedizione) &&
            Objects.equals(costoSpedizione, that.costoSpedizione) &&
            Objects.equals(totaleImponibile, that.totaleImponibile) &&
            Objects.equals(totaleIva, that.totaleIva) &&
            Objects.equals(totaleFinal, that.totaleFinal) &&
            Objects.equals(buonoSconto, that.buonoSconto) &&
            Objects.equals(scontoApplicato, that.scontoApplicato) &&
            Objects.equals(statoOrdine, that.statoOrdine) &&
            Objects.equals(dataCreazione, that.dataCreazione) &&
            Objects.equals(righeOrdineId, that.righeOrdineId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            numeroOrdine,
            clienteId,
            nomeCliente,
            cognomeCliente,
            email,
            telefono,
            indirizzo,
            citta,
            provincia,
            cap,
            statoPaese,
            noteSpedizione,
            tipoSpedizione,
            costoSpedizione,
            totaleImponibile,
            totaleIva,
            totaleFinal,
            buonoSconto,
            scontoApplicato,
            statoOrdine,
            dataCreazione,
            righeOrdineId,
            distinct
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrdineCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalNumeroOrdine().map(f -> "numeroOrdine=" + f + ", ").orElse("") +
            optionalClienteId().map(f -> "clienteId=" + f + ", ").orElse("") +
            optionalNomeCliente().map(f -> "nomeCliente=" + f + ", ").orElse("") +
            optionalCognomeCliente().map(f -> "cognomeCliente=" + f + ", ").orElse("") +
            optionalEmail().map(f -> "email=" + f + ", ").orElse("") +
            optionalTelefono().map(f -> "telefono=" + f + ", ").orElse("") +
            optionalIndirizzo().map(f -> "indirizzo=" + f + ", ").orElse("") +
            optionalCitta().map(f -> "citta=" + f + ", ").orElse("") +
            optionalProvincia().map(f -> "provincia=" + f + ", ").orElse("") +
            optionalCap().map(f -> "cap=" + f + ", ").orElse("") +
            optionalStatoPaese().map(f -> "statoPaese=" + f + ", ").orElse("") +
            optionalNoteSpedizione().map(f -> "noteSpedizione=" + f + ", ").orElse("") +
            optionalTipoSpedizione().map(f -> "tipoSpedizione=" + f + ", ").orElse("") +
            optionalCostoSpedizione().map(f -> "costoSpedizione=" + f + ", ").orElse("") +
            optionalTotaleImponibile().map(f -> "totaleImponibile=" + f + ", ").orElse("") +
            optionalTotaleIva().map(f -> "totaleIva=" + f + ", ").orElse("") +
            optionalTotaleFinal().map(f -> "totaleFinal=" + f + ", ").orElse("") +
            optionalBuonoSconto().map(f -> "buonoSconto=" + f + ", ").orElse("") +
            optionalScontoApplicato().map(f -> "scontoApplicato=" + f + ", ").orElse("") +
            optionalStatoOrdine().map(f -> "statoOrdine=" + f + ", ").orElse("") +
            optionalDataCreazione().map(f -> "dataCreazione=" + f + ", ").orElse("") +
            optionalRigheOrdineId().map(f -> "righeOrdineId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
