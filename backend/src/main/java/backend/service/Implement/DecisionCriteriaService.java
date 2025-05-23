package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.dao.ICriteriaRepository;
import backend.dao.IDecisionCriteriaRepository;
import backend.dao.IRankingDecisionRepository;
import backend.model.dto.CriteriaResponse;
import backend.model.dto.DecisionCriteriaResponse;
import backend.model.dto.TitleConfiguration.DecisionCriteriaDTO;
import backend.model.dto.TitleConfiguration.OptionDTO;
import backend.model.entity.Criteria;
import backend.model.entity.DecisionCriteria;
import backend.model.entity.Options;
import backend.model.form.DecisionCriteria.AddDecisionCriteriaRequest;
import backend.model.form.DecisionCriteria.UpdateDecisionCriteriaRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.IDecisionCriteriaService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
public class DecisionCriteriaService implements IDecisionCriteriaService {
    private IDecisionCriteriaRepository iDecisionCriteriaRepository;
    private ICriteriaRepository iCriteriaRepository;
    private IRankingDecisionRepository iRankingDecisionRepository;
    private ModelMapper modelMapper;

    @Autowired
    public DecisionCriteriaService(IDecisionCriteriaRepository iDecisionCriteriaRepository,
            ICriteriaRepository iCriteriaRepository, IRankingDecisionRepository iRankingDecisionRepository,
            ModelMapper modelMapper) {
        this.iDecisionCriteriaRepository = iDecisionCriteriaRepository;
        this.iCriteriaRepository = iCriteriaRepository;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public DecisionCriteria findByCriteriaId(Integer criteriaId) {
        return iDecisionCriteriaRepository.findByCriteriaId(criteriaId);
    }

    @Override
    public ResultPaginationDTO getAllDecisionCriteria(Specification<DecisionCriteria> spec, Pageable pageable) {
        Page<DecisionCriteria> pageDecisionCriteria = iDecisionCriteriaRepository.findAll(spec, pageable);
        return new PaginationUtils().buildPaginationDTO(pageDecisionCriteria);
    }

    @Override
    public List<DecisionCriteriaResponse> getDecisionCriteriaResponse(List<DecisionCriteria> list) {
        // Kiểm tra nếu list là null hoặc rỗng
        if (list == null || list.isEmpty()) {
            return new ArrayList<>(); // Trả về danh sách trống nếu không có dữ liệu
        }

        List<DecisionCriteriaResponse> decisionCriteriaResponses = new ArrayList<>();

        for (DecisionCriteria dcResponse : list) {
            // Map DecisionCriteria to DecisionCriteriaResponse
            DecisionCriteriaResponse response = modelMapper.map(dcResponse, DecisionCriteriaResponse.class);

            // Fetch Criteria based on criteriaId and update response properties
            Criteria criteria = iCriteriaRepository.findById(dcResponse.getCriteriaId()).orElse(null);
            if (criteria != null) {
                response.setCriteriaName(criteria.getCriteriaName());
                response.setNumOptions(criteria.getOptions().size());
                Integer maxScore = criteria.getOptions().stream()
                        .mapToInt(option -> option.getScore())
                        .max()
                        .orElse(0);
                response.setMaxScore(maxScore);
            } else {
                response.setCriteriaName(null);
                response.setNumOptions(null);
                response.setMaxScore(null);
            }

            decisionCriteriaResponses.add(response);
        }

        return decisionCriteriaResponses;
    }

    @Override
    public List<DecisionCriteriaDTO> getDecisionCriteriaConfigurationResponse(List<DecisionCriteria> list) {
        List<DecisionCriteriaDTO> decisionCriteriaDTO = new ArrayList<>();
        if (list == null || list.isEmpty()) {
            return new ArrayList<>();
        }

        for (DecisionCriteria dcResponse : list) {

            DecisionCriteriaDTO response = modelMapper.map(dcResponse, DecisionCriteriaDTO.class);

            // Get criteriaName
            Criteria criteria = iCriteriaRepository.findById(dcResponse.getCriteriaId()).orElse(null);
            if (criteria != null) {
                response.setCriteriaName(criteria.getCriteriaName());
                Integer maxScore = criteria.getOptions().stream()
                        .mapToInt(option -> option.getScore())
                        .max()
                        .orElse(0);
                response.setMaxScore(maxScore);
            }

            // Get List Option
            List<OptionDTO> optionDTOList = new ArrayList<>();
            if (criteria != null && criteria.getOptions() != null) { // Check null trước khi gọi getOptions
                for (Options option : criteria.getOptions()) {
                    OptionDTO optionDTO = modelMapper.map(option, OptionDTO.class);
                    optionDTOList.add(optionDTO);
                }
            }
            response.setOptions(optionDTOList);

            // Add response to the list
            decisionCriteriaDTO.add(response);
        }

        return decisionCriteriaDTO;
    }

    // get have page
    @Override
    public ResultPaginationDTO findByDecisionIdAndSpecification(Integer decisionId,
            Specification<DecisionCriteria> spec, Pageable pageable) {
        Specification<DecisionCriteria> combinedSpec = (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get("decisionId"), decisionId);

        if (spec != null) {
            combinedSpec = combinedSpec.and(spec);
        }

        Page<DecisionCriteria> find = iDecisionCriteriaRepository.findAll(combinedSpec, pageable);
        return new PaginationUtils().buildPaginationDTO(find);
    }

    @Override // SEARCH lIST BY decisionId
    public List<DecisionCriteria> findByDecisionId(Integer decisionId) {
        return iDecisionCriteriaRepository.findByDecisionId(decisionId);
    }

    @Override
    public Optional<DecisionCriteria> findByCriteriaIdAndDecisionId(Integer decisionId,Integer criteriaId) {
        return iDecisionCriteriaRepository.findByDecisionIdAndCriteriaId(decisionId,criteriaId);
    }

    @Override
    @Transactional
    public DecisionCriteria addDecisionCriteria(DecisionCriteria decisionCriteria) {
        return iDecisionCriteriaRepository.save(decisionCriteria);
    }

    @Override
    @Transactional
    public void deleteDecisionCriteria(Integer decisionId, Integer criteriaId) {
        Optional<DecisionCriteria> findDecisionCriteria = iDecisionCriteriaRepository.findByDecisionIdAndCriteriaId(decisionId,criteriaId);

        if (findDecisionCriteria.isPresent()) {
            // Nếu tìm thấy, tiến hành xóa đối tượng
            iDecisionCriteriaRepository.delete(findDecisionCriteria.get());
        } else {
            // Nếu không tìm thấy, ném ngoại lệ
            throw new EntityNotFoundException(
                    String.format("DecisionCriteria with decisionId %d and criteriaId %d not found", decisionId, criteriaId));
        }
    }

    /**
     * Form request
     */
    @Override // ADD
    @Transactional
    public void createDecisionCriteria(AddDecisionCriteriaRequest form) {
        DecisionCriteria decisionCriteria = DecisionCriteria.builder()
                .decisionId(form.getDecisionId())
                .criteriaId(form.getCriteriaId())
                .weight(form.getWeight())
                .build();
        iDecisionCriteriaRepository.save(decisionCriteria);
    }

    @Override
    @Transactional
    public void updateDecisionCriteria(UpdateDecisionCriteriaRequest form, Integer decisionId, Integer criteriaId) {
        Optional<DecisionCriteria> find = iDecisionCriteriaRepository.findByDecisionIdAndCriteriaId(decisionId,criteriaId);

        if (find.isPresent()) {
            // Nếu tồn tại, cập nhật thông tin
            DecisionCriteria existingCriteria = find.get();
            existingCriteria.setDecisionId(form.getDecisionId());
            existingCriteria.setCriteriaId(form.getCriteriaId());
            existingCriteria.setWeight(form.getWeight());
            iDecisionCriteriaRepository.saveAndFlush(existingCriteria);
        } else {
            // Nếu không tồn tại, tạo mới
            DecisionCriteria newCriteria = DecisionCriteria.builder()
                    .decisionId(form.getDecisionId())
                    .criteriaId(form.getCriteriaId())
                    .weight(form.getWeight())
                    .build();
            iDecisionCriteriaRepository.save(newCriteria);
        }
    }
}
