package backend.service.Implement;

import backend.dao.ICriteriaRepository;
import backend.model.entity.Criteria;
import backend.service.ICriteriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CriteriaService implements ICriteriaService {

    private final ICriteriaRepository criteriaRepository;

    @Autowired
    public CriteriaService(ICriteriaRepository criteriaRepository) {
        this.criteriaRepository = criteriaRepository;
    }

    @Override
    public List<Criteria> getAllCriteria() {
        return criteriaRepository.findAll();
    }

    @Override
    public Criteria getCriteriabyId(int criteriaId) {
        return criteriaRepository.findById(criteriaId)
                .orElseThrow(() -> new RuntimeException("Criteria not found with id: " + criteriaId));
    }

    @Override
    public Criteria addCriteria(Criteria criteria) {
        return criteriaRepository.save(criteria);
    }

    @Override
    public Criteria updateCriteria(Criteria criteria) {
        // Check if the criteria exists before updating
        if (!criteriaRepository.existsById(criteria.getCriteriaId())) {
            throw new RuntimeException("Criteria not found with id: " + criteria.getCriteriaId());
        }
        return criteriaRepository.save(criteria);
    }

    @Override
    public void deleteCriteria(int criteriaId) {
        if (!criteriaRepository.existsById(criteriaId)) {
            throw new RuntimeException("Criteria not found with id: " + criteriaId);
        }
        criteriaRepository.deleteById(criteriaId);
    }
}
