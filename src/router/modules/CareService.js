import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'CareService-';

export default {
    path: '/CareService',
    name: 'CareService',
    redirect: {
        name: `${pre}organManage`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'organManage',
            name: `${pre}organManage`,
            meta: {
                ...meta,
                title: '机构管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/organManage')
        },
        {
            path: 'organClassify',
            name: `${pre}organClassify`,
            meta: {
                ...meta,
                title: '机构分类管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/organClassify')
        },
        {
            path: 'newsOrgan',
            name: `${pre}newsOrgan`,
            meta: {
                ...meta,
                title: '新建机构管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/newsOrgan')
        },
        {
            path: 'shopManage',
            name: `${pre}shopManage`,
            meta: {
                ...meta,
                title: '门店管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/shopManage')
        },
        {
            path: 'newsShop',
            name: `${pre}newsShop`,
            meta: {
                ...meta,
                title: '新建门店管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/newsShop')
        },
        {
            path: 'shopAssistant',
            name: `${pre}shopAssistant`,
            meta: {
                ...meta,
                title: '店员管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/shopAssistant')
        },
        {
            path: 'serveManage',
            name: `${pre}serveManage`,
            meta: {
                ...meta,
                title: '服务管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/serveManage')
        },
        {
            path: 'serveClassify',
            name: `${pre}serveClassify`,
            meta: {
                ...meta,
                title: '服务分类管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/serveClassify')
        },
        {
            path: 'newsServe',
            name: `${pre}newsServe`,
            meta: {
                ...meta,
                title: '新增服务管理',
                // closable: false
            },
            component: () => import('@/pages/CareService/newsServe')
        },
        {
            path: 'orderManage',
            name: `${pre}orderManage`,
            meta: {
                ...meta,
                title: '订单管理',
                // closable: false 
            },
            component: () => import('@/pages/CareService/orderManage')
        },
        {
            path: 'discountsPayment',
            name: `${pre}discountsPayment`,
            meta: {
                ...meta,
                title: '优惠付订单管理',
                // closable: false 
            },
            component: () => import('@/pages/CareService/discountsPayment')
        },
    ]
};
