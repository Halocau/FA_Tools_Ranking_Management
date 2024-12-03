package backend.model.entity.Serializable;

import java.io.Serializable;
import java.util.Objects;

public class DecisionTasksSerializable implements Serializable {
    private Integer decisionId;
    private Integer taskId;

    public DecisionTasksSerializable() {
    }

    public DecisionTasksSerializable(Integer decisionId, Integer taskId) {
        this.decisionId = decisionId;
        this.taskId = taskId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DecisionTasksSerializable that = (DecisionTasksSerializable) o;
        return Objects.equals(decisionId, that.decisionId) && Objects.equals(taskId, that.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(decisionId, taskId);
    }
}
