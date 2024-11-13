package backend.model.page;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageInfo {
    private int page;
    private int size;
    private int total;
    private long element;
}
