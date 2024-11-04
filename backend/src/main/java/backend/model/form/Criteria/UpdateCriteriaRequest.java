package backend.model.form.Criteria;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCriteriaRequest {
    @NotNull
    private String criteriaName;

    private Integer updatedBy;
}
