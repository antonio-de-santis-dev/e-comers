package main.ms.recensioni.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * A DTO for the {@link main.ms.recensioni.domain.Recensione} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RecensioneDTO implements Serializable {

    private String id;

    @NotNull
    private UUID prodottoId;

    @NotNull
    private UUID ordineId;

    @NotNull
    @Size(max = 100)
    private String nomeCliente;

    @NotNull
    @Size(max = 1000)
    private String descrizione;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    private Integer votoSingolo;

    private byte[] immagineRecensione;

    private String immagineRecensioneContentType;

    @NotNull
    private Instant dataRecensione;

    @NotNull
    private Boolean approvata;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UUID getProdottoId() {
        return prodottoId;
    }

    public void setProdottoId(UUID prodottoId) {
        this.prodottoId = prodottoId;
    }

    public UUID getOrdineId() {
        return ordineId;
    }

    public void setOrdineId(UUID ordineId) {
        this.ordineId = ordineId;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Integer getVotoSingolo() {
        return votoSingolo;
    }

    public void setVotoSingolo(Integer votoSingolo) {
        this.votoSingolo = votoSingolo;
    }

    public byte[] getImmagineRecensione() {
        return immagineRecensione;
    }

    public void setImmagineRecensione(byte[] immagineRecensione) {
        this.immagineRecensione = immagineRecensione;
    }

    public String getImmagineRecensioneContentType() {
        return immagineRecensioneContentType;
    }

    public void setImmagineRecensioneContentType(String immagineRecensioneContentType) {
        this.immagineRecensioneContentType = immagineRecensioneContentType;
    }

    public Instant getDataRecensione() {
        return dataRecensione;
    }

    public void setDataRecensione(Instant dataRecensione) {
        this.dataRecensione = dataRecensione;
    }

    public Boolean getApprovata() {
        return approvata;
    }

    public void setApprovata(Boolean approvata) {
        this.approvata = approvata;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RecensioneDTO)) {
            return false;
        }

        RecensioneDTO recensioneDTO = (RecensioneDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, recensioneDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RecensioneDTO{" +
            "id='" + getId() + "'" +
            ", prodottoId='" + getProdottoId() + "'" +
            ", ordineId='" + getOrdineId() + "'" +
            ", nomeCliente='" + getNomeCliente() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", votoSingolo=" + getVotoSingolo() +
            ", immagineRecensione='" + getImmagineRecensione() + "'" +
            ", dataRecensione='" + getDataRecensione() + "'" +
            ", approvata='" + getApprovata() + "'" +
            "}";
    }
}
