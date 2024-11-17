package backend.dao;

import backend.model.entity.DecisionCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IDecisionCriteriaRepository extends JpaRepository<DecisionCriteria, Integer> {
    public DecisionCriteria findByCriteriaId(Integer criteriaId);
}
