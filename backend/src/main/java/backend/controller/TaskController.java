package backend.controller;

import backend.config.exception.TaskException;
import backend.model.dto.TaskResponse;
import backend.model.entity.Task;
import backend.model.form.Task.AddTaskRequest;
import backend.model.form.Task.UpdateTaskRequest;
import backend.service.ITaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/task")
public class TaskController {
    private ITaskService iTaskService;

    @Autowired
    public TaskController(ITaskService iTaskService) {
        this.iTaskService = iTaskService;
    }

    @GetMapping
    public List<TaskResponse> getAllTasks() {
        List<Task> taskList = iTaskService.getTask();
        return iTaskService.getAllTaskResponse(taskList);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable int id) {
        Task task = iTaskService.getTaskById(id);
        if (task == null) {
            throw new TaskException("task not found");
        }
        TaskResponse taskResponse = iTaskService.getTaskResponseById(task);
        return ResponseEntity.ok(taskResponse);
    }

    @PostMapping("/add")
    public ResponseEntity<String> createTask(@RequestBody @Valid AddTaskRequest form) {
        iTaskService.createTaskByForm(form);
        return ResponseEntity.ok("Task successfully added");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTask(@PathVariable int id, @RequestBody @Valid UpdateTaskRequest form) {
        iTaskService.updateTaskByForm(id, form);
        return ResponseEntity.ok("Task successfully updated");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTaskById(@PathVariable int id) {
        Task task = iTaskService.getTaskById(id);
        if (task == null) {
            throw new TaskException("task not found for deletion");
        }
        iTaskService.deleteTaskById(id);
        return ResponseEntity.ok("Task successfully deleted id " + id);
    }
}
