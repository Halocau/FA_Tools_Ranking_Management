package backend.dao;

import backend.model.entity.DecisionCriteria;
import backend.model.entity.Task;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IDecisionCriteriaRepository extends JpaRepository<DecisionCriteria, Integer>, JpaSpecificationExecutor<DecisionCriteria> {
    public List<DecisionCriteria> findByDecisionId(Integer decisionId);

    public DecisionCriteria findByCriteriaId(Integer criteriaId);

    // criteriaId and decisionId
    public Optional<DecisionCriteria> findByDecisionIdAndCriteriaId(Integer decisionId, Integer criteriaId);
    public void deleteDecisionCriteriaByDecisionIdAndCriteriaId(Integer decisionId, Integer criteriaId);

    @Modifying
    @Query("DELETE FROM DecisionCriteria dc WHERE dc.decisionId = :decisionId")
    void deleteByDecisionId(@Param("decisionId") int decisionId);
}
