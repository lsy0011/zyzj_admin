import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'advertisingManage-';

export default {
    path: '/advertisingManage',
    name: 'advertisingManage',
    redirect: {
        name: `${pre}advertisingList`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'advertisingList',
            name: `${pre}advertisingList`,
            meta: {
                ...meta,
                title: '广告列表',
                // closable: false
            },
            component: () => import('@/pages/advertisingManage/advertisingList')
        },
    ]
};
