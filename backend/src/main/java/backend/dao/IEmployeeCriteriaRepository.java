package backend.dao;

import backend.model.entity.Employee;
import backend.model.entity.EmployeeCriteria;
import backend.model.entity.Serializable.EmployeeCriteriaSerializable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IEmployeeCriteriaRepository extends JpaRepository<EmployeeCriteria, EmployeeCriteriaSerializable> {
    EmployeeCriteria findByEmployeeIdAndCriteriaId(Integer employeeId, Integer criteriaId);
    List<EmployeeCriteria> findByEmployeeId(Integer employeeId);

    @Query("SELECT ec FROM EmployeeCriteria ec " +
            "JOIN Employee e ON ec.employeeId = e.employeeId " +
            "WHERE e.groupId = :groupId")
    List<EmployeeCriteria> findByGroupId(@Param("groupId") Integer groupId);
}
