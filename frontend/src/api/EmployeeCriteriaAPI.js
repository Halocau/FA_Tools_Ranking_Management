import authClient from './baseapi/AuthorAPI';

const employee_criteria_api = '/employee-criteria';

const EmployeeCriteriaAPI = {
    /**
     * Upsert a list of employee criteria data.
     * 
     * @param {Array} form - An array of objects with employeeId, criteriaId, and optionId.
     * @returns {Promise} - Resolves with the response data.
     */
    upsertEmployeeCriteriaList: (form) =>
        authClient
            .post(`${employee_criteria_api}/upsert-list`, form)
            .then((response) => response.data),

    /**
     * Get all criteria data associated with a specific employee.
     * 
     * @param {number} employeeId - The ID of the employee.
     * @returns {Promise} - Resolves with the criteria data.
     */
    getAllEmployeeCriteria: () =>
        authClient
            .get(`${employee_criteria_api}`)
            .then((response) => response.data),

    /**
     * Delete specific criteria data for an employee.
     * 
     * @param {number} employeeId - The ID of the employee.
     * @returns {Promise} - Resolves with the response data.
     */
    deleteEmployeeCriteria: (employeeId) =>
        authClient
            .delete(`${employee_criteria_api}/delete/${employeeId}`)
            .then((response) => response.data),


    /**
     * Delete specific criteria data for an employee.
     * 
     * @param {number} groupId - The ID of the ranking group.
     * @returns {Promise} - Resolves with the response data.
     */
    getAllEmployee: async (groupId) => {
        const response = await authClient.get(`employee-criteria/get-groupId/${groupId}`)
        return response.data;
    },
};

export default EmployeeCriteriaAPI;
