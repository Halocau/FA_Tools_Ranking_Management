package backend.model.form.Options;

import backend.model.validation.Options.AddOptionNameNotDuplicate;
import backend.model.validation.Options.UniqueScoreCreate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@UniqueScoreCreate
public class CreateOptionRequest {
    @NotBlank
    @AddOptionNameNotDuplicate
    private String optionName;

    @NotNull
    private Integer score;

    @NotBlank
    private String description;

    @NotNull
    private Integer createdBy;
    @NotNull
    private Integer criteriaId;
}
