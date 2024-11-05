package backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OptionResponse {
    private int optionId;
    private String optionName;
    private Integer score;
    private String description;
}
