package backend.service;

import backend.model.dto.TaskWagesResponse;
import backend.model.entity.RankingTitle;
import backend.model.entity.TaskWages;
import backend.model.form.TasksWage.UpsertTasksWage;


import java.util.List;
import java.util.Optional;

public interface ITaskWagesService {
    //crud
    public Optional<TaskWages> findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId);

    public List<TaskWages> getTaskWages();

    public void deleteTaskWages(Integer rankingTitleId, Integer taskId);

    //form
    public void upsertTaskWages(UpsertTasksWage form, Integer rankingTitleId, Integer taskId);
    public void upsertTaskWagesList(List<UpsertTasksWage> forms);
}
