package backend.service;

import backend.model.entity.Criteria;
import backend.model.form.Criteria.AddCriteriaRequest;
import backend.model.form.Criteria.UpdateCriteriaRequest;

import java.util.List;
import java.util.Optional;

public interface ICriteriaService {

    public List<Criteria> getAllCriteria();

    public Criteria getCriteriabyId(int criteriaId);

    public Criteria addCriteria(Criteria criteria);

    public Criteria updateCriteria(Criteria criteria);

    public void deleteCriteria(int criteriaId);

    public Criteria createCriteria(AddCriteriaRequest request);

    public Optional<Criteria> updateCriteria(int criteriaId, UpdateCriteriaRequest request);
}
