package backend.model.form.DecisionCriteria;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateDecisionCriteriaRequest {
    @NotNull
    private Integer decisionId;
    @NotNull
    private Integer criteriaId;

    private Float weight;
}
