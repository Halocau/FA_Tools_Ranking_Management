package backend.model.dto;

import backend.model.entity.Criteria;
import lombok.Data;

import java.util.List;
@Data
public class EmployeeCriteriaResponse {
    private Integer employeeId;
    private String employeeName;
    private String rankingGroupName;
    private String currentRankingDecision;
    private String currentRank;
    private String assessmentRank;
    private List<ApplyCriteriaResponse> criteriaList;
    private Double totalScore;
}
