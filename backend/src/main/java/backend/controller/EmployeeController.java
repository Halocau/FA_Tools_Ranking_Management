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
    public ResponseEntity<List<EmployeeResponse>> getEmployeeResponse(
            @Filter Specification<Employee> spec) {
        // get object pagination
        List<Employee> allEmployee = iEmployeeService.getAllEmployee(spec);
        List<EmployeeResponse> getEmployeeResponse = iEmployeeService.getAllEmployeeResponses(allEmployee);
        return new ResponseEntity<>(getEmployeeResponse, HttpStatus.OK);
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
