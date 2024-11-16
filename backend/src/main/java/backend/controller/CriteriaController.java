package backend.controller;

import backend.model.dto.CriteriaResponse;
import backend.model.dto.DecisionCriteriaResponse;
import backend.model.entity.Criteria;
import backend.model.entity.DecisionCriteria;
import backend.model.form.Criteria.AddCriteriaRequest;
import backend.model.form.Criteria.UpdateCriteriaRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.ICriteriaService;
import backend.service.IDecisionCriteriaService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.turkraft.springfilter.boot.Filter;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/criteria")
public class CriteriaController {

    private final ICriteriaService criteriaService;
    private IDecisionCriteriaService idDecisionCriteriaService;

    @Autowired
    public CriteriaController(ICriteriaService criteriaService, IDecisionCriteriaService idDecisionCriteriaService) {
        this.criteriaService = criteriaService;
        this.idDecisionCriteriaService = idDecisionCriteriaService;
    }

    @GetMapping
    public ResponseEntity<ResultPaginationDTO> searchCriteria(
            @Filter Specification<Criteria> spec,
            Pageable pageable) {
        ResultPaginationDTO criteriaList = criteriaService.getAllCriteria(spec, pageable);
        // List<CriteriaResponse> criteriaResponses =
        // criteriaService.convertToCriteriaResponseList(criteriaList);
        return new ResponseEntity<>(criteriaList, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<CriteriaResponse> getCriteriaById(@PathVariable("id") int criteriaId) {
        Criteria criteria = criteriaService.getCriteriabyId(criteriaId);
        return new ResponseEntity<>(criteriaService.convertToCriteriaResponse(criteria), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<CriteriaResponse> createCriteria(@Valid @RequestBody AddCriteriaRequest request) {
        Criteria createdCriteria = criteriaService.createCriteria(request);
        return new ResponseEntity<>(criteriaService.convertToCriteriaResponse(createdCriteria), HttpStatus.CREATED);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<CriteriaResponse> updateCriteria(
            @PathVariable int id,
            @Valid @RequestBody UpdateCriteriaRequest request) {

        Optional<Criteria> updatedCriteria = criteriaService.updateCriteria(id, request);
        return updatedCriteria
                .map(criteria -> new ResponseEntity<>(criteriaService.convertToCriteriaResponse(criteria),
                        HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteCriteria(@PathVariable("id") int criteriaId) {
        criteriaService.deleteCriteria(criteriaId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
