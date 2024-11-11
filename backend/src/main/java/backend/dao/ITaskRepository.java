package backend.dao;

import backend.model.entity.Task;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ITaskRepository extends JpaRepository<Task, Integer> {
    public Task findByCreatedBy(int createdBy);

    public List<Task> findByTaskName(String taskName, Pageable pageable);

    public List<Task> findByTaskNameContainingIgnoreCase(String taskName, Pageable pageable);
}
