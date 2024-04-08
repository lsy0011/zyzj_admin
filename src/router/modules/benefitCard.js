import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'benefitCard-';

export default {
    path: '/benefitCard',
    name: 'benefitCard',
    redirect: {
        name: `${pre}sincerityCard`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'sincerityCard',
            name: `${pre}sincerityCard`,
            meta: {
                ...meta,
                title: '诚益卡管理',
                // closable: false
            },
            component: () => import('@/pages/benefitCard/sincerityCard')
        },
        {
            path: 'goodwillCard',
            name: `${pre}goodwillCard`,
            meta: {
                ...meta,
                title: '善益卡管理',
                // closable: false
            },
            component: () => import('@/pages/benefitCard/goodwillCard')
        },
    ]
};
