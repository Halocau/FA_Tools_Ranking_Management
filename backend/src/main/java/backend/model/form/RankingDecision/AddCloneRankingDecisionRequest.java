package backend.model.form.RankingDecision;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCloneRankingDecisionRequest {
    private String decisionName;
    @NotNull
    private Integer decisionToCloneId;//Id RankingDecison Clone
    @NotNull
    private Integer createdBy;
}
