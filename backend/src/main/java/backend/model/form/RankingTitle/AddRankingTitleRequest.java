package backend.model.form.RankingTitle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddRankingTitleRequest {
    @NotNull
    private Integer decisionId;

    @NotBlank
    @Size(min = 3, max = 100)
    private String titleName;
}
