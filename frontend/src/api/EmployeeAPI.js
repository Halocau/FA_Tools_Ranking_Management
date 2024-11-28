import authClient from './baseapi/AuthorAPI';

const EmployeeAPI = {

    getAllEmployee: async (groupId) => {
        const response = await authClient.get(`employee-criteria/get-groupId/${groupId}`)
        return response.data;
    }
};
export default EmployeeAPI;
