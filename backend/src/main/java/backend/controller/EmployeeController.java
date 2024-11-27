package backend.controller;

import backend.model.dto.EmployeeResponse;
import backend.model.entity.Employee;
import backend.model.page.ResultPaginationDTO;
import backend.service.IEmployeeService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/employee")
public class EmployeeController {
    private IEmployeeService iEmployeeService;

    @Autowired
    public EmployeeController(IEmployeeService iEmployeeService) {
        this.iEmployeeService = iEmployeeService;
    }

    @GetMapping
    public ResponseEntity<ResultPaginationDTO> getEmployeeResponse(
            @Filter Specification<Employee> spec,
            Pageable pageable
    ) {
        //get object pagination
        ResultPaginationDTO allEmployee = iEmployeeService.getAllEmployee(spec, pageable);

        List<Employee> getEmployee = (List<Employee>) allEmployee.getResult();

        List<EmployeeResponse> getEmployeeResponse = iEmployeeService.getAllEmployeeResponses(getEmployee);
        allEmployee.setResult(getEmployeeResponse);

        return new ResponseEntity<>(allEmployee, HttpStatus.OK);
    }
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<EmployeeResponse>> getEmployeeGroupId(@PathVariable Integer groupId) {
        List<Employee> getByGroupId = iEmployeeService.findByGroupId(groupId);
        List<EmployeeResponse> getEmployeeResponse = iEmployeeService.getAllEmployeeResponses(getByGroupId);
        return new ResponseEntity<>(getEmployeeResponse, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Integer id) {
        iEmployeeService.deleteEmployee(id);
        return new ResponseEntity<>("Employee deleted successfully", HttpStatus.OK);
    }
}
