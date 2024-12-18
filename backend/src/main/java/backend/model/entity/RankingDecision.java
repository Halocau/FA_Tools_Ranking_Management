package backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Ranking_Decision")
@SuperBuilder
public class RankingDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "decision_id")
    private int decisionId; //hihi

    @Column(name = "decision_name")
    private String decisionName;

    @Column(name = "status")
    private String status;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @Column(name = "finalized_by")
    private Integer finalizedBy;

    @Column(name = "created_by")
    private Integer createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    //Task <-> RankingDecision
    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.DETACH,
                    CascadeType.MERGE,
                    CascadeType.PERSIST,
                    CascadeType.REFRESH
            })
    @JoinTable(
            name = "Decision_Tasks",
            joinColumns = @JoinColumn(name = "decision_id"),
            inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    private List<Task> tasks;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    @JoinTable(
            name = "Decision_Criteria",
            joinColumns = @JoinColumn(name = "decision_id"),
            inverseJoinColumns = @JoinColumn(name = "criteria_id")
    )
    private List<Criteria> criterias;

    @OneToMany(mappedBy = "decisionId", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DecisionCriteria> decisionCriteria;

    @OneToMany(mappedBy = "decisionId", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DecisionTasks> decisionTasks;

//    @OneToMany(mappedBy = "rankingDecisionId", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
//    private List<Employee> employees;

//    @OneToMany(mappedBy = "current_ranking_decision", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
//    private List<RankingGroup> rankingGroups;

    @OneToMany(mappedBy = "decisionId", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<RankingTitle> rankingTitles;

}
//orphanRemoval = true: Khi muốn tự động xóa các bản ghi con bị loại bỏ khỏi danh sách liên kết trong thực thể cha.
