package backend.model.dto;

import lombok.Data;

@Data
public class TaskWagesResponse {

    private int rankingTitleId;
    private String titleName;
    private Float workingHourWage;
    private Float overtimeWage;
}
