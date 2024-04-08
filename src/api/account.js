import request from '@/plugins/request';

/*
2. 然后, 方法名的命名:  整体驼峰式, 'method'的值  + url末的字段
    (如果末尾是 list、cancel、detail等常见操作字段, 即没有表明文件位置的情况, 从后往前提取字段)+ "Api", 
    比如:
    'get' + 'sendVerCode' + 'Api' = getSendVerCodeApi;      
    注意驼峰 这里 s => S;
    'post' + 'domeInfo' + list + 'Api' = postDomeInfoListApi; 
    注意驼峰 这里 d => D, l => L;  url末尾字段是常见的list, 不能说明是哪个接口的list, 
    所以这里向左再提一个字段 domeInfo + list :表示domeInfo目录下的list;
 */
// 账号密码登录
export function AccountLogin(data) {
    return request({
        url: '/server/sso/auth/login',
        method: 'post',
        data
    });
}

// 手机号验证码登录
export function postAuthLoginAuthcodeApi(data) {
    return request({
        url: '/server/sso/auth/login4authcode',
        method: 'post',
        data
    });
}

// 获取验证码
export function postSsoCodeSendApi(data) {
    return request({
        url: '/server/sso/code/send',
        method: 'post',
        data
    });
}

export function AccountRegister(data) {
    return request({
        url: '/api/register',
        method: 'post',
        data
    });
}

// 模板列表
// export function basicRegionList() {
//     return request({
//         url: '/server/server/data/open/goods/category/list?parentId=0',
//         method: 'get'
//     });
// }

// 地区树
export function getAreaTreeApi(parentId = '100000', deep = '3') {
    // console.log(data);
    return request({
        url: "/server/data/admin/basic/region/tree",
        method: 'get',
        params: {
            parentId,
            deep
        }
    })
}

/* ========================================> 角色管理  <========================================*/

// 角色分页 
export function getAuthorityRolePageApi(data) {
    return request({
        url: '/server/sso/admin/authority/role/page',
        method: "get",
        params: data
    })
}

// 角色保存
export function postAuthorityRoleSaveApi(data) {
    return request({
        url: '/server/sso/admin/authority/role/save',
        method: 'post',
        data
    });
}

// 角色详情
export function getAuthorityRoleDetailApi(id) {
    return request({
        url: `/server/sso/admin/authority/role/detail/${id}?echoAccess=true`,
        method: "get",
    })
}

// 角色状态 
export function postAuthorityRoleActivateApi(data) {
    return request({
        url: '/server/sso/admin/authority/role/activate',
        method: 'post',
        data
    });
}

// 角色删除
export function postAuthorityRoleRemoveApi(id) {
    return request({
        url: `/server/sso/admin/authority/role/remove/${id}`,
        method: 'post',
    });
}

/* ========================================> 资源配置  <========================================*/

// 资源树 
export function getAuthorityPermissionTreeApi(data) {
    return request({
        url: '/server/sso/admin/authority/permission/tree',
        method: "get",
        params: data
    })
}

// 资源保存
export function postAuthorityPermissionSaveApi(data) {
    return request({
        url: `/server/sso/admin/authority/permission/save`,
        method: 'post',
        data
    });
}

// 资源删除
export function postAuthorityPermissionRemoveApi(id) {
    return request({
        url: `/server/sso/admin/authority/permission/remove/${id}`,
        method: 'post',
    });
}

/* ========================================> 角色授权  <========================================*/

// 角色授权 
export function postAuthorityRoleAccessSaveApi(data, key) {
    return request({
        url: `/server/sso/admin/authority/role/access/save`,
        method: 'post',
        data, key
    });
}

// 角色权限
export function getAuthorityRoleAccessListApi(data) {
    return request({
        url: '/server/sso/admin/authority/role/access/list',
        method: "get",
        params: data
    })
}

/* ========================================> 全局参数  <========================================*/

// 参数读取
export function getSettingDetailApi() {
    return request({
        url: '/server/data/admin/global/setting/detail',
        method: "get"
    })
}

// 数据字典 
export function getSysDictListApi(data) {
    return request({
        url: '/server/data/admin/sys/dict/list',
        method: "get",
        params: data
    })
}

// 配置树状图
export function getSysDictItemTreeApi(data, key = 'list') {
    return request({
        url: `/server/data/admin/sys/dict/item/${key}`,
        method: "get",
        params: data
    })
}

// 配置项保存  
export function postSysDictItemSaveApi(data) {
    return request({
        url: '/server/data/admin/sys/dict/item/save',
        method: 'post',
        data
    });
}

// 配置项删除  
export function postSysDictItemRemoveApi(data) {
    return request({
        url: '/server/data/admin/sys/dict/item/remove',
        method: 'post',
        data
    });
}

// 系统设置 详情
export function getGlobalSetDetailApi() {
    return request({
        url: '/server/data/admin/global/setting/detail',
        method: "get"
    })
}

// 系统设置 保存 
export function postGlobalSetSaveApi(data, key) {
    return request({
        url: '/server/data/admin/global/setting/save',
        method: 'post',
        data,
        key: key
    });
}

