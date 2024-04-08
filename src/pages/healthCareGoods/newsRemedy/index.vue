<template>
    <div class='newsRemedy'>
        <!-- <h5>新建药品</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" :content="pageTitle" hidden-breadcrumb />
        </div>
        <div class="news_body">
            <div class="body_top">
                <Row>
                    <Col span="3">
                    <strong style="margin-right: 15px;">查询方式:</strong>
                    <RadioGroup v-model="searchCode.type" @on-change="(i) => searchTypeChange(i)">
                        <Radio label="barcode">
                            <span>69码</span>
                        </Radio>
                        <Radio label="search">
                            <span>关键字</span>
                        </Radio>
                    </RadioGroup>
                    </Col>
                    <Col span="18" style="margin-bottom: 20px;">
                    <template v-if="searchCode.type == 'search'">
                        <TreeSelect v-model="searchCode.classifyId" placeholder="请选择次级分类" clearable :data="classList"
                            v-width="150" />
                        <Input v-model="searchCode.searchKey" placeholder="请输入条形编码或者药品名称" clearable
                            style="width: 40%;"></Input>
                        <Select v-model="searchCode.searchType" clearable v-width="100">
                            <Option value="1">药品名称</Option>
                            <Option value="2">药企名称</Option>
                            <Option value="3">药准字号</Option>
                            <Option value="4">药品id</Option>
                        </Select>
                    </template>
                    <Input v-else v-model="searchCode.codeId" placeholder="请输入条形编码或者商品名称" style="width: 40%;"></Input>
                    <Button type="primary" @click="getCodeList" style="margin: 0 20px;">查询</Button>
                    <Button type="primary">+自定义增加</Button>
                    </Col>
                </Row>
                <Row v-if="drugSearchList.length !== 0">
                    <Col span="2">
                    </Col>
                    <Col span="19">
                    <div style="border: 1px solid #d7d7d7;display: inline-block; ">
                        <RadioGroup style="display: flex;margin: 10px;" @on-change="changeDrugRadio">

                            <template v-for="(item, index) in drugSearchList" :key="index">
                                <Radio :label="index" style="display: flex;align-items: center; margin: 0 10px;">
                                    <img src="" alt="" width="50">
                                    <div>
                                        <strong>{{ item.drugName }}</strong>
                                        <p>{{ item.manu }}</p>
                                        <p>{{ item.gg }}</p>
                                    </div>
                                </Radio>
                            </template>
                        </RadioGroup>
                    </div>
                    </Col>
                </Row>
            </div>
            <Skeleton :loading="loadingSke" animated
                :paragraph="{ rows: 5, width: ['70%', '78%', '86%', '94%', '100%'] }">
            </Skeleton>
            <div class="body_main" v-show="!loadingSke">
                <!-- 通用 -->
                <Row style="margin: 20px 0 10px;">
                    <Col span="2">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>条形编码</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.barcode" placeholder="请输入条形编码"></Input>
                    </Col>
                    <Col span="2">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>商品名称</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.name" placeholder="请输入商品名称"></Input>
                    </Col>
                </Row>
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>通用名称</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input placeholder="请输入名称 -- "></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>商品名称</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.name" disabled placeholder="请输入商品名称"></Input>
                    </Col>
                </Row> -->
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>分类</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <TreeSelect v-model="list.categoryId" :data="classifyList" @on-change="(id) => classId = id" />
                    </Col>
                    <Col span="2">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>品牌</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Select v-model="list.brandId" filterable :remote-method="remoteMethodBrand"
                        :loading="loadingBrand">
                        <Option :value="item.id" v-for="item in  brandDataList" :key="item.id">{{ item.name }}
                        </Option>
                    </Select>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>批准文号</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.approval" placeholder="请输入批准文号"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>规格</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.spec" placeholder="请输入规格"></Input>
                    </Col>
                </Row>
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>药品id</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input placeholder="请输入药品id -- "></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>保质期</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input placeholder="请输入保质期 -- "></Input>
                    </Col>
                </Row> -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>汉语拼音</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.namePy" placeholder="请输入汉语拼音"></Input>
                    </Col>
                    <Col span="2">
                    <strong>执行标准</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.manuExeStandard" placeholder="请输入执行标准 --- "></Input>
                    </Col>
                </Row> -->
                <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>有效期</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.validity" placeholder="请输入有效期"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>贮藏</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.storage" placeholder="请输入"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>生产企业</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.manuName" placeholder="请输入生产企业"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>性状</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.character" placeholder="请输入"></Input>
                    </Col>
                </Row>

                <!-- 药品 -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>剂型</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.form" placeholder="请输入 --- "></Input>
                    </Col>
                    <Col span="2">
                    <strong>药理毒理</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input placeholder="请输入药理毒理 -- "></Input>
                    </Col>
                </Row> -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>药物相互作用</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.interactions" placeholder="请输入 --- "></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>不良反应</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.adr" placeholder="请输入不良反应 --- "></Input>
                    </Col>
                </Row> -->
                <!-- <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>适应症状</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.cureDisease" placeholder="请输入适应症状 --- "></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>药代动力学</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.dmpk" placeholder="请输入 --- "></Input>
                    </Col>
                </Row> -->
                <!-- 通用 -->
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    <strong>禁忌</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.taboo" placeholder="请输入"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;"><strong>主治疾病</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.purpose" placeholder="请输入主治疾病"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <!-- <Col span="2">
                    <strong>适宜人群</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.commendedUser" placeholder="请输入适宜人群 --- "></Input>
                    </Col> -->
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>供应商</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Select v-model="list.merchantId" filterable :remote-method="remoteMethodMerchant"
                        :loading="loadingMerchant">
                        <Option :value="item.id" v-for="item in merchantList" :key="item.id">{{ item.name }}
                        </Option>
                    </Select>
                    </Col>
                    <Col span="2">
                    <strong>用法用量</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.dosage" placeholder="请输入用法用量"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;"><strong>注意事项</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.consideration" placeholder="请输入注意事项"></Input>
                    </Col>
                    <Col span="2">
                    <strong>主要成分</strong></Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.basis" placeholder="请输入主要成分"></Input>
                    </Col>
                </Row>
                <!-- 通用 -->
                <Row style="margin: 20px 0;">
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>初始销量</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.initSales" type="number"
                        @on-blur="list.initSales = $event.target.value < 0 ? 0 : $event.target.value * 1"
                        placeholder="请输入销量"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>市场价</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.marketPrice" type="number"
                        @on-blur="list.marketPrice = $event.target.value < 0 ? 0 : $event.target.value * 1"
                        placeholder="请输入价格"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <!--  -->
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>权益卡补贴金额</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.cyCardDiscount" type="number"
                        @on-blur="list.cyCardDiscount = $event.target.value < 0 ? 0 : $event.target.value * 1"
                        placeholder="请输入价格"></Input>
                    </Col>
                    <Col span="2" style="text-align: right;">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>成本价</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;">
                    <Input v-model="list.costPrice" type="number"
                        @on-blur="list.costPrice = $event.target.value < 0 ? 0 : $event.target.value * 1"
                        placeholder="请输入价格"></Input>
                    </Col>
                </Row>
                <Row style="margin: 20px 0;">
                    <Col span="2">
                    关联基金会</Col>
                    <Col span="9">
                    <Select v-model="list.foundationId" filterable :remote-method="remoteMethodNPO"
                        :loading="loadingNPO">
                        <Option v-for="(option, index) in NPOList" :value="option.id" :key="index">
                            {{ option.name }}
                        </Option>
                    </Select>
                    </Col>
                    <!--  -->
                    <Col span="2" style="text-align: right;" v-if="medicalType == 'drug'">
                    <Icon type="md-medical" size="11" color="#ff0000" style="transform: scale(.5);" />
                    <strong>医药类型</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;" v-if="medicalType == 'drug'">
                    <RadioGroup v-model="list.drugType">
                        <!-- <Radio label="health">
                            <span>保健品</span>
                        </Radio> -->
                        <Radio label="prescription">
                            <span>处方药</span>
                        </Radio>
                        <Radio label="otc">
                            <span>非处方药</span>
                        </Radio>
                    </RadioGroup>
                    </Col>
                    <Col span="2" style="text-align: right;" v-if="medicalType != 'drug'"><strong>是否进口</strong>
                    </Col>
                    <Col span="9" style="display: flex;align-items: center;" v-if="medicalType != 'drug'">
                    <RadioGroup v-model="list.imported">
                        <Radio label="true">
                            <span>是</span>
                        </Radio>
                        <Radio label="false">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                    </Col>
                </Row>
                <!-- 规格 库存 组件 -->
                <skuStore ref="skuStore" :bizType="bizType" :goodsId="goodsId" :classId="classId"
                    :classifyList="classifyList" :haveSizeList="haveSizeList"></skuStore>
                <!-- 分账规则 @on-blur="list.marketPrice = $event.target.value < 0 ? 0 : $event.target.value" -->

                <!-- 
                        系统没办法支持
                        目前只能 根据 订单类型 去匹配 分账策略， 无法做到 不同商品不同策略
                        分账通道 都是根据订单来的，拆不到商品
                     -->
                <!-- <div class="newGoods-price">
                    <div class="basics-title">分账规则：
                        <Switch size="large" v-model="ruleFlag">

                            <template #open>
                                <span>全局</span>
                            </template>

                            <template #close>
                                <span>单独</span>
                            </template>
                        </Switch>
                    </div>

                    <div class="price-main" v-show="!ruleFlag">
                        <Row style="margin: 20px 0;">
                            <Col span="2">分账时效：</Col>
                            <Col span="20">
                            <strong class="rule_obj"> T + </strong>
                            <Input v-width="75" type="number" v-model="ruleList.division.offsetDay" max="100"
                                @on-blur="ruleList.division.offsetDay = $event.target.value < 0 ? 0 : $event.target.value * 1">
                            </Input>
                            <p>个工作日</p>
                            <i>（备注：选填，不填则默认全局规则）</i>
                            </Col>
                        </Row>
                        <Row style="margin: 20px 0;">
                            <Col span="2">分账对象：</Col>
                            <Col span="20">
                            <strong class="rule_obj"> 供应商 </strong>
                            <Input v-width="120" type="number" v-model="ruleList.division.divPercent.supplier" max="100"
                                @on-blur="ruleList.division.divPercent.supplier = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                            <p>%</p>
                            <i>（备注：选填，不填则默认全局规则）</i>
                            </Col>
                        </Row>
                        <Row style="margin: 20px 0;">
                            <Col span="2">
                            </Col>
                            <Col span="20">
                            <strong class="rule_obj"> 基金会 </strong>
                            <Input v-width="120" type="number" v-model="ruleList.division.divPercent.foundation"
                                max="100"
                                @on-blur="ruleList.division.divPercent.foundation = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                            <p>%</p>
                            <i>（备注：选填，不填则默认全局规则）</i>
                            </Col>
                        </Row>
                        <Row style="margin: 20px 0;">
                            <Col span="2">
                            </Col>
                            <Col span="20">
                            <strong class="rule_obj"> 平台 </strong>
                            <Input v-width="120" type="number" v-model="ruleList.division.divPercent.platform" max="100"
                                @on-blur="ruleList.division.divPercent.platform = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                            <p>%</p>
                            <i>（备注：选填，不填则默认全局规则）</i>
                            </Col>
                        </Row>
                    </div>
                </div> -->
                <!-- 主图 -->
                <Row style="margin: 15px 0; border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>主图</strong></Col>
                    <Col span="20" style="padding-top: 10px;">
                    <div class="uploadImg" v-for="( item, index ) in  list.pic " :key="index">
                        <div v-viewer class="imgs">
                            <img :src="item.media" alt="" :data-source="item.media" style="width: 100%;" />
                        </div>
                        <Icon type="md-close" class="uploadImg_icon" size="25" @click="mediaDelFn(item, index, 'img')"
                            v-show="item" />
                    </div>
                    <div class="uploadd">
                        <Upload :multiple="true" action="abc" ref="upload"
                            :before-upload="handleBeforeLicenseUrlUpload">
                            <Button icon="md-cloud-upload">上传文件</Button>
                            最少1张、最多10张
                        </Upload>
                    </div>
                    </Col>
                </Row>
                <!-- 视频 -->
                <Row style=" border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>视频</strong></Col>
                    <Col span="20" style="padding-top: 10px;">
                    <div class="uploadImg" v-for="( item, index ) in  list.video " :key="index">
                        <div v-viewer class="imgs">
                            <video :src="item.media" alt="" controls :data-source="item.media"
                                style="width: 100%;"></video>
                        </div>
                        <Icon type="md-close" class="uploadImg_icon" size="25" @click="mediaDelFn(item, index, 'video')"
                            v-show="item" />
                    </div>
                    <Upload ref="upload" action="" :before-upload="videoHandleBeforeLicenseUrlUpload">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    </Col>
                </Row>
                <!-- 详情 -->
                <Row style="margin: 20px 0; border: #d7d7d7 1px solid;">
                    <Col span="2">
                    <strong>详情</strong></Col>
                    <Col span="9">
                    <div style="width: 100%; height: 550px; overflow: hidden;">
                        <div style="border: 1px solid #ccc; height: 550px;">
                            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor"
                                :defaultConfig="toolbarConfig" mode="default" />
                            <Editor style="height: 467px; overflow-y: hidden" v-model="list.details"
                                :defaultConfig="editorConfig" mode="default" @onCreated="onCreated" />
                        </div>
                    </div>
                    <p>
                        <strong style="color: #ffa000;">友情提示：</strong>
                        <i style="color: #c7c9cd;"> 上传的图片宽度参差不齐时，没有与屏幕宽度保持一致，解决方案如下</i>
                    </p>
                    <p style="padding: 5px 60px;">点击图片(鼠标左击)，会弹出 "30%、50%、100% …… " 的浮窗，选择点击 "100%"
                        使图片与手机宽度保持一致。上传多张图时
                        重复该操作即可使多图保持同宽 (手机屏幕宽度)
                    </p>
                    </Col>
                </Row>
                <div style="margin: 20px 0; width:50%; text-align: center;">
                    <Space>
                        <Button type="primary" @click="submitFn(true)">确认</Button>
                        <Button @click="this.$router.back()">取消</Button>
                    </Space>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
    getGoodsCategoryTreeApi, // 商品分类
    getBrandPageApi,  // 品牌
    getMerchantBasePageApi,  // 供应商
    getSupplierListApi,   // 基金会列表
    postGoodsInfoSaveApi,  // 保存
    getGoodsInfoDetailApi,  // 商品详情
    goodsInfoFileDel,   // 图片删除
    getOttDrugBarcodeApi,  // 条码获取
    getOttDrugClassifyApi,  // 药品分类

    getGoodsPropertyValueListApi, // 规格列表

    postGoodsMediaBatchSaveApi,   // 媒体保存
    getGoodsMediaListApi,   // 媒体列表
    postGoodsMediaRemoveApi,   // 媒体删除

    postSettingPaydivSaveApi,   // 分账规则
    getSettingPaydivDetailApi,
} from '@/api/account'
import { jsonToArray, jsonToArray2 } from "@/libs/util.js";
import skuStore from '@/components/sku-store'
export default {
    name: 'newsRemedy',
    components: { Editor, Toolbar, skuStore },
    data() {
        return {
            loadingSke: false,  // 骨架屏
            toolbarConfig: {},
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },  // 编辑器
            editor: null,
            list: {
                pic: [],
                video: [],  // 视频
                details: ''
            }, // 主图
            bizType: 'medical',   // 业务类型
            goodsId: '',  // 商品id
            classId: '',    // 分类id
            medicalType: '',  // 类别
            pageTitle: '新增药品',   // 页面标题
            video: [],  // 视频
            pic: [], // 主图
            uploadImgKey: 0,  // 主图个数
            uploadVideoKey: 0,  // 视频个数
            classifyList: [],  // 分类树
            brandDataList: [],  // 品牌列表
            merchantList: [],  // 供应商
            searchCode: {
                type: 'barcode'
            },  // 条码信息
            classList: [],  // 分类
            drugSearchList: [],  // 远程获取的商品

            /* 规格属性 */
            tabsId: '',
            haveSizeList: [],  // 单个规格列表

            loading: false,
            timer: null,

            loadingNPO: false,  // 
            npoTime: null,   //基金会
            NPOList: [],   // 列表

            brandTime: null,  // 品牌模糊查询
            loadingBrand: false,  // 品牌……
            merchantTime: null,  // 商家模糊查询
            loadingMerchant: false,  // 商家


            ruleList: {
                type: 'drug',
                targetId: '',
                division: {
                    offsetDay: '',
                    divPercent: {
                        supplier: '',
                        servicer: '',
                        foundation: '',
                        platform: ''
                    }
                }
            },   // 分账数据
            ruleFlag: true,   // 是否全局分账
        }
    },
    async created() {
        this.getClassify()  // 商品分类
        this.getClassList()  // 系统分类
        this.goodsId = this.$route.query.id;
        this.medicalType = this.$route.query.type;
        if (this.medicalType == 'health') {
            if (!this.goodsId) {
                this.pageTitle = '新建保健品'
            } else {
                this.pageTitle = '编辑保健品'
            }
        } else {
            if (!this.goodsId) {
                this.pageTitle = '新建药品'
            } else {
                this.pageTitle = '编辑药品'
            }
        }
        if (this.goodsId) {
            this.loadingSke = true;
            await getBrandPageApi({ biz: 'medical', pageSize: 6666 }).then(res => {
                this.brandDataList = []
                this.brandDataList.push(...res.data)
                // console.log(res.data);
            }).catch(err => {
                console.log(err);
            })
            await getMerchantBasePageApi({ biz: 'medical', type: 'supplier' }).then(res => {
                let data = res.data
                this.merchantList = data
            }).catch(err => {
                console.log(err);
            })
            await getGoodsInfoDetailApi(this.goodsId).then(res => {
                let arr = res
                let url = [];
                if (arr.file) {
                    let key = Object.keys(arr.file);
                    let values = Object.values(arr.file);
                    for (let i = 0; i < key.length; i++) {
                        // console.log(key[i], values[i]);
                        url.push({ id: key[i], img: values[i] });
                    }
                }

                if (res.foundation) {
                    this.NPOList = [res.foundation]
                }

                this.list = {
                    id: this.goodsId,
                    barcode: res.barcode ? res.barcode : '',  // 条编码
                    name: res.name ? res.name : '',  // 药品名
                    namePy: res.namePy ? res.namePy : '',  // 拼音
                    drugType: res.drugType ? res.drugType.code : '',  // 医药类型
                    spec: res.spec ? res.spec : '',  // 规格
                    brandId: res.brand ? res.brand.id : '',  // 品牌
                    categoryId: res.category ? res.category.id : '',  // 分类
                    manuExeStandard: res.manuExeStandard ? res.manuExeStandard : '',  // 执行标准 --- 
                    storage: res.storage ? res.storage : '',  // 贮藏
                    validity: res.validity ? res.validity : '',  // 有效期
                    approval: res.approval ? res.approval : '',  // 批准文号
                    form: res.form ? res.form : '',  // 剂型 --- 
                    character: res.character ? res.character : '',  // 性状
                    manuName: res.manuName ? res.manuName : '',  // 生产企业
                    interactions: res.interactions ? res.interactions : '',  // 相互作用
                    adr: res.adr ? res.adr : '',  // 不良反应 --- 
                    purpose: res.purpose ? res.purpose : '',  // 适应症状
                    dmpk: res.dmpk ? res.dmpk : '',  // 药代动力学  --- 
                    taboo: res.taboo ? res.taboo : '',  // 禁忌
                    cureDisease: res.cureDisease ? res.cureDisease : '',  // 主治疾病  ---
                    commendedUser: res.commendedUser ? res.commendedUser : '',  // 适宜人群 --- 
                    dosage: res.dosage ? res.dosage : '',  // 用法用量
                    consideration: res.consideration ? res.consideration : '',  // 注意事项
                    basis: res.basis ? res.basis : '',  // 主要成分
                    cyCardDiscount: res.cyCardDiscount ? res.cyCardDiscount : 0,   // 补贴金额
                    merchantId: res.merchant ? res.merchant.id : '',  // 供应商
                    marketPrice: res.marketPrice ? res.marketPrice : 0,  // 市场价
                    initSales: res.initSales ? res.initSales : 0,  // 初始销量
                    costPrice: res.costPrice ? res.costPrice : 0,  // 成本价格
                    medicalType: res.medicalType ? res.medicalType.code : '',  // 医药类型
                    imported: res.imported ? res.imported.toString() : 'false',  // 是否进口
                    // manuCertNum: res.manuCertNum ? res.manuCertNum : '',  // 生产许可
                    // packingInfo: res.packingInfo ? res.packingInfo : '',  // 包装信息
                    // pic: url,  // 图片
                    // video: res.videoSource ? res.videoSource : '',  // 视频
                    details: res.details ? res.details : '',  // 详情

                    foundationId: res.foundation ? res.foundation.id : '',   // 基金会
                };

                this.$refs.skuStore.getCid(this.list.categoryId);  // 属性
                this.mediaListFn('mainpic');
                this.mediaListFn('mainvideo');
            }).catch(err => {
                console.log(err);
            })
            this.getGoodsPropertyValueList();    // 获取规格列表

        }
    },
    mounted() {
        this.$refs.skuStore.getgoodsSkuList();   // 库存
    },
    watch: {
        'searchCode.type'(newVal, oldVal) {
            this.searchCode = {
                type: newVal
            }
        },
        ruleFlag(newVal, oldVal) {

            if (!newVal) {
                getSettingPaydivDetailApi({ type: 'drug', targetId: this.list.id || '' })
                    .then(res => {
                        this.ruleList.division.offsetDay = res.division.offsetDay;
                        // res.division.divPercent
                        for (const key in this.ruleList.division.divPercent) {
                            if (Object.hasOwnProperty.call(this.ruleList.division.divPercent, key)) {

                                this.ruleList.division.divPercent[key] = res.division.divPercent[key] ? (res.division.divPercent[key] * 100).toFixed(5) * 1 : 0;
                            }
                        }

                    })
            }
        }
    },
    provide() {
        return {
            fatherGoodsSave: this.submitFn,
            getGoodsPropertyValueList: this.getGoodsPropertyValueList,
        }
    },
    methods: {
        // 商品分类
        getClassify() {
            getGoodsCategoryTreeApi({ biz: 'medical' }).then(res => {
                this.classifyList = jsonToArray(res, false)
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取品牌列表 模糊查询
        remoteMethodBrand(query) {
            if (query !== '') {
                this.loadingBrand = true;
                if (this.brandTime) {
                    clearTimeout(this.brandTime);
                };
                this.brandTime = setTimeout(() => {
                    this.loadingBrand = false;
                    getBrandPageApi({
                        biz: 'medical',
                        keywords: query
                    }).then(res => {
                        this.brandDataList = []
                        this.brandDataList.push(...res.data)
                        // console.log(res.data);
                    }).catch(err => {
                        console.log(err);
                    })
                }, 300);
            } else {
                this.brandDataList = [];
            }
        },
        // 获取商家列表
        remoteMethodMerchant(query) {
            if (query !== '') {
                this.loadingMerchant = true;
                if (this.merchantTime) {
                    clearTimeout(this.merchantTime);
                };
                this.merchantTime = setTimeout(() => {
                    this.loadingMerchant = false;
                    getMerchantBasePageApi({
                        biz: 'medical', type: 'supplier',
                        keywords: query
                    }).then(res => {
                        this.merchantList = []
                        this.merchantList = res.data
                        // console.log(res.data);
                    }).catch(err => {
                        console.log(err);
                    })
                }, 300);
            } else {
                this.merchantList = [];
            }
        },
        // 基金会
        remoteMethodNPO(keywords) {
            if (keywords.length != 24) {
                if (keywords !== '') {
                    this.loadingNPO = true;
                    if (this.npoTime) {
                        clearTimeout(this.npoTime);
                    };
                    this.npoTime = setTimeout(() => {
                        getSupplierListApi({ keywords, type: 'NPO' }).then(res => {
                            this.loadingNPO = false;
                            this.NPOList = res;
                        }).catch(err => {
                            console.log(err);
                        })
                    }, 300);
                } else {
                    this.NPOList = [];
                };
            }
        },
        // 获取系统药品分类
        getClassList() {
            getOttDrugClassifyApi().then(res => {
                let obj = JSON.parse(JSON.stringify(res))
                let arr = []
                for (const key in obj) {
                    if (Object.hasOwnProperty.call(obj, key)) {
                        const item = obj[key];
                        arr.push({
                            value: new Date().getTime() + Math.random(),
                            title: key,
                            children: jsonToArray2(item, 'classify', 'classifyId')
                        })
                    }
                }
                this.classList = arr
            })
        },
        // 提交
        submitFn(back) {
            return new Promise((resolve, reject) => {
                let formData = new FormData()
                this.list.biz = 'medical';
                this.list.medicalType = this.medicalType;
                for (const key in this.list) {
                    if (Object.hasOwnProperty.call(this.list, key)) {
                        const element = this.list[key];
                        if (key !== 'pic' && key !== 'video') {
                            formData.append(key, element)
                        }
                        if (key == 'imported') {
                            formData.append(key, element == 'true' ? true : false)
                        }
                    }
                }
                postGoodsInfoSaveApi(formData, false).then(res => {
                    if (res.name) {
                        this.$Message.success('成功')
                        this.goodsId = res.id;
                        this.list.id = res.id;

                        if (!this.ruleFlag) {
                            this.savePaydivFn(res.id);
                        } else {
                            if (back) {
                                this.$router.back();
                            }
                        }

                        if (this.pic && this.pic.length > 0) {
                            this.mediaSaveFn('mainpic');
                        };
                        if (this.video && this.video.length > 0) {
                            this.mediaSaveFn('mainvideo');
                        };
                        resolve(res);
                    };
                }).catch(err => {
                    clearInterval(this.timer);
                    this.timer = null;
                    reject(err);
                });
            })
        },
        // 分账信息保存
        savePaydivFn(i) {

            let list = JSON.parse(JSON.stringify(this.ruleList));

            list.targetId = i;

            for (const key in list.division.divPercent) {
                if (Object.hasOwnProperty.call(list.division.divPercent, key)) {
                    const element = list.division.divPercent[key];
                    list.division.divPercent[key] = (element / 100).toFixed(5) * 1;
                };
            };
            let { supplier, foundation, platform } = list.division.divPercent;

            let allAccount = + supplier * 1 + foundation * 1 + platform * 1;
            if (allAccount <= 1) {
                if (list.type == 'auction') list.division.divPercent.servicer = 1 - allAccount;
                // else list.division.divPercent.servicer = 0;

                postSettingPaydivSaveApi(list, true).then(res => {
                    if (res.type) {
                        this.$Message.success(`${res.type.name}分账规则修改成功！`);
                        this.$router.back();
                    }
                }).catch(err => {
                    this.saveTime = false;
                })
            } else {
                this.saveTime = false;
                this.$Message.warning('总和不能超过100 %，请合理设置！');
            }
        },
        // 切换查询条件
        searchTypeChange(i) {
            this.drugSearchList = [];
            this.list = {};
        },
        // 条码获取  、 关键字获取
        getCodeList() {
            let data = {}
            if (!!this.searchCode.codeId) {
                data.code = this.searchCode.codeId
            }
            if (!!this.searchCode.searchKey) {
                data = { ...this.searchCode }
            }
            getOttDrugBarcodeApi(data, this.searchCode.type).then(res => {
                // this.assistInput = false;  // 状态是否禁用
                if (res.msg && res.ret_code != '0') {
                    this.$Message.error(res.msg)
                    this.drugSearchList = []
                    this.list = {}
                } else {
                    this.$Message.success('查询成功！')
                }
                if (this.searchCode.type == 'search') {
                    if (res.ret_code == 0) {
                        if (res.drugList.length <= 3) {
                            this.drugSearchList = res.drugList
                        } else {
                            this.drugSearchList = res.drugList.slice(0, 3)
                        }
                    }
                }
                if (this.searchCode.type == 'barcode') {
                    this.list = {
                        barcode: res.code ? res.code : '', // 条形编码 
                        name: res.name, // 名字  。。 -- 
                        namePy: res.namePy ? res.namePy : '', // 拼音
                        categoryId: res.category ? res.category.id : '',  // 分类
                        brandId: res.brand ? res.brand.id : '', // 品牌
                        merchantId: res.merchant ? res.merchant.id : '',  // 商家
                        dmpk: res.dmpk ? res.dmpk : '',  // 药代动力学
                        drugType: res.drugType ? res.drugType.code : '',  // 药品类型
                        nrdl: res.nrdl ? res.nrdl.toString() : "false",  // 是否是国家医保目录
                        interactions: res.other ? res.other : '',  // 药物相互作用  ---
                        adr: res.adr ? res.adr : '',  // 不良反应
                        purpose: res.purpose ? res.purpose : '',  // 适应症状
                        // 药理毒理
                        packingInfo: res.packingInfo ? res.packingInfo : '',  // 包装信息
                        manuExeStandard: res.manuExeStandard ? res.manuExeStandard : '',  // 执行标准
                        storage: res.storage ? res.storage : '',  // 贮藏信息  -- 
                        approval: res.approval ? res.approval : '',  // 批准文号  。。 -- 
                        spec: res.spec ? res.spec : '',  // 规格信息  。。  -- 
                        manuName: res.manuName ? res.manuName : '',  // 生产企业 。。 -- 
                        manuAddress: res.manuAddress ? res.manuAddress : '',  // 产地  -- 
                        basis: res.basis ? res.basis : '',  // 主要成分
                        form: res.form ? res.form : '',  // 剂型
                        character: res.character ? res.character : '',  // 性状  -- 
                        taboo: res.taboo ? res.taboo : '',   // 禁忌  。。  -- 
                        cureDisease: res.purpose ? res.purpose : '',  // 主治疾病 。。  -- 
                        dosage: res.dosage ? res.dosage : '',   // 用法用量  。。  -- 
                        commendedUser: res.note ? res.note : '',  // 适宜人群  。。  -- 
                        costPrice: res.costPrice ? res.costPrice : '',   // 成本价
                        consideration: res.consideration ? res.consideration : '',  // 注意事项  -- 
                        marketPrice: res.marketPrice ? res.marketPrice : '',  // 市场价
                        details: res.details ? res.details : '',  // 详情
                        medicalType: res.medicalType ? res.medicalType.code : '',  // 大 类别
                        // memberPrice: res.memberPrice ? res.memberPrice : '',  // 销售价
                        validity: res.validity ? res.validity : '',  // 有效期  暂无用 -- 
                        manuDate: res.manuDate ? res.manuDate : '',  // 生产日期
                        validity: res.validity ? res.validity : '',  // 过期日期
                        // coinGain4Pur: res.coinGain4Pur ? res.coinGain4Pur : '',  // 采购员积分
                        // coinGain4Clerk: res.coinGain4Clerk ? res.coinGain4Clerk : '',  // 店员积分
                        // fz4Sales: res.fz4Sales ? res.fz4Sales : '',  // 业务员分润
                        // fz4Agency: res.fz4Agency ? res.fz4Agency : '',  // 区域分代商分润
                        // fz4Operator: res.fz4Operator ? res.fz4Operator : '',  // 鸿升医药分账
                        // fz4Platform: res.fz4Platform ? res.fz4Platform : '',  // 平台剩余分账
                        pic: [],
                        video: '',  // 视频
                        details: ''
                    }
                }
            })
        },
        // 选择商品
        changeDrugRadio(i) {
            let res = this.drugSearchList[i]
            // console.log("🚀 ~ file: index.vue:1034 ~ changeDrugRadio ~ res:", res)
            this.list = {
                barcode: res.code ? res.code : '', // 条形编码
                name: res.drugName, // 名字  。。.
                namePy: res.namePy ? res.namePy : '', // 拼音
                categoryId: res.category ? res.category.id : '',  // 分类
                brandId: res.brand ? res.brand.id : '', // 品牌
                merchantId: res.merchant ? res.merchant.id : '',  // 商家
                // dmpk: res.dmpk ? res.dmpk : '',  // 药代动力学
                drugType: res.drugType ? res.drugType.name : '',  // 药品类型
                // nrdl: res.nrdl ? res.nrdl.toString() : "false",  // 是否是国家医保目录
                interactions: res.ywxhzy ? res.ywxhzy : '',  // 药物相互作用  。。.
                adr: res.blfy ? res.blfy : '',  // 不良反应  。。.
                purpose: res.syz ? res.syz : '',  // 适应症状 。。.
                // 药理毒理
                packingInfo: res.packingInfo ? res.packingInfo : '',  // 包装信息
                manuExeStandard: res.zxbz ? res.zxbz : '',  // 执行标准  。。.
                storage: res.zc ? res.zc : '',  // 贮藏信息  。。.
                approval: res.pzwh ? res.pzwh : '',  // 批准文号  。。.
                spec: res.gg ? res.gg : '',  // 规格信息  。。.
                manuName: res.manu ? res.manu : '',  // 生产企业 。。.
                manuAddress: res.manuAddress ? res.manuAddress : '',  // 产地
                basis: res.zycf ? res.zycf : '',  // 主要成分  。。.
                form: res.jx ? res.jx : '',  // 剂型  。。.
                character: res.xz ? res.xz : '',  // 性状  。。.
                taboo: res.jj ? res.jj : '',   // 禁忌  。。.
                cureDisease: res.purpose ? res.purpose : '',  // 主治疾病 。。
                dosage: res.yfyl ? res.yfyl : '',   // 用法用量  。。.
                commendedUser: res.note ? res.note : '',  // 适宜人群  。。
                costPrice: res.costPrice ? res.costPrice : '',   // 成本价
                consideration: res.zysx ? res.zysx : '',  // 注意事项  。。.

                marketPrice: res.marketPrice ? res.marketPrice : '',  // 市场价
                details: res.details ? res.details : '',  // 详情
                medicalType: res.medicalType ? res.medicalType.code : '',  // 大 类别
                memberPrice: res.memberPrice ? res.memberPrice : '',  // 销售价
                validity: res.yxq ? res.yxq : '',  // 有效期  暂无用
                manuDate: res.manuDate ? res.manuDate : '',  // 生产日期
                validity: res.validity ? res.validity : '',  // 过期日期
                pic: [],
                video: '',  // 视频
                details: ''
            }
        },

        // 媒体保存
        mediaSaveFn(tag) {
            let formData = new FormData();
            formData.append('goodsId', this.goodsId);
            formData.append('tag', tag);

            if (tag == 'mainpic') {
                formData.append('name', '商品主图');
                if (this.pic && this.pic.length > 0) {
                    this.pic.forEach((v) => {
                        formData.append("file", v);
                    });
                }
            } else if (tag == 'mainvideo') {
                formData.append('name', '商品视频');
                if (this.video && this.video.length > 0) {
                    this.video.forEach((v) => {
                        formData.append("file", v);
                    });
                }
            }

            postGoodsMediaBatchSaveApi(formData, false).then(res => {
                if (res.length > 0) {
                    console.log('success');
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 媒体列表
        mediaListFn(tag) {
            getGoodsMediaListApi({
                goodsId: this.goodsId,
                tag
            }).then(res => {
                let arr = JSON.parse(JSON.stringify(res))
                arr = arr.map(item => {
                    return {
                        ids: item.id,
                        media: item.filePath
                    }
                })

                if (tag == 'mainpic') {
                    this.list.pic = arr;
                }
                if (tag == 'mainvideo') {
                    this.list.video = arr;
                }

            }).catch(err => {
                console.log(err);
            })
        },
        // 媒体删除
        mediaDelFn(item, index, tag) {
            let id = item.ids;
            if (typeof id != 'string') {
                if (tag == 'img') {
                    this.list.pic.splice(index, 1);
                    this.pic.splice(index, 1);
                };
                if (tag == 'video') {
                    this.list.video.splice(index, 1);
                    this.video.splice(index, 1);
                };
            } else {
                postGoodsMediaRemoveApi({ id }).then(res => {
                    if (res) {
                        if (tag == 'img') {
                            this.list.pic.splice(index, 1);
                        }
                        if (tag == 'video') {
                            this.list.video.splice(index, 1);
                        }
                        this.$Message.success('删除成功');
                    };
                }).catch(err => {
                    console.log(err);
                })
            }
        },

        // 图片上传 多个图片
        handleBeforeLicenseUrlUpload(file) {
            file.ids = this.uploadImgKey;
            if (this.list.pic.length > 9) {
                this.$Message.error('请注意最多上传10张')
            } else {
                this.list.pic.push({
                    ids: this.uploadImgKey,
                    media: window.URL.createObjectURL(file),
                });
                this.pic.push(file);
                this.uploadImgKey++;
                return false;
            }
        },
        // 上传视频
        videoHandleBeforeLicenseUrlUpload(file) {
            file.ids = this.uploadVideoKey;
            if (this.list.video.length > 5) {
                this.$Message.error('请注意最多上传5张')
            } else {
                this.list.video.push({
                    ids: this.uploadVideoKey,
                    media: window.URL.createObjectURL(file),
                });
                this.video.push(file);
                this.uploadVideoKey++;
                return false;
            }
        },

        // 规格属性  设置
        // 获取规格列表
        getGoodsPropertyValueList() {
            getGoodsPropertyValueListApi({ goodsId: this.goodsId }).then(res => {
                let arr = res
                arr.forEach(v => {
                    v.value.forEach(a => {
                        a.rankType = false;
                        if (a.file) {
                            a.img = a.file.pic;
                        } else {
                            a.img = '';
                        }
                    });
                });
                if (arr.length > 0 && (!this.tabsId)) {
                    this.tabsId = arr[0].property.id
                }
                this.haveSizeList = arr;
                this.loading = false;
                this.loadingSke = false;
            }).catch(err => {
                this.loading = false
                console.log(err);
            })
        },

        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    },
    beforeUnmount() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
        this.timer = null;
        this.brandTime = null;
    },
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped lang='less'>
.news_body {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .body_top {
        margin-top: 10px;
    }

    .uploadImg {
        position: relative;
        display: inline-block;
        margin-right: 16px;
        width: 19%;

        .imgs {
            margin: 10px 10px 0 0;
        }

        .uploadImg_icon {
            position: absolute;
            right: -3px;
            top: -3px;
            cursor: pointer;
        }

    }

    .uploadVideo {
        position: relative;
        padding: 10px;
        display: inline-block;

        .btn_remove {
            position: absolute;
            right: -1%;
            top: -1%;
        }
    }

    :deep(.ivu-col-span-2) {
        text-align: right;
        // line-height: 32px;
        display: flex;
        align-items: center;
        justify-content: right;
        padding-right: 15px;
        box-sizing: border-box;
    }


    .newGoods-price {
        margin-top: 15px;
        padding: 30px 30px 10px;
        background: #fff;
        border: #d7d7d7 solid 1px;


        .basics-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .price-main {
            .ivu-row {
                line-height: 32px;
                margin-bottom: 10px;

                .ivu-col-span-2 {
                    // font-size: 14px;
                    padding-right: 10px;
                    text-align: right;
                }

                .rule_obj {
                    display: inline-block;
                    padding: 0 15px 0 0;
                    width: 70px;
                    text-align: right;
                }

                i,
                p {
                    display: inline-block;
                    margin: 0 10px;
                }
            }
        }
    }
}
</style>