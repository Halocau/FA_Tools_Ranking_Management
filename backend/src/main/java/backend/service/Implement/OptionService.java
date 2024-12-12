package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.config.exception.exceptionEntity.OptionException;
import backend.dao.IOptionRepository;
import backend.model.dto.OptionResponse;
import backend.model.entity.Options;
import backend.model.form.Options.CreateOptionRequest;
import backend.model.form.Options.UpdateOptionRequest;
import backend.service.IOptionService;
import backend.model.page.ResultPaginationDTO;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@Service
public class OptionService implements IOptionService {
    private IOptionRepository iOptionRepository;
    private ModelMapper modelMapper;

    @Autowired
    public OptionService(IOptionRepository iOptionRepository, ModelMapper modelMapper) {
        this.iOptionRepository = iOptionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<Options> getAllOptions() {
        return iOptionRepository.findAll();
    }

    @Override
    public ResultPaginationDTO getAllOptions(Specification<Options> spec, Pageable pageable) {
        Page<OptionResponse> pageOptions = iOptionRepository.findAll(spec, pageable).map(this::convertToOptionResponse);

        return new PaginationUtils().buildPaginationDTO(pageOptions);
    }

    @Override
    public Options findOptionById(int id) {
        return iOptionRepository.findById(id).get();
    }

    @Override
    @Transactional
    public Options addOption(Options option) {
        return iOptionRepository.save(option);
    }

    @Override
    @Transactional
    public Options updateOption(Options option) {
        return iOptionRepository.saveAndFlush(option);
    }

    @Override
    @Transactional
    public void deleteOption(int id) {
        iOptionRepository.deleteById(id);
    }

    @Override
    public List<Options> findByCriteriaId(Integer criteriaId) {
        return iOptionRepository.findByCriteriaId(criteriaId);
    }

    @Override
    public List<OptionResponse> getAllOptionResponses(List<Options> options) {
        List<OptionResponse> responses = new ArrayList<>();
        for (Options option : options) {
            responses.add(modelMapper.map(option, OptionResponse.class));
        }
        return responses;
    }

    @Override
    public OptionResponse convertToOptionResponse(Options options) {
        return modelMapper.map(options, OptionResponse.class);
    }

    // @Override
    // public List<OptionResponse> getAllOptionResponses(Integer criteriaId) {
    // List<Options> findIdOptionByCriteriaId =
    // iOptionRepository.findByCriteriaId(criteriaId);
    // List<OptionResponse> optionResponses = new ArrayList<>();
    // for (Options option : findIdOptionByCriteriaId) {
    // optionResponses.add(modelMapper.map(option, OptionResponse.class));
    // }
    // return optionResponses;
    // }

    @Override
    @Transactional
    public void createOption(CreateOptionRequest form) {
        Options options = Options.builder()
                .optionName(form.getOptionName())
                .score(form.getScore())
                .description(form.getDescription())
                .createdBy(form.getCreatedBy())
                .criteriaId(form.getCriteriaId())
                .build();
        iOptionRepository.save(options);
    }

    @Override
    @Transactional
    public void updateOption(UpdateOptionRequest form, int optionId) {
        // Tìm đối tượng Options theo optionId và xử lý khi không tìm thấy
        Options findOptionId = iOptionRepository.findById(optionId)
                .orElseThrow(() -> new EntityNotFoundException("Option not found with id: " + optionId));

        // Kiểm tra trùng tên với các Options khác (không phải chính nó)
        if (!findOptionId.getOptionName().equals(form.getOptionName())
                && iOptionRepository.existsByOptionNameAndOptionIdNot(form.getOptionName(), optionId)) {
            throw new OptionException("Option name already exists.");
        }
        
        // Kiểm tra trùng lặp score trong cùng criteriaId (không so với chính nó)
        if (form.getScore() != null && !form.getScore().equals(findOptionId.getScore())
                && iOptionRepository.existsByScoreAndCriteriaIdAndOptionIdNot(form.getScore(), form.getCriteriaId(), optionId)) {
            throw new OptionException("Score already exists for this criteria.");
        }

        findOptionId.setOptionName(form.getOptionName());
        findOptionId.setScore(form.getScore());
        findOptionId.setDescription(form.getDescription());
        findOptionId.setCriteriaId(form.getCriteriaId());
        iOptionRepository.saveAndFlush(findOptionId);
    }

    @Override
    public boolean existsByOptionName(String optionName) {
        return iOptionRepository.existsByOptionName(optionName);
    }

    @Override
    public boolean existsByOptionNameAndOptionIdNot(String optionName, Integer optionId) {
        return iOptionRepository.existsByOptionNameAndOptionIdNot(optionName, optionId);
    }

}
