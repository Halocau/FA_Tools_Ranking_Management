package backend.model.dto.TitleConfiguration;

import java.util.List;

import lombok.Data;

@Data
public class TitleOptionDTO {
    private Integer rankingTitleId;
    private String rankingTitleName;
    private Float totalScore;
    private List<OptionDTO> options;
}
