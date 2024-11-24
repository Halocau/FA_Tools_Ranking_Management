package backend.model.form.TasksWage;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpsertTasksWage {
    @NotNull(message = "RankingTitleId cannot be null")
    private Integer rankingTitleId;

    @NotNull(message = "TaskId cannot be null")
    private Integer taskId;

    @NotNull(message = "WorkingHourWage cannot be null")
    private Float workingHourWage;

    @NotNull(message = "OvertimeWage cannot be null")
    private Float overtimeWage;
}
