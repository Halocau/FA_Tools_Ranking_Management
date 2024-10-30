package backend.service;

import backend.model.entity.Criteria;

import java.util.List;

public interface ICriteriaService {

    public List<Criteria> getAllCriteria();

    public Criteria getCriteriabyId(int criteriaId);

    public Criteria addCriteria(Criteria criteria);

    public Criteria updateCriteria(Criteria criteria);

    public void deleteCriteria(int criteriaId);
}
