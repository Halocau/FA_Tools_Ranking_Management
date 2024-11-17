package backend.model.form.DecisionCriteria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddDecisionCriteria {
    @NotBlank
    private Integer decisionId;
    @NotNull
    private Integer criteriaId;
    private Float weight;
}
