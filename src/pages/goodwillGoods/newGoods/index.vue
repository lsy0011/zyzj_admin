<template>
    <div class='newGoods'>
        <!-- <h5>新建商品</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城商品管理" :content="title" hidden-breadcrumb />
        </div>
        <!-- 骨架屏 -->
        <Skeleton :loading="loadingSke" animated :paragraph="{ rows: 5, width: ['70%', '78%', '86%', '94%', '100%',] }">
        </Skeleton>
        <div class="newGoods-main" v-show="!loadingSke">
            <!-- 基础信息 -->
            <div class="newGoods-basics">
                <div class="basics-title">基础信息</div>
                <div class="basics-main">
                    <Form ref="formData1" :model="list" label-position="right" :rules="ruleValidateGoods"
                        :label-width="160">
                        <FormItem label="供应商" prop="merchantId">
                            <Select v-model="list.merchantId" filterable :remote-method="getDimSupplier"
                                placeholder="请输入品牌关键字" :loading="supFlag">
                                <Option :value="item.id" v-for="item in  dimSupplierList" :key="item.id">
                                    {{ item.name }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="商品名称" prop="name">
                            <Input v-model="list.name" @on-blur="list.name = $event.target.value.trim()"
                                placeholder="请输入商品名称"></Input>
                        </FormItem>
                        <FormItem label="商品69码" prop="barcode">
                            <Input v-model="list.barcode" @on-blur="list.barcode = $event.target.value.trim()"
                                placeholder="请输入商品69码"></Input>
                        </FormItem>
                        <FormItem label="商品分类" prop="categoryId">
                            <TreeSelect v-model="list.categoryId" :data="categoryTree" transfer
                                @on-change="(id) => classId = id" />
                        </FormItem>
                        <FormItem label="商品品牌" prop="brandId">
                            <div style="display: flex;">
                                <Select v-model="list.brandId" filterable :remote-method="remoteMethodBrand"
                                    placeholder="请输入品牌关键字" :loading="loadingBrand">
                                    <Option :value="item.id" v-for="item in  brandDataList" :key="item.id">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                                <Button @click="brandFlag = true;">新增品牌</Button>
                            </div>
                        </FormItem>
                        <FormItem label="生产厂家" prop="manuName">
                            <Input v-model="list.manuName" placeholder="请输入成产厂家"
                                @on-blur="list.manuName = $event.target.value.trim()"></Input>
                        </FormItem>
                        <FormItem label="关联基金会">
                            <Select v-model="list.foundationId" filterable :remote-method="remoteMethodNPO"
                                :loading="loadingNPO">
                                <Option v-for="(option, index) in NPOList" :value="option.id" :key="index">
                                    {{ option.name }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
                <!-- 规格 库存 组件 -->
                <skuStore ref="skuStore" :bizType="bizType" :goodsId="goodsId" :classId="classId"
                    :classifyList="classifyList" :haveSizeList="haveSizeList"></skuStore>
            </div>
            <!-- 价格信息 -->
            <div class="newGoods-price">
                <div class="basics-title">价格信息</div>
                <div class="basics-main">

                    <Form ref="formData2" :model="list" label-position="right" :rules="ruleValidateGoods"
                        :label-width="160">
                        <FormItem label="市场价" prop="marketPrice">
                            <Input v-model="list.marketPrice" type="number" placeholder="请输入市场价"
                                @on-blur="list.marketPrice = $event.target.value < 0 ? 0 : $event.target.value * 1">
                            <template #append>元/件</template>
                            </Input>
                        </FormItem>
                        <FormItem label="成本价" prop="costPrice">
                            <Input v-model="list.costPrice" type="number" placeholder="请输入成本价"
                                @on-blur="list.costPrice = $event.target.value < 0 ? 0 : $event.target.value * 1">

                            <template #append>元/件</template>
                            </Input>
                        </FormItem>
                        <FormItem label="权益卡补贴金额" prop="cyCardDiscount">
                            <Input v-model="list.cyCardDiscount" type="number" placeholder="请输入最多补贴"
                                @on-blur="list.cyCardDiscount = $event.target.value < 0 ? 0 : $event.target.value * 1">

                            <template #append>元/件</template>
                            </Input>
                        </FormItem>
                        <FormItem label="捐款类型">
                            <RadioGroup v-model="list.donateType">
                                <Radio label="fixed">
                                    <span>固定 </span>
                                </Radio>
                                <Radio label="ratio">
                                    <span>比例</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="公益捐款">
                            <Input v-model="list.donateAmount" type="number" placeholder="请输入内容"
                                @on-blur="list.donateAmount = $event.target.value < 0 ? 0 : $event.target.value * 1">

                            <template #append>{{ list.donateType == 'fixed' ? '元' : '%' }}</template>
                            </Input>
                        </FormItem>
                        <FormItem label="初始销量">
                            <Input v-model="list.initSales" placeholder="请输入最多补贴"
                                @on-blur="list.initSales = $event.target.value < 0 ? 0 : $event.target.value * 1"
                                type="number">
                            </Input>
                        </FormItem>
                        <FormItem label="是否包邮">
                            <RadioGroup v-model="list.freightFree">
                                <Radio label="true">
                                    <span>是 </span>
                                </Radio>
                                <Radio label="false">
                                    <span>否</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="运费模板" v-if="list.freightFree == 'false'">
                            <Select clearable v-model="list.freightTmpId" placeholder="运费模板">
                                <Option v-for="(item, index) in freightTemplateData" :key="index" :value="item.id">
                                    {{ item.name }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <!-- <Row>
                        <Col span="2">平台毛利</Col>
                        <Col span="3">
                        <Input v-model="list.gbCrossMargin" type="number" placeholder="请输入市场价"></Input>
                        </Col>
                        <Col span="4"> <i>（元/件）</i> </Col>
                    </Row> -->
                    <!-- <Col span="2">状态</Col>
                        <Col span="3">
                        <Select v-model="list.status" placeholder="状态">
                            <Option value="enabled">启用</Option>
                            <Option value="disabled">禁用</Option>
                        </Select>
                        </Col> -->
                </div>
            </div>
            <!-- 
                    系统没办法支持
                    目前只能 根据 订单类型 去匹配 分账策略， 无法做到 不同商品不同策略
                    分账通道 都是根据订单来的，拆不到商品
                 -->
            <!-- 分账规则 -->
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
                        <Input v-width="120" type="number" v-model="ruleList.division.divPercent.foundation" max="100"
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
            <!-- 图文信息 -->
            <div class="newGoods-imgtext">
                <div class="basics-title">图文信息</div>
                <div class="imgtext-main">
                    <Row>
                        <Col span="2">商品主图</Col>
                        <Col span="11">
                        <div class="imgs_box" v-if="list.pic.length > 0">
                            <div class="images" v-viewer v-for="(item, index) in list.pic" :key="item">
                                <img :src="item.media" :data-source="item.media" v-width="'100%'" alt="">
                                <Icon type="md-close" class="img_del" @click="mediaDelFn(item, index, 'img')" size="20"
                                    color="#f00" />
                            </div>
                        </div>
                        <div class="images1" v-else>
                            <Icon type="md-add" size="40" color="#ccc" />
                        </div>
                        <div class="uploadd">
                            <Upload :multiple="true" action="" ref="upload"
                                :before-upload="handleBeforeLicenseUrlUpload">
                                <Button icon="md-cloud-upload">上传文件</Button>
                                最少1张、最多10张(尺寸比例1:1)
                            </Upload>
                        </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2">商品视频</Col>
                        <Col span="11">
                        <div class="uploadImg" v-for="( item, index ) in  list.video " :key="index">
                            <div v-viewer class="imgs">
                                <video :src="item.media" controls alt="" :data-source="item.media"
                                    style="width: 100%;"></video>
                            </div>
                            <Icon type="md-close" class="uploadImg_icon" size="25"
                                @click="mediaDelFn(item, index, 'video')" v-show="item" />
                        </div>
                        <Upload ref="upload" action="" :before-upload="videoHandleBeforeLicenseUrlUpload">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2">商品详情</Col>
                        <Col span="16">
                        <div style="width: 730px; height: 700px; overflow: hidden;">
                            <!-- <richText :details="list.details"></richText> -->
                            <div style="border: 1px solid #ccc; height: 700px;">
                                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor"
                                    :defaultConfig="toolbarConfig" mode="default" />
                                <Editor style="height: 617px; overflow-y: hidden" v-model="list.details"
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
                </div>

                <div style=" text-align: center;border-top: 1px solid #ccc; padding: 15px 0;">
                    <Space size="large" style="width: 50%;">
                        <Button type="primary" @click="confirmFn(true, 'formData1', 'formData2')">确认</Button>
                        <Poptip confirm transfer title="确认要退出编辑吗？" @on-ok="$router.back()">
                            <Button>返回</Button>
                        </Poptip>
                    </Space>
                </div>
            </div>
        </div>
        <!-- 增加/编辑 品牌 的弹框 -->
        <Modal class-name="vertical-center-modal" @on-visible-change="visibleChange" v-model="brandFlag" title="新增品牌">
            <Form ref="list" :model="addBrand" :label-width="140" :rules="ruleValidateBrand">
                <FormItem label="品牌名：" prop="name">
                    <Input v-model="addBrand.name" placeholder="请输入" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="品牌logo：" prop="name">
                    <p>建议尺寸120*120</p>
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload1">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="addBrand.pic" alt="" :data-source="addBrand.pic" style="width:120px" />
                    </div>
                </FormItem>
            </Form>

            <template #footer>
                <Button type="primary" @click="brandConfirm()">确认</Button>
                <Button @click="brandFlag = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {
    getFreightTemplateListApi,  // 运费模板列表
    getSupplierListApi,  // 供应商列表
    getGoodsCategoryTreeApi,  // 商品分类列表
    getBrandPageApi,  // 品牌列表
    getGoodsInfoDetailApi, // 商品详情
    postGoodsInfoSaveApi, // 商品保存
    getGoodsPropertyValueListApi, // 规格列表
    postBrandSaveApi, // 增加品牌

    postGoodsMediaBatchSaveApi,   // 媒体保存
    getGoodsMediaListApi,   // 媒体列表
    postGoodsMediaRemoveApi,   // 媒体删除

    postSettingPaydivSaveApi,   // 分账规则
    getSettingPaydivDetailApi,
} from '@api/account.js'
import { jsonToArray } from "@/libs/util.js";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import skuStore from '@/components/sku-store';
export default {
    name: 'goodwillGoods-newGoods',
    components: { Editor, Toolbar, skuStore },
    data() {
        return {
            loadingSke: false,  // 骨架屏
            value: false,
            bizType: 'common',   // 业务类型
            goodsId: '',  // 商品id
            classId: '',    // 分类id
            tabsId: '',
            loading: false,
            brandFlag: false, // 新增品牌
            addBrand: {
                name: '',
                pic: ''
            }, // 品牌的提交参数
            brandId: '',  // 编辑的品牌id
            picBrand: '', // 品牌的图片
            propertyList: [], // 所有规格列表
            sizeIndex: '', // 添加的列表索引
            shopSizeList: {}, //  分类下的规格
            haveSizeList: [],  // 拥有的规格列表
            title: '', // 标题
            classifyList: [],   // 添加规格分类
            freightTemplateData: [], // 运费模板
            list: {
                id: "",
                categoryId: "",
                brandId: "",
                freightTmpId: "",
                costPrice: "",
                marketPrice: "",
                cyCardDiscount: "",  // 诚意卡补贴
                // gbCrossMargin: "",
                details: "",
                pic: [],
                video: [],
            }, // 商品提交数据
            pic: [], // 商品图
            video: [],  // 商品视频
            uploadImgKey: 0,  // 商品图片id
            uploadVideoKey: 0,
            dimSupplierList: [],  // 模糊查询供应商列表
            categoryTree: [],  // 商品规格属性列表
            brandDataList: [],  // 品牌列表
            toolbarConfig: {},
            supFlag: false,
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },
            editor: null,
            data: [],
            timer: null, // 定时器
            brandTime: null,  // 品牌模糊查询
            loadingBrand: false,  // 品牌……
            loadingNPO: false,  // 
            npoTime: null,   //基金会
            NPOList: [],   // 列表
            ruleValidateBrand: {
                name: [
                    { required: true, message: '该项不能空', trigger: 'blur' }
                ],
            },
            ruleValidateGoods: {
                merchantId: [
                    { required: true, message: '该项不能空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '该项不能空', trigger: 'blur' }
                ],
                barcode: [
                    { required: true, message: '该项不能空', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '该项不能空', trigger: 'blur' }
                ],
                brandId: [
                    { required: true, message: '该项不能空', trigger: 'blur' }
                ],
                manuName: [
                    { required: true, message: '该项不能空', trigger: 'blur' }
                ],
                marketPrice: [
                    { required: true, type: 'number', message: '该项不能空', trigger: 'blur' }
                ],
                costPrice: [
                    { required: true, type: 'number', message: '该项不能空', trigger: 'blur' }
                ],
                cyCardDiscount: [
                    { required: true, type: 'number', message: '该项不能空', trigger: 'blur' }
                ],
            },

            ruleList: {
                type: 'notDrug',
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
        let data = this.$route.query.data;
        // console.log(data);
        if (data == undefined && data !== '') {
            this.title = '新建商品'
        } else {
            this.goodsId = data;
            this.loadingSke = true;
            this.shopSizeList.goodsId = data;
            await getBrandPageApi({ biz: 'common', pageSize: 6666 }).then(res => {
                this.brandDataList = []
                this.brandDataList.push(...res.data)
                // console.log(res.data);
            }).catch(err => {
                console.log(err);
            })
            await getGoodsInfoDetailApi(data).then(res => {
                this.title = '编辑商品'
                let arr = res
                let url = [];
                if (res.file !== undefined) {
                    let key = Object.keys(res.file);
                    let values = Object.values(res.file);
                    for (let i = 0; i < key.length; i++) {
                        // console.log(key[i], values[i]);
                        url.push({ id: key[i], img: values[i] });
                    };
                };

                if (res.foundation) {
                    this.NPOList = [res.foundation]
                }

                // console.log(data);  商品编辑

                this.dimSupplierList = [res.merchant]

                this.list = {
                    id: arr.id,
                    categoryId: arr.category && arr.category.id,
                    brandId: arr.brand && arr.brand.id,
                    freightTmpId: arr.freightTmp && arr.freightTmp.id,
                    status: arr.status && arr.status.code,
                    name: arr.name,
                    costPrice: arr.costPrice,
                    marketPrice: arr.marketPrice,
                    cyCardDiscount: arr.cyCardDiscount,
                    // gbCrossMargin: arr.gbCrossMargin, // 毛利
                    merchantId: res.merchant ? res.merchant.id : '', // 供应商
                    donateType: res.donateType ? res.donateType.code : '', // 捐款类型
                    donateAmount: arr.donateAmount ? arr.donateAmount : '0',  // 公益捐赠金额
                    freightFree: arr.freightFree ? arr.freightFree.toString() : 'false',
                    initSales: arr.initSales,
                    details: arr.details,
                    pic: url,
                    video: arr.videoSource,
                    manuName: arr.manuName,
                    barcode: res.barcode,
                    foundationId: res.foundation ? res.foundation.id : '',
                };
                if (this.list.categoryId) {
                    this.$refs.skuStore.getCid(this.list.categoryId);
                };

                this.$nextTick(() => {
                    if (res.brand && res.brand.name) {
                        this.remoteMethodBrand(res.brand.name);  //品牌
                    };
                })

                this.mediaListFn('mainpic');
                this.mediaListFn('mainvideo');
            }).catch(err => {
                console.log(err);
            })
            this.getGoodsPropertyValueList();
        }
        this.getList();
        // this.$refs.skuStore.getgoodsSkuList();    // 子类方法
    },
    watch: {
        ruleFlag(newVal, oldVal) {

            if (!newVal) {
                getSettingPaydivDetailApi({ type: 'notDrug', targetId: this.list.id })
                    .then(res => {

                        this.ruleList.division.offsetDay = res.division.offsetDay;

                        for (const key in this.ruleList.division.divPercent) {
                            if (Object.hasOwnProperty.call(this.ruleList.division.divPercent, key)) {

                                this.ruleList.division.divPercent[key] = res.division.divPercent[key] ? (res.division.divPercent[key] * 100).toFixed(5) * 1 : 0;
                            }
                        }


                    })
            }
        }
    },
    mounted() {
        this.$refs.skuStore.getgoodsSkuList();    // 子类方法
    },
    unmounted() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
        this.timer = null;
        this.brandTime = null;
        this.npoTime = null;
    },
    provide() {
        return {
            fatherGoodsSave: this.confirmFn,
            getGoodsPropertyValueList: this.getGoodsPropertyValueList,
        }
    },
    methods: {
        // 获取列表
        getList() {
            // 运费模板列表
            getFreightTemplateListApi().then((res) => {
                this.freightTemplateData = res;
            })
                .catch((err) => { });
            // 分类列表
            getGoodsCategoryTreeApi({ biz: 'common' }).then((res) => {
                // console.log(res);
                let arr = jsonToArray(res, true);
                this.categoryTree = arr;
                this.classifyList = JSON.parse(JSON.stringify(arr));
            })
                .catch((err) => { });
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
                        biz: 'common',
                        keywords: query,
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
        // 获取规格列表
        getGoodsPropertyValueList() {
            getGoodsPropertyValueListApi({ goodsId: this.goodsId }).then(res => {
                let arr = res;
                arr.forEach(v => {
                    if (!v.property) {
                        v.property = {
                            name: '---',
                            id: '---'
                        };
                    }
                    v.value.forEach(a => {
                        if (a.file) {
                            a.img = a.file.pic;
                        } else {
                            a.img = '';
                        };
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
        // 模糊查询
        getDimSupplier(keywords) {
            if (keywords.length != 24) {
                if (keywords !== '') {
                    this.supFlag = true;
                    let timer = setTimeout(() => {
                        getSupplierListApi({ keywords, biz: 'common', type: 'supplier' })
                            .then((res) => {
                                this.supFlag = false;
                                if (res.length < 0) {
                                    this.dimSupplierList = []
                                } else {
                                    this.dimSupplierList = [];
                                    this.dimSupplierList.push(...res);
                                }
                                clearTimeout(timer);
                            })
                    }, 200);
                } else {
                    this.dimSupplierList = [];
                }
            }
        },
        // 提交修改
        confirmFn(back, name1, name2) {

            let flag1 = null;
            let flag2 = null;

            this.$refs[name1].validate((valid) => {
                if (valid) {
                    flag1 = true;
                } else {
                    flag1 = false;
                    this.$Message.error('请补全基本信息必填项 !');
                };
            });

            this.$refs[name2].validate((valid) => {
                if (valid) {
                    flag2 = true;
                } else {
                    flag2 = false;
                    this.$Message.error('请补全价格信息必填项 !');
                };
            });

            return new Promise((resolve, reject) => {

                if (flag1 && flag2) {

                    this.loading = true;
                    let formData = new FormData();
                    // 供应商
                    this.list.biz = 'common';
                    if (this.list.id) {
                        this.list.id = this.goodsId;
                    }
                    if (this.list.categoryId == undefined) {
                        this.$Message.error('请选择分类')
                    } else if (this.list.brandId == undefined) {
                        this.$Message.error('请选择品牌')
                    } else {
                        for (const key in this.list) {
                            if (Object.hasOwnProperty.call(this.list, key)) {
                                const element = this.list[key];
                                if (key == 'freightFree' && element == 'true') {
                                    formData.append('freightTmp', '');
                                } else if (key != 'pic' && key != 'video' && element) {
                                    formData.append(key, element);
                                }
                            }
                        }
                        postGoodsInfoSaveApi(formData, false)
                            .then((res) => {
                                this.modal = false;
                                // this.$Message.success("添加成功");
                                if (this.title == '新建商品') {
                                    this.$Message.success('添加成功');
                                } else if (this.title == '编辑商品') {
                                    this.$Message.success('编辑成功');
                                }
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
                                }
                                if (this.video && this.video.length > 0) {
                                    this.mediaSaveFn('mainvideo');
                                }

                                this.loading = false;
                                resolve(res);
                            })
                            .catch((err) => {
                                this.loading = false;
                                reject(err)
                            });
                    }
                }
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
        // 图片上传
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
        // 新增品牌的图片
        handleBeforeLicenseUrlUpload1(file) {
            this.picBrand = file;
            this.addBrand.pic = window.URL.createObjectURL(file);
            return false;
        },
        // 品牌增加，保存按钮
        brandConfirm() {
            if (this.addBrand.name && this.addBrand.pic) {
                console.log(this.brandId);
                let formData = new FormData();
                formData.append('id', this.brandId ? this.brandId : '');
                formData.append('name', this.addBrand.name ? this.addBrand.name : '');
                formData.append('biz', 'common');
                if (this.picBrand !== null) {
                    formData.append('upload[pic]', this.picBrand);
                }
                // if (this.icon !== null) {
                //     formData.append('upload[icon]', this.icon);
                // }
                postBrandSaveApi(formData, false).then((res) => {
                    this.flag = false
                    this.$Message.success('添加成功');
                    // console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                this.$Message.warning('请确保内容完整后提交')
            }
        },
        // 编辑和添加
        visibleChange(key) {
            if (!key) {
                this.addBrand = {};
            }
        },
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    }
}
</script>

<style scoped lang='less'>
.newGoods-main {
    margin-top: 24px;
    // padding: 20px 30px;
    // box-sizing: border-box;
    background: #fff;

    .newGoods-basics {
        margin-bottom: 15px;
        padding: 30px 30px 10px;
        background: #fff;

        .basics-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
        }



        .ivu-row {
            margin-bottom: 15px;

            .ivu-col-span-2 {
                line-height: 32px;
                padding-right: 15px;
                text-align: right;
            }

            button {
                margin-left: 15px;
            }
        }
    }

    .basics-main {
        width: 50%;
    }

    .newGoods-price {
        margin-bottom: 15px;
        padding: 30px 30px 10px;
        background: #fff;

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

    .newGoods-imgtext {
        margin-bottom: 15px;
        padding: 30px 30px 10px;
        background: #fff;

        .basics-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;

        }

        .imgtext-main {
            .ivu-row {
                line-height: 32px;
                margin-bottom: 10px;

                .ivu-col-span-2 {
                    // font-size: 14px;
                    padding-right: 10px;
                    text-align: right;
                }

                :deep(.upload-a) {
                    width: 120px;
                    height: 120px;
                    // border: 1px dashed #c7c9cd;
                    display: block;
                }

                .ivu-col-span-11 {
                    .imgs_box {
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;

                        .images {
                            position: relative;
                            width: 19%;
                            margin-right: 10px;

                            // justify-content: space-around;
                            .img_del {
                                position: absolute;
                                right: -5%;
                                top: -5%;
                            }
                        }
                    }

                    .images1 {
                        display: inline-block;
                        text-align: center;
                        padding: 20px;
                        background-color: #f0f0f0;
                        border-radius: 10px;
                    }

                    .uploadd {
                        margin-top: 10px;
                    }
                }
            }
        }
    }
}
</style>