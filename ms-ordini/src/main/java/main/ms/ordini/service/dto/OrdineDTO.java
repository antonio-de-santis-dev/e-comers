package main.ms.ordini.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import main.ms.ordini.domain.enumeration.StatoOrdine;
import main.ms.ordini.domain.enumeration.TipoSpedizione;

/**
 * A DTO for the {@link main.ms.ordini.domain.Ordine} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrdineDTO implements Serializable {

    private UUID id;

    private String numeroOrdine; // auto-generato nel service

    @NotNull
    private UUID clienteId;

    @NotNull
    @Size(max = 100)
    private String nomeCliente;

    @NotNull
    @Size(max = 100)
    private String cognomeCliente;

    @NotNull
    private String email;

    private String telefono;

    @NotNull
    private String indirizzo;

    @NotNull
    private String citta;

    @NotNull
    @Size(max = 2)
    private String provincia;

    @NotNull
    @Size(max = 5)
    private String cap;

    @NotNull
    private String statoPaese;

    @Size(max = 500)
    private String noteSpedizione;

    @NotNull
    private TipoSpedizione tipoSpedizione;

    @NotNull
    private BigDecimal costoSpedizione;

    @NotNull
    private BigDecimal totaleImponibile;

    @NotNull
    private BigDecimal totaleIva;

    @NotNull
    private BigDecimal totaleFinal;

    private String buonoSconto;

    private BigDecimal scontoApplicato;

    @NotNull
    private StatoOrdine statoOrdine;

    // Auto-generata nel service — rimosso @NotNull
    private Instant dataCreazione;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNumeroOrdine() { return numeroOrdine; }
    public void setNumeroOrdine(String numeroOrdine) { this.numeroOrdine = numeroOrdine; }

    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }

    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }

    public String getCognomeCliente() { return cognomeCliente; }
    public void setCognomeCliente(String cognomeCliente) { this.cognomeCliente = cognomeCliente; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getIndirizzo() { return indirizzo; }
    public void setIndirizzo(String indirizzo) { this.indirizzo = indirizzo; }

    public String getCitta() { return citta; }
    public void setCitta(String citta) { this.citta = citta; }

    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }

    public String getCap() { return cap; }
    public void setCap(String cap) { this.cap = cap; }

    public String getStatoPaese() { return statoPaese; }
    public void setStatoPaese(String statoPaese) { this.statoPaese = statoPaese; }

    public String getNoteSpedizione() { return noteSpedizione; }
    public void setNoteSpedizione(String noteSpedizione) { this.noteSpedizione = noteSpedizione; }

    public TipoSpedizione getTipoSpedizione() { return tipoSpedizione; }
    public void setTipoSpedizione(TipoSpedizione tipoSpedizione) { this.tipoSpedizione = tipoSpedizione; }

    public BigDecimal getCostoSpedizione() { return costoSpedizione; }
    public void setCostoSpedizione(BigDecimal costoSpedizione) { this.costoSpedizione = costoSpedizione; }

    public BigDecimal getTotaleImponibile() { return totaleImponibile; }
    public void setTotaleImponibile(BigDecimal totaleImponibile) { this.totaleImponibile = totaleImponibile; }

    public BigDecimal getTotaleIva() { return totaleIva; }
    public void setTotaleIva(BigDecimal totaleIva) { this.totaleIva = totaleIva; }

    public BigDecimal getTotaleFinal() { return totaleFinal; }
    public void setTotaleFinal(BigDecimal totaleFinal) { this.totaleFinal = totaleFinal; }

    public String getBuonoSconto() { return buonoSconto; }
    public void setBuonoSconto(String buonoSconto) { this.buonoSconto = buonoSconto; }

    public BigDecimal getScontoApplicato() { return scontoApplicato; }
    public void setScontoApplicato(BigDecimal scontoApplicato) { this.scontoApplicato = scontoApplicato; }

    public StatoOrdine getStatoOrdine() { return statoOrdine; }
    public void setStatoOrdine(StatoOrdine statoOrdine) { this.statoOrdine = statoOrdine; }

    public Instant getDataCreazione() { return dataCreazione; }
    public void setDataCreazione(Instant dataCreazione) { this.dataCreazione = dataCreazione; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrdineDTO)) return false;
        OrdineDTO ordineDTO = (OrdineDTO) o;
        if (this.id == null) return false;
        return Objects.equals(this.id, ordineDTO.id);
    }

    @Override
    public int hashCode() { return Objects.hash(this.id); }

    @Override
    public String toString() {
        return "OrdineDTO{" +
            "id=" + getId() +
            ", numeroOrdine='" + getNumeroOrdine() + "'" +
            ", clienteId='" + getClienteId() + "'" +
            ", nomeCliente='" + getNomeCliente() + "'" +
            ", email='" + getEmail() + "'" +
            ", citta='" + getCitta() + "'" +
            ", statoOrdine='" + getStatoOrdine() + "'" +
            ", dataCreazione='" + getDataCreazione() + "'" +
            "}";
    }
}
