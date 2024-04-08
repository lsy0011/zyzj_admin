import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'loveScore-';

export default {
    path: '/loveScore',
    name: 'loveScore',
    redirect: {
        name: `${pre}loveScore`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'scoreRule',
            name: `${pre}scoreRule`,
            meta: {
                ...meta,
                title: '爱心值规则管理',
                // closable: false
            },
            component: () => import('@/pages/loveScore/scoreRule')
        },
        {
            path: 'spreadAwardRule',
            name: `${pre}spreadAwardRule`,
            meta: {
                ...meta,
                title: '善益金奖励规则',
                // closable: false
            },
            component: () => import('@/pages/loveScore/spreadAwardRule')
        },
    ]
};