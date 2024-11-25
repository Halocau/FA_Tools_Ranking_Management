// frontend/api/taskApi.js
import authClient from "./baseapi/AuthorAPI";

const TASK_API = '/task';

const taskApi = {
    // Get all tasks with pagination
    getAllTasks: async (page = 0, size = 5) => {
        try {
            const response = await authClient.get(`${TASK_API}`, {
                params: { page: page, size: size },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    getAllTaskWihtOutPagination: async () => {
        const response = await authClient.get(`${TASK_API}/all`)
        return response.data;
    },

    // Get a single task by ID
    getTaskById: async (id) => {
        try {
            const response = await authClient.get(`${TASK_API}/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching task with ID ${id}:`, error);
            throw error;
        }
    },

    // Create a new task
    createTask: async (formData) => {
        try {
            const response = await authClient.post(`${TASK_API}/add`, formData);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    // Update a task by ID
    updateTask: async (id, formData) => {
        try {
            const response = await authClient.put(`${TASK_API}/update/${id}`, formData);
            return response.data;
        } catch (error) {
            console.error(`Error updating task with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete a task by ID
    deleteTaskById: async (id) => {
        try {
            const response = await authClient.delete(`${TASK_API}/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting task with ID ${id}:`, error);
            throw error;
        }
    },

    // Search tasks by name with pagination
    searchByTaskName: async (filter = "", page = 0, size = 5) => {
        try {
            const response = await authClient.get(`${TASK_API}`, {
                params: { filter: filter, page: page, size: size },
            });
            return response.data;
        } catch (error) {
            console.error(`Error searching tasks with name "${taskName}":`, error);
            throw error;
        }
    },
};

export default taskApi;
