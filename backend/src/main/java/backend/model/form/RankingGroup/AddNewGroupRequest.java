package backend.model.form.RankingGroup;

import backend.model.validation.RankingGroup.RankingGroupNameNotExits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class AddNewGroupRequest {
    @NotBlank
    @Length(max = 25)
    @RankingGroupNameNotExits
    private String groupName;

    @NotNull
    private int createdBy;


}
