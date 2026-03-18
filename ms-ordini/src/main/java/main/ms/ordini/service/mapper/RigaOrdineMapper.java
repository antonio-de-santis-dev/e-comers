package main.ms.ordini.service.mapper;

import main.ms.ordini.domain.Ordine;
import main.ms.ordini.domain.RigaOrdine;
import main.ms.ordini.service.dto.OrdineDTO;
import main.ms.ordini.service.dto.RigaOrdineDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link RigaOrdine} and its DTO {@link RigaOrdineDTO}.
 */
@Mapper(componentModel = "spring")
public interface RigaOrdineMapper extends EntityMapper<RigaOrdineDTO, RigaOrdine> {
    @Mapping(target = "ordine", source = "ordine", qualifiedByName = "ordineId")
    RigaOrdineDTO toDto(RigaOrdine s);

    @Named("ordineId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OrdineDTO toDtoOrdineId(Ordine ordine);
}
