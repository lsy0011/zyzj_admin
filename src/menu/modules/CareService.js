const pre = '/CareService/';

export default {
    path: '/CareService',
    title: '关爱服务管理',
    header: 'home',
    icon: 'ios-heart',
    children: [
        {
            path: `${pre}organClassify`,
            title: '机构分类管理'
        },
        {
            path: `${pre}organManage`,
            title: '机构管理'
        },
        // {
        //     path: `${pre}newsOrgan`,
        //     title: '新建机构管理'
        // },
        {
            path: `${pre}shopManage`,
            title: '门店管理'
        },
        // {
        //     path: `${pre}newsShop`,
        //     title: '新建门店管理'
        // },
        {
            path: `${pre}shopAssistant`,
            title: '店员管理'
        },
        {
            path: `${pre}serveClassify`,
            title: '服务分类管理'
        },
        {
            path: `${pre}serveManage`,
            title: '服务管理'
        },
        // {
        //     path: `${pre}newsServe`,
        //     title: '新增服务管理' 
        // },
        {
            path: `${pre}orderManage`,
            title: '订单管理'
        },
        {
            path: `${pre}discountsPayment`,
            title: '优惠付订单管理'
        },
    ]
}
