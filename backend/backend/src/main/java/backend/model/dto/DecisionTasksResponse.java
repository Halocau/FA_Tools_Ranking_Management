package backend.model.dto;

import lombok.Data;

import java.util.List;
@Data
public class DecisionTasksResponse {
    private Integer decisionId;
    private Integer taskId;
    private String taskName;
    private List<TaskWagesResponse> taskWages;
}
