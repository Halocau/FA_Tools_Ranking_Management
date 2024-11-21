package backend.service.Implement;

import backend.dao.IRankingTitleRepository;
import backend.dao.ITaskRepository;
import backend.dao.ITaskWagesRepository;
import backend.model.dto.TaskWagesResponse;
import backend.model.entity.RankingTitle;
import backend.model.entity.TaskWages;
import backend.model.form.TasksWage.UpsertTasksWage;
import backend.service.ITaskWagesService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskWagesService implements ITaskWagesService {
    private ITaskWagesRepository iTaskWagesRepository;
    private ModelMapper modelMapper;
    private ITaskRepository iTaskRepository;
    private IRankingTitleRepository iRankingTitleRepository;

    @Autowired
    public TaskWagesService(ITaskWagesRepository iTaskWagesRepository, ModelMapper modelMapper, ITaskRepository iTaskRepository, IRankingTitleRepository iRankingTitleRepository) {
        this.iTaskWagesRepository = iTaskWagesRepository;
        this.modelMapper = modelMapper;
        this.iTaskRepository = iTaskRepository;
        this.iRankingTitleRepository = iRankingTitleRepository;
    }

    @Override
    public TaskWages findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId) {
        return iTaskWagesRepository.findByRankingTitleIdAndTaskId(rankingTitleId, taskId);
    }

    @Override
    public List<TaskWages> getTaskWages() {
        return iTaskWagesRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteTaskWages(Integer rankingTitleId, Integer taskId) {
        if (rankingTitleId == null || taskId == null) {
            throw new IllegalArgumentException("param RankingTitleId và TaskId not null");
        }

        TaskWages find = iTaskWagesRepository.findByRankingTitleIdAndTaskId(rankingTitleId, taskId);
        if (find == null) {
            throw new EntityNotFoundException("Task wages not found with rankingTitleId: "
                    + rankingTitleId + ", taskId: " + taskId);
        }
        iTaskWagesRepository.delete(find);
    }

    /**
     * Form
     */
    @Override
    @Transactional
    public void upsertTaskWages(UpsertTasksWage form, Integer rankingTitleId, Integer taskId) {
        if (form == null || rankingTitleId == null || taskId == null) {
            throw new IllegalArgumentException("Form or input param not null");
        }

        TaskWages findTaskWages = iTaskWagesRepository.findByRankingTitleIdAndTaskId(rankingTitleId, taskId);
        if (findTaskWages == null) {
            TaskWages newTaskWages = TaskWages.builder()
                    .rankingTitleId(form.getRankingTitleId())
                    .taskId(form.getTaskId())
                    .workingHourWage(form.getWorkingHourWage())
                    .overtimeWage(form.getOvertimeWage())
                    .build();
            iTaskWagesRepository.save(newTaskWages);
        } else {
            findTaskWages.setWorkingHourWage(form.getWorkingHourWage());
            findTaskWages.setOvertimeWage(form.getOvertimeWage());
            iTaskWagesRepository.saveAndFlush(findTaskWages);
        }
    }
}
