package backend.model.form.RankingDecision;


import backend.model.validation.RankingDecision.RankingDecisionNameNotExits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CreateRankingDecision {

//    private Integer decisionCloneId;
    @NotBlank
    @Length(max = 100)
    @RankingDecisionNameNotExits
    private String decisionName;

    @NotNull
    private Integer createdBy;
}
