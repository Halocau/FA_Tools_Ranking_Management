package backend.dao;

import backend.model.entity.RankingDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;

@RepositoryRestResource(path = "r")
public interface IRankingDecisionRepository extends JpaRepository<RankingDecision, Integer> {
    public RankingDecision findByGroupId(int groupId);

    public RankingDecision findByDecisionId(int decisionId);

    @Modifying
    @Query("UPDATE RankingDecision rd SET rd.groupId = null WHERE rd.groupId = :groupId")
    public void updateRankingDecisionGroupIdToNull(int groupId);

}
