import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'handicapped-';

export default {
    path: '/handicapped',
    name: 'handicapped',
    redirect: {
        name: `${pre}elementaryitem`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'elementaryitem',
            name: `${pre}elementaryitem`,
            meta: {
                ...meta,
                title: '数据基本项管理',
                // closable: false
            },
            component: () => import('@/pages/handicapped/elementaryitem')
        },
        {
            path: 'peoplelist',
            name: `${pre}peoplelist`,
            meta: {
                ...meta,
                title: '人员列表',
                // closable: false
            },
            component: () => import('@/pages/handicapped/peoplelist')
        },
    ]
};
