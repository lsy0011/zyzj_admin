const pre = '/squareManage/'

export default {
    path: '/squareManage',
    title: '广场管理',
    header: 'home',
    // custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'ios-list-box-outline',
    children: [
        {
            path: `${pre}classifyManage`,
            title: '广场分类管理'
        },
        {
            path: `${pre}squarePage`,
            title: '广场内容管理'
        },
    ]
}