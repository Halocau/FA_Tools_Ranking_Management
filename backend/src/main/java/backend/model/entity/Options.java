package backend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "Options")
@SuperBuilder
public class Options {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private int optionId;

    @Column(name = "criteria_id")
    private Integer criteriaId;

    @ManyToOne
    @JoinColumn(name = "criteria_id", insertable = false, updatable = false)
    @JsonIgnore// Bỏ qua tham chiếu ngược khi chuyển đổi sang JSON
    private Criteria criteria;

    @Column(name = "option_name")
    private String optionName;

    @Column(name = "score")
    private int score;

    @Column(name = "description")
    private String description;

    @Column(name = "created_by")
    private int createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.DETACH,
                    CascadeType.MERGE,
                    CascadeType.PERSIST,
                    CascadeType.REFRESH
            })
    @JoinTable(
            name = "Ranking_Title_Option",
            joinColumns = @JoinColumn(name = "option_id"),
            inverseJoinColumns = @JoinColumn(name = "ranking_title_id")
    )
    private List<RankingTitle> rankingTitles;
}
