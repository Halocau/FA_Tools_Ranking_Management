package backend.model.form.TasksWage;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpsertTasksWage {
    @NotNull
    private Integer rankingTitleId;
    @NotNull
    private Integer taskId;
    @NotNull
    private Float workingHourWage;
    @NotNull
    private Float overtimeWage;
}
