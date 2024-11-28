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
    public ResponseEntity<ResultPaginationDTO> getAllTasks(
            @Filter Specification<Task> spec,
            Pageable pageable
    ) {
        // Lấy đối tượng phân trang
        ResultPaginationDTO allTask = iTaskService.getTask(spec, pageable);

        // Ép kiểu kết quả về danh sách Task trước khi truyền vào getAllTaskResponse
        List<TaskResponse> taskResponses = iTaskService.getAllTaskResponse((List<Task>) allTask.getResult());

        // Cập nhật lại kết quả trong ResultPaginationDTO với danh sách TaskResponse
        allTask.setResult(taskResponses);

        // Trả về ResponseEntity với ResultPaginationDTO
        return ResponseEntity.status(HttpStatus.OK).body(allTask);
    }

    @GetMapping("/all")
        public ResponseEntity<List<TaskResponse>> getAllTaskResponse() {
            List<Task> allTask = iTaskService.getAllTask();
            List<TaskResponse> taskResponses = iTaskService.getAllTaskResponse(allTask);
            return ResponseEntity.ok(taskResponses);
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
