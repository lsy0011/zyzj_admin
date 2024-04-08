<template>
    <div class='financeDetail'>
        <!-- <h5>财务区间明细</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="财务管理" content="财务区间明细" hidden-breadcrumb />
        </div>
        <div class="finance_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <DatePicker type="date" placeholder="起始时间" size="small" style="width: 200px" />
                        <strong>至</strong>
                        <DatePicker type="date" placeholder="截止时间" size="small" style="width: 200px" />
                    </Space>
                    <Space>
                        <Select placeholder="按天展示" size="small" style="width: 160px">
                            <Option value="1">按天结算</Option>
                        </Select>
                    </Space>
                    <Space>
                        <Button type="primary" size="small">查询</Button>
                        <Button size="small">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_title">
                <Space>
                    <Icon type="md-list" />
                    <strong>明细列表</strong>
                </Space>
            </div>
            <div class="table_body">
                <Table :columns="columns" :data="data" border :loading="loading"></Table>
            </div>
            <div class="foot_page">
                <Page :total="total" show-total @on-change="changePage" show-sizer :page-size-opts="[5, 10, 20, 50, 100]"
                    @on-page-size-change="pageSizeChange" size="small"></Page>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'financeDetail',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            columns: [
                {
                    title: '序号',
                    key: 'name',
                    width: '90',
                    align: 'center'
                },
                {
                    title: '时间',
                    key: 'date',
                    width: '120',
                    align: 'center'
                },
                {
                    title: '收入',
                    align: 'center',
                    children: [
                        {
                            title: '善意商城销售——爱心用户',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '善意商城销售——残疾人',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '医药保健——爱心用户',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '医药保健——残疾人',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '益助拍——爱心用户',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '益助拍——残疾人',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '捐款',
                            key: 'address',
                            width: '120',
                            align: 'center'
                        },
                        {
                            title: '总计',
                            key: 'age',
                            width: '120',
                            align: 'center'
                        },
                    ],
                },
                {
                    title: '支出',
                    align: 'center',
                    children: [
                        {
                            title: '商品货款结算',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '公益捐赠',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '残疾工资',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '勤工助学工资',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '支付通道手续费',
                            key: 'address',
                            width: '220',
                            align: 'center'
                        },
                        {
                            title: '总计',
                            key: 'age',
                            width: '120',
                            align: 'center'
                        },
                    ],
                    align: 'center',
                },
                {
                    title: '利润',
                    key: 'age',
                    width: '120',
                    align: 'center'
                },
                {
                    title: '分账金额',
                    key: 'age',
                    width: '120',
                    align: 'center'
                },
                {
                    title: '提现金额',
                    key: 'age',
                    width: '120',
                    align: 'center'
                },
                {
                    title: '现金流',
                    align: 'center',
                    children: [
                        {
                            title: '收入-体现-分账',
                            key: 'age',
                            width: '220',
                            align: 'center'
                        }
                    ]
                }
            ],
            data: [
                {
                    name: 'Brown',
                    age: 18,
                    address: 'No. 2',
                    date: '2016-10-03'
                },
                {
                    name: 'Green',
                    age: 24,
                    address: 'No. 3',
                    date: '2016-10-01'
                },
                {
                    name: 'Black',
                    age: 30,
                    address: 'No. 4',
                    date: '2016-10-02'
                },
                {
                    name: 'Snow',
                    age: 26,
                    address: 'No. 2',
                    date: '2016-10-04'
                }
            ]
        }
    },
    methods: {
        // 分页
        changePage(page) {
            // console.log(page);
            this.pageNumber = page;
            this.getClassifyList(this.treeId);
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getClassifyList(this.treeId);
        },
    }
}
</script>
<style scoped lang='less'>

.finance_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .search_top {
        width: 100%;
    }

    .table_title {
        font-size: 16px;
        margin-top: 15px;
    }

    .table_body {
        margin: 10px 0 20px 0;
    }
}
</style>