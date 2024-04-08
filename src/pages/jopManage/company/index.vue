<template>
    <div class='company'>
        <!-- <h5>企业管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="求职管理" content="企业管理" hidden-breadcrumb />
        </div>
        <div class="box">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <DatePicker type="date" size="small" v-model="search.timeCreatedBegin" placeholder="请选择日期时间"
                            style="width: 200px" />
                        <strong>至</strong>
                        <DatePicker type="date" size="small" v-model="search.timeCreatedEnd" placeholder="请选择日期时间"
                            style="width: 200px" />
                    </Space>
                    <Space>
                        <strong>状态</strong>
                        <Select size="small" v-model="search.status" placeholder="请选择">
                            <Option value="enabled">启用</Option>
                            <Option value="disabled">禁用</Option>
                        </Select>
                    </Space>
                    <Space>
                        <Input v-model="search.keywords" placeholder="请输入企业名、信用码等关键词" size="small"
                            v-width="240"></Input>
                        <Button type="primary" size="small"
                            @click="pageNumber = 1; showBox = 0; getMerList()">查询</Button>
                        <Button size="small" @click="pageNumber = 1; showBox = 0; search = {}; getMerList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_main">
                <div class="table_title">
                    <Space size="large" wrap>
                        <strong>
                            <Icon type="md-list"></Icon>
                            企业列表
                        </strong>
                        <Button :class="{ 'btn_border': showBox == 0 }" @click="showBox = 0; getMerList()">全部</Button>
                        <Button :class="{ 'btn_border': showBox == 1 }" @click="showBox = 1; getMerList()">待审核</Button>
                        <Button :class="{ 'btn_border': showBox == 2 }" @click="showBox = 2; getMerList()">未通过</Button>
                        <Button :class="{ 'btn_border': showBox == 3 }" @click="showBox = 3; getMerList()">已通过</Button>
                        <Button type="primary" @click="addModal = true;">添加</Button>
                    </Space>
                </div>
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #stateSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(v) => changeStatusFn(v, row)"></Switch>
                    </template>
                    <template #actionSlot="{ row }">
                        <div v-show="row.approvalInfo.state.code == 'wait'">
                            <Button size="small" type="success" v-margin="5"
                                @click="auditList = { state: 'success', id: row.id }; auditModal = true;">审核通过</Button>
                            <Button size="small" type="warning" v-margin="5"
                                @click="auditList = { state: 'reject', id: row.id }; auditModal = true;">驳回</Button>
                        </div>
                        <Button size="small" type="primary" v-margin="5" @click="merEditFn(row)">编辑</Button>
                        <Button size="small" type="info" v-margin="5"
                            @click="lookList = row; getMerFileFn(row.id); modal = true;">查看</Button>
                    </template>
                </Table>
            </div>
            <div class="foot_page">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]"
                    @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <!-- 详情 -->
        <Modal v-model="modal" title="企业申请详情" @on-visible-change="visibleChangeFn">
            <Form label-position="right" :label-width="120">
                <FormItem label="公司名称：">{{ lookList.name || '未填写' }}</FormItem>
                <FormItem label="统一信用码：">{{ lookList.creditCode || '未填写' }}</FormItem>
                <FormItem label="注册地址：">
                    {{ lookList.region && lookList.region.extra ? lookList.region.extra.namePath.join('/') : '未填写' }}
                </FormItem>
                <FormItem label="详细地址：">{{ lookList.address || '' }}</FormItem>
                <FormItem label="法人姓名：">{{ lookList.lpName || '未填写' }}</FormItem>
                <FormItem label="法人身份证：">{{ lookList.lpIdNo || '未填写' }}</FormItem>
                <FormItem label="联系人姓名：">{{ lookList.linkman || '未填写' }}</FormItem>
                <!-- <FormItem label="职位：">经理 -- - </FormItem> -->
                <FormItem label="联系电话：">{{ lookList.linkmanTel || '未填写' }}</FormItem>
                <FormItem label="发布职位数："> --19-- </FormItem>
            </Form>
            <div class="img_box">
                <div v-for="(item, index) in uploadList" :key="index">
                    <div class="demo-upload-list">
                        <Image :src="item.url" fit="cover" width="100%" height="100%" />
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView(item.url)"></Icon>
                            <!-- <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon> -->
                        </div>
                    </div>
                    <p style="text-align: center;">{{ item.name }}</p>
                </div>
            </div>
        </Modal>
        <!-- 添加 -->
        <Modal v-model="addModal" title="添加企业" @on-visible-change="visibleChangeFn">
            <Form ref="addForm" :model="list" label-position="right" :label-width="100" :rules="ruleValidate">
                <FormItem label="公司名称" prop="name">
                    <Input v-model="list.name" placeholder="请输入公司名称"></Input>
                </FormItem>
                <FormItem label="注册手机号" prop="tel">
                    <Input v-model="list.tel" placeholder="请输入手机号" type="number" maxlength="11" show-word-limit></Input>
                </FormItem>
                <FormItem label="统一信用码" prop="creditCode">
                    <Input v-model="list.creditCode" placeholder="请输入统一信用代码"></Input>
                </FormItem>
                <FormItem label="地区" prop="regionId">
                    <TreeSelect v-model="list.regionId" :data="areaTree" placeholder="请选择地区" />
                </FormItem>
                <FormItem label="注册地址" prop="address">
                    <Input v-model="list.address" placeholder="请输入注册详细地址"></Input>
                </FormItem>
                <FormItem label="法人姓名" prop="lpName">
                    <Input v-model="list.lpName" placeholder="请输入法人姓名"></Input>
                </FormItem>
                <FormItem label="法人身份证" prop="lpIdNo">
                    <Input v-model="list.lpIdNo" placeholder="请输入法人身份证号" type="number" maxlength="18"
                        show-word-limit></Input>
                </FormItem>
                <FormItem label="联系人姓名" prop="linkman">
                    <Input v-model="list.linkman" placeholder="请输入联系人姓名"></Input>
                </FormItem>
                <!-- <FormItem label="职位">
                    <Input v-model="list.posts"></Input>
                </FormItem> -->
                <FormItem label="联系电话" prop="linkmanTel">
                    <Input v-model="list.linkmanTel" placeholder="请输入联系电话" type="number" maxlength="11"
                        show-word-limit></Input>
                </FormItem>
                <!-- <FormItem label="材料"> -->
                <div class="form_img_box">
                    <div v-for="(item, index) in uploadList" :key="index">
                        <div class="demo-upload-list">
                            <template v-if="item.url !== ''">
                                <Image :src="item.url" fit="cover" width="100%" height="100%" />
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" @click="handleRemove(item, index)"></Icon>
                                </div>
                            </template>
                            <template v-else>

                                <Upload ref="upload" :show-upload-list="false" :format="['jpg', 'jpeg', 'png']"
                                    :max-size="2048" :before-upload="(file) => handleBeforeUpload(file, index)" multiple
                                    type="drag" action="" style="display: inline-block;width:156px;">
                                    <div style="width: 156px;height:154px;line-height: 156px;">
                                        <Icon type="ios-camera" size="20"></Icon>
                                    </div>
                                </Upload>
                            </template>
                        </div>
                        <p style="text-align: center;">{{ item.name }}</p>
                    </div>
                </div>
                <!-- </FormItem> -->
            </Form>
            <template #footer>
                <Button type="primary" :loading="btnLoading" @click="saveMerFn('addForm')">确定</Button>
                <Button @clcik="modal = false;">取消</Button>
            </template>
        </Modal>

        <Modal v-model="auditModal" title="审核" width="360">
            <Input v-model="auditList.remark" type="textarea" :rows="4" placeholder="请填写审核备注" />
            <template #footer>
                <Button type="primary" :disabled="!auditList.remark" @click="auditSaveFn()">确认</Button>
                <Button @click="auditModal = false;">取消</Button>
            </template>
        </Modal>

        <ImagePreview v-model="visible" :preview-list="[imgName]" />
    </div>
