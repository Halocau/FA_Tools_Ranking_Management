package backend.model.form.RankingGroup;

import backend.model.validation.RankingGroup.RankingGroupNameNotExits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;

@Data
public class AddNewGroup {
    @NotBlank
    @Length(max = 25)
    @RankingGroupNameNotExits
    private String groupName;

    @NotNull
    private int createBy;


}
