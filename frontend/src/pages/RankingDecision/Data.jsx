export const rankTitles = [
    "0 - No experience",
    "1 - Low",
    "2 - Normal",
    "3 - Medium",
];
export const initialCriteria = [
    { criteria_name: 'Scope of Training Assignments', weight: 10, max_score: 4, num_options: 4 },
    { criteria_name: 'Technical or Professional Skills', weight: 10, max_score: 6, num_options: 6 },
    { criteria_name: 'Courseraware Development', weight: 30, max_score: 4, num_options: 4 },
    { criteria_name: 'Courseware Development', weight: 10, max_score: 3, num_options: 3 },
    { criteria_name: 'Training Certificate', weight: 30, max_score: 4, num_options: 4 },
    { criteria_name: 'Years of Working and Teaching', weight: 10, max_score: 4, num_options: 4 },
];

export const initialTitles = [
    { title_name: 'TRN1.1', rank_score: 37 },
    { title_name: 'TRN1.2', rank_score: 45 },
    { title_name: 'TRN1.3', rank_score: 50 },
    { title_name: 'TRN2.1', rank_score: 61 },
    { title_name: 'TRN2.2', rank_score: 63 },
    { title_name: 'TRN2.3', rank_score: 74 },
    { title_name: 'TRN3.1', rank_score: 80 },
    { title_name: 'TRN3.2', rank_score: 86 },
    { title_name: 'TRN3.3', rank_score: 100 },
];

export const initialTasks = [
    { task_name: 'Giảng dạy', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Giảng dạy', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Hướng dẫn, hỗ trợ, chấm bài', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Hướng dẫn, hỗ trợ, chấm bài', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Tạo tài liệu', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Tạo tài liệu', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Xem xét tài liệu', task_type: 'In Working Hour', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    { task_name: 'Xem xét tài liệu', task_type: 'Overtime', scores: initialTitles.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
];

