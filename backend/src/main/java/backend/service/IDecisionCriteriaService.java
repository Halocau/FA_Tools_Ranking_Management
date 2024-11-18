package backend.service;

import backend.model.dto.DecisionCriteriaResponse;
import backend.model.entity.DecisionCriteria;
import backend.model.form.DecisionCriteria.AddDecisionCriteriaRequest;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.security.PublicKey;
import java.util.List;

public interface IDecisionCriteriaService {

    //have page
    public ResultPaginationDTO findByDecisionIdAndSpecification(Integer decisionId, Specification<DecisionCriteria> spec, Pageable pageable);

    public ResultPaginationDTO getAllDecisionCriteria(Specification<DecisionCriteria> spec, Pageable pageable);

    public DecisionCriteria findByCriteriaIdAndDecisionId(Integer criteriaId, Integer decisionId);

    //crud
    public DecisionCriteria findByCriteriaId(Integer criteriaId);

    public List<DecisionCriteria> findByDecisionId(Integer decisionId);

    public DecisionCriteria addDecisionCriteria(DecisionCriteria decisionCriteria);

    public void deleteDecisionCriteria(Integer decisionId, Integer criteriaId);
    //response
    public List<DecisionCriteriaResponse> getDecisionCriteriaResponse(List<DecisionCriteria> list);

    //form
    public void createDecisionCriteria(AddDecisionCriteriaRequest form);
}
