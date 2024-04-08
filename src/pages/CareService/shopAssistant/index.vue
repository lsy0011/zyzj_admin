<template>
    <div class='shopAssistant'>
        <!-- <h5>店员管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="关爱服务管理" content="商家用户管理" hidden-breadcrumb />
        </div>
        <div class="shopAssistant_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>机构</strong>
                        <Select v-model="merchantId" placeholder="请选择机构" size="small" style="width:160px;">
                            <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>门店</strong>
                        <Select v-model="consume" placeholder="请选择门店" clearable size="small" style="width:160px; ">
                            <Option value="0001">暂时</Option>
                            <Option value="0003">不能</Option>
                            <Option value="0002">使用</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>关键字</strong>
                        <Input v-model="keywords" placeholder="请输入手机号/姓名等关键字" clearable size="small"
                            style="width: 160px;" />
                    </Space>
                    <Space>
                        <Button type="primary" size="small" @click="pageNumber = 1; getStaffPage();"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; keywords = ''; getStaffPage();">重置</Button>
                    </Space>
                </Space>
            </div>
            <Space size="large" style="margin-bottom: 15px;">
                <Space>
                    <Icon type="md-list" />
                    <strong style="font-size: 16px;">店员列表</strong>
                </Space>
                <Button type="primary" size="small" @click="details(false, true)">添加</Button>
            </Space>
            <Table border :columns="columns" :data="data" @on-selection-change="selectAll" :loading="loading">
                <template #action="{ row }">
                    <Button type="primary" style="margin-right: 10px;" ghost size="small" @click="setManager(row)"
                        v-if="!row.leader" title="每个商家只能有一个管理员">设为管理员</Button>
                    <Button type="primary" size="small" style="margin-right: 10px;"
                        @click="details(row.id, false)">编辑</Button>
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok="remove(row.id)">
                        <Button type="error" size="small" style="margin-right: 10px;">删除</Button>
                    </Poptip>
                    <!-- <Button size="small" style="margin: 10px 10px 0;">重置手机号</Button>
                    <Button size="small">重置密码</Button> -->
                </template>
            </Table>
            <div style="margin-top: 15px; ">
                <Button type="error" size="small" :disabled="selectMore.length == 0">批量删除</Button>
            </div>
            <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
        </div>
        <!-- 增加/编辑的弹框 -->
        <Modal v-model="flag" :title="modalTitle">
            <Form ref="addform" :model="addList" label-position="right" :rules="ruleValidate" :label-width="100">
                <FormItem label="机构选择" prop="merchantId">
                    <Select v-model="addList.merchantId" placeholder="请选择机构" clearable @on-change="modalAddMer">
                        <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="门店选择" prop="storeId">
                    <Select v-model="addList.storeId" multiple :disabled="addList.merchantId == ''" placeholder="请选择门店">
                        <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="店员姓名" prop="name">
                    <Input v-model="addList.name" placeholder="请输入内容"></Input>
                </FormItem>
                <!-- <FormItem label="职位">
                    <Input v-model="addList.type" type="number" placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem label="性别">
                    <Select v-model="addList.gender">
                        <Option value="male">男</Option>
                        <Option value="female">女</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="手机号" prop="mobile" v-if="editFlag">
                    <Input v-model="addList.mobile" type="number" maxlength="11" show-word-limit
                        placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="addList.email" placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem label="用户名">
                    <Input v-model="addList.username" placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="addList.remark" type="textarea" :rows="3" placeholder="请输入内容" />
                </FormItem>
            </Form>
            <p style="text-align: center;color: #ffa000;font-size: 16px;">手机号关联店员的核销中台账号,请确保填写正确!</p>
            <template #footer>
                <Button type="primary" @click="saveConfirmFn('addform')">确定</Button>
                <Button @click="flag = false;">取消</Button>
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
    postMerchantStaffSetLeaderApi,  // 设为管理员
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
                {
                    title: '门店',
                    width: '240',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                class: 'table_flow_auto',
                            }, {
                                default() {
                                    return params.row.stores.map(item => {
                                        return h('p', `${item.name}（${item.id.slice(-5)}）`)
                                    })
                                }
                            })
                        ])
                    }
                },
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
                    title: '是否管理员',
                    align: "center",
                    render: (h, params) => {
                        return h('p', params.row.leader ? '是' : '否')
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 245,
                    align: 'center',
                    // fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
            baseList: [],  // 机构列表
            storeList: [], // 门店列表
            merchantId: '65406cbdcb47603bbc08b5e1',  // 机构id
            keywords: "", //  关键字
            consume: '', // 门店
            modalTitle: '新增店员', // 弹窗的标题
            flag: false, // 弹窗的状态
            addList: {
                storeId: [],
                merchantId: '',
            },  // 添加的 信息
            selectMore: [],  // 修改多个的
            saveTime: null,
            ruleValidate: {
                name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                storeId: [{ required: true, message: '该项不能为空', trigger: 'change', type: 'array' }],
                merchantId: [{ required: true, message: '该项不能为空', trigger: 'change' }],
                mobile: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
            },
            editFlag: false,   // 区分编辑新增
        }
    },
    created() {
        this.getStaffPage();
        this.getBaseList();
    },
    methods: {
        // 店员列表
        getStaffPage() {
            this.loading = true
            let data = {
                merchantId: this.merchantId,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            }
            if (this.keywords != '') {
                data.keywords = this.keywords
            }
            getMerchantStaffPageApi(data)
                .then(res => {
                    // console.log(res);
                    this.total = res.totalElements
                    this.data = res.data
                    this.loading = false
                })
        },
        // 机构列表
        getBaseList() {
            getMerchantBasePageApi({
                biz: 'common',
                type: 'service',
                pageSize: 9999
            }).then(res => {
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
                type: 'service',
                merchantId: id,
                pageSize: 9999
            }
            getStoreInfoPageApi(data)
                .then(res => {
                    let data = res.data
                    data.forEach(item => {
                        item.label = item.name + `（${item.id.slice(-5)}）`
                        item.value = item.id
                    })
                    this.storeList = []
                    this.storeList = data
                    // console.log("🚀 ~ file: index.vue:241 ~ getStore ~ this.storeList:", this.storeList)
                })
        },
        // 设置管理员
        setManager(row) {
            let data = { id: row.id };
            postMerchantStaffSetLeaderApi(data).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功！')
                    this.getStaffPage();
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 删除
        remove(id) {
            postMerchantStaffRemovelApi({ id })
                .then(res => {
                    this.$Message.success('操作成功！');
                    this.getStaffPage();
                })
        },
        // 表格的复选框
        selectAll(selection) {
            this.selectMore = selection
        },
        // 添加时门店根据商家变
        modalAddMer(select) {
            this.getStore(select)
        },
        // 弹窗的方法👇
        // 编辑和添加
        // 编辑和添加
        details(id, flag) {
            this.editFlag = flag;
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
                    this.addList = {
                        id: res.id,
                        merchantId: res.merchant.id,
                        // gender: res.gender,
                        storeId: arr,
                        name: res.name ? res.name : '',
                        email: res.email ? res.email : '',
                        mobile: res.mobile ? res.mobile : '',
                        username: res.username ? res.username : '',
                        remark: res.remark ? res.remark : '',
                    }
                    this.flag = true
                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
            } else {
                this.modalTitle = '新增店员'
                this.addList = {
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
                this.flag = true
            }
        },
        // 弹框的确认,提交新增/编辑
        saveConfirmFn(formname) {
            this.$refs[formname].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let formData = new FormData();
                    formData.append('id', this.addList.id ? this.addList.id : '');
                    formData.append('merchantId', this.addList.merchantId ? this.addList.merchantId : '');
                    formData.append('name', this.addList.name ? this.addList.name : '');
                    // formData.append('gender', this.addList.gender ? this.addList.gender : '');
                    formData.append('username', this.addList.username ? this.addList.username : '');
                    formData.append('mobile', this.addList.mobile ? this.addList.mobile : '');
                    formData.append('email', this.addList.email ? this.addList.email : '');
                    formData.append('remark', this.addList.remark ? this.addList.remark : '');
                    formData.append('type', 'clerk');
                    if (this.addList.storeId.length > 0) {
                        this.addList.storeId.forEach(item => {
                            formData.append('storeId', item)
                        })
                    }
                    // formData.append('biz', 'common');
                    if (this.saveTime) {
                        this.$Message.warning('请勿重复提交');
                        clearTimeout(this.saveTime);
                    };
                    this.saveTime = setTimeout(() => {
                        getMerchantStaffSaveApi(formData, false).then((res) => {
                            let messageT = ''
                            messageT = this.modalTitle == '新增店员' ? '添加成功！' : '修改成功！'
                            if (res.id) {
                                this.$Message.success(messageT);
                                this.getStaffPage();
                                this.loading = false;
                                this.flag = false;
                                clearTimeout(this.saveTime);
                            }
                            // console.log(res);
                        }).catch((err) => {
                            this.loading = false
                            // console.log(err);
                        });
                    }, 500);

                } else {
                    this.$Message.error('请补充必填项！');
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
    },
    beforeUnmount() {
        this.saveTime = null;
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

:deep(.ivu-col-span-7) {
    font-weight: 600;
    text-align: right;
    padding: 0 15px 0 0;
    margin-bottom: 10px;
    line-height: 33px;
}

:deep(.ivu-col-span-10) {
    padding-top: 5px;
}
</style>