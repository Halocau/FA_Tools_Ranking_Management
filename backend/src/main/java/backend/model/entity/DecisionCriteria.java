package backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@IdClass(DecisionCriteriaId.class)
@Table(name="Decision_Criteria")
@SuperBuilder
public class DecisionCriteria {
    @Id
    @Column(name = "decision_id")
    private Integer decisionId;

    @Id
    @Column(name = "criteria_id")
    private Integer criteriaId;

    @Column(name = "weight")
    private Float weight;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
