const pre = '/user/'

export default {
    path: '/user',
    title: '用户管理',
    header: 'home',
    // custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'md-list',
    children: [
        {
            path: `${pre}rankmanage`,
            // icon: 'ios-home',
            title: '等级管理'
        },
        {
            path: `${pre}userlist`,
            title: '用户列表'
        },
    ]
}