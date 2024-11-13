// frontend/api/rankingDecisionApi.js
import authClient from './authClient';

const RANKING_DECISION_API = '/ranking-decision';

const rankingDecisionApi = {
    // Get paginated list of ranking decisions
    getRankingDecisions: async (page = 0, size = 5) => {
        try {
            const response = await authClient.get(`${RANKING_DECISION_API}`, {
                params: { page: page, size: size },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching ranking decisions:', error);
            throw error;
        }
    },

    // Get a single ranking decision by ID
    getRankingDecisionById: async (id) => {
        try {
            const response = await authClient.get(`${RANKING_DECISION_API}/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ranking decision with ID ${id}:`, error);
            throw error;
        }
    },

    // Add a new ranking decision
    addRankingDecision: async (formData) => {
        try {
            const response = await authClient.post(`${RANKING_DECISION_API}/add`, formData);
            return response.data;
        } catch (error) {
            console.error('Error adding new ranking decision:', error);
            throw error;
        }
    },

    // Update an existing ranking decision by ID
    updateRankingDecision: async (id, formData) => {
        try {
            const response = await authClient.put(`${RANKING_DECISION_API}/update/${id}`, formData);
            return response.data;
        } catch (error) {
            console.error(`Error updating ranking decision with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete a ranking decision by ID
    deleteRankingDecision: async (id) => {
        try {
            const response = await authClient.delete(`${RANKING_DECISION_API}/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ranking decision with ID ${id}:`, error);
            throw error;
        }
    },

    // Search ranking decisions by name with pagination
    searchByDecisionName: async (decisionName = '', page = 0, size = 5) => {
        try {
            const response = await authClient.get(`${RANKING_DECISION_API}/search`, {
                params: { name: decisionName, page: page, size: size },
            });
            return response.data;
        } catch (error) {
            console.error(`Error searching ranking decisions with name "${decisionName}":`, error);
            throw error;
        }
    },
};

export default rankingDecisionApi;
