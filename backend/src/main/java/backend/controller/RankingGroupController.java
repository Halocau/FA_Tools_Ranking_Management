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
    @PostMapping
    public ResponseEntity<RankingGroup> addRankingGroup(@RequestBody RankingGroup rankingGroup) {
        rankingGroup.setGroupId(0);
        RankingGroup result = iRankingGroupService.addRankingGroup(rankingGroup);

        if (result != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }




}