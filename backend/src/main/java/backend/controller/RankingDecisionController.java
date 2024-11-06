package backend.controller;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;
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
    @GetMapping("/get/{id}")
    public  RankingDecisionResponse findRankingDecisionResponse(@PathVariable int id){
        return iRankingDecisionService.findRankingDecisionResponseById(id);
    }

    @PostMapping("/add")
    public String addRankingDecision(@RequestBody @Valid CreateRankingDecision form) {
        iRankingDecisionService.createRankingDecision(form);
        String s = form.toString();
        return s;
    }
    @PutMapping("/update/{id}")
    public String updateRankingDecision(@RequestBody @Valid UpdateRankingDecision form, @PathVariable(name = "id") int decisionId) {
        iRankingDecisionService.updateRankingDecision(form,decisionId);
        return "Ranking Decision update Successfully";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRankingDecision(@PathVariable int id) {
        iRankingDecisionService.deleteRankingDecision(id);
        return ResponseEntity.noContent().build();
    }
}
