package backend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Bulk_Ranking_History")
@SuperBuilder
public class BulkRankingHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private int historyId;

    @Column(name = "file_name")
    @Size(min = 3, max = 100)
    private String fileName;

    @Column(name = "ranking_group_id")
    private Integer rankingGroupId;

    @CreationTimestamp
    @Column(name = "upload_at")
    private LocalDateTime uploadAt;

    @Column(name = "upload_by")
    private Integer uploadBy;

    @Column(name = "status")
    private String status;

    @Column(name = "note")
    private String note;
}
