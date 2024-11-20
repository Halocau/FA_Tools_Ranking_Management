package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.dao.IAccount;
import backend.dao.IDecisionCriteriaRepository;
import backend.dao.ITaskRepository;
import backend.dao.ITaskWagesRepository;
import backend.model.dto.TaskResponse;
import backend.model.entity.Account;
import backend.model.entity.Task;
import backend.model.form.Task.AddTaskRequest;
import backend.model.form.Task.UpdateTaskRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.ITaskService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService implements ITaskService {
    private ITaskRepository iTaskRepository;
    private IAccount iAccount;
    private ModelMapper modelMapper;
    private ITaskWagesRepository iTaskWagesRepository;
    private IDecisionCriteriaRepository idDecisionCriteriaRepository;

    @Autowired
    public TaskService(ITaskRepository iTaskRepository, IAccount iAccount, ModelMapper modelMapper, ITaskWagesRepository iTaskWagesRepository, IDecisionCriteriaRepository idDecisionCriteriaRepository) {
        this.iTaskRepository = iTaskRepository;
        this.iAccount = iAccount;
        this.modelMapper = modelMapper;
        this.iTaskWagesRepository = iTaskWagesRepository;
        this.idDecisionCriteriaRepository = idDecisionCriteriaRepository;
    }

    @Override
    public ResultPaginationDTO getTask(Specification<Task> spec, Pageable pageable) {
        Page<Task> pageTask = iTaskRepository.findAll(spec, pageable);
        return new PaginationUtils().buildPaginationDTO(pageTask);
    }

    @Override
    public Task getTaskById(int id) {
        return iTaskRepository.findById(id).get();
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
        Task task = iTaskRepository.findById(id).get();
        // Account oldManager = department.getManager();
        // if(oldManager.getId() != form.getManagerId()) {
        // // update role of old manager
        // oldManager.setRole(Role.EMPLOYEE);
        // accountRepository.save(oldManager);
        // // update role of new manager
        // Account newManager = accountRepository.findById(form.getManagerId()).get();
        // newManager.setRole(Role.MANAGER);
        // // update manager of department
        // department.setManager(newManager);
        // }
        task.setTaskName(form.getTaskName());
        task.setCreatedBy(form.getCreatedBy());
        iTaskRepository.saveAndFlush(task);
    }

}
