package backend.controller;

import backend.model.dto.DecisionTasksResponse;
import backend.service.IDecisionTasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/decision-task")
public class DecisionTasksController {
    private IDecisionTasksService iDecisionTasksService;

    @Autowired
    public DecisionTasksController(IDecisionTasksService iDecisionTasksService) {
        this.iDecisionTasksService = iDecisionTasksService;
    }

    @GetMapping("/{decisionId}")
    public ResponseEntity<List<DecisionTasksResponse>> getDecisionTasks(@PathVariable Integer decisionId) {
        List<DecisionTasksResponse> response = iDecisionTasksService.getDecisionTasksByDecisionId(decisionId);
        return ResponseEntity.ok(response);
    }

}
