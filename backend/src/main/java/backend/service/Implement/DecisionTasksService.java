package backend.service.Implement;

import backend.dao.IDecisionTasksRepository;
import backend.dao.IRankingTitleRepository;
import backend.dao.ITaskRepository;
import backend.dao.ITaskWagesRepository;
import backend.model.dto.DecisionTasksResponse;
import backend.model.dto.TaskWagesResponse;
import backend.model.entity.DecisionTasks;
import backend.model.entity.RankingTitle;
import backend.model.entity.Task;
import backend.model.entity.TaskWages;
import backend.service.IDecisionTasksService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DecisionTasksService implements IDecisionTasksService {
    private IDecisionTasksRepository iDecisionTasksRepository;
    private ModelMapper modelMapper;
    private ITaskRepository iTaskRepository;
    private IRankingTitleRepository iRankingTitleRepository;
    private ITaskWagesRepository iTaskWagesRepository;

    @Autowired
    public DecisionTasksService(IDecisionTasksRepository iDecisionTasksRepository, ModelMapper modelMapper, ITaskRepository iTaskRepository, IRankingTitleRepository iRankingTitleRepository, ITaskWagesRepository iTaskWagesRepository) {
        this.iDecisionTasksRepository = iDecisionTasksRepository;
        this.modelMapper = modelMapper;
        this.iTaskRepository = iTaskRepository;
        this.iRankingTitleRepository = iRankingTitleRepository;
        this.iTaskWagesRepository = iTaskWagesRepository;
    }

    @Override
    public List<DecisionTasks> findByDecisionId(int decisionId) {
        return iDecisionTasksRepository.findByDecisionId(decisionId);
    }

    @Override
    public DecisionTasks findByDecisionIdAndTaskId(int decisionId, int taskId) {
        return iDecisionTasksRepository.findByDecisionIdAndTaskId(decisionId, taskId);
    }

    @Override
    public List<DecisionTasks> getAllDecisionTasks() {
        return iDecisionTasksRepository.findAll();
    }

    @Override
    @Transactional
    public DecisionTasks addDecisionTask(DecisionTasks decisionTasks) {
        return iDecisionTasksRepository.save(decisionTasks);
    }

    @Override
    @Transactional
    public DecisionTasks updateDecisionTask(DecisionTasks decisionTasks) {
        return iDecisionTasksRepository.saveAndFlush(decisionTasks);
    }

    @Override
    @Transactional
    public void deleteDecisionTask(int decisionId, int taskId) {
        DecisionTasks decisionTasks = findByDecisionIdAndTaskId(decisionId, taskId);
        if (decisionTasks == null) {
            throw new EntityNotFoundException("Decision Task Not Found");
        }
        iDecisionTasksRepository.delete(decisionTasks);
    }

    @Override
    public List<DecisionTasksResponse> getDecisionTasksByDecisionId(Integer decisionId) {
        List<DecisionTasks> decisionTasks = iDecisionTasksRepository.findByDecisionId(decisionId);

        // Ánh xạ từ DecisionTasks sang DTO
        List<DecisionTasksResponse> response = new ArrayList<>();

        for (DecisionTasks task : decisionTasks) {
            DecisionTasksResponse taskResponse = new DecisionTasksResponse();
            taskResponse.setDecisionId(task.getDecisionId());
            taskResponse.setTaskId(task.getTaskId());

            // Lấy tên task từ bảng Task
            Optional<Task> optionalTask = iTaskRepository.findById(task.getTaskId());
            if (optionalTask.isPresent()) {
                Task taskFromDb = optionalTask.get();
                taskResponse.setTaskName(taskFromDb.getTaskName());  // Lấy taskName từ bảng Task
            }

            List<TaskWagesResponse> taskWages = new ArrayList<>();

            // Lấy danh sách TaskWages liên quan đến taskId
            List<TaskWages> taskWagesList = iTaskWagesRepository.findByTaskId(task.getTaskId());

            for (TaskWages taskWage : taskWagesList) {
                TaskWagesResponse taskWageResponse = new TaskWagesResponse();
                taskWageResponse.setRankingTitleId(taskWage.getRankingTitleId());  // RankingTitleId từ TaskWages
                taskWageResponse.setWorkingHourWage(taskWage.getWorkingHourWage());
                taskWageResponse.setOvertimeWage(taskWage.getOvertimeWage());

                // Lấy titleName từ bảng RankingTitle
                Optional<RankingTitle> optionalRankingTitle = iRankingTitleRepository.findById(taskWage.getRankingTitleId());
                if (optionalRankingTitle.isPresent()) {
                    RankingTitle rankingTitle = optionalRankingTitle.get();
                    taskWageResponse.setTitleName(rankingTitle.getTitleName());  // Lấy titleName từ bảng RankingTitle
                }

                taskWages.add(taskWageResponse);
            }

            taskResponse.setTaskWages(taskWages);
            response.add(taskResponse);
        }

        return response;
    }


}
