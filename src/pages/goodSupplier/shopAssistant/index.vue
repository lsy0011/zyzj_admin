<template>
    <div class='shopAssistant'>
        <!-- <h5>店员管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="商品供应商管理" content="商家用户管理" hidden-breadcrumb />
        </div>
        <div class="shopAssistant_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>机构</strong>
                        <Select v-model="search.merchantId" placeholder="请选择机构" size="small"
                            style="width:160px;margin-right: 10px;">
                            <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </Space>
                    <!-- <Space>
                    <strong>门店</strong>
                    <Select v-model="consume" placeholder="请选择门店" clearable size="small"
                        style="width:160px;margin-right: 10px; ">
                        <Option value="0001">暂时</Option>
                        <Option value="0003">不能</Option>
                        <Option value="0002">使用</Option>
                    </Select>
                </Space> -->
                    <Space>
                        <strong>关键字</strong>
                        <Input v-model="search.keywords" placeholder="请输入手机号/姓名等关键字" clearable size="small"
                            style="width: 160px;" />
                    </Space>
                    <Space>
                        <Button type="primary" size="small" @click="pageNumber = 1; getStaffPage()"> 查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; search = { merchantId: '64b8e2f8cb66253803593c53' }; getStaffPage()">重置</Button>
                    </Space>
                </Space>
            </div>
            <Space size="large" style="margin-bottom: 15px;">
                <Space>
                    <Icon type="md-list" />
                    <strong v-font="16"> 店员列表</strong>
                </Space>
                <Button type="primary" size="small" @click="detailsFn(false, 'listName')">添加</Button>
            </Space>
            <Table border :columns="columns" :data="data" @on-selection-change="selectAll" :loading="loading">
                <template #actionSlot="{ row }">
                    <Space>
                        <Button type="primary" ghost size="small" v-show="!row.leader" @click="setManager(row)"
                            title="每个商家只能有一个管理员">设为管理员</Button>
                        <Button type="primary" size="small" @click="detailsFn(row.id, 'listName')">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn(row.id)">
                            <Button type="error" size="small">删除</Button>
                        </Poptip>
                    </Space>
                </template>
            </Table>
            <div style="margin-top: 15px; ">
                <Button type="error" size="small" :disabled="allShopId <= 0">批量删除</Button>
            </div>
            <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
        </div>
        <!-- 增加/编辑的弹框 -->
        <Modal class-name="vertical-center-modal" v-model="modal" :title="modalTitle">
            <Form ref="listName" :model="list" label-position="right" :rules="ruleValidate" :label-width="120">
                <FormItem label="机构选择：" prop="merchantId">
                    <Select v-model="list.merchantId" placeholder="请输入机构名关键字" clearable @on-change="getStore">
                        <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="门店选择">
                    <Select v-model="list.storeId" multiple placeholder="请选择门店">
                        <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem> -->
                <FormItem label="店员姓名：" prop="name">
                    <Input v-model="list.name" placeholder="请输入店员姓名"></Input>
                </FormItem>
                <FormItem label="用户名：" prop="username">
                    <Input v-model="list.username" placeholder="请输入用户名"></Input>
                </FormItem>
                <!-- <FormItem label="职位">
                    <Input v-model="list.type" type="number" placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem label="性别">
                    <Select v-model="list.gender">
                        <Option value="male">男</Option>
                        <Option value="female">女</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="手机号：" prop="mobile">
                    <Input v-model="list.mobile" type="number" placeholder="请输入手机号" maxlength="11"
                        show-word-limit></Input>
                </FormItem>
                <FormItem label="邮箱：" prop="email">
                    <Input v-model="list.email" placeholder="请输入邮箱"></Input>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="list.remark" type="textarea" :rows="3" placeholder="请输入备注" />
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="saveStaffFn('listName')"> 确认 </Button>
                <Button @click="modal = false; list = {}"> 取消 </Button>
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
    getStoreInfoPageApi, // 门店列表
    postMerchantStaffRemovelApi, // 店员删除
    postMerchantStaffSetLeaderApi,   // 将店员设为管理员
} from '@api/account.js'
export default {
    name: 'shopAssistant',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '机构',
                    // key: 'name',
                    align: "center",
                    render: (h, params) => {
                        return h('p', params.row.merchant.name)
                    }
                },
                // {
                //     title: '门店',
                //     width: '240',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', [
                //             h('div', {
                //                 class: 'table_flow_auto',
                //             }, {
                //                 default() {
                //                     return params.row.stores.map(item => {
                //                         return h('p', `${item.name}，`)
                //                     })
                //                 }
                //             })
                //         ])
                //     }
                // },
                {
                    title: '店员ID',
                    key: 'id',
                    align: "center"
                },
                {
                    title: '姓名',
                    key: 'name',
                    align: "center"
                },
                {
                    title: '手机号',
                    key: 'mobile',
                    align: "center"
                },
                {
                    title: '职位',
                    align: "center",
                    render: (h, params) => {
                        return h('p', params.row.type.name)
                    }
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 260,
                    align: 'center',
                    // fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
            baseList: [],  // 机构列表
            storeList: [], // 门店列表
            search: {
                merchantId: '64b8e2f8cb66253803593c53'
            },   // 查询
            modalTitle: '新增店员', // 弹窗的标题
            modal: false, // 弹窗的状态
            list: {
                storeId: [],
                merchantId: '',
            },  // 添加的 信息
            allShopId: [],  // 批量id

            ruleValidate: {
                merchantId: [
                    { required: true, message: '请选择机构', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' },
                    { type: 'string', max: 11, message: '请输入正确的联系方式', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.getStaffPage();
        this.getBaseList();
    },
    methods: {
        // 店员列表
        getStaffPage() {
            this.loading = true;
            let data = {};
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    data[key] = element;
                }
            }
            getMerchantStaffPageApi(data)
                .then(res => {
                    // console.log(res);
                    this.total = res.totalElements;
                    this.data = res.data;
                    this.loading = false;
                })
        },
        // 机构列表
        getBaseList() {
            getMerchantBasePageApi({ biz: 'common', type: 'supplier' }).then(res => {
                let data = res.data
                data.forEach(item => {
                    item.label = item.name
                    item.value = item.id
                })
                this.baseList = []
                this.baseList = data
            })
        },
        // 获取门店列表
        getStore(id = '') {
            let data = {
                biz: 'common',
                type: 'supplier',
                merchantId: id
            }
            getStoreInfoPageApi(data)
                .then(res => {
                    let data = res.data
                    data.forEach(item => {
                        item.label = item.name
                        item.value = item.id
                    })
                    this.storeList = [];
                    this.storeList = data;
                })
        },
        // 删除
        removeFn(id) {
            postMerchantStaffRemovelApi({ id })
                .then(res => {
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getStaffPage();
                    }
                })
        },
        // 设置管理员
        setManager(row) {
            let data = { id: row.id };
            postMerchantStaffSetLeaderApi(data).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功！')
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 表格的复选框
        selectAll(selection) {
            this.allShopId = []
            selection.forEach(item => {
                this.allShopId.push(item.id)
            })
        },
        // 弹窗的方法👇
        // 编辑和添加
        // 编辑和添加
        detailsFn(id, name) {
            this.$refs[name].resetFields();
            if (id) {
                getMerchantStaffDetailApi(id).then(res => {
                    this.loading = false;
                    this.modalTitle = '编辑店员'
                    this.getStore(res.merchant.id)
                    let arr = [];
                    if (res.stores.length > 0) {
                        arr = res.stores.map(item => {
                            return item.id
                        })
                    }
                    this.list = {
                        id: res.id,
                        merchantId: res.merchant.id,
                        // gender: res.gender,
                        storeId: arr,
                        name: res.name,
                        email: res.email,
                        mobile: res.mobile,
                        username: res.username ? res.username : '',
                        remark: res.remark,
                    }
                    this.modal = true
                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
            } else {
                this.modalTitle = '新增店员'
                this.list = {
                    id: '',
                    merchantId: '',
                    // gender: '',
                    storeId: '',
                    name: '',
                    email: '',
                    mobile: '',
                    username: '',
                    remark: '',
                }
                this.state = false
                this.modal = true
            }
        },
        // 弹框的确认,提交新增/编辑
        saveStaffFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    this.loading = true;
                    let formData = new FormData();
                    formData.append('type', 'clerk');
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (Array.isArray(element)) {
                                element.forEach(item => {
                                    formData.append(key, item);
                                })
                            } else {
                                formData.append(key, element)
                            }
                        }
                    }

                    // // formData.append('gender', this.list.gender ? this.list.gender : '');
                    // // formData.append('storeId', this.list.storeId ? this.list.storeId : '');

                    getMerchantStaffSaveApi(formData, false).then((res) => {
                        if (res.name) {
                            let messageT = ''
                            messageT = this.modalTitle == '新增店员' ? '添加成功！' : '修改成功！'
                            this.$Message.success(messageT);
                            this.getStaffPage()
                            this.loading = false;
                            this.modal = false;
                        }
                    }).catch((err) => {
                        this.loading = false
                        // console.log(err);
                    });

                } else {
                    this.$Message.error('请先补充必填项 !');
                }
            })
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getStaffPage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getStaffPage();
        },
    }
}
</script>
<style scoped lang='less'>
.shopAssistant_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .search_top {
        width: 100%;
        padding: 10px 0 20px;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-around;
        align-items: center;

    }



    :deep(.ivu-page.mini) {
        margin-top: 20px;
    }

    :deep(.ivu-city-rel) {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

    }
}

:deep(.ivu-col-span-7) {
    font-weight: 600;
    text-align: right;
    padding: 0 15px 0 0;
    margin-bottom: 10px;
    line-height: 33px;
}

:deep(.table_flow_auto) {
    min-height: 80px;
    max-height: 110px;
    overflow: auto;

    /* 设置滚动条的样式 */
    &::-webkit-scrollbar {
        width: 5px;
        border-radius: 8px;
    }

    /* 滚动槽 */
    &::-webkit-scrollbar-track {
        /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
        background-color: #f3f3f3;
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background: #e2e2e2;
        /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
    }
}

:deep(.ivu-col-span-10) {
    padding-top: 5px;
}
</style>