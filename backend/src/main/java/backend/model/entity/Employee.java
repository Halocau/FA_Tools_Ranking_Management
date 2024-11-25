package backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.List;

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

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.DETACH,
                    CascadeType.MERGE,
                    CascadeType.PERSIST,
                    CascadeType.REFRESH
            })
    @JoinTable(
            name = "Employee_Criteria",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "criteria_id")
    )
    private List<Criteria> criterias;
}
