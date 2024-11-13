package backend.config.common;

import backend.config.exception.exceptionEntity.PageException;
import backend.model.page.PageInfo;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public class PaginationUtils {

    public  <T> ResultPaginationDTO buildPaginationDTO(Page<T> page) {
        ResultPaginationDTO dto = new ResultPaginationDTO();
        PageInfo info = new PageInfo();

        info.setPage(page.getNumber() + 1);
        info.setSize(page.getSize());
        info.setTotal(page.getTotalPages());
        info.setElement(page.getTotalElements());

        dto.setPageInfo(info);
        dto.setResult(page.getContent());

        return dto;
    }
}
