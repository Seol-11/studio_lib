export const categories = [
    {
        type: 'folder',
        id: 'log',
        title: 'Daily Log (일상)',
        items: [
            { title: '에세이', path: '/log/essay' },
            { title: '음악', path: '/log/music' },
            { title: '독서', path: '/log/reading' }
        ]
    },
    {
        type: 'folder',
        id: 'study',
        title: 'Study Notes (공부)',
        items: [
            { title: 'RTL Design', path: '/study/design' },
            { title: '참고 자료', path: '/study/reference' }
        ]
    },
    {
        type: 'folder',
        id: 'project',
        title: 'Projects (기획)',
        items: [
            { title: 'OFDM', path: '/projects/OFDM' }
        ]
    },
    { type: 'link', title: 'Environment (환경세팅)', path: '/env' }
];
