package backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "Criteria")
@SuperBuilder
public class Criteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "criteria_id")
    private Integer criteriaId;

    @Column(name = "criteria_name", length = 100)
    private String criteriaName;

    @Column(name = "max_score")
    private Integer maxScore;

    @Column(name = "num_options")
    private Integer numOptions;

    @Column(name = "created_by")
    private Integer createdBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Add the OneToMany relationship to Options with cascading delete
    @OneToMany(mappedBy = "criteria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Options> options;

    public Criteria() {
    }
}
