package backend.controller;

import backend.config.common.PaginationUtils;

import backend.config.exception.exceptionEntity.TaskException;
import backend.model.dto.TaskResponse;
import backend.model.entity.Task;
import backend.model.form.Task.AddTaskRequest;
import backend.model.form.Task.UpdateTaskRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.ITaskService;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/task")
public class TaskController {
    private ITaskService iTaskService;

    @Autowired
    public TaskController(ITaskService iTaskService) {
        this.iTaskService = iTaskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam("page") Optional<String> page,
            @RequestParam("size") Optional<String> size
    ) {
        Pageable pageable = PaginationUtils.createPageable(page, size);
        List<TaskResponse> taskResponses = iTaskService.getAllTaskResponse(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(taskResponses);
    }


    //test pagination
    @GetMapping("/full")
    public ResponseEntity<ResultPaginationDTO> getTaskList(
            @Filter Specification<Task> spec,
             Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(this.iTaskService.getTask(spec, pageable));
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
