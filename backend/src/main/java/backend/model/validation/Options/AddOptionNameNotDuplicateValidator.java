package backend.model.validation.Options;

import backend.service.IOptionService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

public class AddOptionNameNotDuplicateValidator implements ConstraintValidator<AddOptionNameNotDuplicate, String> {

    private IOptionService iOptionService;

    @Autowired
    public AddOptionNameNotDuplicateValidator(IOptionService iOptionService) {
        this.iOptionService = iOptionService;
    }

    @Override
    public boolean isValid(String optionName, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(optionName)) {
            return true;
        }
        return !iOptionService.existsByOptionName(optionName);
    }
}
