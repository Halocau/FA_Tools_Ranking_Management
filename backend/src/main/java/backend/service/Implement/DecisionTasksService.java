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

import java.util.*;

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

        // Chuẩn bị dữ liệu trước để giảm truy vấn
        Map<Integer, Task> taskMap = new HashMap<>();
        Map<Integer, List<TaskWages>> taskWagesMap = new HashMap<>();
        Map<Integer, RankingTitle> rankingTitleMap = new HashMap<>();

        // Lấy toàn bộ Task và lưu vào Map
        for (DecisionTasks decisionTask : decisionTasks) {
            Integer taskId = decisionTask.getTaskId();
            if (!taskMap.containsKey(taskId)) {
                Optional<Task> optionalTask = iTaskRepository.findById(taskId);
                optionalTask.ifPresent(task -> taskMap.put(taskId, task));
            }
        }

        // Lấy toàn bộ TaskWages và lưu vào Map theo taskId
        for (Integer taskId : taskMap.keySet()) {
            List<TaskWages> taskWagesList = iTaskWagesRepository.findByTaskId(taskId);
            taskWagesMap.put(taskId, taskWagesList);

            // Lấy RankingTitleId từ TaskWages
            for (TaskWages taskWage : taskWagesList) {
                Integer rankingTitleId = taskWage.getRankingTitleId();
                if (!rankingTitleMap.containsKey(rankingTitleId)) {
                    Optional<RankingTitle> optionalRankingTitle = iRankingTitleRepository.findById(rankingTitleId);
                    optionalRankingTitle.ifPresent(rankingTitle -> rankingTitleMap.put(rankingTitleId, rankingTitle));
                }
            }
        }

        // Ánh xạ từ DecisionTasks sang DTO
        List<DecisionTasksResponse> response = new ArrayList<>();

        for (DecisionTasks task : decisionTasks) {
            DecisionTasksResponse taskResponse = new DecisionTasksResponse();
            taskResponse.setDecisionId(task.getDecisionId());
            taskResponse.setTaskId(task.getTaskId());

            // Lấy taskName từ Map taskMap
            Task taskFromDb = taskMap.get(task.getTaskId());
            if (taskFromDb != null) {
                taskResponse.setTaskName(taskFromDb.getTaskName());
            }

            List<TaskWagesResponse> taskWages = new ArrayList<>();

            // Lấy danh sách TaskWages từ Map
            List<TaskWages> taskWagesList = taskWagesMap.get(task.getTaskId());
            if (taskWagesList != null) {
                for (TaskWages taskWage : taskWagesList) {
                    TaskWagesResponse taskWageResponse = new TaskWagesResponse();
                    taskWageResponse.setRankingTitleId(taskWage.getRankingTitleId());
                    taskWageResponse.setWorkingHourWage(taskWage.getWorkingHourWage());
                    taskWageResponse.setOvertimeWage(taskWage.getOvertimeWage());

                    // Lấy titleName từ Map rankingTitleMap
                    RankingTitle rankingTitle = rankingTitleMap.get(taskWage.getRankingTitleId());
                    if (rankingTitle != null) {
                        taskWageResponse.setTitleName(rankingTitle.getTitleName());
                    }

                    taskWages.add(taskWageResponse);
                }
            }

            taskResponse.setTaskWages(taskWages);
            response.add(taskResponse);
        }

        return response;
    }


}
