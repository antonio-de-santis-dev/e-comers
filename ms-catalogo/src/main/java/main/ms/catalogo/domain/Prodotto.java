package main.ms.catalogo.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * A Prodotto.
 */
@Entity
@Table(name = "prodotto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Prodotto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", unique = true)
    private UUID prodottoUuid;

    @NotNull
    @Size(max = 200)
    @Column(name = "nome", length = 200, nullable = false)
    private String nome;

    @Column(name = "descrizione", nullable = false)
    private String descrizione;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "prezzo", precision = 21, scale = 2, nullable = false)
    private BigDecimal prezzo;

    @NotNull
    @Column(name = "aliquota_iva", nullable = false)
    private Integer aliquotaIva;


    @Column(name = "immagine_copertina", columnDefinition = "bytea")
    private byte[] immagineCopertina;

    @NotNull
    @Column(name = "immagine_copertina_content_type", nullable = false)
    private String immagineCopertinaContentType;

    @Column(name = "immagine_prodotto", columnDefinition = "bytea")
    private byte[] immagineProdotto;

    @Column(name = "immagine_prodotto_content_type")
    private String immagineProdottoContentType;

    @NotNull
    @Column(name = "disponibile", nullable = false)
    private Boolean disponibile;

    @NotNull
    @Min(value = 0)
    @Column(name = "quantita_disponibile", nullable = false)
    private Integer quantitaDisponibile;

    @Column(name = "voto_totale")
    private Double votoTotale;

    @NotNull
    @Column(name = "in_evidenza", nullable = false)
    private Boolean inEvidenza;

    @Column(name = "totale_purchased")
    private Integer totalePurchased;

    @ManyToOne(optional = false)
    @NotNull
    private Categoria categoria;

    // jhipster-needle-entity-add-field - JHipster will add fields here


    public UUID getProdottoUuid() {
        return prodottoUuid;
    }

    public void setProdottoUuid(UUID prodottoUuid) {
        this.prodottoUuid = prodottoUuid;
    }

    public String getNome() {
        return this.nome;
    }

    public Prodotto nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescrizione() {
        return this.descrizione;
    }

    public Prodotto descrizione(String descrizione) {
        this.setDescrizione(descrizione);
        return this;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public BigDecimal getPrezzo() {
        return this.prezzo;
    }

    public Prodotto prezzo(BigDecimal prezzo) {
        this.setPrezzo(prezzo);
        return this;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public Integer getAliquotaIva() {
        return this.aliquotaIva;
    }

    public Prodotto aliquotaIva(Integer aliquotaIva) {
        this.setAliquotaIva(aliquotaIva);
        return this;
    }

    public void setAliquotaIva(Integer aliquotaIva) {
        this.aliquotaIva = aliquotaIva;
    }

    public byte[] getImmagineCopertina() {
        return this.immagineCopertina;
    }

    public Prodotto immagineCopertina(byte[] immagineCopertina) {
        this.setImmagineCopertina(immagineCopertina);
        return this;
    }

    public void setImmagineCopertina(byte[] immagineCopertina) {
        this.immagineCopertina = immagineCopertina;
    }

    public String getImmagineCopertinaContentType() {
        return this.immagineCopertinaContentType;
    }

    public Prodotto immagineCopertinaContentType(String immagineCopertinaContentType) {
        this.immagineCopertinaContentType = immagineCopertinaContentType;
        return this;
    }

    public void setImmagineCopertinaContentType(String immagineCopertinaContentType) {
        this.immagineCopertinaContentType = immagineCopertinaContentType;
    }

    public byte[] getImmagineProdotto() {
        return this.immagineProdotto;
    }

    public Prodotto immagineProdotto(byte[] immagineProdotto) {
        this.setImmagineProdotto(immagineProdotto);
        return this;
    }

    public void setImmagineProdotto(byte[] immagineProdotto) {
        this.immagineProdotto = immagineProdotto;
    }

    public String getImmagineProdottoContentType() {
        return this.immagineProdottoContentType;
    }

    public Prodotto immagineProdottoContentType(String immagineProdottoContentType) {
        this.immagineProdottoContentType = immagineProdottoContentType;
        return this;
    }

    public void setImmagineProdottoContentType(String immagineProdottoContentType) {
        this.immagineProdottoContentType = immagineProdottoContentType;
    }

    public Boolean getDisponibile() {
        return this.disponibile;
    }

    public Prodotto disponibile(Boolean disponibile) {
        this.setDisponibile(disponibile);
        return this;
    }

    public void setDisponibile(Boolean disponibile) {
        this.disponibile = disponibile;
    }

    public Integer getQuantitaDisponibile() {
        return this.quantitaDisponibile;
    }

    public Prodotto quantitaDisponibile(Integer quantitaDisponibile) {
        this.setQuantitaDisponibile(quantitaDisponibile);
        return this;
    }

    public void setQuantitaDisponibile(Integer quantitaDisponibile) {
        this.quantitaDisponibile = quantitaDisponibile;
    }

    public Double getVotoTotale() {
        return this.votoTotale;
    }

    public Prodotto votoTotale(Double votoTotale) {
        this.setVotoTotale(votoTotale);
        return this;
    }

    public void setVotoTotale(Double votoTotale) {
        this.votoTotale = votoTotale;
    }

    public Boolean getInEvidenza() {
        return this.inEvidenza;
    }

    public Prodotto inEvidenza(Boolean inEvidenza) {
        this.setInEvidenza(inEvidenza);
        return this;
    }

    public void setInEvidenza(Boolean inEvidenza) {
        this.inEvidenza = inEvidenza;
    }

    public Integer getTotalePurchased() {
        return this.totalePurchased;
    }

    public Prodotto totalePurchased(Integer totalePurchased) {
        this.setTotalePurchased(totalePurchased);
        return this;
    }

    public void setTotalePurchased(Integer totalePurchased) {
        this.totalePurchased = totalePurchased;
    }

    public Categoria getCategoria() {
        return this.categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Prodotto categoria(Categoria categoria) {
        this.setCategoria(categoria);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prodotto)) {
            return false;
        }
        return getProdottoUuid() != null && getProdottoUuid().equals(((Prodotto) o).getProdottoUuid());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Prodotto{" +
            "id=" + getProdottoUuid() +
            ", nome='" + getNome() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            ", prezzo=" + getPrezzo() +
            ", aliquotaIva=" + getAliquotaIva() +
            ", immagineCopertina='" + getImmagineCopertina() + "'" +
            ", immagineCopertinaContentType='" + getImmagineCopertinaContentType() + "'" +
            ", immagineProdotto='" + getImmagineProdotto() + "'" +
            ", immagineProdottoContentType='" + getImmagineProdottoContentType() + "'" +
            ", disponibile='" + getDisponibile() + "'" +
            ", quantitaDisponibile=" + getQuantitaDisponibile() +
            ", votoTotale=" + getVotoTotale() +
            ", inEvidenza='" + getInEvidenza() + "'" +
            ", totalePurchased=" + getTotalePurchased() +
            "}";
    }
}
