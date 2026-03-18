package main.ms.ordini.service.mapper;

import main.ms.ordini.domain.Ordine;
import main.ms.ordini.service.dto.OrdineDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Ordine} and its DTO {@link OrdineDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrdineMapper extends EntityMapper<OrdineDTO, Ordine> {}
