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
import backend.model.form.DecisionTasks.AddDecisionTasks;
import backend.service.IDecisionTasksService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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
    public Optional<DecisionTasks> findByDecisionIdAndTaskId(int decisionId, int taskId) {
        return iDecisionTasksRepository.findByDecisionIdAndTaskId(decisionId, taskId);
    }

    @Override
    public List<DecisionTasks> getAllDecisionTasks() {
        return iDecisionTasksRepository.findAll();
    }


    @Override
    @Transactional
    public DecisionTasks updateDecisionTask(DecisionTasks decisionTasks) {
        return iDecisionTasksRepository.saveAndFlush(decisionTasks);
    }

    @Override
    @Transactional
    public void deleteDecisionTask(Integer decisionId, Integer taskId) {
        Optional<DecisionTasks> decisionTasks = findByDecisionIdAndTaskId(decisionId, taskId);
        if (decisionTasks.isEmpty()) {
            throw new EntityNotFoundException("Decision Task Not Found");
        }
        iDecisionTasksRepository.delete(decisionTasks.get());
    }

    @Override
    public List<DecisionTasksResponse> getDecisionTasksByDecisionId(Integer decisionId) {
        List<DecisionTasks> decisionTasks = iDecisionTasksRepository.findByDecisionId(decisionId);

        // Lấy danh sách các Task liên quan đến decisionId
        List<Task> tasks = decisionTasks.stream()
                .map(decisionTask -> iTaskRepository.findById(decisionTask.getTaskId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        // Chuẩn bị dữ liệu để giảm truy vấn
        Map<Integer, List<TaskWages>> taskWagesMap = new HashMap<>();
        Map<Integer, RankingTitle> rankingTitleMap = new HashMap<>();

        for (Task task : tasks) {
            // Lấy danh sách TaskWages cho từng Task
            List<TaskWages> taskWagesList = iTaskWagesRepository.findByTaskId(task.getTaskId());

            // Lọc TaskWages dựa trên RankingTitle có cùng decisionId
            List<TaskWages> filteredTaskWages = taskWagesList.stream()
                    .filter(taskWage -> {
                        RankingTitle rankingTitle = iRankingTitleRepository.findById(taskWage.getRankingTitleId()).orElse(null);
                        return rankingTitle != null && rankingTitle.getDecisionId().equals(decisionId);
                    })
                    .collect(Collectors.toList());

            taskWagesMap.put(task.getTaskId(), filteredTaskWages);

            // Lưu thông tin RankingTitle vào map
            for (TaskWages taskWage : filteredTaskWages) {
                rankingTitleMap.putIfAbsent(taskWage.getRankingTitleId(),
                        iRankingTitleRepository.findById(taskWage.getRankingTitleId()).orElse(null));
            }
        }

        // Ánh xạ dữ liệu sang DTO
        List<DecisionTasksResponse> response = new ArrayList<>();
        for (DecisionTasks task : decisionTasks) {
            DecisionTasksResponse taskResponse = new DecisionTasksResponse();
            taskResponse.setDecisionId(task.getDecisionId());
            taskResponse.setTaskId(task.getTaskId());
            Task taskFromDb = iTaskRepository.findById(task.getTaskId()).orElse(null);
            if (taskFromDb != null) {
                taskResponse.setTaskName(taskFromDb.getTaskName());
            }

            List<TaskWagesResponse> taskWages = new ArrayList<>();
            List<TaskWages> taskWagesList = taskWagesMap.get(task.getTaskId());
            if (taskWagesList != null) {
                for (TaskWages taskWage : taskWagesList) {
                    TaskWagesResponse taskWageResponse = new TaskWagesResponse();
                    taskWageResponse.setRankingTitleId(taskWage.getRankingTitleId());
                    taskWageResponse.setWorkingHourWage(taskWage.getWorkingHourWage());
                    taskWageResponse.setOvertimeWage(taskWage.getOvertimeWage());

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


    //UPDATE AND ADD
    @Override
    @Transactional
    public void addDecisionTasks(AddDecisionTasks form, Integer decisionId, Integer taskId) {
        if (form == null || decisionId == null || taskId == null) {
            throw new IllegalArgumentException("Form or input param must not be null");
        }

        // Kiểm tra xem đã có DecisionTask với decisionId và taskId chưa
        Optional<DecisionTasks> decisionTasks = findByDecisionIdAndTaskId(decisionId, taskId);

        // Nếu không có, tiến hành thêm mới
        if (decisionTasks.isEmpty()) {
            DecisionTasks decisionTask = DecisionTasks.builder()
                    .decisionId(form.getDecisionId())
                    .taskId(form.getTaskId())
                    .build();
            iDecisionTasksRepository.save(decisionTask);
        }
        // Nếu đã có rồi thì có thể tùy chọn xử lý thêm, ví dụ như trả về thông báo hoặc không làm gì
    }


    @Override
    @Transactional
    public void addDecisionTasksList(List<AddDecisionTasks> forms) {
        if (forms == null || forms.isEmpty()) {
            throw new IllegalArgumentException("The list of forms cannot be null or empty");
        }
        // Lặp qua từng form trong danh sách và thêm vào cơ sở dữ liệu nếu chưa tồn tại
        for (AddDecisionTasks form : forms) {
            if (form == null || form.getDecisionId() == null || form.getTaskId() == null) {
                throw new IllegalArgumentException("Form or input param must not be null");
            }

            // Kiểm tra xem có tồn tại DecisionTasks với decisionId và taskId không
            Optional<DecisionTasks> decisionTasks = findByDecisionIdAndTaskId(form.getDecisionId(), form.getTaskId());

            // Nếu không có, tiến hành thêm mới
            if (decisionTasks.isEmpty()) {
                DecisionTasks decisionTask = DecisionTasks.builder()
                        .decisionId(form.getDecisionId())
                        .taskId(form.getTaskId())
                        .build();
                iDecisionTasksRepository.save(decisionTask);
            }
        }
    }


}
