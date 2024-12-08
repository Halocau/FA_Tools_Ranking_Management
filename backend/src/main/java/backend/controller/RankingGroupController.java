package backend.controller;

import backend.config.exception.exceptionEntity.RankingGroupException;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.RankingGroup;
import backend.model.form.RankingGroup.AddNewGroupRequest;
import backend.model.form.RankingGroup.UpdateNewGroupRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.IRankingDecisionService;
import backend.service.IRankingGroupService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/ranking-group")
public class RankingGroupController {

    private IRankingGroupService iRankingGroupService;

    @Autowired
    public RankingGroupController(IRankingGroupService iRankingGroupService) {
        this.iRankingGroupService = iRankingGroupService;
    }

    @GetMapping
    public ResponseEntity<ResultPaginationDTO> getAllRankingGroups(
            @Filter Specification<RankingGroup> spec,
            Pageable pageable
    ) {
        ResultPaginationDTO paginationDTO = iRankingGroupService.getAllRankingGroups(spec, pageable);

        List<RankingGroup> rankingGroups = (List<RankingGroup>) paginationDTO.getResult();
        List<RankingGroupResponse> rankingGroupResponses = iRankingGroupService.getAllRankingGroupResponses(rankingGroups);

        paginationDTO.setResult(rankingGroupResponses);
        return ResponseEntity.status(HttpStatus.OK).body(paginationDTO);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<RankingGroupResponse> findRankingGroupById(@PathVariable int id) {
        RankingGroup rankingGroup = iRankingGroupService.findRankingGroupById(id);
        if (rankingGroup == null) {
            // Tự động đi vào CatchException (RankingGroupException handler)
            throw new RankingGroupException("Ranking group not found");
        }
        // RG convert Response
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
