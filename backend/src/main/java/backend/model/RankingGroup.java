package backend.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import backend.entity.RankingDecision;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data

@Entity
@Table(name = "Ranking_Group")
public class RankingGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private int groupId;

    @Column(name = "group_name", length = 100, nullable = false)
    private String groupName;

    @Column(name = "num_employees")
    private int numEmployees;

    @Column(name = "current_ranking_decision", length = 100)
    private String current_ranking_decision;

    @Column(name = "created_by")
    private int createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // One-to-Many relationship with RankingDecision, delete child records when
    // parent is deleted
    @OneToMany(mappedBy = "rankingGroup", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference
    private List<RankingDecision> rankingDecisions;

    @Transient
    private String username;

    public RankingGroup() {
    }
}
