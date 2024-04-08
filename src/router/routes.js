import { h } from 'vue';

import dashboard from './modules/dashboard';
import globalsetting from './modules/globalsetting'; // 全局设置
import permissions from './modules/permissions'; // 权限管理
import user from './modules/user'; // 用户管理
import handicapped from './modules/handicapped'; // 残疾人管理
import informationManage from './modules/informationManage'; // 资讯管理
import goodSupplier from './modules/goodSupplier'; // 商品供应商管理
import goodwillGoods from './modules/goodwillGoods';  // 善意商城商品管理
import goodwillOrder from './modules/goodwillOrder';  // 善意商城订单管理
import medicalSupplier from './modules/medicalSupplier'; // 药品供应商管理
import healthCareGoods from './modules/healthCareGoods';  // 医药保健商品管理
import healthCareOrder from './modules/healthCareOrder';  // 医药保健订单管理
import medicalService from './modules/medicalService'; // 医疗服务管理
import CareService from './modules/CareService'; // 关爱服务管理
import loveScore from './modules/loveScore'; // 爱心积分管理
import benefitCard from './modules/benefitCard'; // 权益卡管理
import advertisingManage from './modules/advertisingManage';  // 广告管理
import benefitAssistedShot from './modules/benefitAssistedShot'; // 益助排管理
import financeManage from './modules/financeManage';  // 财务管理
import merchantInfo from './modules/merchantInfo';  // 分账信息
import problemManage from './modules/problemManage';  // 常见问题
import foundation from './modules/foundation';   // 基金会
import squareManage from './modules/squareManage';   // 广场管理
import jopManage from './modules/jopManage';   // 求职管理

import BasicLayout from '@/layouts/basic-layout';

/**
 * 在主框架内显示
 */

const frameIn = [
    {
        path: '/',
        redirect: {
            name: 'dashboard-console'
        },
        component: BasicLayout,
        children: [
            {
                path: 'index',
                name: 'index',
                redirect: {
                    name: 'dashboard-console'
                }
            },
            {
                path: 'log',
                name: 'system-log',
                meta: {
                    title: '前端日志',
                    auth: true
                },
                component: () => import('@/pages/system/log')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: {
                    beforeRouteEnter(to, from, next) {
                        next(instance => instance.$router.replace(from.fullPath));
                    },
                    render: () => h()
                }
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: {
                    beforeRouteEnter(to, from, next) {
                        next(instance => instance.$router.replace(JSON.parse(from.params.route)));
                    },
                    render: () => h()
                }
            }
        ]
    },
    dashboard,
    globalsetting,
    permissions,
    user,
    handicapped,
    informationManage,
    squareManage,
    goodSupplier,
    goodwillGoods,
    goodwillOrder,
    medicalSupplier,
    healthCareGoods,
    healthCareOrder,
    medicalService,
    CareService,
    loveScore,
    benefitCard,
    advertisingManage,
    financeManage,
    benefitAssistedShot,
    merchantInfo,
    problemManage,
    foundation,
    jopManage,
];

/**
 * 在主框架之外显示
 */

const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            // title: '$t:page.login.title'
            title: '登录'
        },
        component: () => import('@/pages/account/login')
    },
    // 注册
    {
        path: '/register',
        name: 'register',
        meta: {
            // title: '$t:page.register.title'
            title: '注册'
        },
        component: () => import('@/pages/account/register')
    },
    // 注册结果
    {
        path: '/register/result',
        name: 'register-result',
        meta: {
            auth: true,
            title: '注册结果'
        },
        component: () => import('@/pages/account/register/result')
    }
];

/**
 * 错误页面
 */

const errorPage = [
    {
        path: '/403',
        name: '403',
        meta: {
            title: '403'
        },
        component: () => import('@/pages/system/error/403')
    },
    {
        path: '/500',
        name: '500',
        meta: {
            title: '500'
        },
        component: () => import('@/pages/system/error/500')
    },
    {
        path: '/:pathMatch(.*)',
        name: '404',
        meta: {
            title: '404'
        },
        component: () => import('@/pages/system/error/404')
    }
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
];
