package backend.controller;

import backend.model.entity.RankingDecision;
import backend.service.IRankingDecisionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ranking-decision")
public class RankingDecisionController {
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingDecisionController(IRankingDecisionService iRankingDecisionService) {
        this.iRankingDecisionService = iRankingDecisionService;
    }

    @GetMapping
    public ResponseEntity<List<RankingDecision>> getRankingDecisions() {
        List<RankingDecision> rankingDecisions = iRankingDecisionService.getRankingDecisions();
        return ResponseEntity.ok().body(rankingDecisions);
    }

    @GetMapping("/get/{groupId}")
    public ResponseEntity<RankingDecision> findByGroupId(@PathVariable int groupId) {
        RankingDecision decision = iRankingDecisionService.findByGroupId(groupId);
        return ResponseEntity.ok().body(decision);
    }

    @PutMapping("/update/{groupId}")
    public ResponseEntity<Void> clearGroupId(@PathVariable int groupId) {
        iRankingDecisionService.updateRankingDecisionGroupIdToNull(groupId);
        return ResponseEntity.noContent().build();
    }

}
