const pre = '/permissions/'

export default {
    path: '/permissions',
    title: '权限管理',
    header: 'home',
    // custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'ios-list-box-outline',
    children: [
        {
            path: `${pre}rolemanage`,
            // icon: 'ios-home',
            title: '角色管理'
        },
        {
            path: `${pre}adminassigned`,
            title: '管理员分配'
        },
        {
            path: `${pre}sidebarMenu`,
            title: '菜单树管理'
        },
    ]
}