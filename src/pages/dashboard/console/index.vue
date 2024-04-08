<template>
    <div>
        <!-- 欢迎使用 Admin Plus -->
        <div class="i-layout-page-header">
            <PageHeader title="大数据看板" content="工作台" hidden-breadcrumb />
        </div>
        <div class="console">
            <div v-resize="handleResize">
                <base-info ref="baseInfo" />
                <grid-menu />
                <Card :bordered="false" dis-hover class="dashboard-console-visit">
                    <template #title>
                        <Row type="flex" justify="center" align="middle">
                            <Col span="8">
                            <Avatar icon="ios-podium" size="small" v-color="'#1890ff'" v-bg-color="'#e6f7ff'" />
                            <span class="ivu-pl-8">注册量</span>
                            </Col>
                            <Col span="16" class="ivu-text-right">
                            <RadioGroup v-model="visitType" type="button" class="ivu-mr-8"
                                @on-change="handleChangeVisitType">
                                <Radio label="day">今日</Radio>
                                <Radio label="month">本月</Radio>
                                <Radio label="year">全年</Radio>
                            </RadioGroup>
                            <DatePicker v-model="visitDate" type="daterange" placement="bottom-end"
                                placeholder="Select date" style="width: 200px"></DatePicker>
                            </Col>
                        </Row>
                    </template>
                    <div>
                        <visit-chart ref="visitChart" />
                    </div>
                </Card>
                <Row :gutter="24" class="ivu-mt">
                    <Col :xl="12" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
                    <Card :bordered="false" dis-hover v-height="520">
                        <template #title>
                            <Avatar icon="ios-people" size="small" v-color="'#faad14'" v-bg-color="'#fffbe6'" />
                            <span class="ivu-pl-8">用户画像</span>
                        </template>
                        <template #extra>
                            <Tooltip placement="top" content="下载数据">
                                <Icon type="ios-download-outline" />
                            </Tooltip>
                        </template>
                        <user-preference />
                    </Card>
                    </Col>
                    <Col :xl="12" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
                    <Card :bordered="false" dis-hover v-height="520">
                        <template #title>
                            <Avatar icon="md-options" size="small" v-color="'#722ed1'" v-bg-color="'#f9f0ff'" />
                            <span class="ivu-pl-8">产品销售量排行 </span>
                        </template>
                        <template #extra>
                            <Dropdown>
                                <Icon type="md-more" />
                                <template #list>
                                    <DropdownMenu>
                                        <DropdownItem>操作一</DropdownItem>
                                        <DropdownItem>操作二</DropdownItem>
                                    </DropdownMenu>
                                </template>
                            </Dropdown>
                        </template>
                        <!-- <hot-search ref="hotSearch" /> -->
                        <rank-good ref="rankGood"></rank-good>
                    </Card>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>
<script>
import baseInfo from './base-info';
import gridMenu from './grid-menu';
import userPreference from './user-preference.vue'
import visitChart from './visit-chart.vue';
import hotSearch from './hot-search.vue';
import rankGood from './rank-good.vue';
// import searchTable from './search-table.vue';
export default {
    name: 'dashboard-console',
    components: { baseInfo, gridMenu, visitChart, userPreference, hotSearch, rankGood },
    data() {
        return {
            visitType: 'day', // day, month, year
            visitDate: [(new Date()), (new Date())]
        }
    },
    methods: {
        handleChangeVisitType(val) {
            if (val === 'day') {
                this.visitDate = [(new Date()), (new Date())];
            } else if (val === 'month') {
                this.visitDate = [(new Date() - 86400000 * 30), (new Date())];
            } else if (val === 'year') {
                this.visitDate = [(new Date() - 86400000 * 365), (new Date())];
            }
        },
        // 监听页面宽度变化，刷新表格
        handleResize() {
            this.$refs.baseInfo.handleResize();
            this.$refs.visitChart.handleResize();
            // this.$refs.hotSearch.handleResize();
        }
    }
}
</script>
<style lang="less" scoped>
.console {
    margin-top: 24px;
    // padding: 20px 30px;
    // background: #fff;
    // width: 98%;
    // margin: 20px auto;
    // padding: 30px;
    // background: #fff;
}
</style>
