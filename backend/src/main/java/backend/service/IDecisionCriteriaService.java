package backend.service;

import backend.model.dto.DecisionCriteriaResponse;
import backend.model.entity.Criteria;
import backend.model.entity.DecisionCriteria;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface IDecisionCriteriaService {
    public DecisionCriteria findByCriteriaId(Integer criteriaId);
    public List<DecisionCriteriaResponse> getDecisionCriteriaResponse(List<DecisionCriteria> list);

    public ResultPaginationDTO getAllDecisionCriteria(Specification<DecisionCriteria> spec, Pageable pageable);
    public List<DecisionCriteria> findByDecisionIdList(Integer decisionId);

    public DecisionCriteria findByCriteriaIdAndDecisionId(Integer criteriaId, Integer decisionId);
    public DecisionCriteria addDecisionCriteria(DecisionCriteria decisionCriteria);
}
