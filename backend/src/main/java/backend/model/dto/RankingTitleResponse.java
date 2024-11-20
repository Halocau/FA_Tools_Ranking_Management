package backend.model.dto;

import backend.model.dto.TitleConfiguration.OptionDTO;
import lombok.Data;

import java.util.List;

@Data
public class RankingTitleResponse {
    private int rankingTitleId;
    private String titleName;
}
