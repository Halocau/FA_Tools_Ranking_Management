package backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Ranking_Decision")
public class RankingDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "decision_id")
    private int decisionId;

    @Column(name = "group_id")
    private int groupId;

    @Column(name = "decision_name")
    private String decisionName;

    @Column(name = "status")
    private String status;

    @Column(name = "finalized_at")
    private LocalDateTime finalized_at;

    @Column(name = "finalized_by")
    private Integer finalized_by;

    @Column(name = "created_by")
    private Integer createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
