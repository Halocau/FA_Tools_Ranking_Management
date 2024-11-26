package backend.model.entity;

import backend.model.entity.Serializable.EmployeeCriteriaSerializable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(EmployeeCriteriaSerializable.class)
@SuperBuilder
@Entity
@Table(name = "Employee_Criteria")
public class EmployeeCriteria {
    @Id
    @Column(name = "employee_id")
    private Integer employeeId;

    @Id
    @Column(name = "criteria_id")
    private Integer criteriaId;

    @Column(name = "option_id")
    private Integer optionId;
}
