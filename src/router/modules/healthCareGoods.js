import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'healthCareGoods-';

export default {
    path: '/healthCareGoods',
    name: 'healthCareGoods',
    redirect: {
        name: `${pre}producingEnterprise`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'producingEnterprise',
            name: `${pre}producingEnterprise`,
            meta: {
                ...meta,
                title: '生产企业管理',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/producingEnterprise')
        },
        {
            path: 'goodsClassify',
            name: `${pre}goodsClassify`,
            meta: {
                ...meta,
                title: '商品分类管理',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/goodsClassify')
        },
        {
            path: 'sizeAttribute',
            name: `${pre}sizeAttribute`,
            meta: {
                ...meta,
                title: '规格属性管理',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/sizeAttribute')
        },
        {
            path: 'brandManage',
            name: `${pre}brandManage`,
            meta: {
                ...meta,
                title: '品牌管理',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/brandManage')
        },
        {
            path: 'healthList',
            name: `${pre}healthList`,
            meta: {
                ...meta,
                title: '保健品列表',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/healthList')
        },
        {
            path: 'remedyList',
            name: `${pre}remedyList`,
            meta: {
                ...meta,
                title: '医药保健列表',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/remedyList')
        },
        {
            path: 'healthRecycle',
            name: `${pre}healthRecycle`,
            meta: {
                ...meta,
                title: '保健品回收站',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/healthRecycle')
        },
        {
            path: 'remedyRecycle',
            name: `${pre}remedyRecycle`,
            meta: {
                ...meta,
                title: '医药保健回收站',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/remedyRecycle')
        },
        {
            path: 'newsRemedy',
            name: `${pre}newsRemedy`,
            meta: {
                ...meta,
                title: '新建药品',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/newsRemedy')
        },
        {
            path: 'newHealth',
            name: `${pre}newHealth`,
            meta: {
                ...meta,
                title: '新建保健品',
                // closable: false
            },
            component: () => import('@/pages/healthCareGoods/newHealth')
        },
        {
            path: 'reviewManage',
            name: `${pre}reviewManage`,
            meta: {
                ...meta,
                title: '评价管理',
            },
            component: () => import('@/pages/healthCareGoods/reviewManage')
        },
    ]
};
