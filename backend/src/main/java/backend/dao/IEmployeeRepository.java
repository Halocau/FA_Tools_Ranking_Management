package backend.dao;

import backend.model.dto.CaculatorCurrentRank;
import backend.model.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEmployeeRepository extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {
    Optional<Employee> findByEmployeeId(int employeeId);
    public List<Employee> findByGroupId(Integer groupId);
    @Query("SELECT MAX(e.employeeId) FROM Employee e")
    Integer findMaxId();

    @Query("SELECT new backend.model.dto.CaculatorCurrentRank(ec.criteriaId, o.optionId, o.score, dc.weight, c.maxScore) " +
            "FROM Employee e " +
            "JOIN EmployeeCriteria ec ON e.employeeId = ec.employeeId " +
            "JOIN Criteria c ON ec.criteriaId = c.criteriaId " +
            "JOIN Options o ON ec.optionId = o.optionId " +
            "JOIN DecisionCriteria dc ON dc.criteriaId = c.criteriaId AND dc.decisionId = e.rankingDecisionId " +
            "WHERE e.employeeId = :employeeId")
    List<CaculatorCurrentRank> getApplyCriteriaResponsesForEmployee(@Param("employeeId") int employeeId);


}
