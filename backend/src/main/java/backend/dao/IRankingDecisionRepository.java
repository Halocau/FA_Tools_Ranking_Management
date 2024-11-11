package backend.dao;

import backend.model.entity.RankingDecision;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingDecisionRepository extends JpaRepository<RankingDecision, Integer> {

    public RankingDecision findByDecisionId(int decisionId);

    boolean existsByDecisionName(String decisionName);

    List<RankingDecision> findByDecisionName(String decisionName, Pageable pageable);

    List<RankingDecision> findByDecisionNameContainingIgnoreCase(String decisionName, Pageable pageable);
}
