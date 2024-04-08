const pre = '/dashboard/';

export default {
    path: '/dashboard',
    title: '大数据看板',
    header: 'home',
    icon: 'ios-analytics',
    children: [
        {
            path: `${pre}console`,
            title: '工作台'
        },
    ]
}
