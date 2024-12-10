// frontend/api/RankingDecisionAPI.js
import authClient from './baseapi/AuthorAPI';

const feedback_api = '/feedback';

const FeedbackAPI = {
    getFeedbackById: async (id) => {
        try {
            const response = await authClient.get(`${feedback_api}/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error get feedback with ID ${id}:`, error);
            throw error;
        }
    },

    // Update an existing ranking decision by ID
    updateFeedback: async (formData) => {
        try {
            const response = await authClient.put(`${feedback_api}/upsert/`, formData);
            return response.data;
        } catch (error) {
            console.error(`Error updating feedback:`, error);
            throw error;
        }
    },

    // Delete a ranking decision by ID
    deletefeedback: async (id) => {
        try {
            const response = await authClient.delete(`${feedback_api}/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ranking decision with ID ${id}:`, error);
            throw error;
        }
    },
};

export default FeedbackAPI;
