import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'jopManage-';

export default {
    path: '/jopManage',
    name: 'jopManage',
    redirect: {
        name: `${pre}jopManage`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'company',
            name: `${pre}company`,
            meta: {
                ...meta,
                title: '企业管理',
                // closable: false
            },
            component: () => import('@/pages/jopManage/company')
        },
        {
            path: 'staff',
            name: `${pre}staff`,
            meta: {
                ...meta,
                title: '员工管理',
                // closable: false
            },
            component: () => import('@/pages/jopManage/staff')
        },
        {
            path: 'post',
            name: `${pre}post`,
            meta: {
                ...meta,
                title: '岗位管理',
                // closable: false
            },
            component: () => import('@/pages/jopManage/post')
        },
        {
            path: 'resume',
            name: `${pre}resume`,
            meta: {
                ...meta,
                title: '简历管理',
                // closable: false
            },
            component: () => import('@/pages/jopManage/resume')
        },
    ]
};