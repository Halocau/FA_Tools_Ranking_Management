package backend.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplyCriteriaResponse {
    private String criteriaName;
    private String optionName;
    private Integer score;
    private Float weight;
    private int maxScore;


}
