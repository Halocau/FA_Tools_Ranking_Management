package backend.service;

import backend.model.dto.DecisionTasksResponse;
import backend.model.entity.DecisionTasks;
import backend.model.entity.Task;

import java.util.List;

public interface IDecisionTasksService {
    //crud
    public List<DecisionTasks> findByDecisionId(int decisionId);
    public  DecisionTasks findByDecisionIdAndTaskId(int decisionId, int taskId);
    public List<DecisionTasks> getAllDecisionTasks();
    public DecisionTasks addDecisionTask(DecisionTasks decisionTasks);
    public DecisionTasks updateDecisionTask(DecisionTasks decisionTasks);
    public void deleteDecisionTask(int decisionId, int taskId);

    //response
    public List<DecisionTasksResponse> getDecisionTasksByDecisionId(Integer decisionId);
}
