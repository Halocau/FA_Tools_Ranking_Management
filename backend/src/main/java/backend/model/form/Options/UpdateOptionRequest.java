package backend.model.form.Options;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOptionRequest {
    @NotBlank
    private String optionName;

    @NotNull
    private Integer score;

    @NotBlank
    private String description;
    @NotNull
    private Integer criteriaId;
}
