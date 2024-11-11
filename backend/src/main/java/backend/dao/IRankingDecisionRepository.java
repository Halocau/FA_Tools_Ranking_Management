package backend.dao;

import backend.model.entity.RankingDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingDecisionRepository extends JpaRepository<RankingDecision, Integer> {

    public RankingDecision findByDecisionId(int decisionId);

    boolean existsByDecisionName(String decisionName);

}
