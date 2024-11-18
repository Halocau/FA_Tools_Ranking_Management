package backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class DecisionCriteriaResponse {
    private Integer decisionId;
    private Integer criteriaId;
    private String criteriaName;
    private Float weight;
    private Integer numOptions;
    private Integer maxScore;
}
