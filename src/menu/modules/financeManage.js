const pre = '/financeManage/';

export default {
    path: '/financeManage',
    title: '财务管理',
    header: 'home',
    icon: 'logo-playstation',
    children: [
        {
            path: `${pre}financeStat`,
            title: '财务统计',
        },
        {
            path: `${pre}financeDetail`,
            title: '财务区间明细',
        },
        {
            path: `${pre}supplierClearing`,
            title: '供应商结算',
        },
        {
            path: `${pre}fundClearing`,
            title: '基金相关结算',
        },
        {
            path: `${pre}itemsClearing`,
            title: '项目相关结算',
        },
        {
            path: `${pre}salaryClearing`,
            title: '工资相关结算',
        },
        {
            path: `${pre}ledgerFlow`,
            title: '分账流水对账',
        },
    ]
}
