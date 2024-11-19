import authClient from './baseapi/AuthorAPI';

const API_BASE_URL = '/decision-criteria';

const DecisionCriteriaAPI = {
    getAllDecisionCriteria: (filter = '', pageable = { page: 0, size: 5 }) =>
        authClient
            .get(API_BASE_URL, {
                params: {
                    filter,
                    page: pageable.page,
                    size: pageable.size,
                },
            })
            .then((response) => response.data),

    getDecisionCriteriaByDecisionId: (decisionId, filter = '', pageable = { page: 0, size: 5 }) =>
        authClient
            .get(`${API_BASE_URL}/get/${decisionId}`, {
                params: {
                    filter,
                    page: pageable.page,
                    size: pageable.size,
                },
            })
            .then((response) => response.data),

    addDecisionCriteria: (form) =>
        authClient
            .post(`${API_BASE_URL}/add`, form)
            .then((response) => response.data),

    deleteDecisionCriteria: (decisionId, criteriaId) =>
        authClient
            .delete(`${API_BASE_URL}/delete/${decisionId}/${criteriaId}`)
            .then((response) => response.data),

    updateDecisionCriteria: (form, decisionId, criteriaId) =>
        authClient
            .put(`${API_BASE_URL}/upsert/${decisionId}/${criteriaId}`, form)
            .then((response) => response.data),
};

export default DecisionCriteriaAPI;
