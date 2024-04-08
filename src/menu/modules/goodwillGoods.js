const pre = '/goodwillGoods/';

export default {
    path: '/goodwillGoods',
    title: '善益商城商品管理',
    header: 'home',
    icon: 'md-cash',
    children: [
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
            path: `${pre}goodsList`,
            title: '商品列表'
        },
        // {
        //     path: `${pre}newGoods`,
        //     title: '新建商品'
        // },
        {
            path: `${pre}goodsRecycle`,
            title: '商品回收站'
        },
        // {
        //     path: `${pre}reviewManage`,
        //     title: '评价管理'
        // },
    ]
}
