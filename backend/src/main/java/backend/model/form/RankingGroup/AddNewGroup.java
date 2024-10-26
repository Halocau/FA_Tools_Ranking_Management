package backend.model.form.RankingGroup;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AddNewGroup {
    @NotBlank
    @NotNull
    private String groupName;


    @NotNull
    private int createBy;


}
