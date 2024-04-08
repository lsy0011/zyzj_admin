// 菜单，侧边栏
import dashboard from './modules/dashboard'; // 大数据看板
import globalsetting from './modules/globalsetting'; // 全局设置
import permissions from './modules/permissions'; // 权限管理
import handicapped from './modules/handicapped'; // 残疾人管理
// import foundationManage from './modules/foundationManage'; // 基金会管理
import user from './modules/user'; // 用户管理
import informationManage from './modules/informationManage'; // 资讯管理
import goodSupplier from './modules/goodSupplier'; // 商品供应商管理
import goodwillGoods from './modules/goodwillGoods'; // 善意商城商品管理
import goodwillOrder from './modules/goodwillOrder';  // 善意商城订单管理
import medicalSupplier from './modules/medicalSupplier'; // 药品供应商管理
import healthCareGoods from './modules/healthCareGoods';  // 医药保健商品管理
import healthCareOrder from './modules/healthCareOrder';  // 医药保健订单管理
import medicalService from './modules/medicalService';  // 医疗服务管理
import CareService from './modules/CareService';  // 关爱服务管理
import loveScore from './modules/loveScore';  // 爱心积分管理
import benefitCard from './modules/benefitCard';  // 权益卡管理
import advertisingManage from './modules/advertisingManage';  // 广告管理
import benefitAssistedShot from './modules/benefitAssistedShot'; // 益助拍管理
import financeManage from './modules/financeManage'; // 财务管理
import problemManage from './modules/problemManage';   // 常见问题
import foundation from './modules/foundation';    // 基金会管理
import squareManage from './modules/squareManage';   // 广场管理
import jopManage from './modules/jopManage';   // 求职管理

// 系统
import log from './modules/log';

export default [
    dashboard,
    globalsetting,
    permissions,
    informationManage,
    // foundationManage,
    user,
    handicapped,
    squareManage,
    foundation,
    goodSupplier,
    goodwillGoods,
    goodwillOrder,
    medicalSupplier,
    healthCareGoods,
    healthCareOrder,
    medicalService,
    CareService,
    benefitCard,
    advertisingManage,
    benefitAssistedShot,
    financeManage,
    loveScore,
    problemManage,
    jopManage,
    log
];
