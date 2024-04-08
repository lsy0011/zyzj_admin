import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'goodSupplier-';

export default {
    path: '/goodSupplier',
    name: 'goodSupplier',
    redirect: {
        name: `${pre}goodSupplier`
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
            component: () => import('@/pages/goodSupplier/addsupplier')
        },
        {
            path: 'supplierlist',
            name: `${pre}supplierlist`,
            meta: {
                ...meta,
                title: '管理员分配',
                // closable: false
            },
            component: () => import('@/pages/goodSupplier/supplierlist')
        },
        {
            path: 'shopAssistant',
            name: `${pre}shopAssistant`,
            meta: {
                ...meta,
                title: '商家用户管理',
                // closable: false  
            },
            component: () => import('@/pages/goodSupplier/shopAssistant')
        },
    ]
};
