package main.ms.notifiche.domain;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "notifica")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Notifica implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("tipo")
    private String tipo; // ORDINE_CONFERMATO, PAGAMENTO_APPROVATO, RECENSIONE_APPROVATA

    @Field("messaggio")
    private String messaggio;

    @Field("cliente_id")
    private UUID clienteId;

    @Field("entita_id")
    private String entitaId; // id ordine, pagamento o recensione

    @Field("data_notifica")
    private Instant dataNotifica;

    @Field("letta")
    private Boolean letta;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getMessaggio() { return messaggio; }
    public void setMessaggio(String messaggio) { this.messaggio = messaggio; }

    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }

    public String getEntitaId() { return entitaId; }
    public void setEntitaId(String entitaId) { this.entitaId = entitaId; }

    public Instant getDataNotifica() { return dataNotifica; }
    public void setDataNotifica(Instant dataNotifica) { this.dataNotifica = dataNotifica; }

    public Boolean getLetta() { return letta; }
    public void setLetta(Boolean letta) { this.letta = letta; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Notifica)) return false;
        return id != null && id.equals(((Notifica) o).id);
    }

    @Override
    public int hashCode() { return getClass().hashCode(); }

    @Override
    public String toString() {
        return "Notifica{id='" + id + "', tipo='" + tipo + "', clienteId=" + clienteId + ", letta=" + letta + "}";
    }
}
