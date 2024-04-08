import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'problemManage-';

export default {
    path: '/problemManage',
    name: 'problemManage',
    redirect: {
        name: `${pre}problemManage`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'problemClassify',
            name: `${pre}problemClassify`,
            meta: {
                ...meta,
                title: '问题类型',
            },
            component: () => import('@/pages/problemManage/problemClassify')
        },
        {
            path: 'problemList',
            name: `${pre}problemList`,
            meta: {
                ...meta,
                title: '问题列表',
            },
            component: () => import('@/pages/problemManage/problemList')
        },
    ]
};
