<template>
    <div class='newsServe'>
        <!-- <h5>新增服务管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医疗服务管理" :content="editTitle" hidden-breadcrumb />
        </div>
        <div class="newsOrgan_main">
            <div class="top_title">{{ editTitle }}管理</div>
            <div class="new_body">

                <Skeleton :loading="loadingSke" animated>
                </Skeleton>
                <div class="new_form">
                    <Form ref="formDate" :model="list" label-position="right" :label-width="180" :rules="ruleValidate">
                        <FormItem label="所属机构：" prop="merchantId">
                            <Select v-model="list.merchantId" filterable>
                                <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="门店选择：" prop="storeId">
                            <Select v-model="list.storeId" multiple placeholder="请先选择机构后选取门店">
                                <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="服务分类：" prop="categoryId">
                            <Select v-model="list.categoryId">
                                <Option v-for="item in categoryList" :value="item.value" :key="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="服务名称：" prop="name">
                            <Input v-model="list.name" @on-blur="list.name = $event.target.value.trim()"
                                placeholder="请输入..."></Input>
                        </FormItem>
                        <FormItem label="市场价格：" prop="marketPrice">
                            <Input v-model="list.marketPrice" type="number" placeholder="请输入..."
                                @on-blur="list.marketPrice = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                        </FormItem>
                        <FormItem label="成本价：" prop="costPrice">
                            <Input v-model="list.costPrice" type="number" placeholder="请输入..."
                                @on-blur="list.costPrice = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                        </FormItem>
                        <FormItem label="权益卡补贴金额：" prop="cyCardDiscount">
                            <Input v-model="list.cyCardDiscount" type="number" placeholder="请输入..."
                                @on-blur="list.cyCardDiscount = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                        </FormItem>
                        <div class="only_flex">
                            <div v-width="'30%'">
                                <FormItem label="捐款金额类型：" prop="donateType">
                                    <RadioGroup v-model="list.donateType">
                                        <Radio label="fixed">固定</Radio>
                                        <Radio label="ratio">比例</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </div>
                            <div v-width="'60%'" class="only_flex">
                                <FormItem label="公益捐赠金额：" prop="donateAmount">
                                    <Input v-model="list.donateAmount" type="number" placeholder="请输入..."
                                        @on-blur="list.donateAmount = $event.target.value < 0 ? 0 : $event.target.value * 1">
                                    <template #append>
                                        <span v-if="list.donateType == 'ratio'"> % </span>
                                        <span v-else> 元 </span>
                                    </template>
                                    </Input>
                                </FormItem>
                            </div>
                        </div>
                        <FormItem label="工艺基金残疾人补贴：" prop="fundDiscount">
                            <Input v-model="list.fundDiscount" type="number" placeholder="请输入..."
                                @on-blur="list.fundDiscount = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                        </FormItem>

                        <FormItem label="库存总数量：" prop="stock">
                            <Input v-model="list.stock" type="number" placeholder="请输入..."
                                @on-blur="list.stock = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                        </FormItem>
                        <FormItem label="初始人数：" prop="initSales">
                            <Input v-model="list.initSales" type="number" placeholder="请输入..."
                                @on-blur="list.initSales = $event.target.value < 0 ? 0 : $event.target.value * 1">

                            <template #append>
                                <span>人</span>
                            </template>
                            </Input>
                        </FormItem>
                        <div class="only_flex">
                            <FormItem label="有效期：" prop="validityLength" v-width="'50%'">
                                <Input v-model="list.validityLength" type="number"
                                    @on-blur="list.validityLength = $event.target.value < 0 ? 0 : $event.target.value * 1"
                                    placeholder="请输入..."></Input>
                            </FormItem>
                            <FormItem label="单位：" prop="validityUnit" v-width="'50%'">
                                <Select v-model="list.validityUnit">
                                    <Option value="year">年</Option>
                                    <Option value="month">月</Option>
                                </Select>
                            </FormItem>
                        </div>
                        <FormItem label="自动上架时间：" prop="putOnTime">
                            <DatePicker v-model="list.putOnTime" type="datetime" format="yyyy-MM-dd HH:mm"
                                placeholder="选择上架时间" style="width: 60%" />

                            <i style="font-size: 13px;line-height: 32px; color: #ddd;">（若不选择&nbsp;立即上架）</i>
                        </FormItem>
                        <FormItem label="自动下架时间：" prop="putOffTime">
                            <DatePicker v-model="list.putOffTime" type="datetime" format="yyyy-MM-dd HH:mm"
                                placeholder="选择下架时间" style="width: 60%" />
                            <i style="font-size: 13px;line-height: 32px; color: #ddd;">
                                （若不选&nbsp;需手动下架/剩余数量为0自动下架）
                            </i>
                        </FormItem>
                        <FormItem label="套餐图片：" prop="pic">
                            <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload">
                                <Button icon="ios-cloud-upload-outline">上传</Button>
                            </Upload>
                            <div class="uploadImg" v-for="(item, index) in list.pic" :key="index">
                                <div v-viewer>
                                    <img :src="item.img" alt="" :data-source="item.img" style="width: 120px" />
                                </div>
                                <Icon type="md-close" class="uploadImg_icon" size="25" @click="imgDel(item, index)"
                                    v-show="item" />
                            </div>
                        </FormItem>
                        <FormItem label="套餐详情：">

                            <div style="width: 100%; height: 415px; overflow: hidden;">
                                <div style="border: 1px solid #ccc; height: 415px;">
                                    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor"
                                        :defaultConfig="toolbarConfig" mode="default" />
                                    <Editor style="height: 332px; overflow-y: hidden" v-model="list.details"
                                        :defaultConfig="editorConfig" mode="default" @onCreated="onCreated" />
                                </div>
                            </div>
                        </FormItem>
                    </Form>
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
                <div style="display: flex;justify-content: center;align-items: center;">
                    <Button type="primary" :loading="saveTime" style="margin-right: 13px;"
                        @click="serveSaveFn('formDate')">提交</Button>
                    <Button style="margin-right: 13px;" @click="goBack()">返回</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getServiceInfoSaveApi, // 服务 新增 保存
    getServiceInfoDetailApi,  // 服务 详情
    getStoreInfoPageApi, // 门店列表
    getMerchantBasePageApi, //  机构列表
    getServiceCategoryListApi, // 分类  就是服务分类  
    postServiceInfoFileRemoveApi, // 图片删除

    postSettingPaydivSaveApi,   // 分账规则
    getSettingPaydivDetailApi,
} from '@/api/account.js'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
    name: 'newsOrgan',
    components: { Editor, Toolbar },
    data() {
        return {
            loadingSke: false,  // 骨架屏
            serveId: '', // 编辑的 服务id
            toolbarConfig: {},
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },
            uploadImgKey: 0,
            editor: null,
            pic: [], // 图片信息
            // 保存时提交的信息
            list: {
                merchantId: '',
                categoryId: '',
                pic: [],
                storeId: [],
            },
            video: "", // 视频
            baseList: [],  // 机构列表
            storeList: [], // 门店列表
            categoryList: [],  // 分类列表 

            saveTime: false,  // 保存
            editTitle: '新增服务',  // 编辑or新增

            ruleList: {
                type: 'service',
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

            // 验证规则
            ruleValidate: {
                merchantId: [
                    { required: true, message: '请选择机构', trigger: 'change' }
                ],
                storeId: [
                    { required: true, type: 'array', min: 1, message: '请选择所属门店', trigger: 'change' },
                ],
                categoryId: [
                    { required: true, message: '请选择服务分类', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入服务名称', trigger: 'blur' }
                ],
                marketPrice: [
                    { required: true, type: "number", message: '请输入市场价', trigger: 'blur' },
                ],
                costPrice: [
                    { required: true, type: "number", message: '请输入成本价', trigger: 'blur' },
                ],
                cyCardDiscount: [
                    { required: true, type: "number", message: '请输入补贴金额', trigger: 'blur' },
                ],
                donateAmount: [
                    { required: true, type: "number", message: '请输入公益捐款金额', trigger: 'blur' },
                ],
                donateType: [
                    { required: true, message: '请选择捐款金额类型', trigger: 'change' },
                ],

                fundDiscount: [
                    { required: true, type: "number", message: '请输入市工艺基金残疾人补贴', trigger: 'blur' },
                ],
                stock: [
                    { required: true, type: "number", message: '请输入库存总数量', trigger: 'blur' },
                ],
                initSales: [
                    { required: true, type: "number", message: '请选择初始人数', trigger: 'change' },
                ],
                validityLength: [
                    { required: true, type: "number", message: '请输入有效期', trigger: 'blur' },
                ],
                validityUnit: [
                    { required: true, message: '请选择单位', trigger: 'change' },
                ],

                // putOnTime: [
                //     { required: true, type: 'string', message: '请选择自动上架时间', trigger: 'change' }
                // ],
                // putOffTime: [
                //     { required: true, type: 'string', message: '请选择自动下架时间', trigger: 'change' }
                // ],
                pic: [
                    { required: true, type: 'array', min: 1, message: '请上传服务图片', trigger: 'change' }
                ],
            }
        }
    },
    watch: {
        'list.merchantId': {
            handler(newVal) {
                // console.log("🚀 ~ file: index.vue:230 ~ merchantId ~ newVal:", newVal)
                this.getStore(newVal)   // 获取门店列表
            },
            deep: true
        },
        ruleFlag(newVal, oldVal) {

            if (!newVal) {
                getSettingPaydivDetailApi({ type: 'service', targetId: this.serveId || '' })
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
    created() {
        this.serveId = this.$route.query.data;  // 编辑id
        if (this.serveId) {
            this.editTitle = '编辑服务'
            this.loadingSke = true;
            getServiceInfoDetailApi(this.serveId).then(res => {
                let url = [];
                if (res.file) {
                    let key = Object.keys(res.file);
                    let values = Object.values(res.file);
                    for (let i = 0; i < key.length; i++) {
                        url.push({ id: key[i], img: values[i] });
                    };
                };
                this.list = {
                    merchantId: res.merchant ? res.merchant.id : '',
                    categoryId: res.category ? res.category.id : '',
                    name: res.name || '',
                    costPrice: res.costPrice || 0,
                    marketPrice: res.marketPrice || 0,
                    cyCardDiscount: res.cyCardDiscount || 0,
                    nonprofit: res.nonprofit,
                    donateType: res.donateType ? res.donateType.code : 'fixed',
                    donateAmount: res.donateAmount,
                    initSales: res.initSales,
                    stock: res.stock,
                    fundDiscount: res.fundDiscount,
                    validityLength: res.validityLength,
                    validityUnit: res.validityUnit.code,
                    pic: url,
                    // video: res.video,
                    details: res.details
                }

                // 时间转为标准时间
                if (res.putOnTime) {
                    this.list.putOnTime = this.$Date(res.putOnTime).format('YYYY-MM-DD HH:mm')
                };
                if (res.putOffTime) {
                    this.list.putOffTime = this.$Date(res.putOffTime).format('YYYY-MM-DD HH:mm')
                }

                if (res.stores.length > 0) {
                    this.list.storeId = []
                    res.stores.forEach(item => {
                        this.list.storeId.push(item.id)
                    })
                }
                this.loadingSke = false;
            })
        } else {
            this.serveId = '';
            this.editTitle = '新增服务';
        };
        this.getBase()    //  获取机构/供应商列表
        this.getCategory()   // 获取机构分类列表
    },
    methods: {
        // 保存 提交
        serveSaveFn(formName) {
            let formData = new FormData();
            if (this.serveId) {
                formData.append('id', this.serveId);
            };

            formData.append('biz', 'medical');
            formData.append('type', 'service');

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key == 'putOnTime' || key == 'putOffTime') {
                                formData.append(key, new Date(element).getTime());     // 将标准时间转为时间戳
                            } else if (key == 'pic') {
                                this.pic.forEach((v) => {
                                    formData.append("pic", v || '');
                                });
                            } else if (key == 'storeId') {
                                element.forEach(item => {
                                    formData.append(key, item || '');
                                })
                            } else {
                                formData.append(key, element);
                            };
                        }
                    }

                    this.saveTime = true;
                    getServiceInfoSaveApi(formData, false).then(res => {
                        if (res.id) {
                            this.$Message.success('新建成功');

                            if (!this.ruleFlag) {
                                this.savePaydivFn(res.id);
                            } else {

                                this.$router.back();
                            }

                        };
                    }).catch(err => {
                        this.saveTime = false;
                    });
                } else {
                    this.$Message.error('请先补全必填项!');
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
        //  获取机构/供应商列表
        getBase() {
            getMerchantBasePageApi({ biz: 'medical', type: 'service' }).then(res => {
                let data = res.data;
                data.forEach(item => {
                    item.label = item.name
                    item.value = item.id
                })
                this.baseList = data;
            })
        },
        // 获取门店列表
        getStore(id = '') {
            let data = {
                biz: 'medical',
                type: 'service',
                pageSize: 9999,
                merchantId: id
            }
            getStoreInfoPageApi(data).then(res => {
                let data = res.data
                data.forEach(item => {
                    item.label = item.name
                    item.value = item.id
                })
                this.storeList = data;
            })
        },
        // 获取服务分类列表
        getCategory(id = '') {
            getServiceCategoryListApi({ biz: 'medical', merchantId: id })
                .then(res => {
                    res.forEach(element => {
                        element.label = element.name
                        element.value = element.id
                    });
                    this.categoryList = res;
                    // console.log(res);
                })
        },
        // 返回路由
        goBack() {
            this.$router.back()
        },
        // 上传图片
        handleBeforeLicenseUrlUpload(file) {
            file.ids = this.uploadImgKey;
            this.list.pic.push({
                ids: this.uploadImgKey,
                img: window.URL.createObjectURL(file),
            });
            this.pic.push(file);
            this.uploadImgKey++;
            return false;
        },
        // 图片删除
        imgDel(item, index) {
            if (item.id) {
                let data = {
                    id: this.serveId,
                    key: item.id,
                };
                postServiceInfoFileRemoveApi(data).then((res) => {
                    this.$Message.success("删除成功");
                    // this.list.img = ''
                    this.list.pic.splice(index, 1);
                });
            } else {
                this.list.pic.splice(index, 1);
                for (let i = 0; i < this.pic.length; i++) {
                    if (this.pic[i].ids === item.ids) {
                        this.pic.splice(i, 1);
                        break;
                    }
                }
            }
        },
        // 上传视频
        // videoHandleBeforeLicenseUrlUpload(file) {
        //     this.video = file;
        //     this.list.video = window.URL.createObjectURL(file);
        //     return false;
        // },
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    },
    unmounted() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
}
</script>

<style scoped lang='less'>
.newsOrgan_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .top_title {
        font-weight: 600;
        text-align: center;
        font-size: 20px;
        margin-bottom: 15px;
    }

    .new_body {
        width: 100%;

        .new_form {
            width: 63%;
            margin: 0 auto;
        }

        .newGoods-price {
            width: 63%;
            margin: 0 auto 15px;
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

        .only_flex {
            display: flex;
        }
    }


    .uploadImg {
        position: relative;
        display: inline-block;
        margin-right: 16px;

        .uploadImg_icon {
            position: absolute;
            right: -10px;
            top: -10px;
            cursor: pointer;
        }
    }

    .rule_box {
        border: 1px solid #c7c9cd;
        margin-bottom: 15px;

        .ivu-row {
            margin-bottom: 15px;

            .ivu-col-span-6 {
                text-align: right;
                line-height: 32px;
                padding-right: 13px;
                box-sizing: border-box;
            }

        }

        .ivu-col-span-5 {
            text-align: center;
            font-size: 16px;
        }

        .rule_obj {
            display: inline-block;
            padding: 0 15px 0 0;
            width: 70px;
            text-align: right;
        }
    }
}
</style>