package backend.model.form.Feedback;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class upsertFeedBackRequest {
    private String note;
    @NotNull
    private Integer decisionId;
    private Integer createdBy;
}
