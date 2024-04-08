import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'foundation-';

export default {
    path: '/foundation',
    name: 'foundation',
    redirect: {
        name: `${pre}fdnList`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'fdnList',
            name: `${pre}fdnList`,
            meta: {
                ...meta,
                title: '基金会列表',
                closable: false
            },
            component: () => import('@/pages/foundation/fdnList')
        }
    ]
};
