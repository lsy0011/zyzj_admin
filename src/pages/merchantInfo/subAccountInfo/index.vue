<template>
    <div class='subAccountInfo'>
        <!-- <h5>商户分账信息</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="商家管理" content="商户分账信息" hidden-breadcrumb />
        </div>
        <div class="sub_info">
            <Card>
                <template #title>
                    <Icon type="ios-film-outline"></Icon>
                    分账信息
                </template>
                <!-- <template #extra>
                    <Button size="small">编辑</Button>
                </template> -->
                <Form label-position="right" :model="list" v-width="'45%'" ref="formCustom" :rules="ruleValidate"
                    style="margin: 20px auto;" :label-width="200">
                    <FormItem label="客户类型：" prop="custType">
                        <RadioGroup v-model="list.custType">
                            <Radio label="O">
                                <span>小微</span>
                            </Radio>
                            <Radio label="B">
                                <span>企业</span>
                            </Radio>
                            <Radio label="C">
                                <span>个体</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="客户名称：" prop="custName">
                        <Input v-model="list.custName" placeholder="请输入名称"
                            @on-blur="list.custName = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="商户简称：" prop="anotherName">
                        <Input v-model="list.anotherName" placeholder="请输入简称"
                            @on-blur="list.anotherName = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="行业类别：" prop="industry">
                        <Select v-model="list.industry" placeholder="请选择行业类别">
                            <Option v-for="item in industryCategory" :key="item.code" :value="item.code">{{ item.name }}
                                -
                                {{ item.code }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="省份：">
                        <Select v-model="provinceChangeVal" placeholder="请先选择省份"
                            @on-change="(val) => getCityList(val, 'one')">
                            <Option v-for="item in provinceList" :key="item.code" :value="item.name + ',' + item.code">
                                {{ item.name }}
                            </Option>
                        </Select>
                        <!-- <Input @on-blur="list.province = $event.target.value.trim()"></Input> -->
                    </FormItem>
                    <FormItem label="市区：" prop="city">
                        <Select v-model="list.city" placeholder="请选择城市">
                            <Option v-for="item in cityList" :key="item.code" :value="item.name">
                                {{ item.name }}
                            </Option>
                        </Select>
                        <!-- <Input v-model="list.city" placeholder="为完善企业信息请准确填写"
                            @on-blur="list.city = $event.target.value.trim()"></Input> -->
                    </FormItem>
                    <FormItem label="详细地址：" prop="companyAddr">
                        <Input v-model="list.companyAddr" placeholder="为完善企业信息请准确填写"
                            @on-blur="list.companyAddr = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="企业法人名字：" prop="legalName">
                        <Input v-model="list.legalName" placeholder="企业法人名字，需和身份证号码、法人手机号码匹配，当客户类型为小微商户时，企业法人可以为空"
                            @on-blur="list.legalName = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="企业法人手机号码：" prop="legalTel">
                        <Input v-model="list.legalTel" placeholder="企业法人手机号码"
                            @on-blur="list.legalTel = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="企业法人证件类型：" prop="legalCertType">
                        <Select v-model="list.legalCertType" placeholder="证件类型目前只支持该项">
                            <Option value="00">身份证</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="企业法人证件号：" prop="legalCertNo">
                        <Input v-model="list.legalCertNo" maxlength="18" show-word-limit placeholder="如果证件号中有字母请大写"
                            @on-blur="list.legalCertNo = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="结算方式：" prop="settleType">
                        <RadioGroup v-model="list.settleType">
                            <Radio label="0">
                                <span>平台内账户</span>
                            </Radio>
                            <Radio label="1">
                                <span>银行卡账户</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="银行账号：" prop="bankAccountNo">
                        <Input v-model="list.bankAccountNo" placeholder="银行帐号"
                            @on-blur="list.bankAccountNo = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="开户人：" prop="bankAccountName">
                        <Input v-model="list.bankAccountName" placeholder="开户人，银行卡账户名，需和法人姓名或客户姓名一致"
                            @on-blur="list.bankAccountName = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="银行账户类型：" prop="bankAccountType">
                        <RadioGroup v-model="list.bankAccountType">
                            <Radio label="corporate">
                                <span>对公账户</span>
                            </Radio>
                            <Radio label="personal">
                                <span>对私账户</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="银行卡类型：" prop="bankCardType">
                        <RadioGroup v-model="list.bankCardType">
                            <Radio label="debit">
                                <span>借记卡</span>
                            </Radio>
                            <Radio label="unit">
                                <span>单位结算卡</span>
                            </Radio>
                        </RadioGroup>
                        <span v-if="list.bankCardType == 'unit'"
                            style=" color:#ffa000;">（备注：选择单位结算卡，则需要上传单位结算卡图片）</span>
                    </FormItem>
                    <FormItem label="开户行名称：" prop="bankName">
                        <Input v-model="list.bankName" placeholder="为交易能顺利进行，请尽可能填写到街道 示例值：中国银行深圳分行民治支行"
                            @on-blur="list.bankName = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="银行行别：" prop="bankType">
                        <Input v-model="list.bankType" placeholder="示例值：中国银行"
                            @on-blur="list.bankType = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="开户行所在省份：">
                        <Select v-model="provinceChangeValTwo" placeholder="请先选择省份"
                            @on-change="(val) => getCityList(val, 'two')" clearable>
                            <Option v-for="item in provinceList" :key="item.code" :value="item.name + ',' + item.code">
                                {{ item.name }}
                            </Option>
                        </Select>
                        <!-- <Input v-model="list.bankProvince" placeholder="所在的省份"
                            @on-blur="list.bankProvince = $event.target.value.trim()"></Input> -->
                    </FormItem>
                    <FormItem label="开户行所在城市：" prop="bankCity">
                        <Select v-model="list.bankCity" placeholder="请选择城市" clearable>
                            <Option v-for="item in cityListTwo" :key="item.code" :value="item.name">
                                {{ item.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="开户人证件号码：" prop="certNo">
                        <Input v-model="list.certNo" placeholder="证件号码"
                            @on-blur="list.certNo = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="银行预留手机号：" prop="bankTelephoneNo">
                        <Input v-model="list.bankTelephoneNo" placeholder="预留手机号"
                            @on-blur="list.bankTelephoneNo = $event.target.value.trim()"></Input>
                    </FormItem>

                    <FormItem label="营业执照注册号：" prop="busLicense" v-if="list.custType != 'O'">
                        <Input v-model="list.busLicense" placeholder="营业执照注册号"
                            @on-blur="list.busLicense = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="营业执照有效期：" prop="busLicenseExpire" v-if="list.custType != 'O'">
                        <Input v-model="list.busLicenseExpire" placeholder="营业执照有效期,格式yyyyMMdd，如是长期有效请输入29991231"
                            @on-blur="list.busLicenseExpire = $event.target.value.trim()"></Input>
                    </FormItem>
                    <FormItem label="需提供的图片">
                        <p style="color: #ffa000;">（建议图片大小控制在2MB内）</p>
                    </FormItem>
                    <FormItem :label="item.title + '：'" v-for="(item, index) in filesData" :key="index">
                        <div v-viewer v-if="item.img" class="img_box">
                            <Icon type="md-close" class="img_box_close" size="20" @click="colseImgFn(index)" />
                            <img :src="item.img" alt="" class="img_box_img" width="120" height="120" title="点击放大">
                        </div>
                        <Upload action="" :max-size="2024" :before-upload="(file) => beforeUploadFile(file, index)">
                            <Button icon="ios-cloud-upload-outline">上传图片</Button>
                        </Upload>
                    </FormItem>
                </Form>
                <div class="footer_box">
                    <Space>
                        <Button type="primary" :loading="loading" @click="submitSaveFn('formCustom')">保存</Button>
                        <Button @click="this.$router.back();">取消</Button>
                        <!-- <Button size="small" @click="getToken()">重新获取token</Button> -->
                    </Space>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
import {
    getAreaTreeApi,   // 地区
    postMerchantPayYsRegApi,    // 通道注册
    postMerchantPayYsTokenApi,   // 通道token
} from '@/api/account'
export default {
    name: 'subAccountInfo',
    data() {
        // 验证规则
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('不能为空'));
            } else {
                let reg = /^[\u4E00-\u9FA5A-Za-z0-9\_]+$/;
                if (reg.test(this.list.companyAddr)) {
                    this.$refs.formCustom.validateField('companyAddr');
                    callback();
                } else {
                    callback('不能有特殊字符');
                }
            }
        };
        return {
            merchantId: '', // 所属商家
            list: {},  // 添加的信息
            token: '',   // 通道token
            filesData: [
                { title: '公民身份证正面', code: '00', img: '', file: '' },
                { title: '公民身份证反面', code: '30', img: '', file: '' },
                { title: '营业执照', code: '19', img: '', file: '' },
                { title: '税务登记证', code: '20', img: '', file: '' },
                { title: '客户协议', code: '31', img: '', file: '' },
                // { title: '授权书', code: '32', img: '', file: '' },
                { title: '手持身份证正扫面照', code: '33', img: '', file: '' },
                { title: '门头照', code: '34', img: '', file: '' },
                { title: '结算银行卡正面照', code: '35', img: '', file: '' },
                { title: '结算银行卡反面照', code: '36', img: '', file: '' },
                { title: '开户许可证或印鉴卡', code: '37', img: '', file: '' },
                { title: '经营场所图1', code: '50', img: '', file: '' },
                { title: '经营场所图2', code: '51', img: '', file: '' },
            ],  // 文件
            industryCategory: [
                { code: '01', name: '服饰鞋包' },
                { code: '02', name: '数码家电' },
                { code: '03', name: '鲜花礼品' },
                { code: '04', name: '美容护肤' },
                { code: '05', name: '团购' },
                { code: '06', name: '机票旅游' },
                { code: '07', name: '商务办公' },
                { code: '08', name: '文体用品' },
                { code: '09', name: '图书音像' },
                { code: '10', name: '家居装潢' },
                { code: '1001', name: '餐饮娱乐类' },
                { code: '1002', name: '一般类' },
                { code: '1003', name: '民生类' },
                { code: '1004', name: '便民服务' },
                { code: '1005', name: '环保类' },
                { code: '11', name: '母婴儿童' },
                { code: '12', name: '健康保健' },
                { code: '13', name: '食品饮料' },
                { code: '14', name: '资讯杂志' },
                { code: '15', name: '教育咨询' },
                { code: '16', name: '金融保险理财' },
                { code: '17', name: '软件定制创意' },
                { code: '18', name: '虚拟点卡' },
                { code: '19', name: '域名主机' },
                { code: '20', name: '电子商务' },
                { code: '21', name: '酒店预订' },
                { code: '22', name: '彩票' },
                { code: '23', name: '打车、智慧城市' },
                { code: '24', name: '移动支付手游' },
                { code: '25', name: '融资租赁' },
                { code: '26', name: '投资理财' },
                { code: '27', name: '保险行业' },
                { code: '31', name: '消费分期' },
                { code: '32', name: '其他行业' },
                { code: '33', name: '小贷消金' },
                { code: '34', name: '直播行业' },
                { code: '35', name: '信息咨询' },
                { code: '36', name: '综合商城' },
                { code: '41', name: '机械设备' },
                { code: '42', name: '直销行业' },
                { code: '43', name: '通信行业' },
                { code: '44', name: '汽车贸易' },
                { code: '45', name: '拍卖' },
                { code: '46', name: '税务服务' },
                { code: '47', name: '情趣用品' },
                { code: '48', name: '供应链服务' },
                { code: '49', name: '医疗服务' },
                { code: '50', name: '酒店管理' },
                { code: '51', name: '跨境直购' },
                { code: '52', name: '银行机构' },
                { code: '53', name: '事业单位' },
                { code: '55', name: '租赁行业' },
                { code: '56', name: '人力资源' },
                { code: '57', name: '房地产' },
                { code: '58', name: '批发零售业' },
                { code: '59', name: '制造业' },
                { code: '60', name: '文化活动服务' },
                { code: '61', name: '福利彩票' },
                { code: '62', name: '股票操盘' },
                { code: '63', name: '众筹' },
                { code: '66', name: '大宗商品' },
                { code: '67', name: '服装鞋包' },
                { code: '68', name: '互联网金融' },
                { code: '69', name: '话费充值' },
                { code: '70', name: '计算机软件' },
                { code: '71', name: '计算机系统集成' },
                { code: '72', name: '建筑工程' },
                { code: '73', name: '理财投资' },
                { code: '74', name: '金融租赁' },
                { code: '75', name: '旅游机票' },
                { code: '78', name: '人力资源' },
                { code: '79', name: '生活服务' },
                { code: '80', name: '软件定制商城' },
                { code: '82', name: '物流运输' },
                { code: '83', name: '消费金融' },
                { code: '84', name: '物业管理' },
                { code: '85', name: '小额贷款' },
                { code: '86', name: '游戏行业' },
                { code: '87', name: '游戏点卡' },
                { code: '88', name: '影视传媒' },
                { code: '89', name: '艺术品类' },
            ],  // 行业类别
            loading: false,  // 加载框
            provinceList: [],   // 省份
            cityList: [],   // 城市列表
            provinceChangeVal: '',   // 城市变化
            provinceChangeValTwo: '',   // 第二个城市变化
            cityListTwo: [],  // 第二个城市

            ruleValidate: {
                custType: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                custName: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                anotherName: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                industry: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                city: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                companyAddr: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                legalName: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                legalTel: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                legalCertType: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                legalCertNo: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                settleType: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                bankAccountNo: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                bankAccountName: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                bankAccountType: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                bankCardType: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                bankName: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                bankType: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                bankCity: [
                    { required: true, message: '该项为必填项！', trigger: 'change' }
                ],
                certNo: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                bankTelephoneNo: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                busLicense: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],
                busLicenseExpire: [
                    { required: true, message: '该项为必填项！', trigger: 'blur' }
                ],

                companyAddr: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ]
            },  // 表单验证
        }
    },
    created() {
        this.merchantId = this.$route.query.id;
        this.getAreaList();
        // this.getToken();
    },
    methods: {
        // 提交
        submitSaveFn(name) {

            this.loading = true;
            this.$refs[name].validate((valid) => {
                if (valid) {

                    this.list.merchantId = this.merchantId;
                    this.list.token = this.token;
                    // this.list.merchantNo = Date.parse(new Date());
                    this.list.merchantNo = this.merchantId;

                    this.list.certType = '00';  // 开户人证件类型，目前只支持00,00为身份证
                    let formData = new FormData();
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const item = this.list[key];
                            if (item) {
                                formData.append(key, item);
                            }
                        }
                    }
                    this.getToken();
                    postMerchantPayYsRegApi(formData, false).then(res => {
                        // console.log(res);
                        if (res.msg) {
                            this.$Message.success('成功！');
                            this.$router.back();
                            this.loading = false;
                        }
                    }).catch(err => {
                        this.loading = false;
                    })
                } else {
                    this.$Message.error('请先补充必填项 !');
                    this.loading = false;
                }
            })
        },
        // 获取token
        getToken() {
            // Date.parse(new Date()) 
            postMerchantPayYsTokenApi().then(res => {
                this.token = res.token;
                this.submitImgFileFn();
            }).catch(err => {
                console.log(err);
            })
        },
        // 上传图片
        beforeUploadFile(file, index) {

            this.filesData[index].file = file;
            this.filesData[index].img = window.URL.createObjectURL(file);
            return false
        },
        // 删除图片
        colseImgFn(i) {
            this.filesData[i].file = '';
            this.filesData[i].img = '';
        },
        // 提交图片
        submitImgFileFn() {
            this.filesData.forEach(item => {
                if (item.file) {
                    this.list[`picFile[${item.code}]`] = item.file
                }
            })

        },
        // 地区
        getAreaList() {
            getAreaTreeApi().then(res => {
                let data = JSON.parse(JSON.stringify(res));
                this.provinceList = data;
            })
        },
        // 城市
        getCityList(item, type) {
            if (item) {
                let arr = item.split(',');
                if (type == 'one') {
                    this.list.province = arr[0];
                }
                if (type == 'two') {
                    this.list.bankProvince = arr[0];
                }
                let parentId = arr[1];

                getAreaTreeApi(parentId).then(res => {
                    let data = JSON.parse(JSON.stringify(res));
                    if (type == 'one') {
                        this.cityList = data;
                    }
                    if (type == 'two') {
                        this.cityListTwo = data;
                    }
                });
            } else {
                if (type == 'one') {
                    this.list.province = '';
                }
                if (type == 'two') {
                    this.list.bankProvince = '';
                }
            }
        }
    }
}
</script>
<style scoped lang='less'>
.sub_info {
    margin-top: 24px;

    .footer_box {
        padding-top: 15px;
        text-align: center;
        border-top: 1px solid #e8eaec;
    }

    .img_box {
        display: inline-block;
        position: relative;

        .img_box_close {
            position: absolute;
            top: -9px;
            right: -8px;
            color: #f00;
        }
    }
}
</style>