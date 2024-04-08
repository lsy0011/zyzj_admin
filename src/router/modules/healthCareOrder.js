import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'healthCareOrder-';

export default {
    path: '/healthCareOrder',
    name: 'healthCareOrder',
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
            component: () => import('@/pages/healthCareOrder/orderList')
        },
        {
            path: 'parcelManage',
            name: `${pre}parcelManage`,
            meta: {
                ...meta,
                title: '包裹管理',
                // closable: false
            },
            component: () => import('@/pages/healthCareOrder/parcelManage')
        },
        {
            path: 'cancelCause',
            name: `${pre}cancelCause`,
            meta: {
                ...meta,
                title: '取消订单原因设置',
                // closable: false
            },
            component: () => import('@/pages/healthCareOrder/cancelCause')
        },
    ]
};
