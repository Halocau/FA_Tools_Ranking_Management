package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.config.exception.exceptionEntity.CriteriaException;
import backend.dao.IAccount;
import backend.dao.IDecisionCriteriaRepository;
import backend.dao.ITaskRepository;
import backend.dao.ITaskWagesRepository;
import backend.model.dto.TaskResponse;
import backend.model.entity.Account;
import backend.model.entity.Task;
import backend.model.entity.TaskWages;
import backend.model.form.Task.AddTaskRequest;
import backend.model.form.Task.UpdateTaskRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.ITaskService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService implements ITaskService {
    private ITaskRepository iTaskRepository;
    private IAccount iAccount;
    private ModelMapper modelMapper;
    private ITaskWagesRepository iTaskWagesRepository;

    @Autowired
    public TaskService(ITaskRepository iTaskRepository, IAccount iAccount, ModelMapper modelMapper,
            ITaskWagesRepository iTaskWagesRepository) {
        this.iTaskRepository = iTaskRepository;
        this.iAccount = iAccount;
        this.modelMapper = modelMapper;
        this.iTaskWagesRepository = iTaskWagesRepository;
    }

    @Override
    public ResultPaginationDTO getTask(Specification<Task> spec, Pageable pageable) {
        Page<Task> pageTask = iTaskRepository.findAll(spec, pageable);
        return new PaginationUtils().buildPaginationDTO(pageTask);
    }

    @Override
    public List<Task> getAllTask() {
        return iTaskRepository.findAll();
    }

    @Override
    public Task getTaskById(int id) {
        return iTaskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    @Override
    @Transactional
    public Task addTask(Task task) {
        return iTaskRepository.save(task);
    }

    @Override
    @Transactional
    public Task updateTask(Task task) {
        return iTaskRepository.saveAndFlush(task);
    }

    @Override
    @Transactional
    public void deleteTaskById(int id) {
        // Kiểm tra xem task có tồn tại trong repository không
        if (!iTaskRepository.existsById(id)) {
            throw new EntityNotFoundException("Task not found with id: " + id);
        }

        // Kiểm tra xem task có tồn tại trong bảng Task_Wages không
        List<TaskWages> taskWagesList = iTaskWagesRepository.findByTaskId(id);
        if (taskWagesList != null && !taskWagesList.isEmpty()) {
            // Nếu danh sách không rỗng, có nghĩa là task đang được liên kết với Task_Wages
            throw new CriteriaException("Task cannot be deleted because it is associated with Task_Wages.");
        }

        // Nếu không có liên kết trong Task_Wages, tiếp tục xóa task
        iTaskRepository.deleteById(id);
    }

    @Override
    public Task findTaskByCreatedBy(int createdBy) {
        return iTaskRepository.findByCreatedBy(createdBy);
    }

    @Override
    public List<TaskResponse> getAllTaskResponse(List<Task> allTask) {
        List<TaskResponse> taskResponses = new ArrayList<>();

        for (Task task : allTask) {

            TaskResponse response = modelMapper.map(task, TaskResponse.class);

            if (task.getCreatedBy() == null) {
                response.setCreatedByName(null);
            } else {
                Account account = iAccount.findById(task.getCreatedBy()).orElse(null);
                response.setCreatedByName(account != null ? account.getUsername() : null);
            }
            taskResponses.add(response);
        }
        return taskResponses;
    }

    @Override
    public TaskResponse getTaskResponseById(Task task) {
        TaskResponse taskResponse = modelMapper.map(task, TaskResponse.class);
        return taskResponse;
    }

    @Override
    @Transactional
    public void createTaskByForm(AddTaskRequest form) {
        Task task = Task.builder()
                .taskName(form.getTaskName())
                .createdBy(form.getCreatedBy())
                .build();
        iTaskRepository.save(task);
    }

    @Override
    @Transactional
    public void updateTaskByForm(int id, UpdateTaskRequest form) {
        Task task = iTaskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
        task.setTaskName(form.getTaskName());
        task.setCreatedBy(form.getCreatedBy());
        iTaskRepository.saveAndFlush(task);
    }

}
