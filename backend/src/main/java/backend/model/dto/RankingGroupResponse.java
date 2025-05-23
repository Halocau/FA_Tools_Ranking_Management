package backend.model.dto;

import jakarta.persistence.*;
import lombok.Data;

@Data

public class RankingGroupResponse {
    private int groupId;
    private String groupName;
    private int numEmployees;
    private Integer decisionId;
    private String currentRankingDecision;// decisionName
    private String createdBy;
    private String createdAt;
}
