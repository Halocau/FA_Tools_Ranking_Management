package backend.model.form.Task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddTaskRequest {
    @NotBlank
    private String taskName;

    @NotNull
    private int createdBy;
}
