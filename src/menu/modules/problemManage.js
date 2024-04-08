const pre = '/problemManage/'

export default {
    path: '/problemManage',
    title: '常见问题管理',
    header: 'home',
    // custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'ios-list-box-outline',
    children: [
        {
            path: `${pre}problemClassify`,
            title: '问题类型'
        },
        {
            path: `${pre}problemList`,
            title: '问题列表'
        },
    ]
}