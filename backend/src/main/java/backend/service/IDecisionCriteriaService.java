package backend.service;

import backend.model.dto.DecisionCriteriaResponse;
import backend.model.dto.TitleConfiguration.DecisionCriteriaDTO;
import backend.model.entity.DecisionCriteria;
import backend.model.form.DecisionCriteria.AddDecisionCriteriaRequest;
import backend.model.form.DecisionCriteria.UpdateDecisionCriteriaRequest;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.security.PublicKey;
import java.util.List;
import java.util.Optional;

public interface IDecisionCriteriaService {

    //have page
    public ResultPaginationDTO findByDecisionIdAndSpecification(Integer decisionId, Specification<DecisionCriteria> spec, Pageable pageable);

    public ResultPaginationDTO getAllDecisionCriteria(Specification<DecisionCriteria> spec, Pageable pageable);

    public  Optional<DecisionCriteria> findByCriteriaIdAndDecisionId(Integer decisionId,Integer criteriaId);

    //crud
    public DecisionCriteria findByCriteriaId(Integer criteriaId);

    public List<DecisionCriteria> findByDecisionId(Integer decisionId);

    public DecisionCriteria addDecisionCriteria(DecisionCriteria decisionCriteria);

    public void deleteDecisionCriteria(Integer decisionId, Integer criteriaId);
    //response
    public List<DecisionCriteriaResponse> getDecisionCriteriaResponse(List<DecisionCriteria> list);
    public List<DecisionCriteriaDTO> getDecisionCriteriaConfigurationResponse(List<DecisionCriteria> list);
    //form
    public void createDecisionCriteria(AddDecisionCriteriaRequest form);
    public void updateDecisionCriteria(UpdateDecisionCriteriaRequest form, Integer decisionId, Integer criteriaId);
}
