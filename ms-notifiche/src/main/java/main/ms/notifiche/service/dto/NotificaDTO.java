package main.ms.notifiche.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public class NotificaDTO implements Serializable {

    private String id;

    private String tipo;

    private String messaggio;

    private UUID clienteId;

    private String entitaId;

    // Auto-generata nel service — NO @NotNull
    private Instant dataNotifica;

    // Default false nel service — NO @NotNull
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
        if (!(o instanceof NotificaDTO)) return false;
        NotificaDTO that = (NotificaDTO) o;
        if (this.id == null) return false;
        return Objects.equals(this.id, that.id);
    }

    @Override
    public int hashCode() { return Objects.hash(this.id); }

    @Override
    public String toString() {
        return "NotificaDTO{id='" + id + "', tipo='" + tipo + "', clienteId=" + clienteId + ", letta=" + letta + "}";
    }
}
