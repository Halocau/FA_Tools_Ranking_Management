package backend.model.form.Criteria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCriteriaRequest {
    @NotNull
    private String criteriaName;
    @NotNull
    private Integer updatedBy;
}
