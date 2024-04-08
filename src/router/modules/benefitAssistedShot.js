import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'benefitAssistedShot-';

export default {
    path: '/benefitAssistedShot',
    name: 'benefitAssistedShot',
    redirect: {
        name: `${pre}auctionCompany`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'auctionCompany',
            name: `${pre}auctionCompany`,
            meta: {
                ...meta,
                title: '拍卖公司管理',
            },
            component: () => import('@/pages/benefitAssistedShot/auctionCompany')
        },
        {
            path: 'companyEntrust',
            name: `${pre}companyEntrust`,
            meta: {
                ...meta,
                title: '公司委托方管理',
            },
            component: () => import('@/pages/benefitAssistedShot/companyEntrust')
        },
        {
            path: 'personageEntrust',
            name: `${pre}personageEntrust`,
            meta: {
                ...meta,
                title: '个人委托方管理',
            },
            component: () => import('@/pages/benefitAssistedShot/personageEntrust')
        },
        {
            path: 'goodsClassify',
            name: `${pre}goodsClassify`,
            meta: {
                ...meta,
                title: '拍品分类管理',
            },
            component: () => import('@/pages/benefitAssistedShot/goodsClassify')
        },
        {
            path: 'sizeProperty',
            name: `${pre}sizeProperty`,
            meta: {
                ...meta,
                title: '规格属性管理',
            },
            component: () => import('@/pages/benefitAssistedShot/sizeProperty')
        },
        {
            path: 'auctionEntering',
            name: `${pre}auctionEntering`,
            meta: {
                ...meta,
                title: '拍品管理',
            },
            component: () => import('@/pages/benefitAssistedShot/auctionEntering')
        },
        {
            path: 'enteringDetails',
            name: `${pre}enteringDetails`,
            meta: {
                ...meta,
                title: '录入拍品详情',
            },
            component: () => import('@/pages/benefitAssistedShot/enteringDetails')
        },
        {
            path: 'orderManage',
            name: `${pre}orderManage`,
            meta: {
                ...meta,
                title: '订单管理',
            },
            component: () => import('@/pages/benefitAssistedShot/orderManage')
        },
        {
            path: 'namedUser',
            name: `${pre}namedUser`,
            meta: {
                ...meta,
                title: '指定用户管理',
            },
            component: () => import('@/pages/benefitAssistedShot/namedUser')
        },
        {
            path: 'donateRule',
            name: `${pre}donateRule`,
            meta: {
                ...meta,
                title: '捐赠规则管理',
            },
            component: () => import('@/pages/benefitAssistedShot/donateRule')
        },
        {
            path: 'auctionDeal',
            name: `${pre}auctionDeal`,
            meta: {
                ...meta,
                title: '拍卖协议管理',
            },
            component: () => import('@/pages/benefitAssistedShot/auctionDeal')
        },
    ]
};
