import authClient from './baseapi/AuthorAPI';

const API_BASE_URL = '/ranking-title';

const RankingTitleAPI = {
    // Fetch all ranking titles
    getAllRankingTitles: () =>
        authClient.get(API_BASE_URL).then((response) => response.data),

    // Fetch ranking title by ID
    getRankingTitleById: (id) =>
        authClient.get(`${API_BASE_URL}/get/${id}`).then((response) => response.data),

    // Fetch ranking titles by decision ID
    getRankingTitlesByDecisionId: (decisionId) =>
        authClient
            .get(`${API_BASE_URL}/get-decisionId/${decisionId}`)
            .then((response) => response.data),

    // Add a new ranking title
    addRankingTitle: (form) =>
        authClient.post(`${API_BASE_URL}/add`, form).then((response) => response.data),

    // Delete a ranking title by ID
    deleteRankingTitle: (id) =>
        authClient.delete(`${API_BASE_URL}/delete/${id}`).then((response) => response.data),

    // Upsert a ranking title
    upsertRankingTitle: (form) =>
        authClient.put(`${API_BASE_URL}/upsert`, form).then((response) => response.data),
};

export default RankingTitleAPI;
