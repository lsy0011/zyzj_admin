import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'goodwillOrder-';

export default {
    path: '/goodwillOrder',
    name: 'goodwillOrder',
    redirect: {
        name: `${pre}orderList`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'orderList',
            name: `${pre}orderList`,
            meta: {
                ...meta,
                title: '订单列表',
                // closable: false
            },
            component: () => import('@/pages/goodwillOrder/orderList')
        },
        {
            path: 'parcelManage',
            name: `${pre}parcelManage`,
            meta: {
                ...meta,
                title: '包裹管理',
                // closable: false
            },
            component: () => import('@/pages/goodwillOrder/parcelManage')
        },
        {
            path: 'returnList',
            name: `${pre}returnList`,
            meta: {
                ...meta,
                title: '退换货列表',
                // closable: false
            },
            component: () => import('@/pages/goodwillOrder/returnList')
        },
        {
            path: 'returnCause',
            name: `${pre}returnCause`,
            meta: {
                ...meta,
                title: '退换货原因设置',
                // closable: false
            },
            component: () => import('@/pages/goodwillOrder/returnCause')
        },
        {
            path: 'cancelCause',
            name: `${pre}cancelCause`,
            meta: {
                ...meta,
                title: '取消订单原因设置',
                // closable: false
            },
            component: () => import('@/pages/goodwillOrder/cancelCause')
        },
    ]
};
