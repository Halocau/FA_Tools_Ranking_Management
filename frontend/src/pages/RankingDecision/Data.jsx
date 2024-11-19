export const rankTitles = [
    "0 - No experience",
    "1 - Low",
    "2 - Normal",
    "3 - Medium",
];
export const initialCriteria = [
    { criteriaId: 1, criteriaName: 'Scope of Training Assignments', weight: 10, maxScore: 4, numOptions: 4 },
    { criteriaId: 2, criteriaName: 'Technical or Professional Skills', weight: 10, maxScore: 6, numOptions: 6 },
    { criteriaId: 3, criteriaName: 'Courseraware Development', weight: 30, maxScore: 4, numOptions: 4 },
    { criteriaId: 4, criteriaName: 'Courseware Development', weight: 10, maxScore: 3, numOptions: 3 },
    { criteriaId: 5, criteriaName: 'Training Certificate', weight: 30, maxScore: 4, numOptions: 4 },
    { criteriaId: 6, criteriaName: 'Years of Working and Teaching', weight: 10, maxScore: 4, numOptions: 4 },
];

export const initialTitle = [
    { titleId: 1, titleName: 'TRN1.1', rankScore: 37 },
    { titleId: 2, titleName: 'TRN1.2', rankScore: 45 },
    { titleId: 3, titleName: 'TRN1.3', rankScore: 50 },
    { titleId: 4, titleName: 'TRN2.1', rankScore: 61 },
    { titleId: 5, titleName: 'TRN2.2', rankScore: 63 },
    { titleId: 6, titleName: 'TRN2.3', rankScore: 74 },
    { titleId: 7, titleName: 'TRN3.1', rankScore: 80 },
    { titleId: 8, titleName: 'TRN3.2', rankScore: 86 },
    { titleId: 9, titleName: 'TRN3.3', rankScore: 100 },
];

export const initialTask = [
    {
        task_name: 'Giảng dạy',
        task_types: [
            { task_type: 'In Working Hour', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
            { task_type: 'Overtime', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
        ]
    },
    {
        task_name: 'Hướng dẫn, hỗ trợ, chấm bài',
        task_types: [
            { task_type: 'In Working Hour', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
            { task_type: 'Overtime', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
        ]
    },
    {
        task_name: 'Tạo tài liệu',
        task_types: [
            { task_type: 'In Working Hour', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
            { task_type: 'Overtime', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
        ]
    },
    {
        task_name: 'Xem xét tài liệu',
        task_types: [
            { task_type: 'In Working Hour', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
            { task_type: 'Overtime', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
        ]
    }
];