</template>
<script>
import {
    getAreaTreeApi, // 地区
    getMerchantBasePageApi, // 机构列表
    postMerchantBaseRemoveApi, // 机构删除
    postMerchantBaseStatusApi,  // 机构状态
    getMerchantBaseDetailApi,  // 机构详情
    getMerchantBaseSaveApi, // 编辑/新建机构保存
    postMerchantBaseApprovalApi,    // 审核

    getSysDictItemTreeApi,   // 字典

    getMerchantCertListApi,  // 资质列表
    getMerchantCertSaveApi,  // 资质保存
    postMerchantCertRemoveApi,  // 资质删除
} from '@/api/account';
import { jsonToArea } from "@/libs/util.js"
export default {
    name: 'company',
    data() {
        return {
            columns: [
                {
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '注册时间',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '企业名称',
                    minWidth: 180,
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '统一信用码',
                    width: 220,
                    align: 'center',
                    key: 'creditCode',
                },
                {
                    title: '注册地址',
                    minWidth: 220,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.region && params.row.region.extra && params.row.region.extra.namePath ? params.row.region.extra.namePath.join(' / ') : "---")
                    }
                },
                {
                    title: '详细地址',
                    minWidth: 240,
                    align: 'center',
                    key: 'address'
                },
                {
                    title: '法人姓名',
                    width: 160,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.lpName ? params.row.lpName : "待上传")
                    }
                },
                {
                    title: '法人身份证',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.lpIdNo ? params.row.lpIdNo : "待上传")
                    }
                },
                {
                    title: '联系人',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.linkman ? params.row.linkman : "待上传")
                    }
                },
                // {
                //     title: '职位',
                //     width: 90,
                //     align: 'center',
                //     key: 'posts'
                // },
                {
                    title: '联系电话',
                    width: 130,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.linkmanTel ? params.row.linkmanTel : "待上传")
                    }
                },
                {
                    title: '审核状态',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.approvalInfo && params.row.approvalInfo.state ? params.row.approvalInfo.state.name : '---')
                    }
                },
                {
                    title: '审核备注',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.approvalInfo ? params.row.approvalInfo.approveResult ? params.row.approvalInfo.approveResult : '---' : '---')
                    }
                },
                {
                    title: '状态',
                    width: 80,
                    align: 'center',
                    slot: 'stateSlot',
                    fixed: 'right',
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    fixed: 'right',
                    width: 200,
                    align: 'center'
                }
            ],
            data: [],
            loading: false,
            btnLoading: false,
            pageNumber: 1,
            pageSize: 10,
            total: '',
            modal: false,
            addModal: false,
            auditModal: false,
            search: {},
            list: {},   // 添加
            lookList: {},   // 查看
            auditList: {},   // 审核
            showBox: 0,   // 边框

            areaTree: [],   // 地区树

            uploadList: [
                // { name: '营业执照', code: 'license', file: '', url: '' },
                // { name: '法人身份证正面', code: 'idA', file: '', url: '' },
                // { name: '法人身份证背面', code: 'idB', file: '', url: '' },
            ],   // 上传图片
            oldUploadList: [],   // 查看图片
            imgName: '',
            visible: false,

            ruleValidate: {
                name: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                creditCode: [
                    { required: true, message: '请输入统一信用码', trigger: 'blur' }
                ],
                regionId: [
                    { required: true, message: '请选择地区', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ],
                lpName: [
                    { required: true, message: '请输入法人姓名', trigger: 'blur' }
                ],
                lpIdNo: [
                    { required: true, message: '请输入法人证件号', trigger: 'blur' }
                ],
                linkman: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                ],
                linkmanTel: [
                    { required: true, message: '请输入联系人电话', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.getAreaTree();
        this.getMerList();
        this.getDictList();
    },
    methods: {
        // 获取需要字典
        getDictList() {
            getSysDictItemTreeApi({ dict: 'mer_cert_enterprise' }).then(res => {
                res.forEach((item,) => {
                    this.uploadList.push({
                        id: '',
                        name: item.name,
                        code: item.code,
                        file: '',
                        url: '',
                    })
                });
                this.oldUploadList = JSON.parse(JSON.stringify(this.uploadList));
            })
        },
        // 获取地区
        getAreaTree() {
            getAreaTreeApi().then(res => {
                this.areaTree = jsonToArea(res, 'code', false)
            })
        },
        // 获取企业    
        getMerList() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'recruit',
                type: 'Enterprise'
            };

            switch (this.showBox) {
                case 0:
                    data.approvalInfo = '';
                    break;
                case 1:
                    data.approvalInfo = 'wait,underway';
                    break;
                case 2:
                    data.approvalInfo = 'reject';
                    break;
                case 3:
                    data.approvalInfo = 'success';
                    break;

                default:
                    break;
            }

            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (key == 'timeCreatedBegin' || key == 'timeCreatedEnd') {
                        data[key] = element ? this.$Date(element).format('YYYY-MM-DD') : '';
                    } else {
                        data[key] = element;
                    };
                };
            };

            this.loading = true;
            getMerchantBasePageApi(data).then(res => {
                this.data = res.data;
                this.total = res.totalElements;
                this.loading = false;
            })
        },
        // 编辑
        merEditFn(row) {
            if (row.id) {

                getMerchantBaseDetailApi(row.id).then(res => {
                    // console.log("🚀  getMerchantBaseDetailApi  res:", res);

                    this.list = {
                        id: res.id,
                        name: res.name || '',
                        creditCode: res.creditCode || '',
                        regionId: res.region ? res.region.code : '',
                        address: res.address || '',
                        lpName: res.lpName || '',
                        lpIdNo: res.lpIdNo || '',
                        linkman: res.linkman || '',
                        linkmanTel: res.linkmanTel || '',
                    };
                    this.addModal = true;
                    this.getMerFileFn(res.id);
                })
            } else {
                this.list = {};
                this.addModal = true;
            }
        },
        // 编辑保存
        saveMerFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    let formData = new FormData();
                    formData.append('biz', 'recruit');
                    formData.append('type', ' Enterprise');
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (element) formData.append(key, element);
                        }
                    }
                    this.btnLoading = true;
                    getMerchantBaseSaveApi(formData, false).then(res => {

                        this.$Message.success('添加成功！');
                        this.saveMerFileFn(res.id);
                        this.getMerList();
                        this.addModal = false;
                        this.btnLoading = false;
                    }).catch(err => {
                        this.$Message.error('操作失败，请稍后重试');
                        this.btnLoading = false;
                        this.addModal = false;
                        this.getMerList();
                    })

                } else {
                    this.$Message.error('请先补充必填项 !');
                }
            })
        },
        // 审核保存
        auditSaveFn() {
            postMerchantBaseApprovalApi(this.auditList).then(res => {
                this.auditModal = false;
                this.getMerList();
                this.$Message.success('审核成功！')
            })
        },
        // 修改状态
        changeStatusFn(v, row) {

            postMerchantBaseStatusApi({ value: v, id: row.id }).then(res => {
                if (res) {
                    this.$Message.success('操作成功！');
                    this.getMerList();
                }
            })
        },


        // 资质操作 
        // 获取资质
        getMerFileFn(id) {
            getMerchantCertListApi({ 'merchantId': id, }).then(res => {

                this.uploadList.forEach(item => {
                    res.forEach(itm => {
                        if (item.code === itm.type.code) {
                            item.url = itm.filePath;
                            item.id = itm.id;
                        }
                    })
                })

            })
        },
        // 保存
        saveMerFileFn(id) {
            this.uploadList.forEach(item => {
                if (item.file) {
                    let formData = new FormData();
                    formData.append('merchantId', id);
                    formData.append('typeCode', item.code);
                    formData.append('name', item.name);
                    formData.append('file', item.file);

                    getMerchantCertSaveApi(formData, false).then(res => {

                        this.$Message.success('资质补充成功！')

                    })
                }
            })
        },
        // 删除
        handleRemove(item, index) {
            if (item.id) {
                postMerchantCertRemoveApi({ id: item.id }).then(res => {
                    if (res.success) {
                        this.$Message.success('操作成功！');
                        this.showFile[code] = {};
                    };
                }).catch(err => {
                    this.getMerFileFn(this.list.id);
                    this.uploadList[index].url = '';
                    this.uploadList[index].file = '';
                })
            } else {
                this.uploadList[index].url = '';
                this.uploadList[index].file = '';
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

        handleView(name) {
            this.imgName = name;
            this.visible = true;
        },

        // 上传
        handleBeforeUpload(file, index) {

            this.uploadList[index].url = window.URL.createObjectURL(file);
            this.uploadList[index].file = file;

            return false;
        },
        visibleChangeFn(flag) {
            if (!flag) {
                this.lookList = {};
                this.uploadList = JSON.parse(JSON.stringify(this.oldUploadList));
            }
            this.$refs['addForm'].resetFields();
        },
    }
}
</script>
<style scoped lang='less'>
.box {
    margin-top: 24px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
}

.search_top {
    margin-bottom: 20px;
    text-align: center;
}

.table_title {
    margin-bottom: 15px;
    font-size: 16px;

    .btn_border {
        border: 2px solid #58a3f3;
        border-radius: 3px;
        color: #58a3f3;
        font-weight: 600;
    }
}

.foot_page {
    margin-top: 20px;
}

.img_box {
    display: flex;
    flex-wrap: nowrap;


    .demo-upload-list {
        display: inline-block;
        width: 158px;
        height: 158px;
        text-align: center;
        line-height: 158px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
}

.form_img_box {
    display: flex;
    flex-wrap: nowrap;


    .demo-upload-list {
        display: inline-block;
        width: 158px;
        height: 158px;
        text-align: center;
        line-height: 158px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;

        p {
            line-height: 1px;
        }
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        // display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
}
</style>