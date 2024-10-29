package backend.model.validation.RankingDecision;

import backend.model.validation.RankingGroup.RankingGroupNameNotExits;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = {RankingDecisionNameNotExitsValidator.class})
@Repeatable(RankingDecisionNameNotExits.List.class)
public @interface RankingDecisionNameNotExits {
    String message() default "RankingDecision name exists already!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
    @Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.TYPE_USE})
    @Retention(RUNTIME)
    @Documented
    @interface List{
        RankingDecisionNameNotExits[] value();
    }
}