/* ========================================> 等级管理  <========================================*/

// 等级列表  
export function getBasicMemberLevelListApi() {
    return request({
        url: '/server/data/admin/basic/member/level/list',
        method: "get",
    })
}

// 等级保存
export function postMemberLevelSaveApi(data, key) {
    return request({
        url: '/server/data/admin/basic/member/level/save',
        method: 'post',
        data, key
    });
}

// 等级删除
export function postMemberLevelRemoveApi(data) {
    return request({
        url: '/server/data/admin/basic/member/level/remove',
        method: 'post',
        data
    });
}

/* -----------------------> 用户列表（管理员） <----------------------- */

// 用户分页
export function getUserInfoPageApi(data) {
    return request({
        url: `/server/data/admin/user/info/page`,
        method: 'get',
        params: data
    })
}

// 用户列表
export function getUserInfoListApi(data) {
    return request({
        url: `/server/data/admin/user/info/list`,
        method: 'get',
        params: data
    })
}

// 用户保存
export function postUserInfoSaveApi(data) {
    return request({
        url: '/server/data/admin/user/info/save',
        method: 'post',
        data
    });
}

// 用户详情
export function getUserInfoDetailApi(id) {
    return request({
        url: `/server/data/admin/user/info/detail/${id}`,
        method: 'get',
    })
}

// 用户状态
export function postUserInfoActiveApi(data) {
    return request({
        url: '/server/data/admin/user/info/active',
        method: 'post',
        data
    });
}

// 用户删除
export function postUserInfoRemoveApi(data) {
    return request({
        url: '/server/data/admin/user/info/remove',
        method: 'post',
        data
    });
}

/* -----------------------> 授权 <----------------------- */

// 用户绑定角色 
export function postRoleMemberBind4accountApi(data, key) {
    return request({
        url: '/server/sso/admin/authority/role/member/bind4account',
        method: 'post',
        data, key
    });
}

// 用户角色 
export function getUserRoleListApi(data) {
    return request({
        url: `/server/sso/admin/authority/user/role/list`,
        method: 'get',
        params: data
    })
}

// 资源树 
export function getSelfAuthorityPermissionTreeApi(data) {
    return request({
        url: `/server/sso/self/authority/permission/tree`,
        method: 'get',
        params: data
    })
}

/* ========================================> 善意商城商品管理  <========================================*/

/* -----------------------> 商品管理 <----------------------- */

// 商品删除
export function postGoodsInfoDelApi(data) {
    return request({
        url: '/server/data/admin/goods/info/remove',
        method: 'post',
        data
    });
}

// 后进出回收站
export function postGoodsInfoRecycle(data) {
    return request({
        url: '/server/data/admin/goods/info/recycle',
        method: 'post',
        data
    })
}

// 商品修改状态
export function postGoodsInfoStatusApi(data, key) {
    return request({
        url: '/server/data/admin/goods/info/status',
        method: 'post',
        data, key
    });
}

// 商品是否推荐
export function postGoodsInfoHotApi(data) {
    return request({
        url: '/server/data/admin/goods/info/hot',
        method: 'post',
        data
    });
}

// 商品详情
export function getGoodsInfoDetailApi(data) {
    return request({
        url: '/server/data/admin/goods/info/detail/' + data,
        method: 'get'
    });
}

// 商品保存
export function postGoodsInfoSaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/info/save',
        method: 'post',
        data,
        key: key
    });
}

// 商品图片删除
export function goodsInfoFileDel(data) {
    return request({
        url: '/server/data/admin/goods/info/file/remove',
        method: 'post',
        data
    });
}

// 拍品审核
export function postGoodsInfoApprovalApi(data) {
    return request({
        url: '/server/data/admin/goods/info/approval',
        method: 'post',
        data
    });
}

/* -----------------------> 拍品 捐助规则 <----------------------- */

// 拍品捐助 列表
export function getGoodsDonateCfgListApi(data) {
    return request({
        url: `/server/data/admin/goods/donate/cfg/list`,
        method: "get",
        params: data
    })
}

// 详情
export function getGoodsDonateCfgDetailApi(id) {
    return request({
        url: `/server/data/admin/goods/donate/cfg/detail/${id}`,
        method: "get",
    })
}

// 保存
export function postGoodsDonateCfgSaveApi(data) {
    return request({
        url: '/server/data/admin/goods/donate/cfg/save',
        method: 'post',
        data
    });
}

// 删除
export function postGoodsDonateCfgRemoveApi(data) {
    return request({
        url: '/server/data/admin/goods/donate/cfg/remove',
        method: 'post',
        data
    });
}


/* -----------------------> 条码关键字 远程获取 <----------------------- */

// 条形码 barcode  // 关键字 search
export function getOttDrugBarcodeApi(data, type = 'barcode') {
    return request({
        url: `/server/data/admin/ott/drug/${type}`,
        method: "get",
        params: data
    })
}

// 药品分类
export function getOttDrugClassifyApi() {
    return request({
        url: `/server/data/admin/ott/drug/classify`,
        method: "get",
    })
}

