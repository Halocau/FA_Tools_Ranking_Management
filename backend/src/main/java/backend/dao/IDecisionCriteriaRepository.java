package backend.dao;

import backend.model.entity.DecisionCriteria;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IDecisionCriteriaRepository extends JpaRepository<DecisionCriteria, Integer>, JpaSpecificationExecutor<DecisionCriteria> {
    public DecisionCriteria findByCriteriaId(Integer criteriaId);

    @Query("SELECT d FROM DecisionCriteria d WHERE d.decisionId = :decisionId")
    Page<DecisionCriteria> findByDecisionId(Integer decisionId, Pageable pageable);

    public DecisionCriteria findByCriteriaIdAndDecisionId(Integer criteriaId, Integer decisionId);

    Page<DecisionCriteria> findAll(Specification<DecisionCriteria> spec, Pageable pageable);


}
