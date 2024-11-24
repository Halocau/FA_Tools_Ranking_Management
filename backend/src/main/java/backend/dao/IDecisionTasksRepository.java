package backend.dao;

import backend.model.entity.DecisionTasks;
import backend.model.entity.Serializable.DecisionTasksSerializable;
import backend.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IDecisionTasksRepository extends JpaRepository<DecisionTasks, DecisionTasksSerializable> {


    public List<DecisionTasks> findByDecisionId(int decisionId);
    public Optional<DecisionTasks> findByDecisionIdAndTaskId(int decisionId, int taskId);
}
