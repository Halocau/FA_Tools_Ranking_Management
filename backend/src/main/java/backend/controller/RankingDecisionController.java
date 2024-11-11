package backend.controller;

import backend.config.common.PaginationUtils;
import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;
import backend.service.IRankingDecisionService;

import jakarta.validation.Valid;

import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ranking-decision")
public class RankingDecisionController {
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingDecisionController(IRankingDecisionService iRankingDecisionService) {
        this.iRankingDecisionService = iRankingDecisionService;
    }

    @GetMapping
    public List<RankingDecisionResponse> getRankingDecisionList(
            @RequestParam(value = "page", defaultValue = "0") Optional<String> page,
            @RequestParam(value = "size", defaultValue = "5") Optional<String> limit) {
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        List<RankingDecision> decisionList = iRankingDecisionService.getRankingDecisions(pageable);
        return iRankingDecisionService.getRankingDecisionResponses(decisionList);
    }

    @GetMapping("/get/{id}")
    public RankingDecisionResponse findRankingDecisionResponse(@PathVariable int id) {
        return iRankingDecisionService.findRankingDecisionResponseById(id);
    }

    @PostMapping("/add")
    public String addRankingDecision(@RequestBody @Valid CreateRankingDecision form) {
        iRankingDecisionService.createRankingDecision(form);
        String s = form.toString();
        return s;
    }

    @PutMapping("/update/{id}")
    public String updateRankingDecision(@RequestBody @Valid UpdateRankingDecision form,
            @PathVariable(name = "id") int decisionId) {
        iRankingDecisionService.updateRankingDecision(form, decisionId);
        return "Ranking Decision update Successfully";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRankingDecision(@PathVariable int id) {
        iRankingDecisionService.deleteRankingDecision(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<RankingDecisionResponse> searchByDecisionName(
            @RequestParam(value = "name", defaultValue = "") String decisionName,
            @RequestParam(value = "page", defaultValue = "0") Optional<String> page,
            @RequestParam(value = "size", defaultValue = "5") Optional<String> limit) {
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        List<RankingDecision> decisionList = iRankingDecisionService.searchByDecisionName(decisionName, pageable);
        return iRankingDecisionService.getRankingDecisionResponses(decisionList);
    }
}
