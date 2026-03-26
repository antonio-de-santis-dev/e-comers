package main.ms.catalogo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

/**
 * Immagine aggiuntiva di un prodotto per il carosello.
 * immagineCopertina rimane sul Prodotto (usata nella card lista).
 * Le immagini del carosello vengono salvate qui.
 */
@Entity
@Table(name = "prodotto_immagine")
public class ProdottoImmagine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", unique = true, nullable = false)
    private UUID id;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "prodotto_id", nullable = false)
    private Prodotto prodotto;

    @NotNull
    @Column(name = "immagine", columnDefinition = "bytea", nullable = false)
    private byte[] immagine;

    @NotNull
    @Column(name = "immagine_content_type", nullable = false)
    private String immagineContentType;

    @Column(name = "ordine", nullable = false)
    private Integer ordine = 0;

    // ---- Getters & Setters ----

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Prodotto getProdotto() { return prodotto; }
    public void setProdotto(Prodotto prodotto) { this.prodotto = prodotto; }

    public byte[] getImmagine() { return immagine; }
    public void setImmagine(byte[] immagine) { this.immagine = immagine; }

    public String getImmagineContentType() { return immagineContentType; }
    public void setImmagineContentType(String immagineContentType) { this.immagineContentType = immagineContentType; }

    public Integer getOrdine() { return ordine; }
    public void setOrdine(Integer ordine) { this.ordine = ordine; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProdottoImmagine)) return false;
        ProdottoImmagine that = (ProdottoImmagine) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() { return getClass().hashCode(); }

    @Override
    public String toString() {
        return "ProdottoImmagine{id=" + id + ", ordine=" + ordine + "}";
    }
}
