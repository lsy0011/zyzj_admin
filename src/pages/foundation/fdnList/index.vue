<template>
    <div class='fdnList'>
        <!-- <h5>基金会列表</h5> -->

        <div class="i-layout-page-header">
            <PageHeader title="基金会管理" content="基金会列表" hidden-breadcrumb />
        </div>
        <div class="list-main">

            <!-- <Menu mode="horizontal" :theme="theme" active-name="1">
                <MenuItem name="1" @click="bizType = 'common'">
                商品基金会
                </MenuItem>
                <MenuItem name="2" @click="bizType = 'medical'">
                药品基金会
                </MenuItem>
            </Menu> -->
            <div class="top-search">
                <!-- <div class="search-button"> -->
                <Space size="large" wrap>
                    <!-- <Space>
                        起止时间
                        <DatePicker type="date" placeholder="开始时间" style="width: 200px" size="small" />
                        至
                        <DatePicker type="date" placeholder="截止时间" style="width: 200px" size="small" />
                    </Space> -->
                    <Space>
                        城市
                        <TreeSelect v-model="search.regionId" :data="areaTree" style="width: 120px" size="small" />
                    </Space>
                    <Input v-model="search.keywords" placeholder="请输入名称 / 信用码 / 手机号等关键词" size="small" clearable
                        style="width: 260px;" />
                    <!-- </div> -->
                    <Space>
                        <Button type="primary" size="small" @click="pageNumber = 1; getList()"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; pageSize = 10; search = {}; getList()"> 重置</Button>
                    </Space>
                </Space>
            </div>
            <Space size="large">
                <Space style="font-size: 16px;">
                    <Icon type="md-list"></Icon>
                    <strong>基金会列表</strong>
                </Space>
                <Button @click="showFn(false)" size="small" type="primary">添加</Button>
            </Space>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #nullSlot>
                    <p> --- </p>
                </template>

                <template #extraSlot="{ row }">
                    <div v-if="row.region">
                        <p>
                            {{ row.region.extra && row.region.extra.namePath.length > 0 ?
                            row.region.extra.namePath.join() :
                            '---' }}
                        </p>
                    </div>
                    <div v-else> --- </div>
                </template>

                <template #switchSlot="{ row }">
                    <div v-if="row.status">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => changeSwitch(i, row)"></Switch>
                    </div>
                </template>

                <template #actionSlot="{ row }">

                    <template v-if="row.approvalInfo && row.approvalInfo.state.code == 'wait'">
                        <Button type="success" v-margin="5" size="small"
                            @click="passAuditFn(row, 'success')">审核通过</Button>
                        <Button type="error" v-margin="5" size="small" @click="passAuditFn(row, 'reject')">驳回</Button>
                    </template>

                    <!-- <Button size="small" style="margin-right: 10px;" @click="editInfoFn(row)" type="info">分账信息</Button> -->
                    <Button size="small" v-margin="5" @click="showFn(row)" type="primary">编辑</Button>
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn(row)">
                        <Button size="small" v-margin="5" type="error" v-if="row.status.code == 'disabled'">删除</Button>
                    </Poptip>
                </template>
            </Table>
            <div class="foot_page">
                <Page :total="total" v-model="pageNumber" :page-size="pageSize" show-total size="small" show-elevator
                    show-sizer @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]"
                    @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <!-- 添加 -->
        <Modal v-model="modal" title="添加基金会"  @on-visible-change="visibleChange">
            <Form ref="formValidate" :model="list" :rules="ruleValidate" :label-width="130">
                <FormItem label="名称：" prop="name">
                    <Input v-model="list.name" placeholder="请输入名称" />
                </FormItem>
                <FormItem label="所在区域：" prop="regionId">
                    <TreeSelect v-model="list.regionId" :data="treeData" placeholder="请选择区域" />
                </FormItem>
                <FormItem label="详细地址：" prop="address">
                    <Input v-model="list.address" @on-blur="list.address = $event.target.value.trim()"
                        placeholder="请输入详细地址" />
                </FormItem>
                <FormItem label="联系人：" prop="linkman">
                    <Input v-model="list.linkman" @on-blur="list.linkman = $event.target.value.trim()"
                        placeholder="请输入联系人" />
                </FormItem>
                <FormItem label="联系方式：" prop="linkmanTel">
                    <Input v-model="list.linkmanTel" @on-blur="list.linkmanTel = $event.target.value.trim()"
                        type="number" maxlength="11" show-word-limit placeholder="请输入联系方式" />
                </FormItem>
                <FormItem label="联系人身份证：" prop="linkmanIdNo">
                    <Input v-model="list.linkmanIdNo" @on-blur="list.linkmanIdNo = $event.target.value.trim()"
                        maxlength="18" show-word-limit placeholder="请输入联系人身份证" />
                </FormItem>
                <FormItem label="统一信用代码：" prop="creditCode">
                    <Input v-model="list.creditCode" @on-blur="list.creditCode = $event.target.value.trim()"
                        placeholder="请输入统一信用代码" />
                </FormItem>
                <FormItem label="售后联系人：">
                    <Input v-model="list.afterSaleLinkman" @on-blur="list.afterSaleLinkman = $event.target.value.trim()"
                        placeholder="请输入售后联系人" />
                </FormItem>
                <FormItem label="售后电话：">
                    <Input v-model="list.afterSaleTel" @on-blur="list.afterSaleTel = $event.target.value.trim()"
                        type="number" maxlength="11" show-word-limit placeholder="请输入售后电话" />
                </FormItem>
                <FormItem label="售后地址：">
                    <Input v-model="list.afterSaleAddress" @on-blur="list.afterSaleAddress = $event.target.value.trim()"
                        placeholder="请输入售后地址" />
                </FormItem>
                <FormItem label="结算周期：" prop="paymentPeriod">
                    <Input v-model="list.paymentPeriod" type="number" placeholder="输入整数/单位(天)"
                        @on-blur="list.paymentPeriod = $event.target.value < 0 ? 0 : $event.target.value * 1">

                    <template #append> <span>天</span> </template>
                    </Input>
                </FormItem>
                <FormItem props="remark" label-for="introduction">

                    <template #label>备注<span v-color="'#808695'">（选填）</span>：</template>
                    <Input v-model="list.introduction" type="textarea" placeholder="请输入备注" />
                </FormItem>
                <FormItem :label="item.name + '：'" v-for="item in dictList" :key="item.id">
                    <!--  v-for="(itm, index) in showFile[item.code]" :key="index" -->
                    <div class="uploadImg" v-if="showFile[item.code].img">
                        <div v-viewer class="imgs">
                            <img :src="showFile[item.code].img" alt="" :data-source="showFile[item.code].img"
                                style="width: 100%;" />
                        </div>
                        <Icon type="md-close" @click="imgDel(showFile[item.code].ids, item.code)" class="uploadImg_icon"
                            size="17" />
                    </div>
                    <Upload :before-upload="(file) => beforeUploadFile(file, item)" action="">
                        <Button style="color:#ddd;">点击上传文件</Button>
                    </Upload>
                </FormItem>
            </Form>

            <template #footer>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存</Button>
                <Button class="ivu-ml" @click="modal = false;">取消</Button>
            </template>
        </Modal>
        <!-- 审核 -->
        <Modal v-model="approModal" title="备注" width="300">
            <Input v-model="approvalList.remark" type="textarea" :rows="3" placeholder="请输入备注内容" />

            <template #footer>
                <Button type="primary" @click="approvalGoodsFn()">提交</Button>
                <Button @click="approModal = false; approvalList = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import {
    getAreaTreeApi, // 地区
    getMerchantBasePageApi,  // 列表
    postMerchantBaseStatusApi,  // 状态
    postMerchantBaseRemoveApi,   // 删除

    getMerchantBaseSaveApi,  // 保存
    getMerchantBaseDetailApi,  // 基础详情
    getSysDictItemTreeApi,  // 资质类型

    getMerchantCertListApi,  // 资质列表
    getMerchantCertSaveApi,  // 资质保存
    postMerchantCertRemoveApi,  // 资质删除

    postMerchantBaseApprovalApi,  // 商家审核
} from '@/api/account'
import { jsonToArea } from "@/libs/util.js"
export default {
    name: 'supplierlist',
    data() {
        return {
            loading: false,
            theme: 'light',
            modal: false,
            bizType: 'common',
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
                {
                    key: 'name',
                    width: 60,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '注册时间',
                    key: 'name',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '名称',
                    key: 'name',
                    width: 180,
                    align: "center"
                },
                {
                    title: '唯一信用代码',
                    minWidth: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.creditCode ? params.row.creditCode : '---'])
                    }
                },
                // {
                //     title: '渠道来源',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                {
                    title: '区域城市',
                    slot: 'extraSlot',
                    width: 180,
                    align: "center"
                },
                {
                    title: '手机号',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.linkmanTel ? params.row.linkmanTel : '---'])
                    }
                },
                // {
                //     title: '微信ID',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '会员等级',
                //     width: 180,
                //     align: "center"
                // },
                {
                    title: '联系人',
                    key: 'linkman',
                    width: 180,
                    align: "center"
                },
                {
                    title: '联系方式',
                    key: '',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.linkmanTel ? params.row.linkmanTel : '---'])
                    }
                },
                {
                    title: '联系地址',
                    key: 'address',
                    minWidth: 180,
                    align: "center"
                },
                // {
                //     title: '售后联系人',
                //     key: 'afterSaleLinkman',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '售后电话',
                //     key: 'afterSaleTel',
                //     width: 180,
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', [params.row.address ? params.row.address : '---'])
                //     }
                // },
                // {
                //     title: '售后地址',
                //     width: 180,
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', [params.row.address ? params.row.address : '---'])
                //     }
                // },
                // {
                //     title: '资质证件',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '商品数',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '贷款',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '结算',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                {
                    title: '结算周期',
                    key: 'paymentPeriod',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.paymentPeriod ? params.row.paymentPeriod + '天' : '---'])
                    }
                },
                {
                    title: '审核状态',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.approvalInfo ? params.row.approvalInfo.state.name : '---')
                    }
                },
                {
                    title: '备注',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.approvalInfo ? params.row.approvalInfo.approveResult || '---' : '---')
                    }
                },
                // 状态
                {
                    title: '状态',
                    width: 100,
                    slot: 'switchSlot',
                    align: "center",
                    fixed: 'right',
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 180,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
            areaTree: [], // 地域列表
            search: {}, // 搜索


            treeData: [],  // 区域
            list: {},  // 添加信息
            userList: [],  // 用户列表
            dictList: [],  // 资质类型

            showFile: {},   // 展示用
            saveFile: {},   // 提交用
            fileIds: {},   // 图片ID

            ruleValidate: {
                name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                regionId: [{ required: true, message: '区域不能为空', trigger: 'change' }],
                address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
                linkman: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
                linkmanTel: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
                linkmanIdNo: [{ required: true, message: '证件号不能为空', trigger: 'blur' }],
                creditCode: [{ required: true, message: '信用码不能为空', trigger: 'blur' }],
                paymentPeriod: [{ required: true, type: "number", message: '结算周期不能为空', trigger: 'blur' }],
            },  // 表单验证

            saveTime: null,  // 提交防抖
            editTitle: '新建供应商',

            approModal: false,   // 审核
            approvalList: {},
        }
    },
    created() {
        this.getList();  // 获取列表
        this.getAreaTree();  // 地区
        this.getDictItem();
    },
    methods: {
        // 获取列表
        getList() {
            this.loading = true;
            let data = {
                type: 'NPO',
                ...this.search,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            };
            getMerchantBasePageApi(data).then(res => {
                let data = res.data;
                this.total = res.totalElements;
                // console.log(res);
                this.data = data;
                this.loading = false;
            })
        },
        // 地区
        getAreaTree() {
            getAreaTreeApi().then(res => {
                this.areaTree = jsonToArea(res, 'code', false);
                this.treeData = jsonToArea(res, 'code', false);
            })
        },
        // 修改状态
        changeSwitch(i, row) {
            postMerchantBaseStatusApi({ id: row.id, value: i }).then(res => {
                if (res) {
                    this.$Message.success('状态修改成功');
                    this.getList();
                }
            }).catch(err => {
                console.log(err);
                this.getList()
            })
        },
        // 编辑
        showFn(row) {
            this.modal = true;
            if (row.id) {
                this.editTitle = '编辑供应商';
                getMerchantBaseDetailApi(row.id).then(res => {
                    this.list = {
                        id: res.id,
                        name: res.name,
                        regionId: res.region ? res.region.code : '',
                        address: res.address ? res.address : '',
                        creditCode: res.creditCode ? res.creditCode : '',
                        userId: res.user ? res.user.id : '',

                        linkman: res.linkman ? res.linkman : '',
                        linkmanTel: res.linkmanTel ? res.linkmanTel : '',
                        afterSaleLinkman: res.afterSaleLinkman ? res.afterSaleLinkman : '',
                        afterSaleTel: res.afterSaleTel ? res.afterSaleTel : '',
                        afterSaleAddress: res.afterSaleAddress ? res.afterSaleAddress : '',
                        linkmanIdNo: res.linkmanIdNo ? res.linkmanIdNo : '',
                        introduction: res.introduction ? res.introduction : '',
                        paymentPeriod: res.paymentPeriod ? res.paymentPeriod : '',
                    }
                })
            } else {
                this.editTitle = '添加供应商';
                this.list = {
                    name: '',
                    regionId: '',
                    address: '',
                    creditCode: '',

                    linkman: '',
                    linkmanTel: '',
                    afterSaleLinkman: '',
                    afterSaleTel: '',
                    afterSaleAddress: '',

                    introduction: '',
                    paymentPeriod: '',
                }
            }
        },
        // 分账信息
        editInfoFn(row) {
            let data = {}
            if (row) {
                data.id = row.id
            }
        },
        // 删除
        removeFn(row) {
            postMerchantBaseRemoveApi({ id: row.id }).then(res => {
                this.$Message.success('操作成功');
                this.getList();
            })
        },


        // 审批拍品
        passAuditFn(row, type) {
            this.approvalList = {
                id: row.id,
                state: type,
            };
            this.approModal = true;
        },
        approvalGoodsFn() {

            postMerchantBaseApprovalApi(this.approvalList).then(res => {

                this.$Message.success('审核完成');
                this.approModal = false;
                this.getList();
            })
        },

        // 保存
        handleSubmit(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    this.list.biz = this.bizType;
                    this.list.type = 'NPO';

                    getMerchantBaseSaveApi(this.list).then(res => {
                        if (res.id) {
                            this.$Message.success('添加/修改 成功');
                            this.id = res.id;
                            this.fileSaveFn();
                            this.getList();

                            this.modal = false;
                        }
                    }).catch(err => {
                        console.log(err);
                    })

                } else {
                    this.$Message.error('请补充必填项 !');
                }
            })

        },
        // 获取资质
        getDictItem() {
            // dict=mer_cert_npo
            getSysDictItemTreeApi({ dict: 'mer_cert_npo' }).then(res => {
                let data = JSON.parse(JSON.stringify(res));
                this.dictList = [];
                data.forEach(item => {
                    if (item.code != 'cert_pharmaceutical_trading' && item.code != 'cert_Medical_Institution' || item.id != '64ae92d4ddb00b41852b2bbd' && item.id != '64ae95e8ddb00b41852b2bc1') {
                        this.dictList.push(item)
                    }
                })
                let arr = data.map(item => {
                    if (item.code != 'cert_pharmaceutical_trading' && item.code != 'cert_Medical_Institution' || item.id != '64ae92d4ddb00b41852b2bbd' && item.id != '64ae95e8ddb00b41852b2bc1') {
                        return item.code
                    }
                })
                arr.forEach(item => {
                    this.showFile[item] = {};
                    this.saveFile[item] = '';
                    this.fileIds[item] = 0;
                });

                if (this.id) {
                    this.getImgList();
                };
            }).catch(err => {
                console.log(err);
            })
        },
        // 文件保存
        fileSaveFn() {
            let that = this
            for (const key in this.dictList) {
                if (Object.hasOwnProperty.call(this.dictList, key)) {
                    const element = this.dictList[key];
                    let formData = new FormData()

                    formData.append('merchantId', that.id);
                    formData.append('typeCode', element.code);
                    formData.append('name', element.name)

                    if (this.saveFile[element.code]) {

                        formData.append('file', this.saveFile[element.code]);
                        if (element && key.length > 0) {
                            getMerchantCertSaveApi(formData, false).then(res => {
                                // console.log(res);
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    }

                }
            }
        },
        // 图片列表
        getImgList() {
            getMerchantCertListApi({
                'merchantId': this.id,
                // 'tag': key
            }).then(res => {
                let data = JSON.parse(JSON.stringify(res))
                if (data.length > 0) {
                    data.forEach(item => {
                        let key = item.type.code;
                        this.showFile[key] = {};
                        this.showFile[key] = {
                            ids: item.id,
                            img: item.filePath
                        };
                    });
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 图片删除
        imgDel(i, code) {
            if (i.length > 15) {
                postMerchantCertRemoveApi({ id: i }).then(res => {
                    if (res.success) {
                        this.$Message.success('操作成功！');
                        this.getImgList(code);
                        this.showFile[code] = {};
                    };

                }).catch(err => {
                    console.log(err);
                })
            } else {
                this.saveFile[code] = {};
                this.showFile[code] = {};
            }
        },
        // 上传文件
        beforeUploadFile(file, row) {
            file.ids = this.fileIds[row.code];
            this.showFile[row.code] = {
                ids: this.fileIds[row.code],
                img: window.URL.createObjectURL(file),
            };
            this.saveFile[row.code] = file;
            this.fileIds[row.code]++;
            return false;
        },
        visibleChange(key) {
            if (!key) {
                this.list = {};
            }
            this.$refs['formValidate'].resetFields();
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
    },
    beforeUnmount() {
        this.saveTime = null;
        this.saveFile = {};
    }
}
</script>

<style scoped lang='less'>
.list-main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .ivu-table-wrapper.ivu-table-wrapper-with-border {
        width: 100%;
        overflow: auto;
        margin: 10px 0 30px 0;

    }

    .top-search {
        width: 100%;
        padding: 10px 0 20px;
        display: flex;
        // justify-content: space-around;
        align-items: center;
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
        right: -1px;
        top: -1px;
        cursor: pointer;
    }

}

.ivu-menu-item {
    width: 50%;
    text-align: center;
}
</style>