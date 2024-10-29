package backend.service.Implement;

import backend.dao.ITaskRepository;
import backend.model.dto.TaskResponse;
import backend.model.entity.Task;
import backend.model.form.Task.AddTaskRequest;
import backend.service.ITaskService;
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
    public Task addTask(Task task) {
        return iTaskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task) {
        return iTaskRepository.saveAndFlush(task);
    }

    @Override
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
    public void createTaskByForm(AddTaskRequest form) {

    }
}
