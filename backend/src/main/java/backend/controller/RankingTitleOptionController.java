package backend.controller;

import backend.model.entity.RankingTitleOption;
import backend.model.form.RankingTitleOption.AddRankingTitleOptionRequest;
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

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateRankingTitleOption(RankingTitleOption rankingTitleOption, Integer id) {
        RankingTitleOption find = iRankingTitleOptionService.findRankingTitleOptionById(id);
        iRankingTitleOptionService.updateRankingTitleOption(find);
        return ResponseEntity.status(HttpStatus.CREATED).body("Ranking Title Option updated");
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRankingTitleOption(@PathVariable Integer id) {
        iRankingTitleOptionService.deleteRankingTitleOption(id);
        return ResponseEntity.status(HttpStatus.OK).body("Ranking Title Option deleted");
    }
}
