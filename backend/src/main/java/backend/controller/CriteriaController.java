package backend.controller;

import backend.model.entity.Criteria;
import backend.model.form.Criteria.AddCriteriaRequest;
import backend.model.form.Criteria.UpdateCriteriaRequest;
import backend.service.ICriteriaService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/criteria")
public class CriteriaController {

    private final ICriteriaService criteriaService;

    @Autowired
    public CriteriaController(ICriteriaService criteriaService) {
        this.criteriaService = criteriaService;
    }

    @GetMapping
    public ResponseEntity<List<Criteria>> getAllCriteria() {
        List<Criteria> criteriaList = criteriaService.getAllCriteria();
        return new ResponseEntity<>(criteriaList, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Criteria> getCriteriaById(@PathVariable("id") int criteriaId) {
        Criteria criteria = criteriaService.getCriteriabyId(criteriaId);
        return new ResponseEntity<>(criteria, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Criteria> createCriteria(@Valid @RequestBody AddCriteriaRequest request) {
        Criteria createdCriteria = criteriaService.createCriteria(request);
        return new ResponseEntity<>(createdCriteria, HttpStatus.CREATED);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Criteria> updateCriteria(
            @PathVariable int id,
            @Valid @RequestBody UpdateCriteriaRequest request) {

        Optional<Criteria> updatedCriteria = criteriaService.updateCriteria(id, request);
        return updatedCriteria
                .map(criteria -> new ResponseEntity<>(criteria, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteCriteria(@PathVariable("id") int criteriaId) {
        criteriaService.deleteCriteria(criteriaId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
