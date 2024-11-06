package backend.model.form.RankingGroup;

import backend.model.validation.RankingGroup.RankingGroupNameNotExits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UpdateNewGroupRequest {
    @NotBlank
    @Length(max = 100)
    @RankingGroupNameNotExits
    private String groupName;

    private Integer currentRankingDecision;

    private int createdBy;
}
