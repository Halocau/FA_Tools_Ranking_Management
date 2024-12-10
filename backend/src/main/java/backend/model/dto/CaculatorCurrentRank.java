package backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaculatorCurrentRank {
    private Integer criteriaId;
    private Integer optionId;
    private Integer score;
    private Float weight;
    private int maxScore;
}
