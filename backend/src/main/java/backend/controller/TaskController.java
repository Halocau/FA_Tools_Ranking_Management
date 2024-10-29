package backend.controller;

import backend.model.dto.TaskResponse;
import backend.model.entity.Task;
import backend.service.ITaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
