package backend.model.entity;

import backend.model.entity.Serializable.RankingTitleOptionSerializable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RankingTitleOptionSerializable.class)
@Entity
@Table(name = "Ranking_Title_Option")
public class RankingTitleOption {
    @Id
    @Column(name = "option_id")
    private Integer RankingTitleId;

    @Id
    @Column(name = "ranking_title_id")
    private Integer OptionId;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;
}
