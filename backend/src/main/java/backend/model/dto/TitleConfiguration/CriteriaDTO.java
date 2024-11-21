package backend.model.dto.TitleConfiguration;

import lombok.Data;

import java.util.List;

@Data
public class CriteriaDTO {
    private Integer criteriaId;
    private String criteriaName;
    private List<OptionDTO> options;
}
