package backend.service;

import backend.model.dto.TaskResponse;
import backend.model.entity.Task;
import backend.model.form.Task.AddTaskRequest;
import backend.model.form.Task.UpdateTaskRequest;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface ITaskService {
    // crud task

    public ResultPaginationDTO getTask(Specification<Task> spec, Pageable pageable);
    
    public List<Task> getAllTask();

    public Task getTaskById(int id);

    public Task addTask(Task task);

    public Task updateTask(Task task);

    public void deleteTaskById(int id);

    public Task findTaskByCreatedBy(int createdBy);

    // response
    public List<TaskResponse> getAllTaskResponse(List<Task> tasks);

    public TaskResponse getTaskResponseById(Task task);

    // form
    public void createTaskByForm(AddTaskRequest form);

    public void updateTaskByForm(int taskId, UpdateTaskRequest form);

}
