package backend.controller;

import backend.config.exception.RankingGroupException;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.RankingDecision;
import backend.model.entity.RankingGroup;
import backend.model.form.RankingGroup.AddNewGroupRequest;
import backend.model.form.RankingGroup.UpdateGroupInfo;
import backend.model.form.RankingGroup.UpdateNewGroupRequest;
import backend.service.IRankingDecisionService;
import backend.service.IRankingGroupService;
import jakarta.validation.Valid;
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
    public RankingGroupController(IRankingGroupService iRankingGroupService,
                                  IRankingDecisionService iRankingDecisionService) {
        this.iRankingGroupService = iRankingGroupService;
        this.iRankingDecisionService = iRankingDecisionService;
    }

    // // Covert data RankingGroup -> RankingGroupResponse
    // public RankingGroupResponse convertToDTO(RankingGroup group, String
    // decisionName) {
    // RankingGroupResponse dto = new RankingGroupResponse();
    // dto.setGroupId(group.getGroupId());
    // dto.setGroupName(group.getGroupName());
    // dto.setNumEmployees(group.getNumEmployees());
    // dto.setCurrentRankingDecision(decisionName); // Gán giá trị quyết định xếp
    // hạng
    // return dto;
    // }

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
        //RG convert Response
        RankingGroupResponse response = iRankingGroupService.getRankingGroupResponseById(rankingGroup);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public String addRankingGroup(@RequestBody @Valid AddNewGroupRequest form) {
        iRankingGroupService.createRankingGroup(form);
        return "create successfully!";
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateRankingGroup(@RequestBody @Valid UpdateNewGroupRequest form,
                                                     @PathVariable(name = "id") Integer groupId) {
        RankingGroup rankingGroup = iRankingGroupService.findRankingGroupById(groupId);
        if (rankingGroup == null) {
            throw new RankingGroupException("RankingGroup not found id: " + groupId);
        } else {
            iRankingGroupService.updateRankingGroup(groupId, form);
            return ResponseEntity.ok("update successfully!");
        }
    }


    @PutMapping("/update-group-info/{id}")
    public ResponseEntity<String> updateRankingGroup(@RequestBody @Valid UpdateGroupInfo form,
                                                     @PathVariable(name = "id") Integer groupId) {
        RankingGroup rankingGroup = iRankingGroupService.findRankingGroupById(groupId);
        if (rankingGroup == null) {
            throw new RankingGroupException("RankingGroup not found id: " + groupId);
        } else {
            iRankingGroupService.updateRankingGroupInfo(groupId, form);
            return ResponseEntity.ok("update group info successfully!");
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRankingGroup(@PathVariable int id) {
        RankingGroup exists = iRankingGroupService.findRankingGroupById(id);
        if (exists == null) {
            throw new RankingGroupException("Ranking group not found for deletion");
        }
        if ("Trainer".equals(exists.getGroupName())) {
            throw new RankingGroupException("Cannot delete the group name \"Trainer.\"");
        }
        iRankingGroupService.deleteRankingGroup(id);
        return ResponseEntity.ok("deleted successfully " + id);

    }
}
