package main.ms.catalogo.service.mapper;

import main.ms.catalogo.domain.Categoria;
import main.ms.catalogo.domain.Prodotto;
import main.ms.catalogo.service.dto.CategoriaDTO;
import main.ms.catalogo.service.dto.ProdottoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Prodotto} and its DTO {@link ProdottoDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProdottoMapper extends EntityMapper<ProdottoDTO, Prodotto> {
    @Mapping(target = "id", source = "prodottoUuid")
    @Mapping(target = "categoria", source = "categoria", qualifiedByName = "categoriaNome")
    ProdottoDTO toDto(Prodotto s);

    @Mapping(target = "prodottoUuid", source = "id")
    Prodotto toEntity(ProdottoDTO prodottoDTO);

    @Named("categoriaNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    CategoriaDTO toDtoCategoriaNome(Categoria categoria);
}
