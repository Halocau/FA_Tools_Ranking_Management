package backend.model.validation.Options;

import backend.dao.IOptionRepository;
import backend.model.form.Options.CreateOptionRequest;
import backend.service.IOptionService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

public class AddOptionNameNotDuplicateValidator implements ConstraintValidator<AddOptionNameNotDuplicate, CreateOptionRequest> {

    private IOptionRepository iOptionRepository;

    @Autowired
    public AddOptionNameNotDuplicateValidator(IOptionRepository iOptionRepository) {
        this.iOptionRepository = iOptionRepository;
    }

    @Override
    public boolean isValid(CreateOptionRequest request, ConstraintValidatorContext constraintValidatorContext) {
        boolean exists = iOptionRepository.existsByOptionNameAndCriteriaId(request.getOptionName(), request.getCriteriaId());
        return !exists;
    }
}
