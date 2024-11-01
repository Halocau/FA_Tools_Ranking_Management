import authClient from './authClient';

const taskAPI = {
    // Fetch all tasks
    getAllTasks: async () => {
        try {
            const response = await authClient.get('/task');
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    // Fetch a task by ID
    getTaskById: async (id) => {
        try {
            const response = await authClient.get(`/task/get/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching task with ID ${id}:`, error);
            throw error;
        }
    },

    // Create a new task
    addTask: async (taskData) => {
        try {
            const response = await authClient.post('/task/add', taskData);
            return response.data;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    },

    // Update an existing task
    updateTask: async (id, taskData) => {
        try {
            const response = await authClient.put(`/task/update/${id}`, taskData);
            return response.data;
        } catch (error) {
            console.error(`Error updating task with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete a task by ID
    deleteTaskById: async (id) => {
        try {
            const response = await authClient.delete(`/task/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting task with ID ${id}:`, error);
            throw error;
        }
    },
};

export default taskAPI;
