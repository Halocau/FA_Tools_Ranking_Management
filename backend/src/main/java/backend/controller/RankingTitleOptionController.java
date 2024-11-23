package backend.controller;

import backend.model.dto.TitleConfiguration.OptionDTO;
import backend.model.dto.TitleConfiguration.TitleOptionDTO;
import backend.model.entity.Options;
import backend.model.entity.RankingTitle;
import backend.model.entity.RankingTitleOption;
import backend.model.form.RankingTitleOption.AddRankingTitleOptionRequest;
import backend.model.form.RankingTitleOption.UpdateRankingTitleOptionRequest;
import backend.service.IRankingTitleOptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/ranking-title-option")
public class RankingTitleOptionController {
    private IRankingTitleOptionService iRankingTitleOptionService;

    @Autowired
    public RankingTitleOptionController(IRankingTitleOptionService iRankingTitleOptionService) {
        this.iRankingTitleOptionService = iRankingTitleOptionService;
    }

    @GetMapping
    public ResponseEntity<List<RankingTitleOption>> getAllRankingTitleOptions() {
        List<RankingTitleOption> getAll = iRankingTitleOptionService.getRankingTitleOptions();
        return new ResponseEntity<>(getAll, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addRankingTitleOption(@Valid @RequestBody AddRankingTitleOptionRequest form) {
        iRankingTitleOptionService.createRankingTitleOption(form);
        return ResponseEntity.status(HttpStatus.CREATED).body("Ranking Title Option added");
    }

    @GetMapping("/get-decisionId/{id}")
    public ResponseEntity<List<TitleOptionDTO>> getRankingTitleOptionByDecisionId(@PathVariable int id) {
        List<TitleOptionDTO> listDecisionId = iRankingTitleOptionService
                .getRankingTitleOptionByDecisionId(id);
        return ResponseEntity.status(HttpStatus.OK).body(listDecisionId);
    }

    // @PutMapping("/upsert/{rankingTitleId}/{optionId}")
    // public ResponseEntity<String> updateRankingTitleOption(
    // @Valid @RequestBody UpdateRankingTitleOptionRequest form,
    // @PathVariable(name = "rankingTitleId") Integer rankingTitleId,
    // @PathVariable(name = "optionId") Integer optionId
    // ) {
    // iRankingTitleOptionService.updateRankingTitleOption(form,rankingTitleId,optionId);
    // return ResponseEntity.ok("Ranking Title Option updated successfully");
    // }

    @DeleteMapping("/delete/{rankingTitleId}/{optionId}")
    public ResponseEntity<String> deleteRankingTitleOption(
            @PathVariable(name = "rankingTitleId") Integer rankingTitleId,
            @PathVariable(name = "optionId") Integer optionId) {
        RankingTitleOption find = iRankingTitleOptionService.findByRankingTitleIdAndOptionId(rankingTitleId, optionId);
        if (find == null) {
            return new ResponseEntity<>("Ranking Title Option not found", HttpStatus.NOT_FOUND);
        }
        iRankingTitleOptionService.deleteRankingTitleOption(rankingTitleId, optionId);
        return ResponseEntity.status(HttpStatus.OK).body("Ranking Title Option deleted");
    }
}
