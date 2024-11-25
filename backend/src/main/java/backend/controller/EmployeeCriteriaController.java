package backend.controller;

import backend.model.dto.EmployeeCriteriaResponse;
import backend.model.entity.EmployeeCriteria;
import backend.model.form.EmployeeCriteria.UpsertEmployeeCriteriaRequest;
import backend.service.IEmployeeCriteriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/employee-criteria")
public class EmployeeCriteriaController {
    private IEmployeeCriteriaService iEmployeeCriteriaService;

    @Autowired
    public EmployeeCriteriaController(IEmployeeCriteriaService iEmployeeCriteriaService) {
        this.iEmployeeCriteriaService = iEmployeeCriteriaService;
    }

    @GetMapping
    public List<EmployeeCriteriaResponse> employeeCriteriaList() {
        List<EmployeeCriteria> list = iEmployeeCriteriaService.getEmployeeCriteria();
        List<EmployeeCriteriaResponse> responseList = iEmployeeCriteriaService.getEmployeeCriteriaResponse(list);
        return responseList;
    }

    @PutMapping("/upsert")
    public ResponseEntity<String> upsertEmployeeCriteria(@Valid @RequestBody UpsertEmployeeCriteriaRequest form) {
        EmployeeCriteria findEmployeeCriteria = iEmployeeCriteriaService.findByEmployeeIdAndCriteriaId(form.getEmployeeId(), form.getCriteriaId());
        if (findEmployeeCriteria == null) {
            throw new RuntimeException("Employee criteria already exists");
        }
        iEmployeeCriteriaService.upsertEmployeeCriteria(form, form.getEmployeeId(), form.getCriteriaId());
        return ResponseEntity.ok("Employee criteria updated sucessfully");
    }

    @PutMapping("/upsert-list")
    public ResponseEntity<String> upsertEmployeeCriteriaList(@Valid @RequestBody List<UpsertEmployeeCriteriaRequest> forms) {
        iEmployeeCriteriaService.upsertEmployeeCriteriaList(forms);
        return ResponseEntity.ok("Employee criteria list updated sucessfully");
    }
}
