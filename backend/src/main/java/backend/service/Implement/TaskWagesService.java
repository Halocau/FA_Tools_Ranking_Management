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
import java.util.Optional;

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
    public Optional<TaskWages> findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId) {
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
            throw new IllegalArgumentException("param RankingTitleId và TaskId không được null");
        }

        Optional<TaskWages> find = iTaskWagesRepository.findByRankingTitleIdAndTaskId(rankingTitleId, taskId);
        if (find.isEmpty()) { // Sử dụng isEmpty() thay vì null
            throw new EntityNotFoundException("Task wages not found with rankingTitleId: "
                    + rankingTitleId + ", taskId: " + taskId);
        }

        // Giải nén Optional và xóa đối tượng
        iTaskWagesRepository.delete(find.get());
    }

    @Override
    @Transactional
    public void deleteTaskWagesByRankingTitleId(Integer rankingTitleId) {
        List<TaskWages> find = iTaskWagesRepository.findByRankingTitleId(rankingTitleId);
        if (!find.isEmpty()) {
            // Xóa tất cả các bản ghi này
            iTaskWagesRepository.deleteAll(find);
        }
    }

    /**
     * Form
     */
    @Override //UPDATE AND ADD tasksWage
    @Transactional
    public void upsertTaskWages(UpsertTasksWage form, Integer rankingTitleId, Integer taskId) {
        if (form == null || rankingTitleId == null || taskId == null) {
            throw new IllegalArgumentException("Form or input param must not be null");
        }

        Optional<TaskWages> findTaskWages = iTaskWagesRepository.findByRankingTitleIdAndTaskId(rankingTitleId, taskId);
        if (findTaskWages.isEmpty()) {
            // Insert
            TaskWages newTaskWages = TaskWages.builder()
                    .rankingTitleId(form.getRankingTitleId())
                    .taskId(form.getTaskId())
                    .workingHourWage(form.getWorkingHourWage())
                    .overtimeWage(form.getOvertimeWage())
                    .build();
            iTaskWagesRepository.save(newTaskWages);
        } else {
            // Update
            TaskWages existingTaskWages = findTaskWages.get();
            existingTaskWages.setWorkingHourWage(form.getWorkingHourWage());
            existingTaskWages.setOvertimeWage(form.getOvertimeWage());
            iTaskWagesRepository.save(existingTaskWages);
        }
    }

    @Override  //UPDATE AND ADD LIST tasksWage
    @Transactional
    public void upsertTaskWagesList(List<UpsertTasksWage> forms) {
        if (forms == null || forms.isEmpty()) {
            throw new IllegalArgumentException("The list of forms cannot be null or empty");
        }

        for (UpsertTasksWage form : forms) {
            upsertTaskWages(form, form.getRankingTitleId(), form.getTaskId());
        }
    }
}
