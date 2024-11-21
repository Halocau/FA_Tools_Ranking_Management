package backend.controller;

import backend.model.dto.DecisionCriteriaResponse;
import backend.model.dto.TitleConfiguration.DecisionCriteriaDTO;
import backend.model.entity.DecisionCriteria;
import backend.model.form.DecisionCriteria.AddDecisionCriteriaRequest;
import backend.model.form.DecisionCriteria.UpdateDecisionCriteriaRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.IDecisionCriteriaService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Path;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/decision-criteria")
public class DecisionCriteriaController {
    private IDecisionCriteriaService iDecisionCriteriaService;

    @Autowired
    public DecisionCriteriaController(IDecisionCriteriaService iDecisionCriteriaService) {
        this.iDecisionCriteriaService = iDecisionCriteriaService;
    }

    @GetMapping()
    public ResponseEntity<ResultPaginationDTO> getAllDecisionCriteriaDecision(
            @Filter Specification<DecisionCriteria> spec,
            Pageable pageable
    ) {
        ResultPaginationDTO decisonCritaria = iDecisionCriteriaService.getAllDecisionCriteria(spec, pageable);
        List<DecisionCriteria> decisionCriteriaList = (List<DecisionCriteria>) decisonCritaria.getResult();
        List<DecisionCriteriaResponse> decisionCriteriaResponseList = iDecisionCriteriaService.getDecisionCriteriaResponse(decisionCriteriaList);
        decisonCritaria.setResult(decisionCriteriaResponseList);
        return ResponseEntity.status(HttpStatus.OK).body(decisonCritaria);
    }

    @GetMapping("/get/{decisionId}")
    public ResponseEntity<ResultPaginationDTO> getDecisionCriteriaByDecisionId(
            @PathVariable(name = "decisionId") Integer decisionId,
            @Filter Specification<DecisionCriteria> spec,
            Pageable pageable
    ) {
        ResultPaginationDTO find = iDecisionCriteriaService.findByDecisionIdAndSpecification(decisionId, spec, pageable);
        List<DecisionCriteria> findDecisionCriteria = (List<DecisionCriteria>) find.getResult();
        List<DecisionCriteriaResponse> decisionCriteriaResponses = iDecisionCriteriaService.getDecisionCriteriaResponse(findDecisionCriteria);
        find.setResult(decisionCriteriaResponses);
        return ResponseEntity.status(HttpStatus.OK).body(find);
    }
    @GetMapping("/take/{decisionId}")
    public ResponseEntity<List<DecisionCriteriaDTO>> getDecisionCriteriaByDecisionConfigurationId(@PathVariable(name = "decisionId") Integer decisionId){
        List<DecisionCriteria> find = iDecisionCriteriaService.findByDecisionId(decisionId);
        List<DecisionCriteriaDTO> list = iDecisionCriteriaService.getDecisionCriteriaConfigurationResponse(find);
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }
    @PostMapping("/add")
    public ResponseEntity<String> addDecisionCriteria(@RequestBody @Valid AddDecisionCriteriaRequest form) {
        iDecisionCriteriaService.createDecisionCriteria(form);
        return ResponseEntity.ok("Decision criteria created successfully.");
    }

    @DeleteMapping("/delete/{decisionId}/{criteriaId}")
    public ResponseEntity<String> deleteDecisionCriteriaById(
            @PathVariable Integer decisionId,
            @PathVariable Integer criteriaId) {
        iDecisionCriteriaService.deleteDecisionCriteria(decisionId, criteriaId);
        return ResponseEntity.ok("Decision criteria deleted successfully.");
    }

    @PutMapping("/upsert/{decisionId}/{criteriaId}")
    public ResponseEntity<String> updateDecisionCriteria(
            @RequestBody @Valid UpdateDecisionCriteriaRequest form,
            @PathVariable Integer decisionId,
            @PathVariable Integer criteriaId
    ) {
        iDecisionCriteriaService.updateDecisionCriteria(form, decisionId, criteriaId);
        return ResponseEntity.ok("Decision criteria updated successfully.");
    }

}
