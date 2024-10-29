package backend.model.form.RankingDecision;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CreateRankingDecision {
    @NotBlank
    @Length(max = 100)
    private String decisionName;

    @NotNull
    private Integer createdBy;
}
