package backend.dao;

import backend.model.RankingDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@RepositoryRestResource(path = "r")
public interface IRankingDecisionRepository extends JpaRepository<RankingDecision, Integer> {
    public RankingDecision findByGroupId(int groupId);
}
