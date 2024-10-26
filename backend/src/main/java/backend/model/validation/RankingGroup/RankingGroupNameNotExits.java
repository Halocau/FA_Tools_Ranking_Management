package backend.model.validation.RankingGroup;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.TYPE_USE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.TYPE_USE})
// Chỉ định các nơi có thể áp dụng chú thích này
@Retention(RetentionPolicy.RUNTIME)// Chỉ định chú thích này sẽ được giữ lại tại runtime
@Documented// Cho phép hiển thị thông tin của chú thích trong tài liệu Javadoc
@Constraint(validatedBy = {RankingGroupNameNotExitsValidator.class})
@Repeatable(RankingGroupNameNotExits.List.class)
public @interface RankingGroupNameNotExits {
    String message() default "{RankingGroup name exists already!}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    @Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.TYPE_USE})
    @Retention(RUNTIME)
    @Documented
    @interface List {
        RankingGroupNameNotExits[] value();
    }
}
