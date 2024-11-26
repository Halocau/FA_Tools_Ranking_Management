package backend.model.form.EmployeeCriteria;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpsertEmployeeCriteriaRequest {
    @NotNull
    private Integer employeeId;

    @NotNull
    private Integer criteriaId;

    @NotNull
    private Integer optionId;
}
