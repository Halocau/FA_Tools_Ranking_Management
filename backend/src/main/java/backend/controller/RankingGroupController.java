package backend.controller;

import backend.dao.IAccount;
import backend.exception.AccountException;
import backend.exception.RankingGruopException;
import backend.model.Account;
import backend.model.RankingGroup;
import backend.service.AccountService;
import backend.service.IAccountService;
import backend.service.IRankingGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/ranking-group")
public class RankingGroupController {
    private IRankingGroupService iRankingGroupService;
    private IAccountService iAccountService;

    @Autowired
    public RankingGroupController(IRankingGroupService iRankingGroupService, IAccountService iAccountService) {
        this.iRankingGroupService = iRankingGroupService;
        this.iAccountService = iAccountService;
    }

    @GetMapping
    public List<RankingGroup> getAllRankingGroups() {
        return iRankingGroupService.getAllRankingGroups();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<RankingGroup> findRankingGroupById(@PathVariable int id) {
        RankingGroup rankingGroup = iRankingGroupService.findRankingGroupById(id);
        if (rankingGroup == null) {
            throw new RankingGruopException("Ranking group not found");
        } else {
            return ResponseEntity.ok(rankingGroup);
        }
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