/* -----------------------> 规格属性管理 <----------------------- */

//  属性分页
export function getGoodsPropertyPageApi(data) {
    return request({
        url: '/server/data/admin/goods/property/page',
        method: "get",
        params: data
    })
}

//  属性列表
export function getGoodsPropertyListApi(data) {
    return request({
        url: '/server/data/admin/goods/property/list',
        method: "get",
        params: data
    })
}

//  属性详情
export function getGoodsPropertyDetailApi(id) {
    return request({
        url: `/server/data/admin/goods/property/detail/${id}`,
        method: "get",
    })
}

// 删除属性
export function postGoodsPropertyRemoveApi(data) {
    return request({
        url: '/server/data/admin/goods/property/remove',
        method: 'post',
        data
    })
}

// 属性保存
export function postGoodsPropertySaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/property/save',
        method: 'post',
        data,
        key
        // 'Content-Type': 'application/x-www-form-urlencoded'
    })
}

// 规格属性状态
export function postGoodsPropertyStatusApi(data) {
    return request({
        url: '/server/data/admin/goods/property/status',
        method: 'post',
        data
    });
}

// 规格属性排序值
export function getGoodsPropertyRankApi(data) {
    return request({
        url: '/server/data/admin/goods/property/rank',
        method: 'post',
        data
    });
}

/* -----------------------> 商品分类管理 <----------------------- */

//  商品分类列表
export function getGoodsCategoryTreeApi(data) {
    return request({
        url: '/server/data/admin/goods/category/tree',
        method: 'get',
        params: data
    });
}

// 商品目录状态 ----》 修改状态
export function postGoodsCategoryStatusApi(data) {
    return request({
        url: '/server/data/admin/goods/category/status',
        method: 'post',
        data
    });
}

// 商品目录详情
export function getGoodsCategoryDetailApi(data) {
    return request({
        url: '/server/data/admin/goods/category/detail/' + data,
        method: 'get'
    });
}

// 商品目录保存
export function postGoodsCategorySaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/category/save',
        method: 'post',
        data,
        key: key
    });
}

// 商品目录删除
export function postGoodsCategoryDelApi(data, key) {
    return request({
        url: '/server/data/admin/goods/category/remove',
        method: 'post',
        data, key
    });
}

/* -----------------------> 品牌管理 <----------------------- */

// 品牌列表
export function getBrandPageApi(data) {
    return request({
        url: '/server/data/admin/goods/brand/page',
        method: 'get',
        params: data
    });
}

// 品牌保存
export function postBrandSaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/brand/save',
        method: 'post',
        data,
        key: key
    });
}

// 品牌删除
export function postBrandDelApi(data) {
    return request({
        url: '/server/data/admin/goods/brand/remove',
        method: 'post',
        data
    });
}

/* -----------------------> 商品回收站 <-----------------------*/

// 商品列表
export function getGoodsInfoPageApi(data) {
    return request({
        url: '/server/data/admin/goods/info/page',
        method: 'get',
        params: data
    });
}

// 供应商列表
export function getSupplierListApi(data) {
    return request({
        url: '/server/data/admin/merchant/base/list',
        method: 'get',
        params: data
    });
}

/* -----------------------> 运费模板 <----------------------- */

// 运费模板列表
export function getFreightTemplateListApi(data) {
    return request({
        url: '/server/data/admin/basic/freight/template/list',
        method: 'get',
        params: data
    });
}

// 运费模板保存
export function postFreightTemplateSaveApi(data, key) {
    return request({
        url: '/server/data/admin/basic/freight/template/save',
        method: 'post',
        data,
        key: key
    });
}

// 地区列表
export function getGasicRegionListApi(data) {
    return request({
        url: '/server/data/admin/basic/region/list',
        method: 'get',
        params: data
    });
}

// 运费模板详情
export function getFreightTemplateDetailApi(data) {
    return request({
        url: '/server/data/admin/basic/freight/template/detail/' + data,
        method: 'get'
    });
}

/* -----------------------> 商品规格管理 <-----------------------*/

// 商品规格值列表
export function getGoodsPropertyValueListApi(data) {
    return request({
        url: '/server/data/admin/goods/property/value/list',
        method: 'get',
        params: data
    });
}

// 商品属性值保存
export function postGoodsPropertyValueSaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/property/value/save',
        method: 'post',
        data,
        key: key
    });
}

// 规格删除
export function postGoodsPropertyValueRemoveApi(data) {
    return request({
        url: '/server/data/admin/goods/property/value/remove',
        method: 'post',
        data,
    });
}

// 商品库存保存
export function postGoodsSkuSaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/sku/save',
        method: 'post',
        data,
        key: key
    });
}


// 商品规格 --->  库存列表
export function getGoodsSkuListApi(data) {
    return request({
        url: '/server/data/admin/goods/sku/list',
        method: 'get',
        params: data
    });
}

// 删除库存 
export function postGoodsSkuRemoveApi(data) {
    return request({
        url: '/server/data/admin/goods/sku/remove',
        method: 'post',
        data
    });
}

/* --------------------------------------> 媒体 <---------------------------------------- */

