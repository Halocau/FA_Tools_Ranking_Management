package backend.model.form.Criteria;

import backend.model.validation.Criteria.AddCriteriaNotDuplicate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCriteriaRequest {
    @NotBlank
    @AddCriteriaNotDuplicate
    private String criteriaName;

    private Integer createdBy;
}
