package backend.service;

import backend.model.dto.DecisionTasksResponse;
import backend.model.entity.DecisionTasks;
import backend.model.form.DecisionTasks.AddDecisionTasks;

import java.util.List;
import java.util.Optional;

public interface IDecisionTasksService {
    //crud
    public List<DecisionTasks> findByDecisionId(int decisionId);
    public Optional<DecisionTasks> findByDecisionIdAndTaskId(int decisionId, int taskId);
    public List<DecisionTasks> getAllDecisionTasks();
    public DecisionTasks updateDecisionTask(DecisionTasks decisionTasks);
    public void deleteDecisionTask(Integer decisionId, Integer taskId);

    //response
    public List<DecisionTasksResponse> getDecisionTasksByDecisionId(Integer decisionId);
    //Form
    public void addDecisionTasks(AddDecisionTasks form, Integer decisionId, Integer taskId);
    public void addDecisionTasksList(List<AddDecisionTasks> forms);
}
