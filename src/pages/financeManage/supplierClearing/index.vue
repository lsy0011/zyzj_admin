<template>
    <div class='supplierClearing'>
        <!-- <h5>供应商结算</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="财务管理" content="供应商结算" hidden-breadcrumb />
        </div>
        <div class="finance_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>时间</strong>
                        <DatePicker type="date" placeholder="起始时间" size="small" style="width: 200px" />
                        <strong>至</strong>
                        <DatePicker type="date" placeholder="截止时间" size="small" style="width: 200px" />
                    </Space>
                    <Space>
                        <strong>处理状态</strong>
                        <Select placeholder="请选择" size="small" style="width: 160px">
                            <Option value="1">按天结算</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>供应商</strong>
                        <Select placeholder="请选择" size="small" style="width: 160px">
                            <Option value="1">你</Option>
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
                    <strong>供应商结算列表</strong>
                </Space>
                <Button type="success" style="float: right;" size="small">导出</Button>
            </div>
            <div class="table_body">
                <Table border :columns="columns" :data="data">
                    <template #details>
                        <p class="table_detail">查看订单详情</p>
                    </template>
                    <template #action="{}">
                        <Button type="error" size="small">打款</Button>
                    </template>
                </Table>
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
    name: 'supplierClearing',
    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '序号',
                    key: 'age',
                    width: 90,
                    align: 'center'
                },
                {
                    title: '批次名称',
                    key: 'age',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '供应商',
                    key: 'address',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '发货时间',
                    key: 'date',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '订单数',
                    key: 'age',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '订单总额(包含退款)',
                    key: 'address',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '状态',
                    key: 'address',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '供应商确认时间',
                    key: 'date',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '打款时间',
                    key: 'date',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '详情',
                    slot: 'details',
                    width: 240,
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 120,
                    align: 'center'
                }
            ],
            data: [
                {
                    name: 'Brown',
                    age: 18,
                    address: 'New York',
                    date: '2016-10-03'
                },
                {
                    name: 'Green',
                    age: 24,
                    address: 'London',
                    date: '2016-10-01'
                },
                {
                    name: 'Black',
                    age: 30,
                    address: 'Sydney',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon',
                    age: 26,
                    address: 'Ottawa',
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

        .table_detail {
            color: #2d8cf1;
            cursor: pointer;
        }
    }
}
</style>