package backend.controller;



import backend.model.dto.RankingGroupDTO;
import backend.security.exception.RankingGroupException;

import backend.service.IRankingGroupDTOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/ranking-group")
public class RankingGroupDTOController {
    private IRankingGroupDTOService iRankingGroupDTOService;

    @Autowired
    public RankingGroupDTOController(IRankingGroupDTOService iRankingGroupDTOService) {
        this.iRankingGroupDTOService = iRankingGroupDTOService;
    }


    @GetMapping
    public List<RankingGroupDTO> getAllRankingGroups() {
        return iRankingGroupDTOService.getAllRankingGroups();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<RankingGroupDTO> findRankingGroupById(@PathVariable int id) {
        RankingGroupDTO rankingGroup = iRankingGroupDTOService.findRankingGroupById(id);
        if (rankingGroup == null) {
            throw new RankingGroupException("Ranking group not found");
        } else {
            return ResponseEntity.ok(rankingGroup);
        }
    }




    @PostMapping("/add")
    public ResponseEntity<RankingGroupDTO> addRankingGroup(@RequestBody RankingGroupDTO rankingGroup) {
        rankingGroup.setGroupId(0);
        RankingGroupDTO result = iRankingGroupDTOService.addRankingGroup(rankingGroup);

        if (result != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RankingGroupDTO> updateRankingGroup(@RequestBody RankingGroupDTO rankingGroup, @PathVariable int id) {
        RankingGroupDTO exits = iRankingGroupDTOService.findRankingGroupById(id);
        if (exits != null) {
            exits.setGroupId(rankingGroup.getGroupId());
            exits.setGroupName(rankingGroup.getGroupName());
            exits.setNumEmployees(rankingGroup.getNumEmployees());
            exits.setCurrrentRankingDecision(rankingGroup.getCurrrentRankingDecision());
            iRankingGroupDTOService.updateRankingGroup(rankingGroup);
            return ResponseEntity.ok(exits);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRankingGroup(@PathVariable int id) {
        RankingGroupDTO exits = iRankingGroupDTOService.findRankingGroupById(id);
        if (exits != null) {
            iRankingGroupDTOService.deleteRankingGroup(exits);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }


}