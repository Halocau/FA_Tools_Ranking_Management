package backend.model.validation.Criteria;

import backend.service.ICriteriaService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

public class AddCriteriaNotDuplicateValidator implements ConstraintValidator<AddCriteriaNotDuplicate, String> {
    private ICriteriaService iCriteriaService;

    @Autowired
    public AddCriteriaNotDuplicateValidator(ICriteriaService iCriteriaService) {
        this.iCriteriaService = iCriteriaService;
    }

    @Override
    public boolean isValid(String criteriaName, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(criteriaName)) {
            return true;
        }
        return !iCriteriaService.existsByCriteriaName(criteriaName);
    }
}
