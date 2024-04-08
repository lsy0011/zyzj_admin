import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'squareManage-';

export default {
    path: '/squareManage',
    name: 'squareManage',
    redirect: {
        name: `${pre}squareManage`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'classifyManage',
            name: `${pre}classifyManage`,
            meta: {
                ...meta,
                title: '广场分类管理',
            },
            component: () => import('@/pages/squareManage/classifyManage')
        },
        {
            path: 'squarePage',
            name: `${pre}squarePage`,
            meta: {
                ...meta,
                title: '广场内容管理',
            },
            component: () => import('@/pages/squareManage/squarePage')
        },
    ]
};
