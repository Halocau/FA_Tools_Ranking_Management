package backend.dao;

import backend.model.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IEmployeeRepository extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {
    Optional<Employee> findByEmployeeId(int employeeId);
    public List<Employee> findByGroupId(Integer groupId);
    @Query("SELECT MAX(e.employeeId) FROM Employee e")
    Integer findMaxId();

}
