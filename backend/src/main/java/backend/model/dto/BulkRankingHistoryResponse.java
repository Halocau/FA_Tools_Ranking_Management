package backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
public class BulkRankingHistoryResponse {
    private Integer historyId;
    private String fileName;
    private String filePath;
    private String decisionName;
    private LocalDateTime uploadAt;
    private String uploadByName;
    private String status;
    private String note;
}
