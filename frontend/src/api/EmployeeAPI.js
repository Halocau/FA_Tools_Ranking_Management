import authClient from './baseapi/AuthorAPI';

const employee_api = '/employee';
const EmployeeAPI = {

    getAllEmployee: async (groupId) => {
        const response = await authClient.get(`employee-criteria/get-groupId/${groupId}`)
        return response.data;
    },

    upsertEmployeeList: (form) =>
        authClient
            .post(`${employee_api}/upsert-list`, form)
            .then((response) => response.data),
};
export default EmployeeAPI;
