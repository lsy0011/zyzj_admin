const pre = '/benefitAssistedShot/';

export default {
    path: '/benefitAssistedShot',
    title: '益助拍管理',
    header: 'home',
    icon: 'md-hammer',
    children: [
        {
            path: `${pre}auctionCompany`,
            title: '拍卖公司管理'
        },
        {
            path: `${pre}companyEntrust`,
            title: '公司委托方管理'
        },
        {
            path: `${pre}personageEntrust`,
            title: '个人委托方管理'
        },
        {
            path: `${pre}goodsClassify`,
            title: '拍品分类管理'
        },
        {
            path: `${pre}sizeProperty`,
            title: '规格属性管理'
        },
        {
            path: `${pre}auctionEntering`,
            title: '拍品管理'
        },
        {
            path: `${pre}orderManage`,
            title: '订单管理'
        },
        {
            path: `${pre}namedUser`,
            title: '指定用户管理'
        },
        {
            path: `${pre}auctionDeal`,
            title: '拍卖协议管理'
        },
    ]
}