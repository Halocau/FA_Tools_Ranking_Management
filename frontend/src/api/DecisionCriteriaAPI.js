import authClient from './baseapi/AuthorAPI';

const decision_criteria_api = '/decision-criteria';

const DecisionCriteriaAPI = {
    // 
    getAllCriteria: async () => {
        const response = await authClient.get('/criteria/all');
        return response.data;
    },

    getDecisionCriteriaByDecisionId: (decisionId) =>
        authClient
            .get(`${decision_criteria_api}/get-all/${decisionId}`)
            .then((response) => response.data),


    addDecisionCriteria: (form) =>
        authClient
            .post(`${decision_criteria_api}/add`, form)
            .then((response) => response.data),

    deleteDecisionCriteria: (decisionId, criteriaId) =>
        authClient
            .delete(`${decision_criteria_api}/delete/${decisionId}/${criteriaId}`)
            .then((response) => response.data),

    updateDecisionCriteria: (form, decisionId, criteriaId) =>
        authClient
            .put(`${decision_criteria_api}/upsert`, form)
            .then((response) => response.data),

    optionCriteria: (decisionId) =>
        authClient
            .get(`${decision_criteria_api}/options/${decisionId}`)
            .then((response) => response.data),
};

export default DecisionCriteriaAPI;
