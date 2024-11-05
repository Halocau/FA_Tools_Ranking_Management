package backend.model.form.RankingDecision;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
@Data
public class UpdateRankingDecision {
    @NotBlank
    @Length(max = 100)
    private String decisionName;
}
