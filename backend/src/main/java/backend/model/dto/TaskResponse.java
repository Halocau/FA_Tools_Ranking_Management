package backend.model.dto;

import lombok.Data;

@Data
public class TaskResponse {
    private int taskId;
    private String taskName;
    private String createdByName;
    private String createdAt;
    private String updatedAt;
}
