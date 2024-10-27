package backend.controller;


import backend.config.exception.RankingGroupException;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.RankingDecision;
import backend.model.entity.RankingGroup;
import backend.model.form.RankingGroup.AddNewGroup;
import backend.service.IRankingDecisionService;
import backend.service.IRankingGroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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

//    // Covert data RankingGroup -> RankingGroupResponse
//    public RankingGroupResponse convertToDTO(RankingGroup group, String decisionName) {
//        RankingGroupResponse dto = new RankingGroupResponse();
//        dto.setGroupId(group.getGroupId());
//        dto.setGroupName(group.getGroupName());
//        dto.setNumEmployees(group.getNumEmployees());
//        dto.setCurrentRankingDecision(decisionName);  // Gán giá trị quyết định xếp hạng
//        return dto;
//    }

    @GetMapping
    public List<RankingGroupResponse> getAllRankingGroups() {
        List<RankingGroup> rankingGroups = iRankingGroupService.getAllRankingGroups();
        return iRankingGroupService.getAllRankingGroupResponses(rankingGroups);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<RankingGroupResponse> findRankingGroupById(@PathVariable int id) {
        RankingGroup rankingGroup = iRankingGroupService.findRankingGroupById(id);
        if (rankingGroup == null) {
            // Tự động đi vào CatchException (RankingGroupException handler)
            throw new RankingGroupException("Ranking group not found");
        }
        RankingGroupResponse response = iRankingGroupService.getRankingGroupResponseById(rankingGroup);
        return ResponseEntity.ok(response);
    }


//    @PostMapping("/add")
//    public ResponseEntity<RankingGroup> addRankingGroup(@RequestBody RankingGroup rankingGroup) {
//        rankingGroup.setGroupId(0);
//        RankingGroup result = iRankingGroupService.addRankingGroup(rankingGroup);
//
//        if (result != null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(result);
//        } else {
//            throw new RankingGroupException("Unable to add ranking group"); // Exception will be caught in CatchException
//        }
//    }

    @PostMapping("/add")
    public String addRankingGroup(@RequestBody @Valid AddNewGroup form) {
        iRankingGroupService.createRankingGroup(form);
        return "create successfully!";
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
    public ResponseEntity<String> deleteRankingGroup(@PathVariable int id) {
        RankingGroup exists = iRankingGroupService.findRankingGroupById(id);
        if (exists == null) {
            throw new RankingGroupException("Ranking group not found for deletion");
        }
        RankingDecision checkNullGroupId = iRankingDecisionService.findByGroupId(id);
        if (checkNullGroupId != null) {
            iRankingDecisionService.updateRankingDecisionGroupIdToNull(id);
        }
        if("Trainer".equals(exists.getGroupName())){
            throw new RankingGroupException("Cannot delete the group name \"Trainer.\"");
        }
        iRankingGroupService.deleteRankingGroup(id);
        return ResponseEntity.ok("deleted successfully "+id);

    }
}
