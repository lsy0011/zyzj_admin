<template>
    <div class='auctionCompany'>
        <!-- <h5>拍卖公司账号管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="拍卖公司管理" hidden-breadcrumb />
        </div>
        <div class="auction_main">
            <div class="search_top" style="text-align: center;">
                <Space size="large">
                    <!-- <Space>
                        <strong>企业名称</strong>
                        <Input placeholder="模糊查询" size="small"></Input>
                    </Space>
                    <Space>
                        <strong>统一信用码</strong>
                        <Input placeholder="请输入" size="small"></Input>
                    </Space> -->
                    <Space>
                        <Input v-model="search.keywords" size="small" placeholder="请输入公司名称/统一信用码关键字"
                            v-width="260"></Input>
                        <Button size="small" type="primary" icon="md-search"
                            @click="pageNumber = 1; getMerList();">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; pageSize = 10; search = {}; statuType = 1; getMerList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_tit">
                <Space size="large">
                    <Space>
                        <Icon type="md-list"></Icon>
                        <strong>列表</strong>
                    </Space>

                    <Button size="small" v-for="item in statusList" :class="{ 'show_btn': statuType == item.id }"
                        :key="item.id" @click="changeStatuType(item)">{{ item.title }}</Button>

                    <Button type="primary" size="small" @click="editCompany(false)">添加</Button>
                </Space>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #statuSlot="{ row }">
                    <div v-if="row.status">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => changeSatusFn(i, row)"></Switch>
                    </div>
                    <div v-else>
                        <Switch true-value="enabled" false-value="disabled" @on-change="(i) => changeSatusFn(i, row)">
                        </Switch>
                    </div>
                </template>

                <template #actionSlot="{ row }">
                    <template v-if="row.approvalInfo.state.code == 'wait' || row.approvalInfo.state.code == 'underway'">
                        <Button size="small" type="success" @click="auditApprovalFn(row, 'success')">审核通过</Button>
                        <Button size="small" type="error" @click="auditApprovalFn(row, 'reject')">驳回</Button>
                    </template>
                    <Button size="small" type="warning" v-if="row.approvalInfo.state.code == 'reject'"
                        @click="auditApprovalFn(row, false); repeateFlag = true;">重新审批</Button>
                    <Button size="small" type="info" @click="editCompany(row)">编辑</Button>
                    <Button size="small" type="info" @click="lookCompany(row)">查看详情</Button>

                </template>
            </Table>
            <div class="foot_page" style="margin: 20px 0 0;">
                <Page :total="total" v-model="pageNumber" size="small" show-elevator show-sizer show-total
                    @on-page-size-change="pageSizeChange" @on-change="changePage" />
            </div>
        </div>
        <!-- 详情 -->
        <Modal v-model="modal" class="look_modal" title="拍卖公司详情" width="600">
            <div class="title_top">企业基本信息</div>
            <Form label-position="right" :label-width="160">
                <FormItem label="企业名称:">
                    <strong>{{ lookList.name || '---' }}</strong>
                </FormItem>
                <FormItem label="所在地区:">
                    <strong>
                        {{ lookList.region && lookList.region.extra && lookList.region.extra.namePath ?
                            lookList.region.extra.namePath.join(' / ') : '-- - ' }}</strong>
                </FormItem>
                <FormItem label="详细地址:">
                    <strong>{{ lookList.address || '---' }}</strong>
                </FormItem>
            </Form>
            <div class="title_top">入驻信息</div>
            <Form label-position="right" :label-width="160">
                <FormItem label="法人姓名:">
                    <strong>{{ lookList.lpName || '---' }}</strong>
                </FormItem>
                <FormItem label="法人证件号:">
                    <strong>{{ lookList.lpIdNo || '---' }}</strong>
                </FormItem>
                <FormItem label="统一社会信用代码:">
                    <strong>{{ lookList.creditCode || '---' }}</strong>
                </FormItem>
                <FormItem label="注册成立时间:">
                    <strong>{{ lookList.incorporationDate || '---' }} </strong>
                </FormItem>
                <FormItem label="营业执照有效期:">
                    <strong>{{ lookList.blCertExpiredDate || '---' }} </strong>
                </FormItem>
                <FormItem label="开户银行:">
                    <strong>{{ lookList.openingBank || '---' }} </strong>
                </FormItem>
                <FormItem label="银行账号:">
                    <strong>{{ lookList.bankAccount || '---' }} </strong>
                </FormItem>
            </Form>
            <div class="title_top">联系人信息</div>
            <Form label-position="right" :label-width="160">
                <FormItem label="姓名:">
                    <strong>{{ lookList.linkman || '---' }}</strong>
                </FormItem>
                <FormItem label="手机号:">
                    <strong>{{ lookList.linkmanTel || '---' }}</strong>
                </FormItem>
                <FormItem label="电子邮箱:">
                    <strong>{{ lookList.linkmanEmail || '---' }}</strong>
                </FormItem>
                <FormItem label="联系地址:">
                    <strong>{{ lookList.afterSaleAddress || '---' }}</strong>
                </FormItem>
            </Form>
            <div class="title_top">资质类型</div>
            <div class="info_table">
                <Table stripe :columns="columnsInfo" :data="dataInfo" size="small" border>

                    <template #actionInfoSlot="{ row, index }">
                        <template v-if="!row.pic">
                            <Upload action="" :format="['jpg', 'jpeg', 'png']"
                                :before-upload="(i) => beforeUploadFileFn(i, index)">
                                <a href="javascript:;">上传</a>
                            </Upload>
                        </template>

                        <template v-else>
                            <div style="display: flex;">
                                <a href="javascript:;" v-width="'33%'" style="text-align: center;"
                                    @click="imgName = row.pic; visible = true;">查看</a>

                                <Upload action="" :format="['jpg', 'jpeg', 'png']" v-width="'33%'"
                                    style="text-align: center;" :before-upload="(i) => beforeUploadFileFn(i, index)">
                                    <a href="javascript:;">更换</a>
                                </Upload>
                                <a href="javascript:;" v-width="'33%'" style="text-align: center;" v-color="'#ee0323'"
                                    @click="removeFileFn(row)">删除</a>
                            </div>
                        </template>
                    </template>
                </Table>
            </div>
            <div class="title_top">详情信息</div>
            <div class="footer_box">
                <div>
                    <span>委托方分润金额:</span>
                    <strong>￥{{ lookList.faCoStat ? lookList.faCoStat.consignerFz : '' }}</strong>
                </div>
                <div>
                    <span>拍卖佣金:</span>
                    <strong>￥{{ lookList.faCoStat ? lookList.faCoStat.serviceCharge : '' }}</strong>
                </div>
                <div>
                    <span>总成交金额:</span>
                    <strong>￥{{ lookList.stat ? lookList.stat.turnover : '' }}</strong>
                </div>
                <div>
                    <span>拍品数量:</span>
                    <strong>{{ lookList.stat ? lookList.stat.goodsCount : '' }}</strong>
                </div>
                <div>
                    <span>委托方数量:</span>
                    <strong>{{ lookList.faCoStat ? lookList.faCoStat.consignerCount : '' }}</strong>
                </div>
            </div>
        </Modal>
        <!-- 审核 -->
        <Modal v-model="remarkModal" title="备注" width="300">
            <div v-if="repeateFlag" style="margin-bottom: 15px;">
                <RadioGroup v-model="repeatedly">
                    <Radio label="success">
                        <span>通过</span>
                    </Radio>
                    <Radio label="reject">
                        <span>驳回</span>
                    </Radio>
                </RadioGroup>
            </div>
            <Input v-model="auditData.remark" type="textarea" :rows="4" placeholder="请输入备注内容…"></Input>

            <template #footer>
                <Button type="primary" :disabled="!auditData.remark" @click="approveFn()">确认</Button>
                <Button @click="remarkModal = false">取消</Button>
            </template>
        </Modal>
        <!-- 添加拍卖公司 -->
        <Modal v-model="addModal" title="添加拍卖公司" width="600" @on-visible-change="visibleChangeFn">

            <Form ref="formList" :model="list" label-position="right" :rules="ruleValidate" :label-width="140">
                <FormItem label="名称：" prop="name">
                    <Input v-model="list.name" placeholder="请输入公司名称"></Input>
                </FormItem>
                <FormItem label="统一信用码：" prop="creditCode">
                    <Input v-model="list.creditCode" placeholder="请输入信用码"></Input>
                </FormItem>
                <FormItem label="地区：" prop="regionId">
                    <TreeSelect v-model="list.regionId" :data="areaTree" placeholder="请输入地区" />
                </FormItem>

                <FormItem label="地址：" prop="address">
                    <Input v-model="list.address" placeholder="请输入地址"></Input>
                </FormItem>
                <FormItem label="联系人：" prop="linkman">
                    <Input v-model="list.linkman" placeholder="请输入联系人"></Input>
                </FormItem>
                <FormItem label="联系电话：" prop="linkmanTel">
                    <Input v-model="list.linkmanTel" maxlength="11" show-word-limit type="number"
                        placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="联系人邮箱：">
                    <Input v-model="list.linkmanEmail" placeholder="请输入联系人邮箱"></Input>
                </FormItem>

                <!-- <FormItem label="售后联系人：" prop="afterSaleLinkman">
                    <Input v-model="list.afterSaleLinkman" placeholder="请输入售后联系人"></Input>
                </FormItem>
                <FormItem label="售后电话：" prop="afterSaleTel">
                    <Input v-model="list.afterSaleTel" placeholder="请输入售后电话"></Input>
                </FormItem>
                <FormItem label="售后地址：" prop="afterSaleAddress">
                    <Input v-model="list.afterSaleAddress" placeholder="售后地址"></Input>
                </FormItem> -->

                <FormItem label="法人：">
                    <Input v-model="list.lpName" placeholder="请输入售后联系人"></Input>
                </FormItem>
                <FormItem label="法人证件号码：">
                    <Input v-model="list.lpIdNo" placeholder="请输入法人证件号码"></Input>
                </FormItem>
                <FormItem label="注册成立日期：">
                    <DatePicker v-model="list.incorporationDate" placeholder="注册成立日期" type="date" v-width="'100%'" />
                </FormItem>
                <FormItem label="营业执照有效期：">
                    <DatePicker v-model="list.blCertExpiredDate" placeholder="营业执照有效期" type="date" v-width="'100%'" />
                </FormItem>
                <FormItem label="开户行：">
                    <Input v-model="list.openingBank" placeholder="开户行"></Input>
                </FormItem>
                <FormItem label="银行账号：">
                    <Input v-model="list.bankAccount" placeholder="银行账号"></Input>
                </FormItem>

                <FormItem label="详细介绍：" prop="introduction">
                    <Input v-model="list.introduction" type="textarea" placeholder="详细介绍描述" :rows="3"></Input>
                </FormItem>
            </Form>

            <template #footer>
                <Button type="primary" @click="saveMerFn('formList')">确认</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>

        <!-- 查看图片 -->
        <ImagePreview v-model="visible" :preview-list="[imgName]" />
    </div>
