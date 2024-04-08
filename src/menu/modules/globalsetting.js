const pre = '/globalsetting/';

export default {
    path: '/globalsetting',
    title: '全局设置',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'md-options',
    children: [
        {
            path: `${pre}dictionary`,
            // icon: 'ios-home', 
            title: '数据字典'
        },
        {
            path: `${pre}parameters`,
            title: '系统设置'
        },
        {
            path: `${pre}faresset`,
            title: '运费模板设置',
        },
        {
            path: `${pre}buyNotes`,
            title: '购买须知',
        },
        {
            path: `${pre}divisionRule`,
            title: '分账规则',
        },
        {
            path: `${pre}user-protocol`,
            title: '用户协议管理',
        },
        {
            path: `${pre}businessTheme`,
            title: '控件权限字典',
        }
    ]
}