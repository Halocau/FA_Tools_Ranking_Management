package backend.model.form.Criteria;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCriteriaRequest {
    @NotNull
    private String criteriaName;

    private Integer createdBy;
}
