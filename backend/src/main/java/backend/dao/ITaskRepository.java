package backend.dao;

import backend.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ITaskRepository extends JpaRepository<Task, Integer>, JpaSpecificationExecutor<Task> {
    public Task findByCreatedBy(int createdBy);
    Optional<Task> findById(Integer taskId);
}
