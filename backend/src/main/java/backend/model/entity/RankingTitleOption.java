package backend.model.entity;

import backend.model.entity.Serializable.RankingTitleOptionSerializable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@IdClass(RankingTitleOptionSerializable.class)  // Composite Key Class
@Entity
@Table(name = "Ranking_Title_Option")
public class RankingTitleOption {
    @Id
    @Column(name = "ranking_title_id")
    private Integer rankingTitleId;  // Consistent field naming

    @Id
    @Column(name = "option_id")
    private Integer optionId;        // Consistent field naming

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;
}
