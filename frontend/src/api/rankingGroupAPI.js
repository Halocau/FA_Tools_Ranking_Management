// frontend/api/rankingGroupApi.js
import authClient from "./baseapi/AuthorAPI";

// Endpoint URL
const RANKING_GROUP_API = "/ranking-group";

const rankingGroupApi = {
  // Get all ranking groups with pagination
  getAllRankingGroups: async (page = 0, size = 5) => {
    try {
      const response = await authClient.get(`${RANKING_GROUP_API}`, {
        params: { page: page, size: size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching ranking groups:", error);
      throw error;
    }
  },

  // Get ranking group by ID
  getRankingGroupById: async (id) => {
    try {
      const response = await authClient.get(`${RANKING_GROUP_API}/get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ranking group with ID ${id}:`, error);
      throw error;
    }
  },

  // Add a new ranking group
  addRankingGroup: async (formData) => {
    try {
      const response = await authClient.post(
        `${RANKING_GROUP_API}/add`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding new ranking group:", error);
      throw error;
    }
  },

  // Update an existing ranking group by ID
  updateRankingGroup: async (id, formData) => {
    try {
      const response = await authClient.put(
        `${RANKING_GROUP_API}/update/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating ranking group with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a ranking group by ID
  deleteRankingGroup: async (id) => {
    try {
      const response = await authClient.delete(
        `${RANKING_GROUP_API}/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting ranking group with ID ${id}:`, error);
      throw error;
    }
  },

  // Search ranking groups by name with pagination
  searchRankingGroups: async (filter = "", page = 0, size = 5) => {
    try {
      const response = await authClient.get(`${RANKING_GROUP_API}`, {
        params: { filter: filter, page: page, size: size },
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching ranking groups `, error);
      throw error;
    }
  },
};

export default rankingGroupApi;
