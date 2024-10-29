package backend.dao;

import backend.model.entity.RankingDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingDecisionRepository extends JpaRepository<RankingDecision, Integer> {
    public RankingDecision findByGroupId(int groupId);
    @Modifying
    @Query("UPDATE RankingDecision rd SET rd.groupId = null WHERE rd.groupId = :groupId")
    public void updateRankingDecisionGroupIdToNull(int groupId);

    boolean existsByDecisionName(String decisionName);

}
