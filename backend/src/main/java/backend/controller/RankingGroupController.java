package backend.controller;


import backend.config.exception.RankingGroupException;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.RankingDecision;
import backend.model.entity.RankingGroup;
import backend.service.IRankingDecisionService;
import backend.service.IRankingGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/ranking-group")
public class RankingGroupController {

    private IRankingGroupService iRankingGroupService;
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingGroupController(IRankingGroupService iRankingGroupService, IRankingDecisionService iRankingDecisionService) {
        this.iRankingGroupService = iRankingGroupService;
        this.iRankingDecisionService = iRankingDecisionService;
    }

    @GetMapping
    public List<RankingGroup> getAllRankingGroups() {
        return iRankingGroupService.getAllRankingGroups();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<RankingGroupResponse> findRankingGroupById(@PathVariable int id) {
        RankingGroupResponse rankingGroup = iRankingGroupService.findRankingGroupByResponseId(id);
        if (rankingGroup == null) {
            // Tự động đi vào CatchException (RankingGroupException handler)
            throw new RankingGroupException("Ranking group not found");
        }
        return ResponseEntity.ok(rankingGroup);
    }

//    @GetMapping("/get/{id}")
//    public ResponseEntity<RankingGroup> findRankingGroupById(@PathVariable int id) {
//        RankingGroup rankingGroup = iRankingGroupService.findRankingGroupById(id);
//        if (rankingGroup == null) {
//            // Tự động đi vào CatchException (RankingGroupException handler)
//            throw new RankingGroupException("Ranking group not found");
//        }
//        return ResponseEntity.ok(rankingGroup);
//    }

    @PostMapping("/add")
    public ResponseEntity<RankingGroup> addRankingGroup(@RequestBody RankingGroup rankingGroup) {
        rankingGroup.setGroupId(0);
        RankingGroup result = iRankingGroupService.addRankingGroup(rankingGroup);

        if (result != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else {
            throw new RankingGroupException("Unable to add ranking group"); // Exception will be caught in CatchException
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RankingGroup> updateRankingGroup(@RequestBody RankingGroup rankingGroup, @PathVariable int id) {
        RankingGroup exists = iRankingGroupService.findRankingGroupById(id);
        if (exists == null) {
            throw new RankingGroupException("Ranking group not found for update");
        }

        exists.setGroupId(rankingGroup.getGroupId());
        exists.setGroupName(rankingGroup.getGroupName());
        exists.setNumEmployees(rankingGroup.getNumEmployees());
        exists.setDecisionName(rankingGroup.getDecisionName());
        iRankingGroupService.updateRankingGroup(exists);
        return ResponseEntity.ok(exists);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRankingGroup(@PathVariable int id) {
        RankingGroup exists = iRankingGroupService.findRankingGroupById(id);
        if (exists == null) {
            throw new RankingGroupException("Ranking group not found for deletion");
        }
        RankingDecision checkNullGroupId = iRankingDecisionService.findByGroupId(id);
        if (checkNullGroupId != null) {
            iRankingDecisionService.updateRankingDecisionGroupIdToNull(id);
            iRankingGroupService.deleteRankingGroup(exists);
        } else {
            iRankingGroupService.deleteRankingGroup(exists);
        }

        return ResponseEntity.ok().build();
    }
}