// 媒体保存 
export function postGoodsMediaBatchSaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/media/batch/save',
        method: 'post',
        data, key
    });
}

// 媒体列表
export function getGoodsMediaListApi(data) {
    return request({
        url: '/server/data/admin/goods/media/list',
        method: 'get',
        params: data
    });
}

// 媒体删除
export function postGoodsMediaRemoveApi(data) {
    return request({
        url: '/server/data/admin/goods/media/remove',
        method: 'post',
        data
    });
}

/* -----------------------> 善意商城/医药保健 订单管理 <----------------------- */

// 订单状态 
export function getGoodsOrderStatusListApi(data) {
    return request({
        url: '/server/data/admin/goods/order/status/list',
        method: 'get',
        params: data
    });
}

// 订单列表
export function getGoodsOrderPageApi(data) {
    return request({
        url: '/server/data/admin/goods/order/page',
        method: 'get',
        params: data
    });
}

// 订单详情 
export function getGoodsOrderDetailApi(id) {
    return request({
        url: `/server/data/admin/goods/order/detail/${id}`,
        method: "get",
    })
}

// 订单导出
export function getGoodsOrderExportApi(data) {
    return request({
        url: `/server/data/admin/goods/order/export`,
        method: "get",
        params: data
    })
}

/* -----------------------> 医疗服务管理 供应商 <----------------------- */

// 机构管理 --> 列表
export function getMerchantBasePageApi(data) {
    return request({
        url: '/server/data/admin/merchant/base/page',
        method: 'get',
        params: data
    })
}

// 新增机构管理
export function getMerchantBaseSaveApi(data, key) {
    return request({
        url: '/server/data/admin/merchant/base/save',
        method: 'post',
        data,
        key
    })
}

// 机构详情
export function getMerchantBaseDetailApi(organId) {
    return request({
        url: `/server/data/admin/merchant/base/detail/${organId}`,
        method: 'get'
    })
}

// 机构删除
export function postMerchantBaseRemoveApi(data) {
    return request({
        url: `/server/data/admin/merchant/base/remove`,
        method: 'post',
        data
    })
}

// 机构状态
export function postMerchantBaseStatusApi(data) {
    return request({
        url: `/server/data/admin/merchant/base/status`,
        method: 'post',
        data
    })
}

/*  --------------------------------> 资质文件 <----------------------------------  */

// 资质列表
export function getMerchantCertListApi(data) {
    return request({
        url: '/server/data/admin/merchant/cert/list',
        method: 'get',
        params: data
    })
}

// 资质保存
export function getMerchantCertSaveApi(data, key) {
    return request({
        url: '/server/data/admin/merchant/cert/save',
        method: 'post',
        data, key
    })
}

// 资质删除
export function postMerchantCertRemoveApi(data) {
    return request({
        url: `/server/data/admin/merchant/cert/remove`,
        method: 'post',
        data
    })
}

/*  --------------------------------> 机构分类管理 <----------------------------------  */

// 机构分类管理 --->  目录树
export function getSupplierCategoryTreeApi(data) {
    return request({
        url: '/server/data/admin/merchant/category/tree',
        method: 'get',
        params: data
    })
}

// 机构分类详情
export function getMerchantCategoryDetailApi(id) {
    return request({
        url: `/server/data/admin/merchant/category/detail/${id}`,
        method: 'get',
    })
}

// 新增机构分类
export function postMerchantCategorySaveApi(data, key) {
    return request({
        url: '/server/data/admin/merchant/category/save',
        method: 'post',
        data,
        key
    })
}

// 机构分类  状态  
export function postMerchantCategoryStatuslApi(data) {
    return request({
        url: `/server/data/admin/merchant/category/status`,
        method: 'post',
        data
    })
}

// 机构分类  删除  
export function postMerchantCategoryRemovelApi(data) {
    return request({
        url: `/server/data/admin/merchant/category/remove`,
        method: 'post',
        data
    })
}

// 商家审核
export function postMerchantBaseApprovalApi(data) {
    return request({
        url: `/server/data/admin/merchant/base/approval`,
        method: 'post',
        data
    })
}

// 商家分账信息
export function postMerchantPayYsRegApi(data, key) {
    return request({
        url: `/server/data/admin/merchant/pay/ys/reg`,
        method: 'post',
        data, key
    })
}

// 通道token
export function postMerchantPayYsTokenApi(data) {
    return request({
        url: `/server/data/admin/merchant/pay/ys/token`,
        method: 'post',
        data
    })
}

/*  --------------------------------> 门店管理 <----------------------------------  */

// 门店列表
export function getStoreInfoPageApi(data) {
    return request({
        url: '/server/data/admin/store/info/page',
        method: 'get',
        params: data
    })
}

// 新建门店、门店保存  
export function getStoreInfoSaveApi(data, key) {
    return request({
        url: '/server/data/admin/store/info/save',
        method: 'post',
        data,
        key
    })
}

// 门店详情 
export function getStoreInfoDetailApi(id) {
    return request({
        url: `/server/data/admin/store/info/detail/${id}`,
        method: 'get'
    })
}

