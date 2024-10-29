package backend.model.validation.RankingGroup;

import backend.service.IRankingGroupService;
import ch.qos.logback.core.util.StringUtil;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

public class RankingGroupNameNotExitsValidator implements ConstraintValidator<RankingGroupNameNotExits, String> {
    private IRankingGroupService iRankingGroupService;

    @Autowired
    public RankingGroupNameNotExitsValidator(IRankingGroupService iRankingGroupService) {
        this.iRankingGroupService = iRankingGroupService;
    }

    @Override
    public boolean isValid(String name, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(name)) {
            return true;
        }
        return !iRankingGroupService.isRankingGroupExitsByGroupName(name);
    }
}
