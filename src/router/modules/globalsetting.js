import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'globalsetting-';

export default {
    path: '/globalsetting',
    name: 'globalsetting',
    redirect: {
        name: `${pre}dictionary`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'dictionary',
            name: `${pre}dictionary`,
            meta: {
                ...meta,
                title: '数据字典',
                // closable: false
            },
            component: () => import('@/pages/globalsetting/dictionary')
        },
        {
            path: 'parameters',
            name: `${pre}parameters`,
            meta: {
                ...meta,
                title: '系统设置',
                // closable: false  
            },
            component: () => import('@/pages/globalsetting/parameters')
        },
        {
            path: 'faresset',
            name: `${pre}faresset`,
            meta: {
                ...meta,
                title: '运费模板设置',
            },
            component: () => import('@/pages/globalsetting/faresset')
        },
        {
            path: 'buyNotes',
            name: `${pre}buyNotes`,
            meta: {
                ...meta,
                title: '购买须知',
                // closable: false 
            },
            component: () => import('@/pages/globalsetting/buyNotes')
        },
        {
            path: 'divisionRule',
            name: `${pre}divisionRule`,
            meta: {
                ...meta,
                title: '分账规则',
            },
            component: () => import('@/pages/globalsetting/divisionRule')
        },
        {
            path: 'user-protocol',
            name: `${pre}user-protocol`,
            meta: {
                ...meta,
                title: '用户协议管理',
            },
            component: () => import('@/pages/globalsetting/user-protocol')
        },
        {
            path: 'businessTheme',
            name: `${pre}businessTheme`,
            meta: {
                ...meta,
                title: '控件权限字典',
            },
            component: () => import('@/pages/globalsetting/businessTheme')
        },
    ]
};
