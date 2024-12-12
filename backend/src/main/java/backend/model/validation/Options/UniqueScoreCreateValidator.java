package backend.model.validation.Options;

import backend.dao.IOptionRepository;
import backend.model.form.Options.CreateOptionRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniqueScoreCreateValidator implements ConstraintValidator<UniqueScoreCreate, CreateOptionRequest> {

    @Autowired
    private IOptionRepository iOptionRepository;

    @Override
    public boolean isValid(CreateOptionRequest request, ConstraintValidatorContext context) {
        // Kiểm tra nếu score đã tồn tại với criteriaId
        boolean exists = iOptionRepository.existsByScoreAndCriteriaId(request.getScore(), request.getCriteriaId());
        return !exists;
    }
}
