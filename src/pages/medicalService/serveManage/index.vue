<template>
    <div class='serveManage'>
        <!-- <h5>服务管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医疗服务管理" content="服务管理" hidden-breadcrumb />
        </div>
        <div class="serveManage_main">
            <div class="search_top" style="margin-bottom: 10px;">
                <Space size="large" wrap class="search_top_left">
                    <Space>
                        <strong>机构</strong>
                        <Select v-model="search.merchantId" placeholder="选择机构" clearable size="small" style="width:160px; ">
                            <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>门店</strong>
                        <Select v-model="search.storeId" placeholder="请输入门店关键字" filterable
                            :remote-method="remoteMethodStore" :loading="storeLoading" clearable size="small"
                            style="width:180px;">
                            <Option v-for="item in storeList" :key="item.id" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>服务分类</strong>
                        <Select v-model="search.categoryId" placeholder="请选择分类" clearable size="small"
                            style="width:120px;  ">
                            <Option v-for="item in serviceList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </Space>
                    <!-- <Space>
                        <strong>累计销量</strong>
                        <Input v-model="search.salesSumStart" placeholder="请输入..." size="small" type="number"
                            style="width: 80px;"></Input>
                        <strong>至</strong>
                        <Input v-model="search.salesSumEnd" placeholder="请输入..." size="small" type="number"
                            style="width: 80px; "></Input>
                    </Space> -->
                    <Space>
                        <strong>库存量区间</strong>
                        <Input v-model="search.stocksSumStart" placeholder="请输入..." size="small" type="number"
                            style="width: 80px;"></Input>
                        <strong>至</strong>
                        <Input v-model="search.stocksSumEnd" placeholder="请输入..." size="small" type="number"
                            style="width: 80px; "></Input>
                    </Space>
                    <Space>
                        <strong>推荐</strong>
                        <Select v-model="search.hot" placeholder="是否推荐" clearable size="small" style="width:120px;">
                            <Option value="true">是</Option>
                            <Option value="false">否</Option>
                        </Select>
                    </Space>
                    <!-- <Space>
                        <strong>销售区间</strong>
                        <Input v-model="search.salesPriceStart" placeholder="请输入..." size="small" type="number"
                            style="width: 80px;"></Input>
                        <strong>至</strong>
                        <Input v-model="search.salesPriceEnd" placeholder="请输入..." size="small" type="number"
                            style="width: 80px; "></Input>
                    </Space> -->
                    <Space>
                        <strong>服务名称</strong>
                        <Input v-model="search.keywords" placeholder="请输入名称关键字" size="small" style="width: 160px; "></Input>
                    </Space>
                    <Space class="search_top_right">
                        <Button type="primary" size="small" @click="pageNumber = 1; getServiceList()"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}; getServiceList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="modul_add" style="margin-bottom: 15px;">
                <Space size="large">
                    <Space>
                        <strong style="font-size: 16px;">
                            <Icon type="md-list" /> 服务列表
                        </strong>
                    </Space>
                    <Space>
                        <Button :class="{ 'btn-btm': classFlag == 0, 'btn_mgn': true }" size="small"
                            @click=" pageNumber = 1; search = {}; classFlag = 0; getServiceList()">全部</Button>
                        <Button :class="{ 'btn-btm': classFlag == 1, 'btn_mgn': true }" size="small"
                            @click=" pageNumber = 1; search = {}; classFlag = 1; getServiceList()">在售</Button>
                        <Button :class="{ 'btn-btm': classFlag == 2, 'btn_mgn': true }" size="small"
                            @click=" pageNumber = 1; search = {}; classFlag = 2; getServiceList()">已下架</Button>
                        <Button type="primary" size="small" @click="jumpNew()">添加</Button>
                    </Space>
                </Space>
            </div>
            <Table border :loading="loading" :columns="columns" :data="data">
                <template #indexN="{ index }">
                    <p>{{ index + 1 + (pageNumber - 1 < 0 ? 0 : pageNumber - 1) * pageSize }}</p>
                </template>
                <template #image="{ row }">
                    <div v-if="row.file" v-viewer>
                        <img :src="row.file.pic_0" width="120" height="120" title="点击放大">
                    </div>
                    <div v-else>--</div>
                </template>
                <template #hotSlot="{ row }">
                    <Switch v-model="row.hot" @on-change="(i) => chanageHot(i, row)"></Switch>
                </template>
                <!-- 有效期 -->
                <template #validity="{ row }">
                    <div>{{ row.validityLength }}{{ row.validityUnit.name }}</div>
                </template>
                <template #kong="{ }">
                    <p>--</p>
                </template>
                <template #statuSlot="{ row }">
                    <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                        @on-change="(i) => changeStatusFn(i, row)"></Switch>
                </template>
                <template #action="{ row }">
                    <Button type="primary" size="small" v-margin="5" @click=" jumpNew(row)">编辑</Button>
                    <Poptip confirm transfer title="确认删除该服务吗?" @on-ok=" remove(row)">
                        <Button type="error" size="small" v-show="row.status.code != 'enabled'">删除</Button>
                    </Poptip>
                    <Button size="small" v-margin="5" @click="lookReview(row)">查看评论</Button>
                </template>
            </Table>
            <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
        </div>
    </div>
