package main.ms.catalogo.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

/**
 * A DTO for the {@link main.ms.catalogo.domain.Prodotto} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProdottoDTO implements Serializable {

    private UUID  id;

    @NotNull
    @Size(max = 200)
    private String nome;

    @Lob
    private String descrizione;

    @NotNull
    @DecimalMin(value = "0")
    private BigDecimal prezzo;

    @NotNull
    private Integer aliquotaIva;

    @Lob
    private byte[] immagineCopertina;

    private String immagineCopertinaContentType;

    @Lob
    private byte[] immagineProdotto;

    private String immagineProdottoContentType;

    @NotNull
    private Boolean disponibile;

    @NotNull
    @Min(value = 0)
    private Integer quantitaDisponibile;

    private Double votoTotale;

    @NotNull
    private Boolean inEvidenza;

    private Integer totalePurchased;

    @NotNull
    private CategoriaDTO categoria;

    public UUID  getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public Integer getAliquotaIva() {
        return aliquotaIva;
    }

    public void setAliquotaIva(Integer aliquotaIva) {
        this.aliquotaIva = aliquotaIva;
    }

    public byte[] getImmagineCopertina() {
        return immagineCopertina;
    }

    public void setImmagineCopertina(byte[] immagineCopertina) {
        this.immagineCopertina = immagineCopertina;
    }

    public String getImmagineCopertinaContentType() {
        return immagineCopertinaContentType;
    }

    public void setImmagineCopertinaContentType(String immagineCopertinaContentType) {
        this.immagineCopertinaContentType = immagineCopertinaContentType;
    }

    public byte[] getImmagineProdotto() {
        return immagineProdotto;
    }

    public void setImmagineProdotto(byte[] immagineProdotto) {
        this.immagineProdotto = immagineProdotto;
    }

    public String getImmagineProdottoContentType() {
        return immagineProdottoContentType;
    }

    public void setImmagineProdottoContentType(String immagineProdottoContentType) {
        this.immagineProdottoContentType = immagineProdottoContentType;
    }

    public Boolean getDisponibile() {
        return disponibile;
    }

    public void setDisponibile(Boolean disponibile) {
        this.disponibile = disponibile;
    }

    public Integer getQuantitaDisponibile() {
        return quantitaDisponibile;
    }

    public void setQuantitaDisponibile(Integer quantitaDisponibile) {
        this.quantitaDisponibile = quantitaDisponibile;
    }

    public Double getVotoTotale() {
        return votoTotale;
    }

    public void setVotoTotale(Double votoTotale) {
        this.votoTotale = votoTotale;
    }

    public Boolean getInEvidenza() {
        return inEvidenza;
    }

    public void setInEvidenza(Boolean inEvidenza) {
        this.inEvidenza = inEvidenza;
    }

    public Integer getTotalePurchased() {
        return totalePurchased;
    }

    public void setTotalePurchased(Integer totalePurchased) {
        this.totalePurchased = totalePurchased;
    }

    public CategoriaDTO getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaDTO categoria) {
        this.categoria = categoria;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProdottoDTO)) {
            return false;
        }

        ProdottoDTO prodottoDTO = (ProdottoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, prodottoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProdottoDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", prezzo=" + getPrezzo() +
            ", aliquotaIva=" + getAliquotaIva() +
            ", immagineCopertina='" + getImmagineCopertina() + "'" +
            ", immagineProdotto='" + getImmagineProdotto() + "'" +
            ", disponibile='" + getDisponibile() + "'" +
            ", quantitaDisponibile=" + getQuantitaDisponibile() +
            ", votoTotale=" + getVotoTotale() +
            ", inEvidenza='" + getInEvidenza() + "'" +
            ", totalePurchased=" + getTotalePurchased() +
            ", categoria=" + getCategoria() +
            "}";
    }
}
