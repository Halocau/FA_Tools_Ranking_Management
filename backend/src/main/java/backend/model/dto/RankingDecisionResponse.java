package backend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class RankingDecisionResponse {
    private int decisionId;
    private String decisionName;
    private LocalDateTime finalizedAt;
    private Integer finalizedBy;
    private String status;
}
