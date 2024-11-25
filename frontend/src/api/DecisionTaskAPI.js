import authClient from './baseapi/AuthorAPI';

const decision_task_api = '/decision-task';

const DecisionTaskAPI = {
    getDecisionTaskByDecisionId: (decisionId) =>
        authClient
            .get(`/decision-task/${decisionId}`)
            .then((response) => response.data),
    addDecisionTask: (form) =>
        authClient
            .post(`${decision_task_api}/add`, form)
            .then((response) => response.data),

    deleteDecisionTask: (decisionId, taskId) =>
        authClient
            .delete(`${decision_task_api}/delete/${decisionId}/${taskId}`)
            .then((response) => response.data),

    updateDecisionTask: (form) =>
        authClient
            .post(`${decision_task_api}/add`, form)
            .then((response) => response.data),

    upsertDecisionTask: (form) =>
        authClient
            .put(`${decision_task_api}/add-list`, form)
            .then((response) => response.data),
};

export default DecisionTaskAPI;
