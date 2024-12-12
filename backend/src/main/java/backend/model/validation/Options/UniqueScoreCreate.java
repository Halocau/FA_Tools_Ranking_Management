package backend.model.validation.Options;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueScoreCreateValidator.class)
public @interface UniqueScoreCreate {
    String message() default "Score already exists for the specified criteria";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

