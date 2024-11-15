package backend.model.validation.Criteria;

import backend.model.validation.Options.AddOptionNameNotDuplicate;
import backend.model.validation.Options.AddOptionNameNotDuplicateValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE,
        ElementType.CONSTRUCTOR, ElementType.TYPE_USE })
// Chỉ định các nơi có thể áp dụng chú thích này
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = { AddCriteriaNotDuplicateValidator.class })
@Repeatable(AddCriteriaNotDuplicate.List.class)
public @interface AddCriteriaNotDuplicate {
    String message() default "{Criteria name exists already!}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    @Target({ ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE,
            ElementType.CONSTRUCTOR, ElementType.TYPE_USE })
    @Retention(RUNTIME)
    @Documented
    @interface List {
        AddCriteriaNotDuplicate[] value();
    }
}
