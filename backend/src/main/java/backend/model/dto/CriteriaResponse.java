package backend.model.dto;

import lombok.Data;

@Data
public class CriteriaResponse {
    private Integer criteriaId;
    private String criteriaName;
    private Integer maxScore;
    private Integer numOptions;
}
