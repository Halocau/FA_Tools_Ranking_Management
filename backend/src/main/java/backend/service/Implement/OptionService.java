package backend.service.Implement;

import backend.dao.IOptionRepository;
import backend.model.dto.OptionResponse;
import backend.model.entity.Options;
import backend.model.form.Options.CreateOptionRequest;
import backend.model.form.Options.UpdateOptionRequest;
import backend.service.IOptionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

//    @Override
//    public List<OptionResponse> getAllOptionResponses(Integer criteriaId) {
//        List<Options> findIdOptionByCriteriaId = iOptionRepository.findByCriteriaId(criteriaId);
//        List<OptionResponse> optionResponses = new ArrayList<>();
//        for (Options option : findIdOptionByCriteriaId) {
//            optionResponses.add(modelMapper.map(option, OptionResponse.class));
//        }
//        return optionResponses;
//    }


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
        Options findOptionId = iOptionRepository.findById(optionId).orElseThrow(() ->
                new EntityNotFoundException("Option not found with id: " + optionId));

        // Cập nhật trực tiếp các thuộc tính của đối tượng tìm thấy
        findOptionId.setOptionName(form.getOptionName());
        findOptionId.setScore(form.getScore());
        findOptionId.setDescription(form.getDescription());
        findOptionId.setCriteriaId(form.getCriteriaId());
        // Lưu lại đối tượng đã cập nhật (không cần gọi lại saveAndFlush vì JPA sẽ tự động đồng bộ)
        iOptionRepository.saveAndFlush(findOptionId);
    }

    @Override
    public boolean existsByOptionName(String optionName) {
        return iOptionRepository.existsByOptionName(optionName);
    }

}
