package backend.controller;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.service.IRankingDecisionService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking-decision")
public class RankingDecisionController {
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingDecisionController(IRankingDecisionService iRankingDecisionService) {
        this.iRankingDecisionService = iRankingDecisionService;
    }

    @GetMapping
    public List<RankingDecisionResponse> getRankingDecisionList() {
        List<RankingDecision> decisionList = iRankingDecisionService.getRankingDecisions();
        return iRankingDecisionService.getRankingDecisionResponses(decisionList);
    }

    @GetMapping("/groupid/{groupId}")
    public ResponseEntity<RankingDecision> findByGroupId(@PathVariable int groupId) {
        RankingDecision decision = iRankingDecisionService.findByGroupId(groupId);
        return ResponseEntity.ok().body(decision);
    }

    @PutMapping("/putid/{groupId}")
    public ResponseEntity<Void> clearGroupId(@PathVariable int groupId) {
        iRankingDecisionService.updateRankingDecisionGroupIdToNull(groupId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add")
    public String addRankingDecision(@RequestBody @Valid CreateRankingDecision form) {
        iRankingDecisionService.createRankingDecision(form);
        return "Ranking Decision Added Successfully";
    }
}
