package backend.service;

import backend.model.dto.CriteriaResponse;
import backend.model.dto.TitleConfiguration.DecisionCriteriaDTO;
import backend.model.entity.Criteria;
import backend.model.form.Criteria.AddCriteriaRequest;
import backend.model.form.Criteria.UpdateCriteriaRequest;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;
import java.util.Optional;

public interface ICriteriaService {

    public List<Criteria> getAllCriteria();

    public ResultPaginationDTO getAllCriteria(Specification<Criteria> spec, Pageable pageable);

    public Criteria getCriteriabyId(int criteriaId);

    public Criteria addCriteria(Criteria criteria);

    public Criteria updateCriteria(Criteria criteria);

    public void deleteCriteria(int criteriaId);

    public Criteria createCriteria(AddCriteriaRequest request);

    public Optional<Criteria> updateCriteria(int criteriaId, UpdateCriteriaRequest request);

    public CriteriaResponse convertToCriteriaResponse(Criteria criteria);

    public List<CriteriaResponse> convertToCriteriaResponseList(List<Criteria> criteriaList);

    //validation
    boolean existsByCriteriaName(String name);

    //TitleConfiguration
    public List<DecisionCriteriaDTO> getAllCriteriaTitleConfiguration(List<Criteria> criteriaList);
}
