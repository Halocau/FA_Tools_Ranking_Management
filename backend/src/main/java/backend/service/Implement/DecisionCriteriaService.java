package backend.service.Implement;

import backend.dao.ICriteriaRepository;
import backend.dao.IDecisionCriteriaRepository;
import backend.model.dto.DecisionCriteriaResponse;
import backend.model.entity.Criteria;
import backend.model.entity.DecisionCriteria;
import backend.service.IDecisionCriteriaService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DecisionCriteriaService implements IDecisionCriteriaService {
    private IDecisionCriteriaRepository iDecisionCriteriaRepository;
    private ICriteriaRepository iCriteriaRepository;
    private ModelMapper modelMapper;

    @Autowired
    public DecisionCriteriaService(IDecisionCriteriaRepository iDecisionCriteriaRepository, ICriteriaRepository iCriteriaRepository, ModelMapper modelMapper) {
        this.iDecisionCriteriaRepository = iDecisionCriteriaRepository;
        this.iCriteriaRepository = iCriteriaRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public DecisionCriteria findByCriteriaId(Integer criteriaId) {
        return iDecisionCriteriaRepository.findByCriteriaId(criteriaId);
    }

    @Override
    public List<DecisionCriteriaResponse> getDecisionCriteriaResponse(List<Criteria> criteriaList) {
        List<DecisionCriteriaResponse> decisionCriteriaResponse = new ArrayList<>();
        for (Criteria criteria : criteriaList) {
            // Ánh xạ Criteria thành DecisionCriteriaResponse
            DecisionCriteriaResponse response = modelMapper.map(criteria, DecisionCriteriaResponse.class);

            // Đặt weight cho response nếu decisionCriteria tồn tại
            if (criteria.getCriteriaId() != null) {
                DecisionCriteria decisionCriteria = iDecisionCriteriaRepository.findByCriteriaId(criteria.getCriteriaId());
                if (decisionCriteria != null) {
                    response.setWeight(decisionCriteria.getWeight());
                } else {
                    response.setWeight(null); // Hoặc giá trị mặc định nếu cần
                }
            } else {
                response.setWeight(null);
            }
            decisionCriteriaResponse.add(response);
        }
        return decisionCriteriaResponse;
    }



}
