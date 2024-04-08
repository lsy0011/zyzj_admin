<template>
    <div class='supplierlist'>
        <!-- <h5>供应商列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="药品供应商管理" content="供应商列表" hidden-breadcrumb />
        </div>
        <div class="list-main">
            <div class="top-search">
                <!-- <div class="search-button"> -->
                <Space size="large" wrap>
                    <Space>
                        起止时间
                        <DatePicker type="date" placeholder="开始时间" style="width: 200px" size="small" />
                        至
                        <DatePicker type="date" placeholder="截止时间" style="width: 200px" size="small" />
                    </Space>
                    <Space>
                        城市
                        <TreeSelect v-model="search.regionId" :data="areaTree" style="width: 120px" size="small" />
                    </Space>
                    <Input v-model="search.keywords" placeholder="请输入手机号、姓名、商品等关键词" size="small" clearable
                        style="width: 260px;" />
                    <!-- </div> -->
                    <Space>
                        <Button type="primary" size="small" @click="pageNumber = 1; getList()"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}; getList()"> 重置</Button>
                    </Space>
                </Space>
            </div>
            <Space size="large">
                <Space style="font-size: 16px;">
                    <Icon type="md-list"></Icon>
                    <strong>供应商列表</strong>
                </Space>
                <Button @click="addSupplierFn()" size="small" type="primary">添加</Button>
            </Space>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #nullSlot>
                    <p> --- </p>
                </template>
                <template #extraSlot="{ row }">
                    <div v-if="row.region">
                        <p>
                            {{ row.region.extra && row.region.extra.namePath.length > 0 ? row.region.extra.namePath.join() :
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

                    <template v-if="row.fzChannel && row.fzChannel.code == 'unknown'">
                        <Button size="small" style="margin-right: 10px;" @click="editInfoFn(row)" type="info">分账信息</Button>
                    </template>

                    <Button size="small" style="margin-right: 10px;" @click="addSupplierFn(row)" type="primary">编辑</Button>
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok=" removeFn(row)">
                        <Button size="small" type="error" v-show="row.status.code != 'enabled'">删除</Button>
                    </Poptip>
                </template>
            </Table>
            <div class="foot_page">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div>
        </div>
    </div>
</template>
<script>
import {
    getAreaTreeApi, // 地区
    getMerchantBasePageApi,  // 供应商列表
    postMerchantBaseStatusApi,  // 状态
    postMerchantBaseRemoveApi,   // 删除
} from '@/api/account'
import { jsonToArea } from "@/libs/util.js"
export default {
    name: 'supplierlist',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
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
                    width: 220,
                    align: "center"
                },
                {
                    title: '唯一信用代码',
                    key: 'creditCode',
                    width: 200,
                    align: "center"
                },
                {
                    title: '渠道来源',
                    slot: 'nullSlot',
                    width: 180,
                    align: "center"
                },
                {
                    title: '区域城市',
                    slot: 'extraSlot',
                    width: 180,
                    align: "center"
                },
                {
                    title: '手机号',
                    key: 'linkmanTel',
                    width: 180,
                    align: "center"
                },
                // {
                //     title: '微信ID',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '会员等级',
                //     slot: 'nullSlot',
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
                    key: 'linkmanTel',
                    width: 180,
                    align: "center"
                },
                {
                    title: '联系地址',
                    key: 'address',
                    minWidth: 180,
                    align: "center"
                },
                {
                    title: '售后联系人',
                    key: 'afterSaleLinkman',
                    width: 180,
                    align: "center"
                },
                {
                    title: '售后电话',
                    key: 'afterSaleTel',
                    width: 180,
                    align: "center"
                },
                {
                    title: '售后地址',
                    key: 'address',
                    minWidth: 180,
                    align: "center"
                },
                {
                    title: '资质证件',
                    slot: 'nullSlot',
                    width: 180,
                    align: "center"
                },
                {
                    title: '商品数',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.stat ? params.row.stat.goodsCount || 0 : 0)
                    }
                },
                {
                    title: '贷款',
                    slot: 'nullSlot',
                    width: 180,
                    align: "center"
                },
                {
                    title: '结算',
                    slot: 'nullSlot',
                    width: 180,
                    align: "center"
                },
                {
                    title: '结算周期',
                    key: 'paymentPeriod',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.paymentPeriod ? params.row.paymentPeriod + '天' : '---'])
                    }
                },
                // {
                //     title: '添加管理员',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '备注',
                //     slot: 'nullSlot',
                //     width: 180,
                //     align: "center"
                // },
                {
                    title: '分账通道',
                    width: 120,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.fzChannel ? params.row.fzChannel.name : '---'])
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
                    width: 220,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
            areaTree: [], // 地域列表
            search: {}, // 搜索
        }
    },
    created() {
        this.getList()  // 获取列表
        this.getAreaTree()  // 地区
    },
    methods: {
        // 获取列表
        getList() {
            this.loading = true
            let data = {
                biz: 'medical',
                type: 'supplier',
                ...this.search,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            };
            getMerchantBasePageApi(data).then(res => {
                let data = res.data
                this.total = res.totalElements
                // console.log(res);
                this.loading = false
                this.data = data
            })
        },
        // 修改状态
        changeSwitch(i, row) {
            postMerchantBaseStatusApi({ id: row.id, value: i }).then(res => {
                if (res) {
                    this.$Message.success('状态修改成功')
                    this.getList()
                }
            }).catch(err => {
                console.log(err);
                this.getList()
            })
        },
        // 地区
        getAreaTree() {
            getAreaTreeApi().then(res => {
                // console.log(res);
                this.areaTree = jsonToArea(res, 'code', false)
            })
        },
        // 编辑
        addSupplierFn(row) {
            let data = {}
            if (row) {
                data.id = row.id
            }
            this.$router.push({
                path: 'addSupplier',
                query: data
            })
        },
        // 分账信息
        editInfoFn(row) {
            let data = {}
            if (row) {
                data.id = row.id
            }
            this.$router.push({
                path: '/merchantInfo/subAccountInfo',
                query: data
            })
        },
        // 删除
        removeFn(row) {
            postMerchantBaseRemoveApi({ id: row.id })
                .then(res => {
                    console.log(res);
                    this.getList()
                })
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
    }
}
</style>