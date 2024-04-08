const pre = '/informationManage/';

export default {
    path: '/informationManage',
    title: '资讯管理',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'md-bookmarks',
    children: [
        {
            path: `${pre}informationClassify`,
            title: '资讯分类管理'
        },
        {
            path: `${pre}informationRelease`,
            title: '资讯发布管理'
        },
        // {
        //     path: `${pre}newInformation`,
        //     title: '新建发布',
        // }
    ]
}