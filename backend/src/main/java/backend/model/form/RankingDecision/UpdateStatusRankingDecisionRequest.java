package backend.model.form.RankingDecision;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRankingDecisionRequest {
    @NotNull
    private Integer decisionId;
    @NotBlank
    private String status;
}
