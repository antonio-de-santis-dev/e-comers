package main.ms.recensioni.service.mapper;

import main.ms.recensioni.domain.Recensione;
import main.ms.recensioni.service.dto.RecensioneDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Recensione} and its DTO {@link RecensioneDTO}.
 */
@Mapper(componentModel = "spring")
public interface RecensioneMapper extends EntityMapper<RecensioneDTO, Recensione> {}
