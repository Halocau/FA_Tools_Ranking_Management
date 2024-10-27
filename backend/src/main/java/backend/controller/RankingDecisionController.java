package backend.controller;

import backend.model.entity.RankingDecision;
import backend.service.IRankingDecisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class RankingDecisionController {
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingDecisionController(IRankingDecisionService iRankingDecisionService) {
        this.iRankingDecisionService = iRankingDecisionService;
    }

    @GetMapping("/check/{groupId}")
    public ResponseEntity<RankingDecision> findByGroupId(@PathVariable int groupId) {
        RankingDecision decision = iRankingDecisionService.findByGroupId(groupId);
        return ResponseEntity.ok().body(decision);
    }
    @PutMapping("/putid/{groupId}")
    public ResponseEntity<Void> clearGroupId(@PathVariable int groupId) {
        iRankingDecisionService.updateRankingDecisionGroupIdToNull(groupId);
        return ResponseEntity.noContent().build();
    }


}
