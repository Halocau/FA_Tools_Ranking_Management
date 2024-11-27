import authClient from './baseapi/AuthorAPI';

const EmployeeAPI = {

    getAllEmployee: async (groupId) => {
        const response = await authClient.get(`employee/group/${groupId}`)
        return response.data;
    }
};
export default EmployeeAPI;
