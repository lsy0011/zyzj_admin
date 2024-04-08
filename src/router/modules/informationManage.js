import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'informationManage-';

export default {
    path: '/informationManage',
    name: 'informationManage',
    redirect: {
        name: `${pre}informationClassify`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'informationClassify',
            name: `${pre}informationClassify`,
            meta: {
                ...meta,
                title: '资讯分类管理',
                // closable: false
            },
            component: () => import('@/pages/informationManage/informationClassify')
        },
        {
            path: 'informationRelease',
            name: `${pre}informationRelease`,
            meta: {
                ...meta,
                title: '资讯发布管理',
                // closable: false
            },
            component: () => import('@/pages/informationManage/informationRelease')
        },
        {
            path: 'newInformation',
            name: `${pre}newInformation`,
            meta: {
                ...meta,
                title: '新建资讯',
                // closable: false
            },
            component: () => import('@/pages/informationManage/newInformation')
        },
    ]
};
