import authClient from './baseapi/AuthorAPI';

const CriteriaAPI = {
    // Fetch all criteria with pagination and filtering
    searchCriteria: async (filter = "", page = 1, size = 5) => {
        try {
            const response = await authClient.get('/criteria', {
                params: {
                    filter: filter,
                    page: page,
                    size: size
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching criteria:", error);
            throw error;
        }
    },

    // Fetch criteria by ID
    getCriteriaById: async (id) => {
        try {
            const response = await authClient.get(`/criteria/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching criteria with ID ${id}:`, error);
            throw error;
        }
    },

    // Create a new criteria
    createCriteria: async (criteriaData) => {
        try {
            const response = await authClient.post('/criteria/add', criteriaData);
            return response.data;
        } catch (error) {
            console.error("Error creating criteria:", error);
            throw error;
        }
    },

    // Update criteria by ID
    updateCriteria: async (id, updateData) => {
        try {
            const response = await authClient.put(`/criteria/update/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating criteria with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete criteria by ID
    deleteCriteria: async (id) => {
        try {
            await authClient.delete(`/criteria/delete/${id}`);
        } catch (error) {
            console.error(`Error deleting criteria with ID ${id}:`, error);
            throw error;
        }
    },
};

export default CriteriaAPI;
