import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'permissions-';

export default {
    path: '/permissions',
    name: 'permissions',
    redirect: {
        name: `${pre}permissions`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'rolemanage',
            name: `${pre}rolemanage`,
            meta: {
                ...meta,
                title: '角色管理',
                // closable: false
            },
            component: () => import('@/pages/permissions/rolemanage')
        },
        {
            path: 'adminassigned',
            name: `${pre}adminassigned`,
            meta: {
                ...meta,
                title: '管理员分配',
                // closable: false 
            },
            component: () => import('@/pages/permissions/adminassigned')
        },
        {
            path: 'sidebarMenu',
            name: `${pre}sidebarMenu`,
            meta: {
                ...meta,
                title: '菜单树管理',
                // closable: false 
            },
            component: () => import('@/pages/permissions/sidebarMenu')
        },
    ]
};
