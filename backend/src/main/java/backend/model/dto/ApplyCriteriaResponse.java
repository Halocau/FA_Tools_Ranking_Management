package backend.model.dto;

import lombok.Data;

@Data
public class ApplyCriteriaResponse {
    private String criteriaName;
    private String optionName;
    private Integer score;
    private Float weight;
    private int maxScore;
}
