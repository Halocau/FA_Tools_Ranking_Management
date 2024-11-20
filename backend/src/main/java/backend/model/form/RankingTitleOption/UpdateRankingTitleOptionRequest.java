package backend.model.form.RankingTitleOption;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRankingTitleOptionRequest {
    @NotNull(message = "RankingTitleId must not be null")
    private Integer rankingTitleId;

    @NotNull(message = "OptionId must not be null")
    private Integer optionId;
}
