package backend.model.form.DecisionTasks;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddDecisionTasks {
    @NotNull
    private Integer decisionId;

    @NotNull
    private Integer taskId;
}
