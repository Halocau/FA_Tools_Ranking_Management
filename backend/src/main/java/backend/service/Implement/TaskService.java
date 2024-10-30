package backend.service.Implement;

import backend.dao.ITaskRepository;
import backend.model.dto.TaskResponse;
import backend.model.entity.Task;
import backend.model.form.Task.AddTaskRequest;
import backend.model.form.Task.UpdateTaskRequest;
import backend.service.ITaskService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService implements ITaskService {
    private ITaskRepository iTaskRepository;
    private ModelMapper modelMapper;

    @Autowired
    public TaskService(ITaskRepository iTaskRepository, ModelMapper modelMapper) {
        this.iTaskRepository = iTaskRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<Task> getTask() {
        return iTaskRepository.findAll();
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

    //Response
    @Override
    public List<TaskResponse> getAllTaskResponse(List<Task> tasks) {
        List<TaskResponse> taskResponses = new ArrayList<>();
        for (Task task : tasks) {
            taskResponses.add(modelMapper.map(task, TaskResponse.class));
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
//        Account oldManager = department.getManager();
//        if(oldManager.getId() != form.getManagerId()) {
//            // update role of old manager
//            oldManager.setRole(Role.EMPLOYEE);
//            accountRepository.save(oldManager);
//            // update role of new manager
//            Account newManager = accountRepository.findById(form.getManagerId()).get();
//            newManager.setRole(Role.MANAGER);
//            // update manager of department
//            department.setManager(newManager);
//        }
        task.setTaskName(form.getTaskName());
        task.setCreatedBy(form.getCreatedBy());
        iTaskRepository.saveAndFlush(task);
    }


}