// 服务分类管理 状态 
export function postStoreInfoStatusApi(data) {
    return request({
        url: `/server/data/admin/store/info/status`,
        method: 'post',
        data
    })
}

// 门店删除 
export function postStoreInfoRemove(data) {
    return request({
        url: `/server/data/admin/store/info/remove`,
        method: 'post',
        data
    })
}

// 批量设置优惠付
export function postStoreInfoBatchCardPayDisApi(data, key) {
    return request({
        url: `/server/data/admin/store/info/batch/cardPayDis`,
        method: 'post',
        data, key
    })
}

// 门店收款二维码 
export function postStoreInfoPayQrApi(data) {
    return request({
        url: `/server/data/admin/store/info/payQr`,
        method: 'post',
        data
    })
}


/*  --------------------------------> 店员管理 <----------------------------------  */

// 店员列表
export function getMerchantStaffPageApi(data) {
    return request({
        url: '/server/data/admin/merchant/staff/page',
        method: 'get',
        params: data
    })
}

// 店员详情
export function getMerchantStaffDetailApi(userId) {
    return request({
        url: `/server/data/admin/merchant/staff/detail/${userId}`,
        method: 'get'
    })
}

// 店员保存 
export function getMerchantStaffSaveApi(data, key) {
    return request({
        url: '/server/data/admin/merchant/staff/save',
        method: 'post',
        data,
        key
    })
}

// 店员删除 /merchant/staff/remove
export function postMerchantStaffRemovelApi(data) {
    return request({
        url: `/server/data/admin/merchant/staff/remove`,
        method: 'post',
        data
    })
}

// 店员设置成管理员 
export function postMerchantStaffSetLeaderApi(data) {
    return request({
        url: `/server/data/admin/merchant/staff/set/leader`,
        method: 'post',
        data
    })
}

// 服务管理

// 服务分页列表  
export function getServiceInfoPagetApi(data) {
    return request({
        url: `/server/data/admin/service/info/page`,
        method: 'get',
        params: data
    })
}

// 服务 详情 
export function getServiceInfoDetailApi(userId) {
    return request({
        url: `/server/data/admin/service/info/detail/${userId}`,
        method: 'get'
    })
}

// 服务 新增 保存
export function getServiceInfoSaveApi(data, key) {
    return request({
        url: '/server/data/admin/service/info/save',
        method: 'post',
        data,
        key
    })
}

// 服务推荐
export function postServiceInfoHotApi(data) {
    return request({
        url: `/server/data/admin/service/info/hot`,
        method: 'post',
        data
    })
}

// 服务分类管理 状态 
export function postServiceInfoStatusApi(data) {
    return request({
        url: `/server/data/admin/service/info/status`,
        method: 'post',
        data
    })
}

// 服务删除
export function postServiceInfoRemoveApi(data) {
    return request({
        url: `/server/data/admin/service/info/remove`,
        method: 'post',
        data
    })
}

// 服务图片删除 
export function postServiceInfoFileRemoveApi(data) {
    return request({
        url: `/server/data/admin/service/info/file/remove`,
        method: 'post',
        data
    })
}

// 服务分类管理

// 服务分类管理列表
export function getServiceCategoryListApi(data) {
    return request({
        url: `/server/data/admin/service/category/list`,
        method: 'get',
        params: data
    })
}

// 服务分类详情 
export function getServiceCategoryDetailApi(userId) {
    return request({
        url: `/server/data/admin/service/category/detail/${userId}`,
        method: 'get'
    })
}

//  服务分类管理 新增/保存
export function postServiceCategorySaveApi(data, key) {
    return request({
        url: '/server/data/admin/service/category/save',
        method: 'post',
        data,
        key
    })
}

// 服务分类管理 状态 
export function postServiceCategoryStatuslApi(data) {
    return request({
        url: `/server/data/admin/service/category/status`,
        method: 'post',
        data
    })
}

// 服务分类管理  删除  
export function postServiceCategoryRemovelApi(data) {
    return request({
        url: `/server/data/admin/service/category/remove`,
        method: 'post',
        data
    })
}


/* ------------------------------------> 服务 订单管理 <------------------------------------ */

// 服务订单状态
export function getServiceOrderStatusListApi() {
    return request({
        url: `/server/data/admin/service/order/status/list`,
        method: 'get',
    })
}

// 订单列表  
export function getServiceOrderPageApi(data) {
    return request({
        url: `/server/data/admin/service/order/page`,
        method: 'get',
        params: data
    })
}

// 订单详情 
export function getServiceOrderDetailApi(id) {
    return request({
        url: `/server/data/admin/service/order/detail/${id}`,
        method: 'get',
    })
}

/* ------------------------------------> 资讯管理 <------------------------------------ */

// 资讯分类管理

// 资讯分类列表  
export function getCmsCategoryPolicyListApi(type = 'information') {
    return request({
        url: `/server/data/admin/cms/category/${type}/list`,
        method: 'get',
    })
}

// 资讯分类树 /admin/cms/category/policy/tree
export function getCmsCategoryPolicyTreeApi(type = 'information') {
    return request({
        url: `/server/data/admin/cms/category/${type}/tree`,
        method: 'get',
    })
}

