package backend.model.entity.Serializable;


import java.io.Serializable;
import java.util.Objects;

public class DecisionCriteriaSerializable implements Serializable {
    private Integer decisionId;
    private Integer criteriaId;

    // Constructors, getters, setters, equals, and hashCode
    public DecisionCriteriaSerializable() {
    }

    public DecisionCriteriaSerializable(Integer decisionId, Integer criteriaId) {
        this.decisionId = decisionId;
        this.criteriaId = criteriaId;
    }

    // equals() and hashCode() cần được override để JPA hoạt động đúng
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DecisionCriteriaSerializable that = (DecisionCriteriaSerializable) o;
        return Objects.equals(decisionId, that.decisionId) &&
                Objects.equals(criteriaId, that.criteriaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(decisionId, criteriaId);
    }
}
