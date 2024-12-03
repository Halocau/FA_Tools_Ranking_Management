package backend.model.form.RankingTitleOption;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRankingTitleOptionRequest {

    private Integer rankingTitleId;

    private Integer optionId;

    @NotNull(message = "NewRankingTitleId must not be null")
    private Integer newRankingTitleId;

    @NotNull(message = "NewOptionId must not be null")
    private Integer newOptionId;
}
