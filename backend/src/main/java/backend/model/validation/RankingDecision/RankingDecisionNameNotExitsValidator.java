package backend.model.validation.RankingDecision;

import backend.service.IRankingDecisionService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

public class RankingDecisionNameNotExitsValidator implements ConstraintValidator<RankingDecisionNameNotExits, String> {
    private IRankingDecisionService iRankingDecisionService;

    @Autowired
    public RankingDecisionNameNotExitsValidator(IRankingDecisionService iRankingDecisionService) {
        this.iRankingDecisionService = iRankingDecisionService;
    }

    @Override
    public boolean isValid(String decisionName, ConstraintValidatorContext constraintValidatorContext) {
        if(StringUtils.isEmpty(decisionName)) {
            return true;// Tên trống được coi là hợp lệ, nên bỏ qua kiểm tra
        }
        return !iRankingDecisionService.isRankingDecisionNameExist(decisionName);
    }
}
