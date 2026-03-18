package main.ms.recensioni.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Recensione.
 */
@Document(collection = "recensione")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Recensione implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("prodotto_id")
    private UUID prodottoId;

    @NotNull
    @Field("ordine_id")
    private UUID ordineId;

    @NotNull
    @Size(max = 100)
    @Field("nome_cliente")
    private String nomeCliente;

    @NotNull
    @Size(max = 1000)
    @Field("descrizione")
    private String descrizione;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Field("voto_singolo")
    private Integer votoSingolo;

    @Field("immagine_recensione")
    private byte[] immagineRecensione;

    @Field("immagine_recensione_content_type")
    private String immagineRecensioneContentType;

    @NotNull
    @Field("data_recensione")
    private Instant dataRecensione;

    @NotNull
    @Field("approvata")
    private Boolean approvata;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Recensione id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UUID getProdottoId() {
        return this.prodottoId;
    }

    public Recensione prodottoId(UUID prodottoId) {
        this.setProdottoId(prodottoId);
        return this;
    }

    public void setProdottoId(UUID prodottoId) {
        this.prodottoId = prodottoId;
    }

    public UUID getOrdineId() {
        return this.ordineId;
    }

    public Recensione ordineId(UUID ordineId) {
        this.setOrdineId(ordineId);
        return this;
    }

    public void setOrdineId(UUID ordineId) {
        this.ordineId = ordineId;
    }

    public String getNomeCliente() {
        return this.nomeCliente;
    }

    public Recensione nomeCliente(String nomeCliente) {
        this.setNomeCliente(nomeCliente);
        return this;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getDescrizione() {
        return this.descrizione;
    }

    public Recensione descrizione(String descrizione) {
        this.setDescrizione(descrizione);
        return this;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Integer getVotoSingolo() {
        return this.votoSingolo;
    }

    public Recensione votoSingolo(Integer votoSingolo) {
        this.setVotoSingolo(votoSingolo);
        return this;
    }

    public void setVotoSingolo(Integer votoSingolo) {
        this.votoSingolo = votoSingolo;
    }

    public byte[] getImmagineRecensione() {
        return this.immagineRecensione;
    }

    public Recensione immagineRecensione(byte[] immagineRecensione) {
        this.setImmagineRecensione(immagineRecensione);
        return this;
    }

    public void setImmagineRecensione(byte[] immagineRecensione) {
        this.immagineRecensione = immagineRecensione;
    }

    public String getImmagineRecensioneContentType() {
        return this.immagineRecensioneContentType;
    }

    public Recensione immagineRecensioneContentType(String immagineRecensioneContentType) {
        this.immagineRecensioneContentType = immagineRecensioneContentType;
        return this;
    }

    public void setImmagineRecensioneContentType(String immagineRecensioneContentType) {
        this.immagineRecensioneContentType = immagineRecensioneContentType;
    }

    public Instant getDataRecensione() {
        return this.dataRecensione;
    }

    public Recensione dataRecensione(Instant dataRecensione) {
        this.setDataRecensione(dataRecensione);
        return this;
    }

    public void setDataRecensione(Instant dataRecensione) {
        this.dataRecensione = dataRecensione;
    }

    public Boolean getApprovata() {
        return this.approvata;
    }

    public Recensione approvata(Boolean approvata) {
        this.setApprovata(approvata);
        return this;
    }

    public void setApprovata(Boolean approvata) {
        this.approvata = approvata;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Recensione)) {
            return false;
        }
        return getId() != null && getId().equals(((Recensione) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Recensione{" +
            "id=" + getId() +
            ", prodottoId='" + getProdottoId() + "'" +
            ", ordineId='" + getOrdineId() + "'" +
            ", nomeCliente='" + getNomeCliente() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", votoSingolo=" + getVotoSingolo() +
            ", immagineRecensione='" + getImmagineRecensione() + "'" +
            ", immagineRecensioneContentType='" + getImmagineRecensioneContentType() + "'" +
            ", dataRecensione='" + getDataRecensione() + "'" +
            ", approvata='" + getApprovata() + "'" +
            "}";
    }
}
