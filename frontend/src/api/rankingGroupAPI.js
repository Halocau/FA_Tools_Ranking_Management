// frontend/api/rankingGroupApi.js
import authClient from './baseapi/AuthorAPI';

// Endpoint URL
const ranking_group_api = '/ranking-group';

const RankingGroupAPI = {
    // Get all ranking groups with pagination
    searchRankingGroups: async (filter = "", page = 1, size = 5) => {
        try {
            const response = await authClient.get(`${ranking_group_api}.all`, {
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

    // Get ranking group by ID
    getRankingGroupById: async (id) => {
        try {
            const response = await authClient.get(`${ranking_group_api}/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ranking group with ID ${id}:`, error);
            throw error;
        }
    },

    // Add a new ranking group
    addRankingGroup: async (formData) => {
        try {
            const response = await authClient.post(`${ranking_group_api}/add`, formData);
            return response.data;
        } catch (error) {
            console.error('Error adding new ranking group:', error);
            throw error;
        }
    },

    // Update an existing ranking group by ID
    updateRankingGroup: async (id, formData) => {
        try {
            const response = await authClient.put(`${ranking_group_api}/update/${id}`, formData);
            return response.data;
        } catch (error) {
            console.error(`Error updating ranking group with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete a ranking group by ID
    deleteRankingGroup: async (id) => {
        try {
            const response = await authClient.delete(`${ranking_group_api}/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ranking group with ID ${id}:`, error);
            throw error;
        }
    },
};

export default RankingGroupAPI;
