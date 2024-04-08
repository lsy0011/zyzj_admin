const pre = '/healthCareGoods/';

export default {
    path: '/healthCareGoods',
    title: '医药保健商品管理',
    header: 'home',
    icon: 'md-flask',
    children: [
        // {
        //     path: `${pre}producingEnterprise`,
        //     title: '生产企业管理'
        // },
        {
            path: `${pre}goodsClassify`,
            title: '商品分类管理'
        },
        {
            path: `${pre}sizeAttribute`,
            title: '规格属性管理'
        },
        {
            path: `${pre}brandManage`,
            title: '品牌管理'
        },
        {
            path: `${pre}remedyList`,
            title: '医药保健列表'
        },
        // {
        //     path: `${pre}healthList`,
        //     title: '保健品列表'
        // },
        {
            path: `${pre}remedyRecycle`,
            title: '医药保健回收站'
        },
        // {
        //     path: `${pre}healthRecycle`,
        //     title: '保健品回收站'
        // },
        // {
        //     path: `${pre}newsRemedy`,
        //     title: '新建商品'
        // },
        // {
        //     path: `${pre}newHealth`,
        //     title: '新建保健品'
        // },
        // {
        //     path: `${pre}reviewManage`,
        //     title: '评价管理'
        // },
    ]
}
