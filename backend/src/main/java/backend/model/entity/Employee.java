package backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;

@Entity
@Table(name = "Employee")
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "group_id")
    private Integer groupId;
    @Column(name = "rank_title_id")
    private Integer rankingTitleId;

    @Column(name = "bulk_import_id")
    private Integer bulkImportId;

    @Column(name = "ranking_decision_id")
    private Integer rankingDecisionId;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDate createdDate;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDate updatedDate;
}
