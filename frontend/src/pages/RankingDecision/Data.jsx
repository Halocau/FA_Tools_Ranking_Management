export const rankTitle = [
    "0 - No experience",
    "1 - Low",
    "2 - Normal",
    "3 - Medium",
];
export const initialCriteria = [
    { criteriaId: 1, criteriaName: 'Scope of Training Assignments', weight: 10, maxScore: 4, numOptions: 4 },
    { criteriaId: 2, criteriaName: 'Technical or Professional Skills', weight: 10, maxScore: 6, numOptions: 6 },
    { criteriaId: 3, criteriaName: 'Courseraware Development', weight: 30, maxScore: 6, numOptions: 6 },
    { criteriaId: 5, criteriaName: 'Training and Mentoring Skills', weight: 10, maxScore: 6, numOptions: 6 },
    { criteriaId: 5, criteriaName: 'Training Certificate', weight: 30, maxScore: 6, numOptions: 6 },
    { criteriaId: 10, criteriaName: 'Years of Working and Teaching', weight: 10, maxScore: 5, numOptions: 5 },

];

export const initialTitle = [
    { titleId: 1, titleName: 'TRN1.1', rankScore: '' },
    { titleId: 2, titleName: 'TRN1.2', rankScore: '' },
    // {
    //     titleId: 3,
    //     titleName: 'TRN1.3',
    //     rankScore: 50,
    //     criteriaSelections: { // Lưu các giá trị đã chọn cho từng tiêu chí
    //         'Scope of Training Assignments': '2 - Normal',
    //         'Technical or Professional Skills': '3 - Medium',
    //         'Courseraware Development': '1 - Low',
    //         'Courseware Development': '3 - Medium',
    //         'Training Certificate': '2 - Normal',
    //         'Years of Working and Teaching': '1 - Low',
    //     }
    // },
    // { titleId: 3, titleName: 'TRN1.3', rankScore: 50 },
    // { titleId: 4, titleName: 'TRN2.1', rankScore: 61 },
    // { titleId: 5, titleName: 'TRN2.2', rankScore: 63 },
    // { titleId: 6, titleName: 'TRN2.3', rankScore: 74 },
    // { titleId: 7, titleName: 'TRN3.1', rankScore: 80 },
    // { titleId: 8, titleName: 'TRN3.2', rankScore: 86 },
    // { titleId: 9, titleName: 'TRN3.3', rankScore: 100 },
    // { titleId: 9, titleName: 'TRN3.3', rankScore: 100 },
    //     { titleId: 10, titleName: 'TRN3.3', rankScore: 100 },
    //     { titleId: 11, titleName: 'TRN3.3', rankScore: 100 },
    //     { titleId: 12, titleName: 'TRN3.3', rankScore: 100 },
    //     { titleId: 13, titleName: 'TRN3.3', rankScore: 100 },
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
    //     {
    //         task_name: 'Tạo tài liệu',
    //         task_types: [
    //             { task_type: 'In Working Hour', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    //             { task_type: 'Overtime', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    //         ]
    //     },
    //     {
    //         task_name: 'Xem xét tài liệu',
    //         task_types: [
    //             { task_type: 'In Working Hour', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    //             { task_type: 'Overtime', scores: initialTitle.reduce((acc, title) => ({ ...acc, [title.title_name]: '' }), {}) },
    //         ]
    //     }
];


