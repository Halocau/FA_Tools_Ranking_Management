package backend.model.dto;

import lombok.Data;

@Data
public class ApplyCriteriaResponse {
    private String cirteriaName;
    private String optionName;
    private Integer score;
}
