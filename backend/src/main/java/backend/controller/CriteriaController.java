package backend.controller;

import backend.model.entity.Criteria;
import backend.service.ICriteriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public ResponseEntity<Criteria> getCriteriaById(@PathVariable("id") int criteriaId) {
        Criteria criteria = criteriaService.getCriteriabyId(criteriaId);
        return new ResponseEntity<>(criteria, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Criteria> addCriteria(@RequestBody Criteria criteria) {
        Criteria createdCriteria = criteriaService.addCriteria(criteria);
        return new ResponseEntity<>(createdCriteria, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Criteria> updateCriteria(@PathVariable("id") int criteriaId, @RequestBody Criteria criteria) {
        criteria.setCriteriaId(criteriaId); // Ensure the ID is set for the update
        Criteria updatedCriteria = criteriaService.updateCriteria(criteria);
        return new ResponseEntity<>(updatedCriteria, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCriteria(@PathVariable("id") int criteriaId) {
        criteriaService.deleteCriteria(criteriaId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
