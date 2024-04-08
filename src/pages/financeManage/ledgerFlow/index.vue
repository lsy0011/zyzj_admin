<template>
    <div class='ledgerFlow'>
        <!-- <h5>分账流水对账</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="财务管理" content="分账流水对账" hidden-breadcrumb />
        </div>
        <div class="ledger_main">
            <div class="search_top">
                <div class="search_top_left">
                    <Space size="large" wrap>
                        <Space>
                            <strong>订单支付日期</strong>
                            <DatePicker type="date" size="small" placeholder="请选择日期" style="width: 200px" />
                            <strong>至</strong>
                            <DatePicker type="date" size="small" placeholder="请选择日期" style="width: 200px" />
                        </Space>
                        <Space>
                            <strong>分账日期</strong>
                            <DatePicker type="date" size="small" placeholder="请选择日期" style="width: 200px" />
                            <strong>至</strong>
                            <DatePicker type="date" size="small" placeholder="请选择日期" style="width: 200px" />
                        </Space>
                        <Space>
                            <strong>订单号</strong>
                            <Input size="small" placeholder="请输入内容" style="width: 200px"></Input>
                        </Space>
                        <Space>
                            <strong>支付通道分账订单号</strong>
                            <Input size="small" placeholder="请输入内容" style="width: 200px"></Input>
                        </Space>
                        <Space>
                            <strong>分账商户</strong>
                            <Input size="small" placeholder="请输入商户关键字" style="width: 200px"></Input>
                            <!-- 支持模糊查询 -->
                        </Space>
                    </Space>
                </div>
                <div class="search_top_right">
                    <Space>
                        <Button type="primary">查询</Button>
                        <Button>重置</Button>
                    </Space>
                </div>
            </div>
            <div class="table_title">
                <Space>
                    <Icon type="md-list" />
                    <strong>列表</strong>
                </Space>
                <Button type="success" size="small">导出</Button>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #detailSlot="{ row }">
                    <Button type="info" size="small" @click="getPaydivLogDetFn(row)"> 详情 </Button>
                </template>
            </Table>
            <div class="table_footer">
                <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                    :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <Modal v-model="modal" :mask-closable="false" :closable="false" :draggable="true" title="记录详情"
            @on-visible-change="onVisibleChange">
            <Form :model="list" label-position="right" :label-width="120">
                <FormItem label="记录ID：">{{ list.id }}</FormItem>
                <FormItem label="批次号：">{{ list.batchNo }}</FormItem>
                <FormItem label="交易号：">{{ list.tradeNo }}</FormItem>
                <FormItem label="订单结算价：">{{ list.orderCostPrice }}</FormItem>
                <FormItem label="订单支付价:">{{ list.orderPayPrice }}</FormItem>
                <FormItem label="分账金额:">{{ typeof list.divAmount === 'number' ? list.divAmount : '未知' }}</FormItem>
                <FormItem label="分账类型:">{{ list.divType ? list.divType.name : '---' }}</FormItem>
                <FormItem label="状态:">{{ list.status ? list.status.name : '---' }}</FormItem>
                <FormItem label="状态时间:" style="margin-bottom: 10px;">
                    <!-- {{ list.statusTime && list.status ? $Date(list.statusTime[list.status.code]).format('YYYY-MM-DD HH:mm:ss') : '---' }} -->
                </FormItem>
            </Form>
            <Button long type="success" v-if="modal" ghost @click.once="lookPaydivObjFn(list)"
                :disabled="detailsData.length">
                查看分账对象
            </Button>

            <Table border :columns="detailsColumns" :data="detailsData" :loading="DetailsLoading">
                <template #modalDetSlot="{ row }">
                    <Button type="info" size="small" @click="merDetailsFn(row)"> 详情 </Button>
                </template>
            </Table>
        </Modal>
        <!-- 分账商户详情 -->
        <Modal v-model="detaModal" :mask-closable="false" :closable="false" :draggable="true" title="记录详情"
            @on-visible-change="onVisibleChangeTwo" width="350">
            <Form :model="detaList" label-position="right" :label-width="120">
                <FormItem label="商户名：">{{ detaList.merchant ? detaList.merchant.name : '---' }}</FormItem>
                <FormItem label="商户类型：">{{ detaList.divTarget ? detaList.divTarget.name : '--' }}</FormItem>
                <FormItem label="是否收通道费：">
                    {{ detaList.divTarget ? detaList.divTarget.channelFeeCharge ? '是' : '否' : '---' }}
                </FormItem>
                <FormItem label="分账比例：">{{ detaList.divPercent }}</FormItem>
                <FormItem label="分账金额:">{{ typeof list.divAmount === 'number' ? list.divAmount : '未知' }}</FormItem>
                <FormItem label="状态:">{{ list.status ? list.status.name : '---' }}</FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import {
    getFinancePaydivLogPageApi,   // 记录分页
    getFinancePaydivLogDetailApi,    // 记录详情
    getFinancePaydivDetailListApi,    // 明细列表
    getFinancePaydivDetailDetailApi,    // 明细详情
} from '@/api/account'
export default {
    name: 'ledgerFlow',
    data() {
        return {
            columns: [
                {
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: 'ID',
                    align: 'center',
                    key: 'id',
                },
                {
                    title: '批次号',
                    align: 'center',
                    key: 'batchNo',
                },
                {
                    title: '交易号',
                    align: 'center',
                    key: 'tradeNo'
                },
                {
                    title: '订单结算价',
                    align: 'center',
                    key: 'orderCostPrice',
                    width: 150,
                },
                {
                    title: '订单支付价',
                    align: 'center',
                    key: 'orderPayPrice',
                    width: 150,
                },
                {
                    title: '分账金额',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('p', typeof params.row.divAmount === 'number' ? params.row.divAmount : '未知')
                    }
                },
                {
                    title: '分账类型',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('div', params.row.divType ? params.row.divType.name : '---')
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 150,
                    slot: 'detailSlot',
                },
            ],
            data: [],
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            search: {},

            modal: false,
            list: {},

            detaModal: false,
            detaList: {},

            detailsColumns: [
                {
                    title: '商户名称',
                    align: 'center',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', params.row.merchant ? params.row.merchant.name : '---')
                    }
                },
                {
                    title: '商户类型',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', params.row.divTarget ? params.row.divTarget.name : '---')
                    }
                },
                {
                    title: '是否收取通道费',
                    align: 'center',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', params.row.divTarget ? params.row.divTarget.channelFeeCharge ? '是' : '否' : '---')
                    }
                },
                {
                    title: '分账比例',
                    align: 'center',
                    key: 'divPercent',
                    minWidth: 100,
                },
                {
                    title: '分账金额',
                    align: 'center',
                    key: 'divAmount',
                    minWidth: 100,
                },
                {
                    title: '状态',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', params.row.status ? params.row.status.name : '---')
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    minWidth: 100,
                    slot: 'modalDetSlot'
                },

            ],  // 分账公司
            detailsData: [], // 分账公司列表
            DetailsLoading: false,
        }
    },
    created() {
        this.getPaydivLogFn();
    },
    methods: {

        // 获取分页
        getPaydivLogFn() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                ...this.search,
            };
            this.loading = true;
            getFinancePaydivLogPageApi(data).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;
            })
        },
        // 记录详情
        getPaydivLogDetFn(row) {
            getFinancePaydivLogDetailApi(row.id).then(res => {
                this.modal = true;
                this.list = res;
            })
        },
        // 分账对象
        lookPaydivObjFn(item) {
            this.DetailsLoading = true;
            getFinancePaydivDetailListApi({ payDivId: item.id }).then(res => {
                this.detailsData = res;
                this.DetailsLoading = false;
                if (!res.length) {
                    this.$Message.warning({
                        duration: 3,
                        content: '暂时没有分账公司'
                    })
                }
            })
        },
        // 商户信息
        merDetailsFn(row) {
            getFinancePaydivDetailDetailApi(row.id).then(res => {
                this.detaModal = true;
                this.detaList = res;
            })
        },
        onVisibleChange(flag) {
            if (!flag) {
                this.list = {};
                this.detailsData = [];
            }
        },
        onVisibleChangeTwo(flag) {
            if (!flag) {
                this.detaList = {};
            }
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getPaydivLogFn();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPaydivLogFn();
        },
    }
}
</script>
<style scoped lang='less'>
.ledger_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .search_top {
        width: 100%;
        display: flex;

        .search_top_left {
            width: 89.9%;
        }

        .search_top_right {
            width: 10%;
            text-align: center;
        }
    }

    .table_title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 15px;
        margin: 15px 0;
        padding-right: 10px;
        box-sizing: border-box;
    }

    .table_footer {
        margin-top: 15px;
    }
}
</style>