package main.ms.ordini.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import main.ms.ordini.domain.enumeration.StatoOrdine;
import main.ms.ordini.domain.enumeration.TipoSpedizione;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ordine.
 */
@Entity
@Table(name = "ordine")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ordine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", unique = true)
    private UUID id;

    @NotNull
    @Column(name = "numero_ordine", nullable = false, unique = true)
    private String numeroOrdine;

    @NotNull
    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @NotNull
    @Size(max = 100)
    @Column(name = "nome_cliente", length = 100, nullable = false)
    private String nomeCliente;

    @NotNull
    @Size(max = 100)
    @Column(name = "cognome_cliente", length = 100, nullable = false)
    private String cognomeCliente;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @NotNull
    @Column(name = "indirizzo", nullable = false)
    private String indirizzo;

    @NotNull
    @Column(name = "citta", nullable = false)
    private String citta;

    @NotNull
    @Size(max = 2)
    @Column(name = "provincia", length = 2, nullable = false)
    private String provincia;

    @NotNull
    @Size(max = 5)
    @Column(name = "cap", length = 5, nullable = false)
    private String cap;

    @NotNull
    @Column(name = "stato_paese", nullable = false)
    private String statoPaese;

    @Size(max = 500)
    @Column(name = "note_spedizione", length = 500)
    private String noteSpedizione;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_spedizione", nullable = false)
    private TipoSpedizione tipoSpedizione;

    @NotNull
    @Column(name = "costo_spedizione", precision = 21, scale = 2, nullable = false)
    private BigDecimal costoSpedizione;

    @NotNull
    @Column(name = "totale_imponibile", precision = 21, scale = 2, nullable = false)
    private BigDecimal totaleImponibile;

    @NotNull
    @Column(name = "totale_iva", precision = 21, scale = 2, nullable = false)
    private BigDecimal totaleIva;

    @NotNull
    @Column(name = "totale_final", precision = 21, scale = 2, nullable = false)
    private BigDecimal totaleFinal;

    @Column(name = "buono_sconto")
    private String buonoSconto;

    @Column(name = "sconto_applicato", precision = 21, scale = 2)
    private BigDecimal scontoApplicato;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "stato_ordine", nullable = false)
    private StatoOrdine statoOrdine;

    @NotNull
    @Column(name = "data_creazione", nullable = false)
    private Instant dataCreazione;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ordine")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ordine" }, allowSetters = true)
    private Set<RigaOrdine> righeOrdines = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Ordine id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNumeroOrdine() {
        return this.numeroOrdine;
    }

    public Ordine numeroOrdine(String numeroOrdine) {
        this.setNumeroOrdine(numeroOrdine);
        return this;
    }

    public void setNumeroOrdine(String numeroOrdine) {
        this.numeroOrdine = numeroOrdine;
    }

    public UUID getClienteId() {
        return this.clienteId;
    }

    public Ordine clienteId(UUID clienteId) {
        this.setClienteId(clienteId);
        return this;
    }

    public void setClienteId(UUID clienteId) {
        this.clienteId = clienteId;
    }

    public String getNomeCliente() {
        return this.nomeCliente;
    }

    public Ordine nomeCliente(String nomeCliente) {
        this.setNomeCliente(nomeCliente);
        return this;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getCognomeCliente() {
        return this.cognomeCliente;
    }

    public Ordine cognomeCliente(String cognomeCliente) {
        this.setCognomeCliente(cognomeCliente);
        return this;
    }

    public void setCognomeCliente(String cognomeCliente) {
        this.cognomeCliente = cognomeCliente;
    }

    public String getEmail() {
        return this.email;
    }

    public Ordine email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public Ordine telefono(String telefono) {
        this.setTelefono(telefono);
        return this;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getIndirizzo() {
        return this.indirizzo;
    }

    public Ordine indirizzo(String indirizzo) {
        this.setIndirizzo(indirizzo);
        return this;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public String getCitta() {
        return this.citta;
    }

    public Ordine citta(String citta) {
        this.setCitta(citta);
        return this;
    }

    public void setCitta(String citta) {
        this.citta = citta;
    }

    public String getProvincia() {
        return this.provincia;
    }

    public Ordine provincia(String provincia) {
        this.setProvincia(provincia);
        return this;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getCap() {
        return this.cap;
    }

    public Ordine cap(String cap) {
        this.setCap(cap);
        return this;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public String getStatoPaese() {
        return this.statoPaese;
    }

    public Ordine statoPaese(String statoPaese) {
        this.setStatoPaese(statoPaese);
        return this;
    }

    public void setStatoPaese(String statoPaese) {
        this.statoPaese = statoPaese;
    }

    public String getNoteSpedizione() {
        return this.noteSpedizione;
    }

    public Ordine noteSpedizione(String noteSpedizione) {
        this.setNoteSpedizione(noteSpedizione);
        return this;
    }

    public void setNoteSpedizione(String noteSpedizione) {
        this.noteSpedizione = noteSpedizione;
    }

    public TipoSpedizione getTipoSpedizione() {
        return this.tipoSpedizione;
    }

    public Ordine tipoSpedizione(TipoSpedizione tipoSpedizione) {
        this.setTipoSpedizione(tipoSpedizione);
        return this;
    }

    public void setTipoSpedizione(TipoSpedizione tipoSpedizione) {
        this.tipoSpedizione = tipoSpedizione;
    }

    public BigDecimal getCostoSpedizione() {
        return this.costoSpedizione;
    }

    public Ordine costoSpedizione(BigDecimal costoSpedizione) {
        this.setCostoSpedizione(costoSpedizione);
        return this;
    }

    public void setCostoSpedizione(BigDecimal costoSpedizione) {
        this.costoSpedizione = costoSpedizione;
    }

    public BigDecimal getTotaleImponibile() {
        return this.totaleImponibile;
    }

    public Ordine totaleImponibile(BigDecimal totaleImponibile) {
        this.setTotaleImponibile(totaleImponibile);
        return this;
    }

    public void setTotaleImponibile(BigDecimal totaleImponibile) {
        this.totaleImponibile = totaleImponibile;
    }

    public BigDecimal getTotaleIva() {
        return this.totaleIva;
    }

    public Ordine totaleIva(BigDecimal totaleIva) {
        this.setTotaleIva(totaleIva);
        return this;
    }

    public void setTotaleIva(BigDecimal totaleIva) {
        this.totaleIva = totaleIva;
    }

    public BigDecimal getTotaleFinal() {
        return this.totaleFinal;
    }

    public Ordine totaleFinal(BigDecimal totaleFinal) {
        this.setTotaleFinal(totaleFinal);
        return this;
    }

    public void setTotaleFinal(BigDecimal totaleFinal) {
        this.totaleFinal = totaleFinal;
    }

    public String getBuonoSconto() {
        return this.buonoSconto;
    }

    public Ordine buonoSconto(String buonoSconto) {
        this.setBuonoSconto(buonoSconto);
        return this;
    }

    public void setBuonoSconto(String buonoSconto) {
        this.buonoSconto = buonoSconto;
    }

    public BigDecimal getScontoApplicato() {
        return this.scontoApplicato;
    }

    public Ordine scontoApplicato(BigDecimal scontoApplicato) {
        this.setScontoApplicato(scontoApplicato);
        return this;
    }

    public void setScontoApplicato(BigDecimal scontoApplicato) {
        this.scontoApplicato = scontoApplicato;
    }

    public StatoOrdine getStatoOrdine() {
        return this.statoOrdine;
    }

    public Ordine statoOrdine(StatoOrdine statoOrdine) {
        this.setStatoOrdine(statoOrdine);
        return this;
    }

    public void setStatoOrdine(StatoOrdine statoOrdine) {
        this.statoOrdine = statoOrdine;
    }

    public Instant getDataCreazione() {
        return this.dataCreazione;
    }

    public Ordine dataCreazione(Instant dataCreazione) {
        this.setDataCreazione(dataCreazione);
        return this;
    }

    public void setDataCreazione(Instant dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    public Set<RigaOrdine> getRigheOrdines() {
        return this.righeOrdines;
    }

    public void setRigheOrdines(Set<RigaOrdine> rigaOrdines) {
        if (this.righeOrdines != null) {
            this.righeOrdines.forEach(i -> i.setOrdine(null));
        }
        if (rigaOrdines != null) {
            rigaOrdines.forEach(i -> i.setOrdine(this));
        }
        this.righeOrdines = rigaOrdines;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Ordine)) return false;
        return getId() != null && getId().equals(((Ordine) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Ordine{" +
            "id=" + getId() +
            ", numeroOrdine='" + getNumeroOrdine() + "'" +
            ", clienteId='" + getClienteId() + "'" +
            ", statoOrdine='" + getStatoOrdine() + "'" +
            ", dataCreazione='" + getDataCreazione() + "'" +
            "}";
    }
}
