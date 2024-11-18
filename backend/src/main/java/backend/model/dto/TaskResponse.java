package backend.model.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private int taskId;
    private String taskName;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