// 资讯分类保存  
export function postCmsCategoryPolicySaveApi(data, key, type = 'information') {
    return request({
        url: `/server/data/admin/cms/category/${type}/save`,
        method: 'post',
        data, key
    })
}

// 资讯分类删除  
export function postCmsCategoryPolicyRemoveApi(data, type = 'information') {
    return request({
        url: `/server/data/admin/cms/category/${type}/remove`,
        method: 'post',
        data
    })
}

// 状态修改
export function postCmsCategoryPolicyStatusApi(data, type = 'information') {
    return request({
        url: `/server/data/admin/cms/category/${type}/status`,
        method: 'post',
        data
    })
}

// 资讯发布管理 文章

/**
 * 资讯管理 type = policy ；
 * 全局 → 用户协议 →  协议保存 隐私协议privacy 、 用户协议 userAgreement
 */


// 资讯发布列表   
export function getCmsContentPolicyPageApi(data, type = 'information') {
    return request({
        url: `/server/data/admin/cms/content/${type}/page`,
        method: 'get',
        params: data
    })
}

// 资讯状态
export function postCmsContentPolicyStatusApi(data, key, type = 'information') {
    return request({
        url: `/server/data/admin/cms/content/${type}/status`,
        method: 'post',
        data, key
    })
}

// 资讯批量分类
export function postCmsContentPolicyCategoryApi(data, key, type = 'information') {
    return request({
        url: `/server/data/admin/cms/content/${type}/category`,
        method: 'post',
        data, key
    })
}

// 文章排序
export function postCmsContentRankApi(data, type = 'information') {
    return request({
        url: `/server/data/admin/cms/content/${type}/rank`,
        method: 'post',
        data
    })
}

// 保存 详情 （用户协议保存）
export function postCmsContentPolicySaveApi(data, key, type = 'information') {
    return request({
        url: `/server/data/admin/cms/content/${type}/save`,
        method: 'post',
        data,
        key
    })
}

// 文章最新(唯一) 协议 详情 协议保存 隐私协议privacy 、 用户协议 userAgreement
export function getContentTypeLstestApi(type) {
    return request({
        url: `/server/data/admin/cms/content/${type}/latest`,
        method: 'get',
    });
}

// 删除 
export function postCmsContentPolicyRemoveApi(data, key, type = 'information') {
    return request({
        url: `/server/data/admin/cms/content/${type}/remove`,
        method: 'post',
        data, key
    })
}

// 详情 
export function getCmsContentPolicyDetailApi(userId, type = 'information') {
    return request({
        url: `/server/data/admin/cms/content/${type}/detail/${userId}`,
        method: 'get'
    })
}

/* ------------------------------------> 物流 <------------------------------------ */

// 发货
export function postLogisticsDeliverApi(data) {
    return request({
        url: `/server/data/admin/logistics/deliver`,
        method: 'post',
        data
    })
}

// 概要
export function getLogisticsSummaryApi(data) {
    return request({
        url: `/server/data/admin/logistics/summary`,
        method: 'get',
        params: data
    })
}

// 物流跟踪  
export function getLogisticsTrackingListApi(data) {
    return request({
        url: `/server/data/admin/logistics/tracking/list`,
        method: 'get',
        params: data
    })
}


/* ------------------------------------> 权益卡 <------------------------------------ */


// 卡分页 
export function getEquitycardPageApi(data) {
    return request({
        url: `/server/data/admin/equitycard/page`,
        method: 'get',
        params: data
    })
}

// 卡保存 
export function postEquityCardSaveApi(data, key) {
    return request({
        url: '/server/data/admin/equitycard/save',
        method: 'post',
        data,
        key
    })
}

// 卡状态
export function postEquityCardStageApi(data) {
    return request({
        url: '/server/data/admin/equitycard/stage',
        method: 'post',
        data,
    })
}

// 卡发放
export function postEquityCardIssueApi(data, key) {
    return request({
        url: '/server/data/admin/equitycard/issue',
        method: 'post',
        data, key
    })
}


/* ------------------------------------> 积分管理 <------------------------------------ */


// 积分规则
export function getCoinflowSettingListApi() {
    return request({
        url: `/server/data/admin/coinflow/setting/list`,
        method: 'get',
    })
}

// 规则保存
export function postCoinflowSettingSaveApi(data) {
    return request({
        url: '/server/data/admin/coinflow/setting/save',
        method: 'post',
        data,
    })
}

// 积分方向
export function getCoinflowSettingActionsApi(data) {
    return request({
        url: `/server/data/admin/coinflow/setting/actions`,
        method: 'get',
        params: data
    })
}


/* -----------------------> 卡金管理 <----------------------- */


// 卡金规则
export function getSettingCardfundFlowListApi() {
    return request({
        url: `/server/data/admin/setting/cardfund/flow/list`,
        method: 'get',
    })
}

// 卡金保存  
export function postSettingCardfundFlowSaveApi(data) {
    return request({
        url: '/server/data/admin/setting/cardfund/flow/save',
        method: 'post',
        data,
    })
}

