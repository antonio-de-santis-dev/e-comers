package main.ms.notifiche.service.mapper;

import main.ms.notifiche.domain.Notifica;
import main.ms.notifiche.service.dto.NotificaDTO;
import org.springframework.stereotype.Component;

@Component
public class NotificaMapper {

    public NotificaDTO toDto(Notifica notifica) {
        if (notifica == null) return null;
        NotificaDTO dto = new NotificaDTO();
        dto.setId(notifica.getId());
        dto.setTipo(notifica.getTipo());
        dto.setMessaggio(notifica.getMessaggio());
        dto.setClienteId(notifica.getClienteId());
        dto.setEntitaId(notifica.getEntitaId());
        dto.setDataNotifica(notifica.getDataNotifica());
        dto.setLetta(notifica.getLetta());
        return dto;
    }

    public Notifica toEntity(NotificaDTO dto) {
        if (dto == null) return null;
        Notifica notifica = new Notifica();
        notifica.setId(dto.getId());
        notifica.setTipo(dto.getTipo());
        notifica.setMessaggio(dto.getMessaggio());
        notifica.setClienteId(dto.getClienteId());
        notifica.setEntitaId(dto.getEntitaId());
        notifica.setDataNotifica(dto.getDataNotifica());
        notifica.setLetta(dto.getLetta());
        return notifica;
    }
}
