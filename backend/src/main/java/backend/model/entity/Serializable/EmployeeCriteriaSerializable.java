package backend.model.entity.Serializable;

import java.util.Objects;

public class EmployeeCriteriaSerializable {
    private Integer employeeId;
    private Integer criteriaId;

    public EmployeeCriteriaSerializable() {
    }

    public EmployeeCriteriaSerializable(Integer employeeId, Integer criteriaId) {
        this.employeeId = employeeId;
        this.criteriaId = criteriaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmployeeCriteriaSerializable that = (EmployeeCriteriaSerializable) o;
        return Objects.equals(employeeId, that.employeeId) && Objects.equals(criteriaId, that.criteriaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeeId, criteriaId);
    }
}
