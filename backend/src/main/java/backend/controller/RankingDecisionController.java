package backend.controller;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.service.IRankingDecisionService;
<<<<<<< HEAD

import java.util.List;

=======
import jakarta.validation.Valid;
>>>>>>> quatbt
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
<<<<<<< HEAD
@RequestMapping("/api/ranking-decision")
=======
@RequestMapping("api/ranking-decision")
>>>>>>> quatbt
public class RankingDecisionController {
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingDecisionController(IRankingDecisionService iRankingDecisionService) {
        this.iRankingDecisionService = iRankingDecisionService;
    }

<<<<<<< HEAD
    @GetMapping
    public ResponseEntity<List<RankingDecision>> getRankingDecisions() {
        List<RankingDecision> rankingDecisions = iRankingDecisionService.getRankingDecisions();
        return ResponseEntity.ok().body(rankingDecisions);
    }

    @GetMapping("/get/{groupId}")
=======
    @GetMapping("/groupid/{groupId}")
>>>>>>> quatbt
    public ResponseEntity<RankingDecision> findByGroupId(@PathVariable int groupId) {
        RankingDecision decision = iRankingDecisionService.findByGroupId(groupId);
        return ResponseEntity.ok().body(decision);
    }

<<<<<<< HEAD
    @PutMapping("/update/{groupId}")
=======
    @PutMapping("/putid/{groupId}")
>>>>>>> quatbt
    public ResponseEntity<Void> clearGroupId(@PathVariable int groupId) {
        iRankingDecisionService.updateRankingDecisionGroupIdToNull(groupId);
        return ResponseEntity.noContent().build();
    }

<<<<<<< HEAD
=======
    @GetMapping
    public List<RankingDecisionResponse> getRankingDecisionList() {
        List<RankingDecision> decisionList = iRankingDecisionService.getRankingDecisions();
        return iRankingDecisionService.getRankingDecisionResponses(decisionList);
    }
    @PostMapping("/add")
    public String addRankingDecision(@RequestBody @Valid CreateRankingDecision form) {
        iRankingDecisionService.createRankingDecision(form);
        return "Ranking Decision Added Successfully";
    }

>>>>>>> quatbt
}
