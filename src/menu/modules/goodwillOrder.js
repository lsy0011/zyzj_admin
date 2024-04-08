const pre = '/goodwillOrder/';

export default {
    path: '/goodwillOrder',
    title: '善益商城订单管理',
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
            path: `${pre}returnList`,
            title: '退换货列表',
            // subtitle: 'Workplace'
        },
        {
            path: `${pre}returnCause`,
            title: '退换货原因设置',
            // subtitle: 'Workplace'
        },
        {
            path: `${pre}cancelCause`,
            title: '取消订单原因设置',
            // subtitle: 'Workplace'
        }
    ]
}