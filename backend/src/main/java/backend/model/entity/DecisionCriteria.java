package backend.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.io.Serializable;

@Entity
@Table(name = "Decision_Criteria")
public class DecisionCriteria {

    @EmbeddedId
    private DecisionCriteriaId id = new DecisionCriteriaId();

    @ManyToOne
    @MapsId("decisionId")
    @JoinColumn(name = "decision_id")
    private RankingDecision rankingDecision;

    @ManyToOne
    @MapsId("criteriaId")
    @JoinColumn(name = "criteria_id")
    private Criteria criteria;

    @Column(name = "weight")
    private Float weight;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and Setters

    // Composite Key Class
    @Embeddable
    public static class DecisionCriteriaId implements Serializable {
        private Integer decisionId;
        private Integer criteriaId;

        // Constructors, equals(), and hashCode()
    }
}
