package backend.model.page;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultPaginationDTO {
    private PageInfo pageInfo;
    private Object result;
}
