const pre = '/jopManage/';

export default {
    path: '/jopManage',
    title: '求职管理',
    header: 'home',
    custom: 'i-icon-demo',
    icon: 'ios-laptop',
    children: [
        {
            path: `${pre}company`,
            title: '企业管理'
        },
        {
            path: `${pre}staff`,
            title: '员工管理'
        },
        {
            path: `${pre}post`,
            title: '岗位管理'
        },
        {
            path: `${pre}resume`,
            title: '简历管理',
        }
    ]
}