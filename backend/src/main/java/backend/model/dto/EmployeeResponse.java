package backend.model.dto;

import lombok.Data;

@Data
public class EmployeeResponse {
    private Integer employeeId;
    private String employeeName;
    private String rankingGroupName;
    private String currentRankingDecision;
    private String currentRank;
}
