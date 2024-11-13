import authClient from './baseapi/AuthorAPI';

const OptionAPI = {
    // Fetch all options with pagination and filtering
    searchOptions: async (filter = "", page = 1, size = 5) => {
        try {
            const response = await authClient.get('/option/all', {
                params: {
                    filter: filter,
                    page: page,
                    size: size,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching options:", error);
            throw error;
        }
    },

    // Fetch options by Criteria ID
    getOptionsByCriteriaId: async (criteriaId) => {
        try {
            const response = await authClient.get(`/option/get/${criteriaId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching options for criteria ID ${criteriaId}:`, error);
            throw error;
        }
    },

    // Create a new option
    createOption: async (optionData) => {
        try {
            const response = await authClient.post('/option/add', optionData);
            return response.data;
        } catch (error) {
            console.error("Error creating option:", error);
            throw error;
        }
    },

    // Update option by ID
    updateOption: async (id, updateData) => {
        try {
            const response = await authClient.put(`/option/update/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating option with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete option by ID
    deleteOption: async (id) => {
        try {
            await authClient.delete(`/option/delete/${id}`);
        } catch (error) {
            console.error(`Error deleting option with ID ${id}:`, error);
            throw error;
        }
    },
};

export default OptionAPI;
