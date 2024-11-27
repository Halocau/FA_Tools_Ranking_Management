import authClient from './baseapi/AuthorAPI';

const tasks_wage = '/tasks-wage';

const TaskWageAPI = {

    upsertTaskWage: (form) =>
        authClient
            .put(`${tasks_wage}/upsert-list`, form)
            .then((response) => response.data),

    deleteTaskWage: (rankingTitleId, taskId) =>
        authClient
            .delete(`${tasks_wage}/delete/${rankingTitleId}/${taskId}`)
            .then((response) => response.data),
};

export default TaskWageAPI;
