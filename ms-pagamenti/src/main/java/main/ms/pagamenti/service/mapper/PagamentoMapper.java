package main.ms.pagamenti.service.mapper;

import main.ms.pagamenti.domain.Pagamento;
import main.ms.pagamenti.service.dto.PagamentoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Pagamento} and its DTO {@link PagamentoDTO}.
 */
@Mapper(componentModel = "spring")
public interface PagamentoMapper extends EntityMapper<PagamentoDTO, Pagamento> {}
