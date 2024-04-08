<template>
    <div class='producingEnterprise'>
        <!-- <h5>生产企业管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="生产企业管理" hidden-breadcrumb />
        </div>
        <div class="producing_main">
            <div class="producing_search">
                <Row>
                    <Col span="6">
                    <div style="display: inline-block;">
                        <strong>创建时间</strong>
                        <DatePicker :value="search.timeCreatedBegin" @on-change="search.timeCreatedBegin = $event"
                            type="date" placeholder="起始日期" transfer size="small" style="width: 135px" class="mr8">
                        </DatePicker>
                        <p style="margin: 0 5px; display: inline-block;">至</p>
                        <DatePicker :value="search.timeCreatedEnd" @on-change="search.timeCreatedEnd = $event" type="date"
                            size="small" placeholder="结束日期" transfer style="width: 135px; margin-right: 20px" class="mr8">
                        </DatePicker>
                    </div>
                    </Col>
                    <!-- <Col span="4">
                    <strong>商品编号</strong>
                    <Input v-model="search.code" size="small" placeholder="请选择商品编号" style="width: 70%" />
                    </Col> -->
                    <Col span="4">
                    <div style="display: inline-block;">
                        <strong>商品名称</strong>
                        <Input v-model="search.keywords" size="small" style="width: 70%" placeholder="请输入商品名称"></Input>
                    </div>
                    </Col>
                    <!-- <Col span="4">
                    </Col> -->
                    <Col span="4">
                    <div style="display: inline-block;">
                        <Button type="primary" size="small" @click="pageNumber = 0;">查询</Button>
                        <Button style="margin: 0 10px;" size="small" @click=" pageNumber = 0; search = {};">重置</Button>
                    </div>
                    </Col>
                </Row>
            </div>
            <div class="producing_btn">
                <Button type="primary">添加</Button>
            </div>
            <div class="producing_tab_box">
                <Table border :columns="columns" :data="data" :loading="loading"
                    style="width: 100%; font-size: 15px;">
                    <template #action="{ row, index }">
                        <Button type="primary" size="small" style="margin: 5px" @click=" show(row)">编辑</Button>
                        <Button type="error" size="small" style="margin: 5px" @click=" remove(index)">删除</Button>
                    </template>
                </Table>
                <div class="tab-foot-page">
                    <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                        :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'producingEnterprise',
    data() {
        return {
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            search: {}, // 搜索
            loading: false,
            columns: [
                {
                    title: '序号',
                    key: 'rank',
                    align: 'center',
                    width: 90
                },
                {
                    title: '企业名称',
                    key: 'name',
                    align: 'center',
                    // width: 220
                },
                {
                    title: '添加人',
                    key: 'addPro',
                    align: 'center',
                    // width: 180
                },
                {
                    title: '最后编辑人',
                    key: 'endPro',
                    align: 'center',
                    // width: 180
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 180,
                    align: 'center',
                    fixed: 'right'
                }
            ], // 表头
            data: [
                {
                    rank: 1,
                    name: '你真好企业',
                    addPro: '热心人',
                    endPro: '狼人'
                }
            ],  // 表体
        }
    },
    methods: {
        // 编辑
        show(row) { },
        // 删除
        remove(index) { },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getGoodsList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getGoodsList();
        },
    }
}
</script>
<style scoped lang='less'>
.producing_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .producing_search {
        strong {
            margin-right: 10px;
        }
    }

    .producing_btn {
        margin: 20px 0;
    }

    .tab-foot-page {
        margin-top: 20px;
    }
}
</style>