package backend.model.dto.TitleConfiguration;

import lombok.Data;

@Data
public class OptionDTO {
    private int optionId;
    private String optionName;
    private int score;
    private int criteriaId;
}
