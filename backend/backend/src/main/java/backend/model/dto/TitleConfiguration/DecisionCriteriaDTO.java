package backend.model.dto.TitleConfiguration;

import lombok.Data;

import java.util.List;

@Data
public class DecisionCriteriaDTO {
    private Integer decisionId;
    private Integer criteriaId;
    private Float weight;
    private Integer maxScore;
    private String criteriaName;
    private List<OptionDTO> options;
}
