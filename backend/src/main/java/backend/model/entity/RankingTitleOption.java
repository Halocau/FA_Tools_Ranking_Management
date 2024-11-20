package backend.model.entity;

import backend.model.entity.Serializable.RankingTitleOptionSerializable;
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
@IdClass(RankingTitleOptionSerializable.class)  // Lớp Khóa Chính Hợp Thành
@Entity
@Table(name = "Ranking_Title_Option")
public class RankingTitleOption {

    @Id
    @Column(name = "ranking_title_id")
    private Integer rankingTitleId;  // Đảm bảo tên trường nhất quán

    @Id
    @Column(name = "option_id")
    private Integer optionId;        // Đảm bảo tên trường nhất quán

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDate createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDate updatedAt;

}
