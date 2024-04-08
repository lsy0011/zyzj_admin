const pre = '/advertisingManage/';

export default {
    path: '/advertisingManage',
    title: '广告管理',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'logo-dropbox',
    // auth: ["abc"],
    children: [
        {
            path: `${pre}advertisingList`,
            // icon: 'ios-home',
            title: '广告列表',
        },
    ]
}