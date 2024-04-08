<template>
    <div class='fundClearing'>
        <!-- <h5>基金相关结算</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="财务管理" content="基金相关结算" hidden-breadcrumb />
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
                    <strong>基金相关结算列表</strong>
                </Space>
            </div>
            <div class="table_body">
                <Table :columns="columns" :data="data" border :loading="loading">
                    <template #action>
                        <Button type="error" ghost size="small">手工入账</Button>
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
    name: 'fundClearing',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            columns: [
                {
                    title: '序号',
                    key: 'age',
                    width: '90',
                    align: 'center'
                },
                {
                    title: '日期',
                    key: 'date',
                    align: 'center'
                },
                {
                    title: '时间',
                    key: 'date',
                    align: 'center',
                },
                {
                    title: '类目',
                    key: 'age',
                    align: 'center'
                },
                {
                    title: '来源',
                    key: 'age',
                    align: 'center'
                },
                {
                    title: '金额',
                    key: 'age',
                    align: 'center'
                },
                {
                    title: '是否入账',
                    key: 'age',
                    align: 'center'
                },
                {
                    title: '现金流',
                    align: 'center',
                    slot: 'action'
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