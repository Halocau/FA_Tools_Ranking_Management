package backend.controller;

import backend.model.dto.RankingGroupDTO;
import backend.security.exception.RankingGroupException;
import backend.service.IRankingDecisionService;
import backend.service.IRankingGroupDTOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/ranking-group")
public class RankingGroupController {

    private IRankingGroupDTOService iRankingGroupDTOService;
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingGroupController(IRankingGroupDTOService iRankingGroupDTOService, IRankingDecisionService iRankingDecisionService) {
        this.iRankingGroupDTOService = iRankingGroupDTOService;
        this.iRankingDecisionService = iRankingDecisionService;
    }

    @GetMapping
    public List<RankingGroupDTO> getAllRankingGroups() {
        return iRankingGroupDTOService.getAllRankingGroups();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<RankingGroupDTO> findRankingGroupById(@PathVariable int id) {
        RankingGroupDTO rankingGroup = iRankingGroupDTOService.findRankingGroupById(id);
        if (rankingGroup == null) {
            // Tự động đi vào CatchException (RankingGroupException handler)
            throw new RankingGroupException("Ranking group not found");
        }
        return ResponseEntity.ok(rankingGroup);
    }

    @PostMapping("/add")
    public ResponseEntity<RankingGroupDTO> addRankingGroup(@RequestBody RankingGroupDTO rankingGroup) {
        rankingGroup.setGroupId(0);
        RankingGroupDTO result = iRankingGroupDTOService.addRankingGroup(rankingGroup);

        if (result != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else {
            throw new RankingGroupException("Unable to add ranking group"); // Exception will be caught in CatchException
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RankingGroupDTO> updateRankingGroup(@RequestBody RankingGroupDTO rankingGroup, @PathVariable int id) {
        RankingGroupDTO exists = iRankingGroupDTOService.findRankingGroupById(id);
        if (exists == null) {
            throw new RankingGroupException("Ranking group not found for update");
        }

        exists.setGroupId(rankingGroup.getGroupId());
        exists.setGroupName(rankingGroup.getGroupName());
        exists.setNumEmployees(rankingGroup.getNumEmployees());
        exists.setCurrrentRankingDecision(rankingGroup.getCurrrentRankingDecision());
        iRankingGroupDTOService.updateRankingGroup(exists);
        return ResponseEntity.ok(exists);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRankingGroup(@PathVariable int id) {
        RankingGroupDTO exists = iRankingGroupDTOService.findRankingGroupById(id);
        if (exists == null) {
            throw new RankingGroupException("Ranking group not found for deletion");
        }
        iRankingDecisionService.updateRankingDecisionGroupIdToNull(id);
        iRankingGroupDTOService.deleteRankingGroup(exists);
        return ResponseEntity.ok().build();
    }
}
