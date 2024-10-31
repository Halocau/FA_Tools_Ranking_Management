package backend.model.form.RankingGroup;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class EditRankingGroupRequest {
    public String groupName;
    public Integer decisionId;
}
