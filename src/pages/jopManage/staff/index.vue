<template>
    <div class='staff'>
        <!-- <h5>企业管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="求职管理" content="员工管理" hidden-breadcrumb />
        </div>
        <div class="box">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>企业</strong>
                        <Select v-model="search.merchantId" filterable :remote-method="remoteMethodMerFn"
                            :loading="merLoading" size="small" v-width="200">
                            <Option v-for="(item, index) in merList" :key="item.id" :value="item.id">{{ item.name }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <Input v-model="search.keywords" placeholder="请输入姓名、联系电话等关键词" size="small"
                            v-width="280"></Input>
                        <Button type="primary" size="small" @click="pageNumber = 1; getStaffListFn()">查询</Button>
                        <Button size="small" @click="search = {}; pageNumber = 1; getStaffListFn()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_main">
                <div class="table_title">
                    <Space size="large" wrap>
                        <strong>
                            <Icon type="md-list"></Icon>
                            员工列表
                        </strong>
                        <Button type="primary" @click="staffEditFn(false)">添加</Button>
                    </Space>
                </div>
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #stateSlot="{ }">
                        <Switch></Switch>
                    </template>
                    <template #actionSlot="{ row }">
                        <!-- <Button size="small" type="primary" ghost v-margin="5">设为管理员</Button> -->
                        <Button size="small" type="primary" v-margin="5" @click="staffEditFn(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="staffDelFn(row)">
                            <Button size="small" type="error" v-margin="5">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </div>
            <div class="foot_page">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]"
                    @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <!-- 添加 -->
        <Modal v-model="modal" title="添加员工" @on-visible-change="visibleChangeFn">
            <Form ref="form" :model="list" label-position="right" :label-width="100" :rules="ruleValidate">
                <FormItem label="企业" prop="merchantId">
                    <Select v-model="list.merchantId" filterable :remote-method="remoteMethodMerFn"
                        :loading="merLoading">
                        <Option v-for="(item, index) in merList" :key="item.id" :value="item.id">{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="员工名" prop="name">
                    <Input v-model="list.name" placeholder="请输入姓名"></Input>
                </FormItem>
                <FormItem label="用户名" prop="username">
                    <Input v-model="list.username" placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="职位" prop="type">
                    <Select v-model="list.type" placeholder="请选择职位">
                        <Option value="hr">招聘经理</Option>
                        <Option value="clerk">员工/店员</Option>
                    </Select>
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                    <Input v-model="list.mobile" placeholder="请输入手机号" type="number" maxlength="11"
                        show-word-limit></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="list.email" placeholder="请输入邮箱"></Input>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="list.remark" type="textarea" :rows="4"></Input>
                </FormItem>

            </Form>
            <template #footer>
                <Button type="primary" @click="saveStaffFn('form')">确定</Button>
                <Button @click="modal = false;">取消</Button>
            </template>
        </Modal>
        <Modal v-model="openModal" width="300" :closable="false" :mask-closable="false">
            <Select v-model="openMerId" @on-select="onOpenSelectFn">
                <Option v-for="(item, index) in openMerList" :key="item.id" :value="item.id">
                    {{ item.name }}
                </Option>
            </Select>
            <template #footer>
                <div></div>
            </template>
        </Modal>
    </div>
</template>
<script>

import {
    getMerchantStaffPageApi, // 店员列表  
    getMerchantStaffDetailApi, // 店员详情  
    getMerchantStaffSaveApi,  // 店员保存
    getMerchantBasePageApi, // 机构列表
    postMerchantStaffRemovelApi, // 店员删除
    postMerchantStaffSetLeaderApi,   // 将店员设为管理员
} from '@api/account.js';

export default {
    name: 'staff',
    data() {
        return {
            columns: [
                // {
                //     width: 60,
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', params.index + 1)
                //     }
                // },
                {
                    title: '注册时间',
                    width: 260,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '企业名称',
                    minWidth: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.merchant ? params.row.merchant.name : '---')
                    }
                },
                {
                    title: '员工ID',
                    width: 260,
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '姓名',
                    width: 140,
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '职位',
                    minWidth: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.type ? params.row.type.name : '---')
                    }
                },
                {
                    title: '手机号',
                    minWidth: 160,
                    align: 'center',
                    key: 'mobile'
                },
                {
                    title: '邮箱',
                    minWidth: 160,
                    align: 'center',
                    key: 'email'
                },
                // {
                //     title: '状态',
                //     width: 80,
                //     align: 'center',
                //     slot: 'stateSlot'
                // },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    flex: 'right',
                    width: 260,
                    align: 'center'
                }
            ],
            data: [],
            loading: false,
            modal: false,
            pageNumber: 1,
            pageSize: 10,
            total: '',
            openModal: true,
            openMerList: [],

            list: {},   // 添加 
            search: {
                merchantId: ''
            },

            merList: [],
            merLoading: false,
            merTime: null,

            ruleValidate: {
                merchantId: [
                    { required: true, message: '请选择企业', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入员工姓名', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择职位', trigger: 'change' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '电子邮件格式不正确', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        let merId = sessionStorage.getItem('merchantId');
        // console.log("🚀  created  merId:", merId);
        if (merId) {
            this.search.merchantId = merId;
            this.openModal = false;
            this.getStaffListFn();
        } else {
            this.openModal = true;
        }

        getMerchantBasePageApi({
            pageSize: 9999,
            biz: 'recruit',
            type: 'Enterprise',
        }).then(res => {
            this.openMerList = res.data;
            this.merList = JSON.parse(JSON.stringify(this.openMerList));
        })
    },
    methods: {

        // 员工列表
        getStaffListFn() {
            this.loading = true;
            let merId = sessionStorage.getItem('merchantId');
            if (merId) {
                this.openModal = false;
            } else {
                this.openModal = true;
            }
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                merchantId: merId,
                ...this.search,
            };

            getMerchantStaffPageApi(data).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;
            })
        },
        // 编辑
        staffEditFn(row) {
            if (row) {

                getMerchantStaffDetailApi(row.id).then(res => {

                    this.list = {
                        id: res.id,
                        name: res.name,
                        username: res.username || '',
                        mobile: res.mobile || '',
                        email: res.email || '',
                        merchantId: res.merchant ? res.merchant.id : '',
                        type: res.type ? res.type.code : '',
                        remark: res.remark || '',
                    };
                    this.modal = true;
                    this.merList = [res.merchant]
                })
            } else {
                this.list = {};
                this.modal = true;
            }
        },
        // 添加保存
        saveStaffFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    let formData = new FormData()
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            formData.append(key, element || '');
                        }
                    };
                    getMerchantStaffSaveApi(formData, false).then(res => {

                        if (res.id) {
                            this.$Message.success('添加成功！');
                            this.modal = false;
                            this.getStaffListFn();
                        }

                    })

                } else {
                    this.$Message.error('请先补充必填项 !');
                }
            })
        },
        // 员工删除
        staffDelFn(row) {

            postMerchantStaffRemovelApi({ id: row.id }).then(res => {
                this.$Message.success('操作成功！');
                this.getStaffListFn();
            }).catch(err => {
                this.$Message.error('操作失败，请稍后重试 ！');
                this.getStaffListFn();
            })
        },

        // 模糊机构
        remoteMethodMerFn(keywords) {
            if (keywords !== '' && keywords.length != 24) {
                this.merLoading = true;

                if (this.merTime) {
                    clearTimeout(this.merTime)
                }

                this.merTime = setTimeout(() => {

                    getMerchantBasePageApi({
                        pageSize: 9999,
                        biz: 'recruit',
                        type: 'Enterprise',
                        keywords
                    }).then(res => {
                        this.merLoading = false;
                        res.data.forEach(item => {
                            item.value = item.name;
                        })
                        this.merList = res.data;
                    })

                }, 200);
            } else {
                this.merList = [];
            }
        },
        visibleChangeFn(flag) {
            this.$refs['form'].resetFields();
        },
        onOpenSelectFn(v) {

            sessionStorage.setItem('merchantId', v.value);
            this.search.merchantId = v.value;
            this.openModal = false;
            this.getStaffListFn();

        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getStaffListFn();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getStaffListFn();
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
}

.foot_page {
    margin-top: 20px;
}
</style>