package backend.backend.controller;

import backend.backend.model.RankingGroup;
import backend.backend.dao.RankingGroupRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking-group")
public class RankingGroupController {

    @Autowired
    private RankingGroupRepository rankingGroupRepository;

    // Get all Ranking Groups
    @GetMapping
    public List<RankingGroup> getAllRankingGroups() {
        return rankingGroupRepository.findAll();
    }

    // Get a Ranking Group by ID
    @GetMapping("/{id}")
    public ResponseEntity<RankingGroup> getRankingGroupById(@PathVariable int id) {
        return rankingGroupRepository.findById(id)
                .map(group -> ResponseEntity.ok().body(group))
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new Ranking Group
    @PostMapping
    public RankingGroup createRankingGroup(@RequestBody RankingGroup rankingGroup) {
        return rankingGroupRepository.save(rankingGroup);
    }

    // Update a Ranking Group
    @PutMapping("/{id}")
    public ResponseEntity<RankingGroup> updateRankingGroup(@PathVariable int id,
            @RequestBody RankingGroup updatedRankingGroup) {
        return rankingGroupRepository.findById(id)
                .map(existingGroup -> {
                    existingGroup.setGroupName(updatedRankingGroup.getGroupName());
                    existingGroup.setNumEmployees(updatedRankingGroup.getNumEmployees());
                    existingGroup.setCurrentRankingDecision(updatedRankingGroup.getCurrentRankingDecision());
                    existingGroup.setCreatedBy(updatedRankingGroup.getCreatedBy());
                    return ResponseEntity.ok().body(rankingGroupRepository.save(existingGroup));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a Ranking Group
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRankingGroup(@PathVariable int id) {
        RankingGroup group = rankingGroupRepository.findById(id).get();
        if (group == null) {
            return ResponseEntity.notFound().build();
        } else {
            rankingGroupRepository.delete(group);
            return ResponseEntity.ok().build();
        }
    }
}