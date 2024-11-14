package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.dao.ICriteriaRepository;
import backend.model.dto.CriteriaResponse;
import backend.model.entity.Criteria;
import backend.model.form.Criteria.AddCriteriaRequest;
import backend.model.form.Criteria.UpdateCriteriaRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.ICriteriaService;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CriteriaService implements ICriteriaService {

    private final ICriteriaRepository criteriaRepository;
    private ModelMapper modelMapper;

    @Autowired
    public CriteriaService(ICriteriaRepository criteriaRepository, ModelMapper modelMapper) {
        this.criteriaRepository = criteriaRepository;
        this.modelMapper = modelMapper;
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
        // System.out.println("criteriaId: " + criteriaId);
        criteriaRepository.deleteById(criteriaId);
    }

    @Override
    public Criteria createCriteria(AddCriteriaRequest request) {
        Criteria criteria = Criteria.builder()
                .criteriaName(request.getCriteriaName())
                .createdBy(request.getCreatedBy())
                .build();
        return criteriaRepository.save(criteria);
    }

    @Override
    public Optional<Criteria> updateCriteria(int criteriaId, UpdateCriteriaRequest request) {
        Optional<Criteria> criteriaOptional = criteriaRepository.findById(criteriaId);
        if (criteriaOptional.isPresent()) {
            Criteria criteria = criteriaOptional.get();
            criteria.setCriteriaName(request.getCriteriaName());
            // criteria.setCreatedBy(request.getUpdatedBy());
            return Optional.of(criteriaRepository.save(criteria));
        } else {
            return Optional.empty();
        }
    }

    @Override
    public CriteriaResponse convertToCriteriaResponse(Criteria criteria) {
        return modelMapper.map(criteria, CriteriaResponse.class);
    }

    @Override
    public List<CriteriaResponse> convertToCriteriaResponseList(List<Criteria> criteriaList) {
        List<CriteriaResponse> criteriaResponses = new ArrayList<>();
        for (Criteria criteria : criteriaList) {
            criteriaResponses.add(modelMapper.map(criteria, CriteriaResponse.class));
        }
        return criteriaResponses;
    }

    @Override
    public ResultPaginationDTO getAllCriteria(Specification<Criteria> spec, Pageable pageable) {
        // Page<Criteria> criteriaList = criteriaRepository.findAll(spec, pageable);
        Page<CriteriaResponse> criteriaResponses = criteriaRepository.findAll(spec, pageable)
                .map(this::convertToCriteriaResponse);
        return new PaginationUtils().buildPaginationDTO(criteriaResponses);
    }

}
