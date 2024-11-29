package backend.model.form.BulkRankingHistory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class CreateBulkRankingHistoryRequest {
    @NotBlank
    @Size(min = 3, max = 100)
    private String fileName;

    @NotBlank
    private String filePath;

    @NotNull
    private Integer rankingGroupId;

    @NotNull
    private Integer uploadBy;

    @NotBlank
    private String status;
    private String note;
}
