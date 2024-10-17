package backend.controller;

import backend.model.RankingGroup;
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

    @Autowired
    public RankingGroupController(IRankingGroupService iRankingGroupService) {
        this.iRankingGroupService = iRankingGroupService;
    }

    @GetMapping
    public List<RankingGroup> getAllRankingGroups() {
        return iRankingGroupService.getAllRankingGroups();
    }

    @GetMapping("/get/{id}")
    public RankingGroup findRankingGroupById(@PathVariable int id) {
        return iRankingGroupService.findRankingGroupById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<RankingGroup> addRankingGroup(@RequestBody RankingGroup rankingGroup) {
        rankingGroup.setGroupId(0);
        RankingGroup result = iRankingGroupService.addRankingGroup(rankingGroup);

        if (result != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RankingGroup> updateRankingGroup(@RequestBody RankingGroup rankingGroup, @PathVariable int id) {
        RankingGroup exits = iRankingGroupService.findRankingGroupById(id);
        if (exits != null) {
            exits.setGroupName(rankingGroup.getGroupName());
            exits.setNumEmployees(rankingGroup.getNumEmployees());
            exits.setCurrent_ranking_decision(rankingGroup.getCurrent_ranking_decision());
            exits.setCreatedBy(rankingGroup.getCreatedBy());
            exits.setCreatedAt(rankingGroup.getCreatedAt());
            exits.setUpdatedAt(exits.getCreatedAt());
            iRankingGroupService.updateRankingGroup(rankingGroup);
            return ResponseEntity.ok(exits);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRankingGroup(@PathVariable int id) {
        RankingGroup exits = iRankingGroupService.findRankingGroupById(id);
        if (exits != null) {
            iRankingGroupService.deleteRankingGroup(exits);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }


}