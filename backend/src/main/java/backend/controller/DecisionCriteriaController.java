package backend.controller;

import backend.model.dto.DecisionCriteriaResponse;
import backend.model.entity.DecisionCriteria;
import backend.model.page.ResultPaginationDTO;
import backend.service.IDecisionCriteriaService;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/decision-criteria")
public class DecisionCriteriaController {
    private IDecisionCriteriaService iDecisionCriteriaService;

    @Autowired
    public DecisionCriteriaController(IDecisionCriteriaService iDecisionCriteriaService) {
        this.iDecisionCriteriaService = iDecisionCriteriaService;
    }

    @GetMapping("/get/{decisionId}")
    public List<DecisionCriteriaResponse> getAllDecisionCriteriaByDecisionId(@PathVariable(name = "decisionId") Integer decisionId) {
        List<DecisionCriteria> findDecisionId = iDecisionCriteriaService.findByDecisionIdList(decisionId);
        return iDecisionCriteriaService.getDecisionCriteriaResponse(findDecisionId);
    }

    @GetMapping("all")
    public ResponseEntity<ResultPaginationDTO> getDecisionCriteriaDecision(
            @Filter Specification<DecisionCriteria> spec,
            Pageable pageable
    ) {
        ResultPaginationDTO decisonCritaria = iDecisionCriteriaService.getAllDecisionCriteria(spec, pageable);
        List<DecisionCriteria> decisionCriteriaList = (List<DecisionCriteria>) decisonCritaria.getResult();
        List<DecisionCriteriaResponse> decisionCriteriaResponseList = iDecisionCriteriaService.getDecisionCriteriaResponse(decisionCriteriaList);
        decisonCritaria.setResult(decisionCriteriaResponseList);
        return ResponseEntity.status(HttpStatus.OK).body(decisonCritaria);
    }
}
