import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'merchantInfo-';

export default {
    path: '/merchantInfo',
    name: 'merchantInfo',
    redirect: {
        name: `${pre}merchantInfo`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'subAccountInfo',
            name: `${pre}subAccountInfo`,
            meta: {
                ...meta,
                title: '录入分账信息',
                // closable: false
            },
            component: () => import('@/pages/merchantInfo/subAccountInfo')
        },
    ]
};