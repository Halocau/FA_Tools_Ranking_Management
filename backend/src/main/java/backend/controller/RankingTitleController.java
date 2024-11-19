package backend.controller;

import backend.model.dto.RankingTitleResponse;
import backend.model.entity.RankingTitle;
import backend.model.form.RankingTitle.AddRankingTitleRequest;
import backend.service.Implement.RankingTitleService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/ranking-title")
public class RankingTitleController {
    private RankingTitleService iRankingTitleService;

    @Autowired
    public RankingTitleController(RankingTitleService iRankingTitleService) {
        this.iRankingTitleService = iRankingTitleService;
    }

    @GetMapping
    public ResponseEntity<List<RankingTitleResponse>> allRankingTitle() {
        List<RankingTitle> rankingTitleList = iRankingTitleService.getRankingTitle();
        List<RankingTitleResponse> rankingTitleResponseList = iRankingTitleService.getRankingTittleResponse(rankingTitleList);
        return new ResponseEntity<>(rankingTitleResponseList, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<RankingTitleResponse> findRankingTitleById(@PathVariable int id) {
        RankingTitle rankingTitle = iRankingTitleService.findRankingTitleById(id);
        RankingTitleResponse rankingTitleResponse = iRankingTitleService.findRankingTitleResponse(rankingTitle);
        return new ResponseEntity<>(rankingTitleResponse, HttpStatus.OK);
    }


    @PostMapping("/add")
    public ResponseEntity<String> addRankingTitle(@Valid @RequestBody AddRankingTitleRequest form) {
        iRankingTitleService.createRankingTitleByForm(form);
        return ResponseEntity.ok("Successfully added Ranking Title");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRankingTitle(@PathVariable(name = "id") int id) {
        RankingTitle rankingTitle = iRankingTitleService.findRankingTitleById(id);
        iRankingTitleService.deleteRankingTitle(rankingTitle.getRankingTitleId());
        return ResponseEntity.ok("Successfully deleted Ranking Title");
    }

}
