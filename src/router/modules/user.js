import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'user-';

export default {
    path: '/user',
    name: 'user',
    redirect: {
        name: `${pre}user`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'rankmanage',
            name: `${pre}rankmanage`,
            meta: {
                ...meta,
                title: '等级管理',
                // closable: false
            },
            component: () => import('@/pages/user/rankmanage')
        },
        {
            path: 'userlist',
            name: `${pre}userlist`,
            meta: {
                ...meta,
                title: '用户列表',
                // closable: false
            },
            component: () => import('@/pages/user/userlist')
        },
    ]
};
