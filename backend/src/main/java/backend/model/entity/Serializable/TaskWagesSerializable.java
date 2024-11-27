package backend.model.entity.Serializable;

import java.io.Serializable;
import java.util.Objects;

public class TaskWagesSerializable implements Serializable {
    private Integer rankingTitleId;
    private Integer taskId;

    public TaskWagesSerializable() {
    }

    public TaskWagesSerializable(Integer rankingTitleId, Integer taskId) {
        this.rankingTitleId = rankingTitleId;
        this.taskId = taskId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskWagesSerializable that = (TaskWagesSerializable) o;
        return Objects.equals(rankingTitleId, that.rankingTitleId) && Objects.equals(taskId, that.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rankingTitleId, taskId);
    }
}
