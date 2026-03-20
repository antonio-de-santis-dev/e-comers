package main.ms.admin.service.mapper;

import main.ms.admin.domain.StatisticaOrdine;
import main.ms.admin.service.dto.StatisticaOrdineDTO;
import org.springframework.stereotype.Component;

@Component
public class StatisticaOrdineMapper {

    public StatisticaOrdineDTO toDto(StatisticaOrdine entity) {
        if (entity == null) return null;
        StatisticaOrdineDTO dto = new StatisticaOrdineDTO();
        dto.setId(entity.getId());
        dto.setOrdineId(entity.getOrdineId());
        dto.setPagamentoId(entity.getPagamentoId());
        dto.setClienteId(entity.getClienteId());
        dto.setTotale(entity.getTotale());
        dto.setStatoOrdine(entity.getStatoOrdine());
        dto.setStatoPagamento(entity.getStatoPagamento());
        dto.setDataRegistrazione(entity.getDataRegistrazione());
        return dto;
    }

    public StatisticaOrdine toEntity(StatisticaOrdineDTO dto) {
        if (dto == null) return null;
        StatisticaOrdine entity = new StatisticaOrdine();
        entity.setId(dto.getId());
        entity.setOrdineId(dto.getOrdineId());
        entity.setPagamentoId(dto.getPagamentoId());
        entity.setClienteId(dto.getClienteId());
        entity.setTotale(dto.getTotale());
        entity.setStatoOrdine(dto.getStatoOrdine());
        entity.setStatoPagamento(dto.getStatoPagamento());
        entity.setDataRegistrazione(dto.getDataRegistrazione());
        return entity;
    }
}
