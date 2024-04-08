const pre = '/healthCareOrder/';

export default {
    path: '/healthCareOrder',
    title: '医药保健订单管理',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    icon: 'ios-link',
    children: [
        {
            path: `${pre}orderList`,
            // icon: 'ios-home',
            title: '订单列表'
        },
        // {
        //     path: `${pre}parcelManage`,
        //     title: '包裹管理'
        // },
        {
            path: `${pre}cancelCause`,
            title: '取消订单原因设置',
            // subtitle: 'Workplace'
        }
    ]
}