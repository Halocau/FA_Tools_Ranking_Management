package backend.model.dto;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Ranking_Group")
public class RankingGroupDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private int groupId;

    @Column(name = "group_name", length = 100, nullable = false)
    private String groupName;

    @Column(name = "num_employees")
    private int numEmployees;

    @Transient
    private String currrentRankingDecision;//decisionName
}