// 卡金方向
export function getSettingCardfundFlowActionsApi(data) {
    return request({
        url: `/server/data/admin/setting/cardfund/flow/actions`,
        method: 'get',
        params: data
    })
}


/* -----------------------> 卡金管理 <----------------------- */


// 分账类型 
export function getSettingPaydivTypesApi() {
    return request({
        url: `/server/data/admin/setting/paydiv/types`,
        method: 'get',
    })
}

// 分账保存 
export function postSettingPaydivSaveApi(data, key) {
    return request({
        url: '/server/data/admin/setting/paydiv/save',
        method: 'post',
        data, key
    })
}

// 分账详情
export function getSettingPaydivDetailApi(data) {
    return request({
        url: `/server/data/admin/setting/paydiv/detail`,
        method: 'get',
        params: data
    })
}

/* -----------------------> 优惠付订单管理 <----------------------- */

// 订单分页 
export function getDirectOrderPageApi(data) {
    return request({
        url: `/server/data/admin/direct/order/page`,
        method: 'get',
        params: data
    })
}

// 订单状态 
export function getDirectOrderStatusListApi(data) {
    return request({
        url: `/server/data/admin/direct/order/status/list`,
        method: 'get',
        params: data
    })
}

// 订单详情
export function getDirectOrderDetailApi(id) {
    return request({
        url: `/server/data/admin/direct/order/detail/${id}`,
        method: 'get',
    })
}

/* -----------------------> 拍卖 委托方 <----------------------- */

// 委托方分页
export function getAuctionConsignerPageApi(data) {
    return request({
        url: `/server/data/admin/auction/consigner/page`,
        method: 'get',
        params: data
    })
}

// 详情
export function getAuctionConsignerDetailApi(id) {
    return request({
        url: `/server/data//admin/auction/consigner/detail/${id}`,
        method: 'get',
    })
}

// 委托方保存
export function postAuctionConsignerSaveApi(data, key) {
    return request({
        url: '/server/data/admin/auction/consigner/save',
        method: 'post',
        data, key
    })
}

// 委托方状态
export function postAuctionConsignerStatusApi(data) {
    return request({
        url: '/server/data/admin/auction/consigner/status',
        method: 'post',
        data
    })
}

// 委托方删除
export function postAuctionConsignerRemoveApi(data) {
    return request({
        url: '/server/data/admin/auction/consigner/remove',
        method: 'post',
        data
    })
}

// 审核
export function postAuctionConsignerApprovalApi(data) {
    return request({
        url: '/server/data/admin/auction/consigner/approval',
        method: 'post',
        data
    })
}

// 资质分页
export function getConsignerCertListApi(data) {
    return request({
        url: '/server/data/admin/auction/consigner/cert/list',
        method: 'get',
        params: data
    });
}

/* -----------------------> 拍卖订单 <----------------------- */

// 订单状态
export function getAuctionOrderStatusListApi(data) {
    return request({
        url: `/server/data/admin/auction/order/status/list`,
        method: 'get',
        params: data
    })
}

// 订单分页
export function getAuctionOrderPageApi(data) {
    return request({
        url: `/server/data/admin/auction/order/page`,
        method: 'get',
        params: data
    })
}

// 订单详情
export function getAuctionOrderDetailApi(id) {
    return request({
        url: `/server/data/admin/auction/order/detail/${id}`,
        method: 'get',
    })
}

// 申请单状态
export function getAuctionApplyStateListApi(data) {
    return request({
        url: `/server/data/admin/auction/apply/state/list`,
        method: 'get',
        params: data
    })
}

// 申请单分页 
export function getAuctionApplyPageApi(data) {
    return request({
        url: `/server/data/admin/auction/apply/page`,
        method: 'get',
        params: data
    })
}

// 申请单详情
export function getAuctionApplyDetailApi(data) {
    return request({
        url: `/server/data/admin/auction/apply/detail`,
        method: 'get',
        params: data
    })
}

/* -----------------------> 指定用户管理 <----------------------- */

// 指定保存
export function postGoodsWhitelistSaveApi(data, key) {
    return request({
        url: '/server/data/admin/goods/whitelist/save',
        method: 'post',
        data, key
    })
}

// 获取指定
export function getGoodsWhitelistPageApi(data) {
    return request({
        url: `/server/data/admin/goods/whitelist/page`,
        method: 'get',
        params: data
    })
}

// 指定详情
export function getGoodsWhitelistDetailApi(id) {
    return request({
        url: `/server/data/admin/goods/whitelist/detail/${id}`,
        method: 'get',
    })
}

// 指定删除
export function postGoodsWhitelistRemoveApi(data) {
    return request({
        url: '/server/data/admin/goods/whitelist/remove',
        method: 'post',
        data
    })
}

// 指定状态
export function postGoodsWhitelistStatusApi(data) {
    return request({
        url: '/server/data/admin/goods/whitelist/status',
        method: 'post',
        data
    })
}


/* -----------------------> 业务主题  通用参数 <----------------------- */

