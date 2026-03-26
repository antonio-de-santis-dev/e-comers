package main.ms.catalogo.service.dto;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO per le immagini del carosello di un prodotto.
 * immagine viene gestita come stringa Base64 per compatibilità con il frontend Angular.
 */
public class ProdottoImmagineDTO implements Serializable {

    private String id;           // UUID come stringa

    private UUID prodottoId;

    private String immagine;     // Base64 string (non byte[])

    private String immagineContentType;

    private Integer ordine;

    // ---- Getters & Setters ----

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public UUID getProdottoId() { return prodottoId; }
    public void setProdottoId(UUID prodottoId) { this.prodottoId = prodottoId; }

    public String getImmagine() { return immagine; }
    public void setImmagine(String immagine) { this.immagine = immagine; }

    public String getImmagineContentType() { return immagineContentType; }
    public void setImmagineContentType(String immagineContentType) { this.immagineContentType = immagineContentType; }

    public Integer getOrdine() { return ordine; }
    public void setOrdine(Integer ordine) { this.ordine = ordine; }
}