</template>

<script>
import {
    getMerchantBasePageApi,   // 商家分页
    postMerchantBaseStatusApi,  // 状态
    getMerchantBaseSaveApi,    // 商家保存
    getMerchantBaseDetailApi,    // 商家详情
    postMerchantBaseRemoveApi,    // 商家删除
    postMerchantBaseApprovalApi,    // 审核

    getAreaTreeApi,  // 地区
    getMerchantStaffSaveApi,    // 管理员
    postMerchantStaffSetLeaderApi,   // 设为管理员
    getSysDictItemTreeApi,   // 字典配置项

    getMerchantCertSaveApi,   // 资质保存
    getMerchantCertListApi,   // 资质别表
    postMerchantCertRemoveApi,   // 资质删除
} from '@api/account'
export default {
    name: 'auctionCompany',
    data() {
        return {
            loading: false,
            modal: false,
            remarkModal: false,
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            columns: [
                {
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '注册时间',
                    align: 'center',
                    minWidth: 170,
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '企业名称',
                    align: 'center',
                    minWidth: 180,
                    key: 'name',
                },
                {
                    title: '统一信用码',
                    align: 'center',
                    minWidth: 160,
                    key: 'creditCode',
                },
                {
                    title: '所在地',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [params.row.region && params.row.region.extra && params.row.region.extra.namePath ? params.row.region.extra.namePath.join(' / ') + ' / ' + params.row.address : '---'])
                    }
                },
                {
                    title: '联系人',
                    align: 'center',
                    minWidth: 160,
                    key: 'linkman'
                },
                {
                    title: '手机号',
                    align: 'center',
                    minWidth: 160,
                    key: 'linkmanTel'
                },
                {
                    title: '总成交金额',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [params.row.stat && params.row.stat.customerTotal ? params.row.stat.customerTotal : '0'])
                    }
                },
                {
                    title: '拍品数量',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [params.row.stat && params.row.stat.customerTotal ? params.row.stat.purchaseAmountTotal : '0'])
                    }
                },
                {
                    title: '委托方数量',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '审核状态',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', params.row.approvalInfo && params.row.approvalInfo.state ? params.row.approvalInfo.state.name : '---')
                    }
                },
                {
                    title: '审核备注',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', params.row.approvalInfo ? params.row.approvalInfo.approveResult || '---' : '---')
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 90,
                    fixed: 'right',
                    slot: 'statuSlot'
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 180,
                    fixed: 'right',
                    slot: 'actionSlot'
                },
            ],
            data: [],
            columnsInfo: [
                {
                    title: '内容',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '附件',
                    align: 'center',
                    slot: 'actionInfoSlot'
                },
            ],
            dataInfo: [
                { name: '联系人身份证正面' },
                { name: '联系人身份证反面' },
                { name: '法人身份证正面' },
                { name: '法人身份证反面' },
                { name: '营业执照' },
                { name: '授权委托书' },
                { name: '拍卖经营批准证书' },
            ],
            search: {},   // 搜索
            statusList: [
                { title: '全部', key: '', id: 1 },
                { title: '待审批', key: 'wait', id: 2 },
                { title: '审批中', key: 'underway', id: 3 },
                { title: '已通过', key: 'success', id: 4 },
                { title: '未通过', key: 'reject', id: 5 },
            ],   // 状态列表
            statuType: 1,

            areaTree: [],    // 地区树
            addModal: false,   // 添加
            list: {},   // 信息

            lookList: {},   // 查看
            auditData: {},  // 审核数据

            repeateFlag: false,
            repeatedly: '',    // 重新审批

            visible: false,   // 查看图片
            imgName: '',   // 图片

            ruleValidate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                creditCode: [
                    { required: true, message: '请输入统一信用码', trigger: 'blur' },
                ],
                regionId: [
                    { required: true, message: '请选择地区', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ],
                linkman: [
                    { required: true, type: 'string', message: '请输入联系人', trigger: 'blur' }
                ],
                linkmanTel: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { type: 'string', min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur' }
                ],
                afterSaleLinkman: [
                    { required: true, type: 'string', message: '请输入联系人', trigger: 'blur' }
                ],
                afterSaleTel: [
                    { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                    { type: 'string', min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur' }
                ],
                afterSaleAddress: [
                    { required: true, type: 'string', message: '请输入联系人', trigger: 'blur' }
                ],
                time: [
                    { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
                ],
            },
        }
    },
    created() {
        this.getMerList();
        getSysDictItemTreeApi({ dict: 'mer_cert_faco' }).then(res => {

            let arr = res.map(item => {
                return {
                    id: item.id,    // 字典ID
                    code: item.code,   // 字典编码
                    name: item.name,
                    file: '',
                    pic: '',
                    fileId: '',
                }
            })
            this.dataInfo = JSON.parse(JSON.stringify(arr));

        })
        getAreaTreeApi().then(res => {
            this.areaTree = this.handleDataFn(res, false);
        })
    },
    methods: {
        // 商家分页
        getMerList() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'auction',
                type: 'FACO',    // FACO
                ...this.search
            };
            getMerchantBasePageApi(data).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
            })
        },
        // 编辑
        editCompany(row) {
            if (row.id) {
                getMerchantBaseDetailApi(row.id).then(res => {
                    this.list = {
                        id: res.id,
                        name: res.name,
                        creditCode: res.creditCode,
                        regionId: res.region ? res.region.id : '',
                        address: res.address || '',
                        linkman: res.linkman || '',
                        linkmanTel: res.linkmanTel || '',
                        afterSaleLinkman: res.afterSaleLinkman || '',
                        afterSaleTel: res.afterSaleTel || '',
                        afterSaleAddress: res.afterSaleAddress || '',
                        introduction: res.introduction || '',

                        lpName: res.lpName || '',
                        lpIdNo: res.lpIdNo || '',
                        openingBank: res.openingBank || '',
                        bankAccount: res.bankAccount || '',
                        incorporationDate: res.incorporationDate || '',
                        blCertExpiredDate: res.blCertExpiredDate || '',
                        linkmanEmail: res.linkmanEmail || '',
                    };
                    this.addModal = true;
                })
            } else {
                this.list = {};
                this.addModal = true;
            }
        },
        // 商家保存
        saveMerFn(ruleName) {

            this.$refs[ruleName].validate((valid) => {
                if (valid) {

                    let formData = new FormData();

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key == 'incorporationDate' || key == 'blCertExpiredDate') {
                                let date = new Date(element).getTime();
                                formData.append(key, this.$Date(date).format('YYYY-MM-DD'))
                            } else {
                                formData.append(key, element);
                            };
                        };
                    };

                    formData.append('biz', 'auction');
                    formData.append('type', 'FACO');

                    let formdata2 = new FormData();
                    formdata2.append('name', this.list.name);
                    formdata2.append('usemame', this.list.name);
                    formdata2.append('mobile', this.list.linkmanTel);

                    getMerchantBaseSaveApi(formData, false).then(res => {
                        if (res.id) {
                            formdata2.append('merchantId', res.id);

                            // console.log("🚀 ~ file: index.vue:561 ~ getMerchantBaseSaveApi ~ !this.list.id:", !this.list.id)
                            if (!this.list.id) {

                                getMerchantStaffSaveApi(formdata2, false).then(rs => {

                                    postMerchantStaffSetLeaderApi({ id: rs.id }).then(re => {

                                        this.$Message.success("保存成功！");
                                        this.addModal = false;
                                        this.getMerList();
                                    });
                                });
                            } else {
                                this.addModal = false;
                                this.getMerList();
                            }
                        };
                    });

                } else {
                    this.$Message.error('请补充必填项!');
                };
            });

        },
        // 修改状态
        changeSatusFn(value, row) {
            postMerchantBaseStatusApi({ id: row.id, value }).then(res => {
                this.$Message.success('操作成功！');
                this.getMerList();
            }).catch(err => {
                this.getMerList();
            })
        },
        // 查看详情
        lookCompany(row) {
            getMerchantBaseDetailApi(row.id).then(res => {
                this.lookList = JSON.parse(JSON.stringify(res));

                this.getFileFn(row.id);

                this.modal = true;
            });
        },
        // 审核状态
        changeStatuType(item) {
            this.statuType = item.id;
            this.search.approState = item.key;
            this.getMerList();
        },

        // 审核
        auditApprovalFn(row, key) {
            this.auditData = row;
            this.remarkModal = true;
            if (key) {
                this.auditData.state = key;
            }
        },
        // 审核通过 确认按钮 / reject 驳回
        approveFn() {

            let { id, state, remark } = this.auditData;
            postMerchantBaseApprovalApi({ id, state, remark }).then(res => {
                if (res) {
                    if (this.auditData.state == 'success') {
                        this.$Message.info('审核通过');
                    } else if (this.auditData.state == 'reject') {
                        this.$Message.info('已被驳回');
                    }
                    this.getMerList();
                    this.remarkModal = false;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 处理数据函数
        handleDataFn(arr = [], key) {
            let newArr = arr;
            arr.forEach(v => {
                v.rankType = false
                if (key) {
                    v.expand = true
                }
                v.value = v.id
                v.title = v.name
                if (v.subset && v.subset.length > 0) {
                    v.children = v.subset;
                    this.handleDataFn(v.children)
                } else if (v.children && v.children.length) {
                    this.handleDataFn(v.children)
                }
            });
            return newArr;
        },
        // 资质获取
        getFileFn(merId) {
            getMerchantCertListApi({ merchantId: merId }).then(rs => {
                this.dataInfo.forEach(item => {
                    if (rs.length != 0) {
                        rs.forEach(itm => {
                            if (item.code == itm.type.code) {
                                item.fileId = itm.id;
                                item.pic = itm.filePath;
                                item.merId = merId;
                            };
                        });
                    } else {
                        item.fileId = '';
                        item.pic = '';
                        item.merId = merId;
                    }
                });
            });
        },
        // 资质上传
        beforeUploadFileFn(file, i) {

            let formData = new FormData();
            formData.append('file', file);
            formData.append('typeCode', this.dataInfo[i].code);
            formData.append('name', this.dataInfo[i].name);
            formData.append('merchantId', this.lookList.id);

            getMerchantCertSaveApi(formData, false).then(res => {
                this.dataInfo[i].fileId = res.id;
                this.dataInfo[i].pic = res.filePath;
            })

            this.dataInfo[i].file = file;
            this.dataInfo[i].pic = window.URL.createObjectURL(file);

            return false;
        },
        // 资质删除
        removeFileFn(row) {
            postMerchantCertRemoveApi({ id: row.fileId }).then(res => {
                this.getFileFn(row.merId);
                this.$Message.success('删除成功！')
            })
        },
        visibleChangeFn(flag) {
            if (!flag) {
                this.$refs['formList'].resetFields();
            }
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getMerList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getMerList();
        },
    }
}
</script>

<style scoped lang='less'>
.auction_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .table_tit {
        margin: 20px 0;
        font-size: 15px;

        .show_btn {
            border: 1px solid #2d8cf0;
            color: #2d8cf0;
        }
    }
}

.look_modal {
    .title_top {
        font-size: 15px;
        font-weight: 600;
        border-left: 5px solid #ed0321;
        padding-left: 12px;
        box-sizing: border-box;
    }

    .ivu-form-item {
        margin-bottom: 0px;
    }
}

.info_table {
    width: 92%;
    margin: 10px auto;
}

.footer_box {
    width: 92%;
    margin: 10px auto;
    display: flex;
    flex-wrap: wrap;

    div {
        width: 33%;
        margin-bottom: 10px;
    }
}

// .ivu-form-item {
//     margin-bottom: 0px;
// }

.ivu-table-cell-slot {
    button {
        margin: 5px;
    }
}
</style>