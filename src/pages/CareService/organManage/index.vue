<template>
    <div class='organManage'>
        <!-- <h5>机构管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="关爱服务管理" content="机构管理" hidden-breadcrumb />
        </div>
        <div class="shopManage_main">
            <div class="search_top" style="margin-bottom: 15px;text-align: center;">
                <Space size="large">
                    <!-- <Space>
                    <strong>起始时间</strong>
                    <DatePicker @on-change="changeTime" type="date" format="yyyy-MM-dd" placement="bottom-end"
                        placeholder="请选择开始时间" size="small" style="width: 160px;" />
                    <strong>至</strong>
                    <DatePicker @on-change="changeTime" type="date" format="yyyy-MM-dd" placement="bottom-end"
                        placeholder="请选择结束时间" size="small" style="width: 160px;margin-right: 10px;" />
                </Space> -->
                    <Space>
                        <strong>城市</strong>
                        <TreeSelect v-model="search.regionId" :data="areaTree" size="small" style="width: 160px;" />
                    </Space>
                    <!-- <Space>
                    <strong>分类</strong>
                    <Select v-model="consume" placeholder="请选择分类" clearable size="small"
                        style="width:160px;margin-right: 10px; ">
                        <Option value="000">是</Option>
                        <Option value="0001">否</Option>
                    </Select>
                </Space> -->
                    <Space>
                        <Input v-model="search.keywords" placeholder="请输入手机号/名称等关键字" clearable size="small"
                            style="width: 200px;" />
                        <Button type="primary" size="small" @click="pageNumber = 1; getBaseList()"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}; getBaseList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div style="margin-bottom: 15px;">
                <Space size="large">
                    <Space>
                        <Icon type="md-list" />
                        <strong style="font-size: 16px;"> 机构列表</strong>
                    </Space>
                    <Button size="small" type="primary" @click=" this.$router.push('newsOrgan')">添加</Button>
                </Space>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #kong="{ }">
                    <p>--</p>
                </template>
                <template #createUser="{ row }">
                    <div v-if="row.user">
                        <p v-if="row.user.name">{{ row.user.name }}</p>
                        <p v-else-if="row.user.code">{{ row.user.code }}</p>
                    </div>
                    <p v-else>--</p>
                </template>
                <template #statuSlot="{ row }">
                    <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                        @on-change="(i) => changeStatusFn(i, row)"></Switch>
                </template>
                <template #action="{ row }">
                    <Button v-editOrganFn="row.fzChannel && row.fzChannel.code == 'unknown'" type="info" size="small"
                        v-margin="5" @click="jumpSubInfo(row)">分账信息</Button>
                    <Button type="primary" size="small" @click=" editOrganFn(row)" v-margin="5">编辑</Button>
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok=" removeOrganFn(row)">
                        <Button type="error" size="small" v-margin="5"
                            v-editOrganFn="row.status.code != 'enabled'">删除</Button>
                    </Poptip>
                    <Button type="info" size="small" @click="jumpShop(row)" v-margin="5">管理门店</Button>
                </template>
            </Table>
            <Page :total="total" v-model="pageNumber" editOrganFn-total size="small" editOrganFn-elevator editOrganFn-sizer
                @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
        </div>
    </div>
</template>
<script>
import {
    getAreaTreeApi, // 地区
    getMerchantBasePageApi, // 机构列表
    postMerchantBaseRemoveApi, // 机构删除
    postMerchantBaseStatusApi,  // 机构状态
    getMerchantStaffDetailApi, // 联系人详情
    getUserInfoPageApi, // 用户列表
} from '@/api/account.js'
import { jsonToArea } from "@/libs/util.js"
export default {
    name: 'organManage',
    data() {
        return {
            loading: false,
            total: 0, // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            areaTree: [], // 地域列表
            search: {}, // 搜索
            columns: [
                {
                    title: '注册时间',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                        ]);
                    },
                },
                {
                    title: '机构名称',
                    key: 'name',
                    width: 220,
                    align: "center"
                },
                {
                    title: '统一信用代码',
                    key: 'creditCode',
                    width: 210,
                    align: "center"
                },
                // {
                //     title: '渠道来源',
                //     slot: "kong",
                //     width: 180,
                //     align: "center"
                // },
                {
                    title: '区域城市',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.region && params.row.region.extra ? params.row.region.extra.namePath.join() : '--')
                    }
                },
                {
                    title: '详细地址',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.address ? params.row.address : '--')
                    }
                },
                {
                    title: '手机号',
                    key: 'linkmanTel',
                    width: 180,
                    align: "center"
                },
                {
                    title: '微信ID',
                    key: 'linkmanTel',
                    width: 180,
                    align: "center"
                },
                {
                    title: '机构分类',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '机构类型',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '连锁联系人',
                    key: 'afterSaleLinkman',
                    width: 180,
                    align: "center"
                },
                {
                    title: '联系方式',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.afterSaleTel ? params.row.afterSaleTel : '--')
                    }
                },
                {
                    title: '门店数',
                    width: 120,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.stat ? params.row.stat.score : '0')
                    }
                },
                {
                    title: '套餐数',
                    width: 120,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.stat ? params.row.stat.goodsCount : '0')
                    }
                },
                {
                    title: '营业额',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.stat ? params.row.stat.turnover : '0')
                    }
                },
                {
                    title: '总服务费',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '捐款额',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '添加管理员',
                    slot: "createUser",
                    width: 180,
                    align: "center",
                },
                {
                    title: '分账信息',
                    width: 120,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.fzChannel ? params.row.fzChannel.name || '' : '')
                    }
                },
                {
                    title: '状态',
                    width: 100,
                    align: "center",
                    fixed: 'right',
                    slot: 'statuSlot',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 300,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
        }
    },
    created() {
        this.getBaseList();  // 获取 机构 列表
        // 地区

        getAreaTreeApi().then(res => {
            this.areaTree = jsonToArea(res, 'code', false)
        })
    },
    methods: {
        // 获取 机构 列表
        getBaseList() {
            this.loading = true
            let data = {
                type: 'service',
                biz: 'common',
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
            }

            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    data[key] = element;
                }
            }

            // 暂时先用供应商列表
            getMerchantBasePageApi(data)
                .then(res => {
                    // console.log(res);
                    this.data = res.data;
                    this.total = res.totalElements;
                    this.loading = false;
                }).catch(err => {
                    err;
                })
        },
        // 状态修改
        changeStatusFn(value, row) {

            postMerchantBaseStatusApi({
                id: row.id,
                value
            }).then(res => {
                this.$Message.success('状态修改成功')
                this.getBaseList()
            }).catch(err => {
                this.getBaseList();
            })
        },
        // 删除
        removeOrganFn(row) {
            postMerchantBaseRemoveApi({ id: row.id })
                .then(res => {
                    this.$Message.success('操作成功！')
                    this.getBaseList()
                })
        },
        // 分账信息
        jumpSubInfo(row = '') {
            let data = row.id
            // console.log(row);
            this.$router.push({
                path: '/merchantInfo/subAccountInfo',
                query: { data }
            })
        },
        // 编辑
        editOrganFn(row) {
            // console.log(row);
            this.$router.push({ path: 'newsOrgan', query: { id: row.id } })
        },
        // 管理门店按钮
        jumpShop(row) {
            let organId = '';
            if (row) {
                organId = row.id;
            }
            this.$router.push({ path: 'shopManage', query: { organId } })
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getBaseList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getBaseList();
        },
    }
}
</script>
<style scoped lang='less'>
.shopManage_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

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
</style>