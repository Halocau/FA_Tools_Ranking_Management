package backend.dao;

import backend.model.entity.TaskWages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITaskWagesRepository extends JpaRepository<TaskWages, Integer> {
    public TaskWages findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId);
    List<TaskWages> findByTaskId(Integer taskId);
}