</template>
<script>
import {
    getMerchantBasePageApi,  // 机构列表
    getStoreInfoPageApi,   // 门店列表
    getServiceInfoPagetApi, // 服务分页列表
    getServiceCategoryListApi, // 服务分类列表 
    postServiceInfoStatusApi,  // 修改 状态
    postServiceInfoRemoveApi,  // 服务删除
    postServiceInfoHotApi,  // 服务推荐
} from '@api/account.js'
export default {
    name: 'serveManage',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            classFlag: 0, // 全部0、在售1、下架2
            columns: [
                {
                    title: '序号',
                    slot: 'indexN',
                    width: '90',
                    align: "center"
                },
                {
                    title: '编号',
                    key: 'id',
                    width: '160',
                    align: "center"
                },
                {
                    title: '机构管理员',
                    slot: 'kong',
                    width: '160',
                    align: "center"
                },
                {
                    title: '服务类型',
                    width: '240',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.category.name)
                    }
                },
                {
                    title: '服务名称',
                    minWidth: 240,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.name)
                    }
                },
                {
                    title: '服务图片',
                    slot: 'image',
                    width: '240',
                    align: "center"
                },
                {
                    title: '门店名称',
                    width: '380',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                class: 'table_flow_auto'
                            }, {
                                default() {
                                    return params.row.stores.map(item => {
                                        return item.name + '、'
                                    })
                                }
                            })
                        ])
                    }
                },
                // {
                //     title: '门店图片',
                //     slot: 'kong',
                //     width: '240',
                //     align: "center"
                // },
                {
                    title: '门店电话',
                    width: '360',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                class: 'table_flow_auto'
                            }, {
                                default() {
                                    return params.row.stores.map(item => {
                                        return item.tel + '、'
                                    })
                                }
                            })
                        ])
                    }
                },
                {
                    title: '城市',
                    width: '240',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                class: 'table_flow_auto'
                            }, {
                                default() {
                                    return params.row.stores.map(item => {
                                        return item.region.name + '、'
                                    })
                                }
                            })
                        ])
                    }
                },
                {
                    title: '门店地址',
                    width: '400',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [
                            h('div', {
                                class: 'table_flow_auto'
                            }, {
                                default() {
                                    return params.row.stores.map(item => {
                                        return item.address + '、'
                                    })
                                }
                            })
                        ])
                    }
                },
                {
                    title: '市场价',
                    key: 'marketPrice',
                    width: '140',
                    align: "center"
                },
                {
                    title: '权益卡可补贴最大金额',
                    key: 'cyCardDiscount',
                    width: '220',
                    align: "center"
                },
                {
                    title: '补贴后最低价',
                    key: 'salePrice',
                    width: '180',
                    align: "center"
                },
                {
                    title: '数量',
                    width: '140',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.stock ? params.row.stock : '---'])
                    }
                },
                {
                    title: '有效期',
                    slot: 'validity',
                    width: '240',
                    align: "center"
                },
                {
                    title: '已销售',
                    key: 'initSales',
                    width: '140',
                    align: "center"
                },
                {
                    title: '创建者',
                    slot: 'kong',
                    width: '140',
                    align: "center"
                },
                {
                    title: '是否推荐',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        return h("div", [params.row.hot ? '推荐' : "不推荐"]);
                    },
                },
                {
                    title: '上架状态',
                    width: '120',
                    align: "center",
                    fixed: 'right',
                    slot: 'statuSlot',
                },
                {
                    title: '推荐',
                    slot: 'hotSlot',
                    width: 120,
                    align: 'center',
                    fixed: 'right',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 160,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
            search: {}, // 搜索关键字
            baseList: [],  // 机构列表
            serviceList: [], // 服务分类列表

            storeLoading: false,  // 门店模糊
            storeList: [],
            storeTime: null,
        }
    },
    created() {
        this.getServiceList()
        this.getBaseList()  // 机构列表
        this.getServeCate()  // 服务分类列表
    },
    methods: {
        // 获取服务列表
        getServiceList() {
            this.loading = true
            let data = {
                biz: 'medical',
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
            }

            for (let i in this.search) {
                if (this.search[i] !== '') {
                    data[i] = this.search[i]
                };
            };

            if (this.classFlag == 0) {
            } else if (this.classFlag == 1) {
                data.status = 'enabled'
            } else {
                data.status = 'disabled'
            };

            getServiceInfoPagetApi(data).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;

                // 过滤未绑定门店的的服务
                let arr = [];
                res.data.forEach(item => {
                    if (item.stores && item.stores.length == 0) {
                        arr.push(item);
                    };
                });

                arr.forEach((item, index) => {
                    if (item.status.code == 'enabled') {

                        postServiceInfoStatusApi({
                            id: item.id,
                            value: 'disabled'
                        }).then(res => {
                            if (index == arr.length - 1) {
                                this.getServiceList();
                            };
                        });
                    };
                });

            });

        },
        // 获取机构列表
        getBaseList() {
            getMerchantBasePageApi({ biz: 'medical', type: 'service' }).then(res => {
                let data = res.data
                data.forEach(item => {
                    item.label = item.name
                    item.value = item.id
                })
                this.baseList = data;
            })
        },
        // 状态修改
        changeStatusFn(value, row) {

            if (row.stores.length == 0) {
                this.$Message.warning('该服务尚未绑定门店，请先绑定后上架');
                return this.getServiceList();
            };

            postServiceInfoStatusApi({
                id: row.id,
                value
            }).then(res => {
                this.$Message.success('状态修改成功')
                this.getServiceList();
            }).catch(err => {
                this.getServiceList();
            })
        },
        // 门店模糊查询
        remoteMethodStore(query) {
            if (query !== '') {
                this.storeLoading = true;
                if (this.storeTime) {
                    clearTimeout(this.storeTime)
                }
                this.storeTime = setTimeout(() => {
                    getStoreInfoPageApi({ biz: 'medical', keywords: query, pageSize: 200 }).then(res => {
                        this.storeList = res.data;
                        this.storeLoading = false;
                    })
                }, 200);
            } else {
                this.storeList = [];
            }
        },
        //  获取服务分类列表
        getServeCate() {
            getServiceCategoryListApi({ biz: 'medical' })
                .then(res => {
                    if (res.length > 0) {
                        res.forEach(element => {
                            element.value = element.id
                            element.label = element.name
                        });
                        this.serviceList = []
                        this.serviceList = res
                    }
                })
        },
        // 是否推荐
        chanageHot(value, row) {
            postServiceInfoHotApi({ id: row.id, value }).then(res => {
                if (res) {
                    this.$Message.success('操作成功')
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 编辑新增跳转
        jumpNew(row = '') {
            let data = row.id
            this.$router.push({
                path: 'newsServe',
                query: { data }
            })
        },
        // 查看评论
        lookReview(row) {
            let id = row.id;
            this.$router.push({
                path: 'reviewManage',
                query: { id }
            })
        },
        // 删除
        remove(row) {
            postServiceInfoRemoveApi({ id: row.id }).then(res => {
                // console.log(res);
                if (res.success) {
                    this.$Message.success('操作成功！')
                    this.getServiceList()
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getServiceList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getServiceList();
        },
    }
}
</script>
<style scoped lang='less'>
.serveManage_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .search_top {
        width: 100%;
        padding: 10px 0 10px;
    }

    .btn-btm {
        color: #57a3f3;
        border: #57a3f3 1px solid;
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

    .btn_mgn {
        margin-right: 15px;
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
</style>