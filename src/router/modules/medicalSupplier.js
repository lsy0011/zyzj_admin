import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'medicalSupplier-';

export default {
    path: '/medicalSupplier',
    name: 'medicalSupplier',
    redirect: {
        name: `${pre}medicalSupplier`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'addsupplier',
            name: `${pre}addsupplier`,
            meta: {
                ...meta,
                title: '添加供应商',
                // closable: false
            },
            component: () => import('@/pages/medicalSupplier/addsupplier')
        },
        {
            path: 'supplierlist',
            name: `${pre}supplierlist`,
            meta: {
                ...meta,
                title: '供应商列表',
                // closable: false
            },
            component: () => import('@/pages/medicalSupplier/supplierlist')
        },
        {
            path: 'shopAssistant',
            name: `${pre}shopAssistant`,
            meta: {
                ...meta,
                title: '商家用户管理',
                // closable: false 
            },
            component: () => import('@/pages/medicalSupplier/shopAssistant')
        },
    ]
};
