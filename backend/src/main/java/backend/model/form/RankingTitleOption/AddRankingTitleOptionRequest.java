package backend.model.form.RankingTitleOption;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddRankingTitleOptionRequest {
    @NotNull(message = "RankingTitleId must not be null")
    private Integer RankingTitleId;

    @NotNull(message = "OptionId must not be null")
    private Integer OptionId;
}
