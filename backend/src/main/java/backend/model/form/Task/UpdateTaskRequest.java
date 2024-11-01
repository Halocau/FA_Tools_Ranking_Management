package backend.model.form.Task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UpdateTaskRequest {
    @NotBlank
    @Length(max= 30)
    private String taskName;

    @NotNull
    private int createdBy;
}
