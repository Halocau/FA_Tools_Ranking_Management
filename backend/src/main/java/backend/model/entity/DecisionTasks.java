package backend.model.entity;

import backend.model.entity.Serializable.DecisionTasksSerializable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(DecisionTasksSerializable.class)
@Entity
@Table(name = "Decision_Tasks")
public class DecisionTasks {
    @Id
    @Column(name = "decision_id")
    private Integer decisionId;

    @Id
    @Column(name = "task_id")
    private Integer taskId;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDate createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDate updatedAt;
}
