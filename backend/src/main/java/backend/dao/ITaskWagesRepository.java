package backend.dao;

import backend.model.entity.TaskWages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITaskWagesRepository extends JpaRepository<TaskWages, Integer> {
    Optional<TaskWages> findByRankingTitleIdAndTaskId(Integer rankingTitleId, Integer taskId);
    List<TaskWages> findByTaskId(Integer taskId);

}
