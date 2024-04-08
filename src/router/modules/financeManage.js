import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'financeManage-';

export default {
    path: '/financeManage',
    name: 'financeManage',
    redirect: {
        name: `${pre}financeStat`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'financeStat',
            name: `${pre}financeStat`,
            meta: {
                ...meta,
                title: '财务统计',
                // closable: false
            },
            component: () => import('@/pages/financeManage/financeStat')
        },
        {
            path: 'financeDetail',
            name: `${pre}financeDetail`,
            meta: {
                ...meta,
                title: '财务区间明细',
                // closable: false
            },
            component: () => import('@/pages/financeManage/financeDetail')
        },
        {
            path: 'supplierClearing',
            name: `${pre}supplierClearing`,
            meta: {
                ...meta,
                title: '供应商结算',
                // closable: false
            },
            component: () => import('@/pages/financeManage/supplierClearing')
        },
        {
            path: 'fundClearing',
            name: `${pre}fundClearing`,
            meta: {
                ...meta,
                title: '基金相关结算',
                // closable: false
            },
            component: () => import('@/pages/financeManage/fundClearing')
        },
        {
            path: 'itemsClearing',
            name: `${pre}itemsClearing`,
            meta: {
                ...meta,
                title: '项目相关结算',
                // closable: false
            },
            component: () => import('@/pages/financeManage/itemsClearing')
        },
        {
            path: 'salaryClearing',
            name: `${pre}salaryClearing`,
            meta: {
                ...meta,
                title: '工资相关结算',
                // closable: false  
            },
            component: () => import('@/pages/financeManage/salaryClearing')
        },
        {
            path: 'ledgerFlow',
            name: `${pre}ledgerFlow`,
            meta: {
                ...meta,
                title: '分账流水对账',
                // closable: false
            },
            component: () => import('@/pages/financeManage/ledgerFlow')
        },
    ]
};
