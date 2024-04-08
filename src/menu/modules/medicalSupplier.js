const pre = '/medicalSupplier/'

export default {
    path: '/medicalSupplier',
    title: '药品供应商管理',
    header: 'home',
    // custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'logo-google',
    children: [
        // {
        //     path: `${pre}addsupplier`,
        //     // icon: 'ios-home',
        //     title: '添加供应商'
        // },
        {
            path: `${pre}supplierlist`,
            title: '供应商列表'
        },
        {
            path: `${pre}shopAssistant`,
            title: '商家用户管理'
        },
    ]
}