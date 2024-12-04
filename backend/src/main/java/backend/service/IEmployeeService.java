package backend.service;

import backend.model.dto.EmployeeResponse;
import backend.model.entity.Employee;
import backend.model.entity.RankingGroup;
import backend.model.form.Employee.UpsertEmployeeRequest;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

public interface IEmployeeService {
    public List<Employee> getAllEmployee(Specification<Employee> spec);
    Optional<Employee> findById(Integer id);
    public void deleteEmployee(Integer id);
    //response
    public List<EmployeeResponse> getAllEmployeeResponses(List<Employee> allEmployees);
    public EmployeeResponse findEmployeeResponseById(Employee employee);
    //form
    public void upsertEmployee(UpsertEmployeeRequest form, Integer employeeId);
    public void upsertEmployeeList(List<UpsertEmployeeRequest> forms);
}
