import authClient from './baseapi/AuthorAPI';

const decision_title_api = '/ranking-title-option';

const DecisionTitleAPI = {
    getAllDecisionTitle: (filter = '', pageable = { page: 0, size: 5 }) =>
        authClient
            .get(decision_title_api, {
                params: {
                    filter,
                    page: pageable.page,
                    size: pageable.size,
                },
            })
            .then((response) => response.data),
    // getDecisionTitleByDecisionId: (decisionId) =>
    //     authClient
    //         .get(`${decision_title_api}/get-decisionId/${decisionId}`,
    //         )
    //         .then((response) => response.data),
    getDecisionTitleByDecisionId: (decisionId) =>
        authClient
            .get(`ranking-title-option/get-decisionId/${decisionId}`,
            )
            .then((response) => response.data),
    addDecisionTitle: (form) =>
        authClient
            .post(`${decision_title_api}/add`, form)
            .then((response) => response.data),

    deleteDecisionTitle: (decisionId, titleId) =>
        authClient
            .delete(`${decision_title_api}/delete/${decisionId}/${titleId}`)
            .then((response) => response.data),

    upsertDecisionTitle: (form) =>
        authClient
            .put(`${decision_title_api}/upsert`, form)
            .then((response) => response.data),

    updateDecisionTitleOption: (form) =>
        authClient
            .put(`${decision_title_api}/update`, form)
            .then((response) => response.data),
};

export default DecisionTitleAPI;