// 参数读取
export function getSysSettingReadApi(data) {
    return request({
        url: `/server/data/admin/sys/setting/read`,
        method: 'get',
        params: data
    })
}

// 参数写入
export function postSysSettingSaveApi(data) {
    return request({
        url: '/server/data/admin/sys/setting/save',
        method: 'post',
        data
    })
}

// 参数清理
export function postSysSettingClearApi(data) {
    return request({
        url: '/server/data/admin/sys/setting/clear',
        method: 'post',
        data
    })
}


/* ========================================>  广告管理  <========================================*/

//  广告分页
export function getBasicRecommendPageApi(data) {
    return request({
        url: '/server/data/admin/basic/recommend/page',
        method: "get",
        params: data,
    })
}

// 广告保存
export function postBasicRecommendSaveApi(data, key) {
    return request({
        url: '/server/data/admin/basic/recommend/save',
        method: 'post',
        data, key
    });
}

// 广告详情
export function getBasicRecommendDetailApi(id) {
    return request({
        url: `/server/data/admin/basic/recommend/detail/${id}`,
        method: "get"
    })
}

// 广告状态
export function postBasicRecommendStatusApi(data) {
    return request({
        url: '/server/data/admin/basic/recommend/status',
        method: 'post',
        data
    });
}

// 广告排序
export function postBasicRecommendRankApi(data) {
    return request({
        url: '/server/data/admin/basic/recommend/rank',
        method: 'post',
        data
    });
}

// 广告删除
export function postBasicRecommendRemoveApi(data) {
    return request({
        url: '/server/data/admin/basic/recommend/remove',
        method: 'post',
        data
    });
}


/* ========================================>  评论管理  <========================================*/

// 评论分页
export function getCommentsPageApi(data) {
    return request({
        url: '/server/data/admin/comments/page',
        method: "get",
        params: data,
    })
}

// 评论详情
export function getCommentsDetailApi(id) {
    return request({
        url: `/server/data/admin/comments/detail/${id}`,
        method: "get"
    })
}

// 评论审核
export function postCommentsAuditApi(data) {
    return request({
        url: '/server/data/admin/comments/audit',
        method: 'post',
        data
    });
}

// 评论删除
export function postCommentsRemoveApi(data) {
    return request({
        url: '/server/data/admin/comments/remove',
        method: 'post',
        data
    });
}

// 评论文件列表
export function getCommentsFilesListApi(data) {
    return request({
        url: '/server/data/admin/comments/files/list',
        method: "get",
        params: data,
    })
}

// 图片审核
export function postCommentsFilesAuditApi(data) {
    return request({
        url: '/server/data/admin/comments/files/audit',
        method: 'post',
        data
    });
}

// 评论图片删除
export function postCommentsFilesRemoveApi(data) {
    return request({
        url: '/server/data/admin/comments/files/remove',
        method: 'post',
        data
    });
}

// 首页数据
export function getRptBizStatApi(data) {
    return request({
        url: '/server/data/admin/rpt/biz/stat',
        method: "get",
        params: data
    })
}

/* ========================================>  分账记录  <======================================== */

// 分账记录
export function getFinancePaydivLogPageApi(data) {
    return request({
        url: '/server/data/admin/finance/paydiv/log/page',
        method: "get",
        params: data
    })
}

// 记录详情
export function getFinancePaydivLogDetailApi(id) {
    return request({
        url: `/server/data/admin/finance/paydiv/log/detail/${id}`,
        method: "get",
    })
}

// 明细列表
export function getFinancePaydivDetailListApi(data) {
    return request({
        url: '/server/data/admin/finance/paydiv/detail/list',
        method: "get",
        params: data
    })
}

// 明细详情
export function getFinancePaydivDetailDetailApi(id) {
    return request({
        url: `/server/data/admin/finance/paydiv/detail/detail/${id}`,
        method: "get",
    })
}

/* ========================================>  岗位管理  <======================================== */

// 岗位分页 
export function getRecruitPageApi(data) {
    return request({
        url: '/server/data/admin/recruit/page',
        method: "get",
        params: data,
    })
}

// 岗位状态
export function postRecruitStatusApi(data) {
    return request({
        url: '/server/data/admin/recruit/status',
        method: 'post',
        data
    });
}

// 删除
export function postRecruitRemoveApi(data) {
    return request({
        url: '/server/data/admin/recruit/remove',
        method: 'post',
        data
    });
}

// 详情
export function getRecruitDetailApi(id) {
    return request({
        url: `/server/data/admin/recruit/detail/${id}`,
        method: "get",
    })
}

// 审核 
export function postRecruitApprovalApi(data) {
    return request({
        url: '/server/data/admin/recruit/approval',
        method: 'post',
        data
    });
}

// 简历列表
export function getUsrResumeListApi(data) {
    return request({
        url: '/server/data/admin/usr/resume/list',
        method: "get",
        params: data,
    })
}

// 下载图片
import axios from 'axios';
export const getImage = (url) => { return axios({ method: 'get', url: '/upload' + url, responseType: 'blob' }) };
//此接口的意思是通过get方式请求图片,图片类型是blob