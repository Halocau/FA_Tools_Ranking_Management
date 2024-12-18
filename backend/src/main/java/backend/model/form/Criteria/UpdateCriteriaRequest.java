package backend.model.form.Criteria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCriteriaRequest {
    @NotBlank
    @Size(min = 3, max = 100)
    private String criteriaName;

    private Integer updatedBy;
}
