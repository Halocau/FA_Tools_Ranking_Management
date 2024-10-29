package backend.model.form.Task;

import lombok.Data;

@Data
public class AddTaskRequest {
    private String taskName;
    private int createdBy;
}
