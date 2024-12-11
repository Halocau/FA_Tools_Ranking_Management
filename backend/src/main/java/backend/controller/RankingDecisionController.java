package backend.controller;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.AddCloneRankingDecisionRequest;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;
import backend.model.form.RankingDecision.UpdateStatusRankingDecisionRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.IRankingDecisionService;

import com.turkraft.springfilter.boot.Filter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    public ResponseEntity<ResultPaginationDTO> getRankingDecisionList(
            @Filter Specification<RankingDecision> spec,
            Pageable pageable
    ) {
        ResultPaginationDTO paginationDTO = iRankingDecisionService.getRankingDecisions(spec, pageable);

        List<RankingDecision> rankingDecisions = (List<RankingDecision>) paginationDTO.getResult();
        List<RankingDecisionResponse> rankingDecisionResponses = iRankingDecisionService.getRankingDecisionResponses(rankingDecisions);

        paginationDTO.setResult(rankingDecisionResponses);
        return ResponseEntity.status(HttpStatus.OK).body(paginationDTO);
    }

    @GetMapping("/get/{id}")
    public RankingDecisionResponse findRankingDecisionResponse(@PathVariable int id) {
        return iRankingDecisionService.findRankingDecisionResponseById(id);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RankingDecisionResponse>> findRankingDecisionResponse() {
        List<RankingDecision> all = iRankingDecisionService.allRankingDecisions();
        List<RankingDecisionResponse> rankingDecisionResponses = iRankingDecisionService.getRankingDecisionResponses(all);
        return ResponseEntity.status(HttpStatus.OK).body(rankingDecisionResponses);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addRankingDecision(@RequestBody @Valid CreateRankingDecision form) {
        try {
            RankingDecision cloneRankingDecision = iRankingDecisionService.createRankingDecision(form);
            return ResponseEntity.status(HttpStatus.OK).body(cloneRankingDecision.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/update/{id}")
    public String updateRankingDecision(@RequestBody @Valid UpdateRankingDecision form, @PathVariable(name = "id") int decisionId) {
        iRankingDecisionService.updateRankingDecision(form, decisionId);
        return "Ranking Decision update Successfully";
    }
    @PutMapping("/update-status")
    public ResponseEntity<?> updateStatusRankingDecision(@RequestBody @Valid UpdateStatusRankingDecisionRequest form) {
        try {
            iRankingDecisionService.updateStatus(form);
            return ResponseEntity.status(HttpStatus.OK).body(form);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRankingDecision(@PathVariable int id) {
        iRankingDecisionService.deleteRankingDecision(id);
        return ResponseEntity.noContent().build();
    }
}
