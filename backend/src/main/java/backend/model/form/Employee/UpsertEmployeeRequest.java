package backend.model.form.Employee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UpsertEmployeeRequest {
    @NotNull
    private Integer employeeId;

    @NotBlank
    @Length(min = 3, max = 100)
    private String employeeName;

    @NotNull
    private Integer groupId;

    @NotNull
    private Integer bulkImportId;
    @NotNull
    private Integer rankingDecisionId;
}
