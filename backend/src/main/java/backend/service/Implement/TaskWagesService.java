package backend.service.Implement;

import backend.dao.IRankingTitleRepository;
import backend.dao.ITaskRepository;
import backend.dao.ITaskWagesRepository;
import backend.model.dto.TaskWagesResponse;
import backend.model.entity.RankingTitle;
import backend.model.entity.TaskWages;
import backend.service.ITaskWagesService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskWagesService implements ITaskWagesService {
    private ITaskWagesRepository iTaskWagesRepository;
    private ModelMapper modelMapper;
    private ITaskRepository iTaskRepository;
    private IRankingTitleRepository iRankingTitleRepository;

    @Autowired
    public TaskWagesService(ITaskWagesRepository iTaskWagesRepository, ModelMapper modelMapper, ITaskRepository iTaskRepository, IRankingTitleRepository iRankingTitleRepository) {
        this.iTaskWagesRepository = iTaskWagesRepository;
        this.modelMapper = modelMapper;
        this.iTaskRepository = iTaskRepository;
        this.iRankingTitleRepository = iRankingTitleRepository;
    }

    @Override
    public TaskWages findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId) {
        return iTaskWagesRepository.findByRankingTitleIdAndTaskId(rankingTitleId, taskId);
    }

    @Override
    public List<TaskWages> getTaskWages() {
        return iTaskWagesRepository.findAll();
    }

    @Override
    @Transactional
    public TaskWages addTaskWages(TaskWages taskWages) {
        return iTaskWagesRepository.save(taskWages);
    }

    @Override
    @Transactional
    public TaskWages updateTaskWages(TaskWages taskWages) {
        return iTaskWagesRepository.saveAndFlush(taskWages);
    }

    @Override
    @Transactional
    public void deleteTaskWages(Integer rankingTitleId, Integer taskId) {
        TaskWages find = iTaskWagesRepository.findByRankingTitleIdAndTaskId(rankingTitleId, taskId);
        if (find == null) {
            throw new EntityNotFoundException("Task wages not found");
        }
        iTaskWagesRepository.delete(find);
    }




}
