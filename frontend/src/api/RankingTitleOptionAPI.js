import authClient from './baseapi/AuthorAPI';

const API_BASE_URL = '/ranking-title-option';

const RankingTitleOptionAPI = {

    getAllRankingTitleOptions: () =>
        authClient.get(API_BASE_URL).then((response) => response.data),

    // Add a new ranking title option
    addRankingTitleOption: (form) =>
        authClient.post(`${API_BASE_URL}/add`, form).then((response) => response.data),

    //Get all ranking title and it choosed option by decision id
    getRankingTitleOptionByDecisionId: (decisionId) =>
        authClient.get(`${API_BASE_URL}/get-decisionId/${decisionId}`).then((response) => response.data),

    //Add or update ranking title option
    upsertRankingTitleOption: (form) =>
        authClient.put(`${API_BASE_URL}/upsert`, form).then((response) => response.data),

    //Delete ranking title option existed
    deleteRankingTitleOption: (rankingTitleId, optionId) =>
        authClient.delete(`${API_BASE_URL}/delete/${rankingTitleId}/${optionId}`).then((response) => response.data),
};

export default RankingTitleOptionAPI;
