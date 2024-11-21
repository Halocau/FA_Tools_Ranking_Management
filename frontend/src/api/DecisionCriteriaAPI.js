import authClient from './baseapi/AuthorAPI';

const decision_criteria_api = '/decision-criteria';

const DecisionCriteriaAPI = {

    getAllCriteria: async () => {
        const response = await authClient.get('/criteria/all');
        return response.data;
    },

    getAllDecisionCriteria: (filter = '', pageable = { page: 0, size: 5 }) =>
        authClient
            .get(decision_criteria_api, {
                params: {
                    filter,
                    page: pageable.page,
                    size: pageable.size,
                },
            })
            .then((response) => response.data),

    getDecisionCriteriaByDecisionIdWithPagination: (decisionId, filter = '', pageable = { page: 0, size: 5 }) =>
        authClient
            .get(`${decision_criteria_api}/get/${decisionId}`, {
                params: {
                    filter,
                    page: pageable.page,
                    size: pageable.size,
                },
            })
            .then((response) => response.data),

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

    takeCriteria: (decisionId) =>
        authClient
            .get(`${decision_criteria_api}/take/${decisionId}`)
            .then((response) => response.data),
};

export default DecisionCriteriaAPI;
