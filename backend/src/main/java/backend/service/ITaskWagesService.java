package backend.service;

import backend.model.dto.TaskWagesResponse;
import backend.model.entity.RankingTitle;
import backend.model.entity.TaskWages;
import backend.model.form.TasksWage.UpsertTasksWage;


import java.util.List;

public interface ITaskWagesService {
    //crud
    public TaskWages findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId);

    public List<TaskWages> getTaskWages();

    public void deleteTaskWages(Integer rankingTitleId, Integer taskId);

    //form
    public void upsertTaskWages(UpsertTasksWage form, Integer rankingTitleId, Integer taskId);
}
