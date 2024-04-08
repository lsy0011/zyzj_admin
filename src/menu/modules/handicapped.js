const pre = '/handicapped/';

export default {
    path: '/handicapped',
    title: '残疾人管理',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'ios-man',
    children: [
        {
            path: `${pre}elementaryitem`,
            // icon: 'ios-home',
            title: '数据基本项管理'
        },
        {
            path: `${pre}peoplelist`,
            title: '人员列表'
        }
    ]
}