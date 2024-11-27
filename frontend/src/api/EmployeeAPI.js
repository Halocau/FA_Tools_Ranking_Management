import authClient from './baseapi/AuthorAPI';

const EmployeeAPI = {

    getAllEmployee: async () => {
        const response = await authClient.get('/employee/all');
        return response.data;
    }
};
export default EmployeeAPI;
