package backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DecisionCriteriaResponse {
    private Integer criteriaId;
    private String criteriaName;
    private Float weight;
    private Integer numOptions;
    private Integer maxScore;
}
