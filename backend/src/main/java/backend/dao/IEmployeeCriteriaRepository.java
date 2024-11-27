package backend.dao;

import backend.model.entity.Employee;
import backend.model.entity.EmployeeCriteria;
import backend.model.entity.Serializable.EmployeeCriteriaSerializable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IEmployeeCriteriaRepository extends JpaRepository<EmployeeCriteria, EmployeeCriteriaSerializable> {
    EmployeeCriteria findByEmployeeIdAndCriteriaId(Integer employeeId, Integer criteriaId);
    List<EmployeeCriteria> findByEmployeeId(Integer employeeId);
}
