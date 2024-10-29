package backend.model.form.Task;

import lombok.Data;

@Data
public class EditTaskRequest {
    private String taskName;
    private int createdBy;
}
