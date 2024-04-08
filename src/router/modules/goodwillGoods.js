import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'goodwillGoods-';

export default {
    path: '/goodwillGoods',
    name: 'goodwillGoods',
    redirect: {
        name: `${pre}goodsClassify`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'goodsClassify',
            name: `${pre}goodsClassify`,
            meta: {
                ...meta,
                title: '商品分类管理',
                // closable: false
            },
            component: () => import('@/pages/goodwillGoods/goodsClassify')
        },
        {
            path: 'sizeAttribute',
            name: `${pre}sizeAttribute`,
            meta: {
                ...meta,
                title: '规格属性管理',
                // closable: false
            },
            component: () => import('@/pages/goodwillGoods/sizeAttribute')
        },
        {
            path: 'brandManage',
            name: `${pre}brandManage`,
            meta: {
                ...meta,
                title: '品牌管理',
                // closable: false
            },
            component: () => import('@/pages/goodwillGoods/brandManage')
        },
        {
            path: 'goodsList',
            name: `${pre}goodsList`,
            meta: {
                ...meta,
                title: '商品列表',
                // closable: false
            },
            component: () => import('@/pages/goodwillGoods/goodsList')
        },
        {
            path: 'newGoods',
            name: `${pre}newGoods`,
            meta: {
                ...meta,
                title: '新建商品',
                // closable: false
            },
            component: () => import('@/pages/goodwillGoods/newGoods')
        },
        {
            path: 'goodsRecycle',
            name: `${pre}goodsRecycle`,
            meta: {
                ...meta,
                title: '商品回收站',
                // closable: false
            },
            component: () => import('@/pages/goodwillGoods/goodsRecycle')
        },
        {
            path: 'reviewManage',
            name: `${pre}reviewManage`,
            meta: {
                ...meta,
                title: '评价管理',
                // closable: false
            },
            component: () => import('@/pages/goodwillGoods/reviewManage')
        },
    ]
};
