package backend.service;

import backend.model.dto.DecisionCriteriaResponse;
import backend.model.entity.Criteria;
import backend.model.entity.DecisionCriteria;

import java.util.List;

public interface IDecisionCriteriaService {
    public DecisionCriteria findByCriteriaId(Integer criteriaId);
    public List<DecisionCriteriaResponse> getDecisionCriteriaResponse(List<Criteria> criteria);
}
