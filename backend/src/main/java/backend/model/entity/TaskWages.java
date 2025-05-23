package backend.model.entity;

import backend.model.entity.Serializable.TaskWagesSerializable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@IdClass(TaskWagesSerializable.class)
@Entity
@Table(name = "Task_Wages")
public class TaskWages {
    @Id
    @Column(name = "ranking_title_id")
    private Integer rankingTitleId;

    @Id
    @Column(name = "task_id")
    private Integer taskId;

    @Column(name = "working_hour_wage")
    private Float workingHourWage;

    @Column(name = "overtime_wage")
    private Float overtimeWage;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDate createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDate updatedAt;
}
