import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'medicalService-';

export default {
    path: '/medicalService',
    name: 'medicalService',
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
            component: () => import('@/pages/medicalService/organManage')
        },
        {
            path: 'organClassify',
            name: `${pre}organClassify`,
            meta: {
                ...meta,
                title: '机构分类管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/organClassify')
        },
        {
            path: 'newsOrgan',
            name: `${pre}newsOrgan`,
            meta: {
                ...meta,
                title: '新建机构管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/newsOrgan')
        },
        {
            path: 'shopManage',
            name: `${pre}shopManage`,
            meta: {
                ...meta,
                title: '门店管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/shopManage')
        },
        {
            path: 'newsShop',
            name: `${pre}newsShop`,
            meta: {
                ...meta,
                title: '新建门店管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/newsShop')
        },
        {
            path: 'shopAssistant',
            name: `${pre}shopAssistant`,
            meta: {
                ...meta,
                title: '店员管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/shopAssistant')
        },
        {
            path: 'serveManage',
            name: `${pre}serveManage`,
            meta: {
                ...meta,
                title: '服务管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/serveManage')
        },
        {
            path: 'serveClassify',
            name: `${pre}serveClassify`,
            meta: {
                ...meta,
                title: '服务分类管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/serveClassify')
        },
        {
            path: 'newsServe',
            name: `${pre}newsServe`,
            meta: {
                ...meta,
                title: '新增服务管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/newsServe')
        },
        {
            path: 'orderManage',
            name: `${pre}orderManage`,
            meta: {
                ...meta,
                title: '订单管理',
                // closable: false
            },
            component: () => import('@/pages/medicalService/orderManage')
        },
        {
            path: 'discountsPayment',
            name: `${pre}discountsPayment`,
            meta: {
                ...meta,
                title: '优惠付订单管理',
                // closable: false 
            },
            component: () => import('@/pages/medicalService/discountsPayment')
        },
        {
            path: 'reviewManage',
            name: `${pre}reviewManage`,
            meta: {
                ...meta,
                title: '评价管理',
            },
            component: () => import('@/pages/medicalService/reviewManage')
        },
    ]
};
