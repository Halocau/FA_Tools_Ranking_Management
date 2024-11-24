package backend.controller;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;
import backend.model.page.ResultPaginationDTO;
import backend.service.IRankingDecisionService;

import com.turkraft.springfilter.boot.Filter;
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
        ResultPaginationDTO paginationDTO = iRankingDecisionService.getRankingDecisions(spec,pageable);

        List<RankingDecision> rankingDecisions = (List<RankingDecision>) paginationDTO.getResult();
        List<RankingDecisionResponse> rankingDecisionResponses = iRankingDecisionService.getRankingDecisionResponses(rankingDecisions);

        paginationDTO.setResult(rankingDecisionResponses);
        return ResponseEntity.status(HttpStatus.OK).body(paginationDTO);
    }
    @GetMapping("/all")
    public  ResponseEntity<List<RankingDecisionResponse>> findRankingDecisionResponse(){
        List<RankingDecision> all = iRankingDecisionService.allRankingDecisions();
        List<RankingDecisionResponse> rankingDecisionResponses = iRankingDecisionService.getRankingDecisionResponses(all);
        return ResponseEntity.status(HttpStatus.OK).body(rankingDecisionResponses);
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
