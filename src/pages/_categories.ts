export const categories = [
    {
        type: 'folder',
        id: 'log',
        title: 'Daily Log (일상)',
        items: [
            { title: '일기장', path: '/log/diary' },
            { title: '음악', path: '/log/music' }
        ]
    },
    {
        type: 'folder',
        id: 'study',
        title: 'Study Notes (공부)',
        items: [
            { title: 'Architecture', path: '/study/arch' },
            { title: 'RTL Design', path: '/study/rtl' }
        ]
    },
    { type: 'link', title: 'Environment (환경세팅)', path: '/env' },
    { type: 'link', title: 'Projects (기획)', path: '/projects' }
];
