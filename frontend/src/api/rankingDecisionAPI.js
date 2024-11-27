// frontend/api/RankingDecisionAPI.js
import authClient from './baseapi/AuthorAPI';

const rankin_decision_api = '/ranking-decision';

const RankingDecisionAPI = {
    // Get paginated list of ranking decisions
    searchRankingDecisions: async (filter = "", page = 1, size = 5) => {
        try {
            const response = await authClient.get(`${rankin_decision_api}`, {
                params: {
                    filter: filter,
                    page: page,
                    size: size
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching ranking groups:', error);
            throw error;
        }
    },

    getAllRankingDecisions: async () => {
        try {
            const response = await authClient.get(`${rankin_decision_api}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ranking decision:`, error);
            throw error;
        }
    },

    // Get a single ranking decision by ID
    getRankingDecisionById: async (id) => {
        try {
            const response = await authClient.get(`${rankin_decision_api}/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ranking decision with ID ${id}:`, error);
            throw error;
        }
    },

    // Add a new ranking decision
    addRankingDecision: async (formData) => {
        try {
            const response = await authClient.post(`${rankin_decision_api}/add`, formData);
            return response.data;
        } catch (error) {
            console.error('Error adding new ranking decision:', error);
            throw error;
        }
    },

    // Update an existing ranking decision by ID
    updateRankingDecision: async (id, formData) => {
        try {
            const response = await authClient.put(`${rankin_decision_api}/update/${id}`, formData);
            return response.data;
        } catch (error) {
            console.error(`Error updating ranking decision with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete a ranking decision by ID
    deleteRankingDecision: async (id) => {
        try {
            const response = await authClient.delete(`${rankin_decision_api}/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ranking decision with ID ${id}:`, error);
            throw error;
        }
    },

    // Search ranking decisions by name with pagination
    searchByDecisionName: async (decisionName = '', page = 0, size = 5) => {
        try {
            const response = await authClient.get(`${rankin_decision_api}/search`, {
                params: { name: decisionName, page: page, size: size },
            });
            return response.data;
        } catch (error) {
            console.error(`Error searching ranking decisions with name "${decisionName}":`, error);
            throw error;
        }
    },
};

export default RankingDecisionAPI;
