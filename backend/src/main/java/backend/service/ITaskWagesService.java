package backend.service;

import backend.model.dto.TaskWagesResponse;
import backend.model.entity.RankingTitle;
import backend.model.entity.TaskWages;

import java.util.List;

public interface ITaskWagesService {
    //crud
    public TaskWages findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId);
    public List<TaskWages> getTaskWages();
    public TaskWages addTaskWages(TaskWages taskWages);
    public TaskWages updateTaskWages(TaskWages taskWages);
    public void deleteTaskWages(Integer rankingTitleId, Integer taskId);
}
