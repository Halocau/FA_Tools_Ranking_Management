import authClient from "./baseapi/AuthorAPI";

const employee_api = "/employee";
const EmployeeAPI = {
  //  Employee
  getAllEmployee: async (groupId) => {
    const response = await authClient.get(`${employee_api}/group/${groupId}`);
    return response.data;
  },

  //  Employee-criteria
  getEmployeeCriteria: async (groupId) => {
    const response = await authClient.get(
      `employee-criteria/get-groupId/${groupId}`
    );
    return response.data;
  },

  upsertEmployeeList: (form) =>
    authClient
      .put(`${employee_api}/upsert-list`, form)
      .then((response) => response.data),
};
export default EmployeeAPI;
