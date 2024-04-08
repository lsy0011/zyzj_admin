<template>
    <div class='healthList'>
        <!-- <h5>保健品列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="保健品列表" hidden-breadcrumb />
        </div>
        <div class="healthList-main">
            <div class="search_top">
                <Space size="large">
                    <!-- 药品名字 -->
                    <Space>
                        <strong>保健品名字</strong>
                        <Input v-model="search.keywords" size="small" style=" width: 180px;" placeholder="请输入保健品名称"></Input>
                    </Space>
                    <!-- 条形编码 -->
                    <Space>
                        <strong>条形编码</strong>
                        <Input v-model="search.keywords" size="small" style=" width: 180px;" placeholder="请输入条形编码"></Input>
                    </Space>
                    <!-- 品牌 -->
                    <Space>
                        <strong>品牌</strong>
                        <Input v-model="search.keywords" size="small" style=" width: 180px;" placeholder="请输入品牌"></Input>
                    </Space>
                    <Space>
                        <Button size="small" type="primary"
                            @click="pageNumber = 0; classFlag = 0; loading = true; getGoodsList();">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 0; search = {}; classFlag = 0; getGoodsList(); getClassifyList(); timeStart(''); timeEnd('')">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="healthList-table-box">
                <div class="list-tab-box-left" v-show="btnFlag">
                    <strong @click="btnFlag = !btnFlag">
                        <Icon type="md-arrow-dropleft" />保健品分类
                    </strong>
                    <div class="shop-tree">
                        <Tree :data="dataTree" @on-select-change="selectChange"></Tree>
                    </div>
                </div>
                <div class="list-tab-box-model" v-show="!btnFlag" @click="btnFlag = !btnFlag">
                    <div class="box-title">保健品分类
                        <Icon type="md-arrow-dropright" />
                    </div>
                </div>
                <div class="list-tab-box-right">
                    <div class="tab-top-btn">
                        <div class="top-btn-r">
                            <Button :class="{ 'btn-btm': classFlag == 0 }"
                                @click="pageNumber = 0; search = {}; classFlag = 0; getGoodsList()">全部</Button>
                            <Button :class="{ 'btn-btm': classFlag == 1 }"
                                @click="pageNumber = 0; search = {}; classFlag = 1; getGoodsList()">在售</Button>
                            <Button :class="{ 'btn-btm': classFlag == 2 }"
                                @click="pageNumber = 0; search = {}; classFlag = 2; getGoodsList()">已下架</Button>
                        </div>
                        <div class="top-btn-l">
                            <Button type="primary" @click="jumpNew">新建保健品</Button>
                        </div>
                    </div>
                    <div class="tab-main">
                        <Table border :columns="columns" :data="data" style="width: 100%; font-size: 15px;"
                            :loading="loading">
                            <!-- ================================ -->
                            <template #file="{ row }">
                                <div v-viewer v-show="row.file">
                                    <img v-if="row.file.pic_0" :src="row.file.pic_0" style="width: 80px;" alt="">
                                    <img v-else :src="row.file.pic_1" style="width: 80px;" alt="">
                                </div>
                            </template>
                            <template #zanWu="{ }">
                                <div>--</div>
                            </template>
                            <template #category="{ row }">
                                <div v-if="row.category">
                                    {{ row.category.name }}
                                </div>
                                <div v-else>--</div>
                            </template>

                            <!-- <template #type="{ row }">
                                <Button type="success" ghost size="small" v-show="row.status.code === 'enabled'"
                                    @click="statusClick(row.id, 'disabled')">上架</Button>
                                <Button type="warning" ghost size="small" v-show="row.status.code !== 'enabled'"
                                    @click="statusClick(row.id, 'enabled')">下架</Button>
                            </template> -->
                            <!-- ================================ -->
                            <template #action="{ row }">
                                <Button type="primary" size="small" style="margin-right: 5px"
                                    @click="jumpNew(row)">编辑</Button>
                                <Poptip confirm transfer title="您确认删除吗?" @on-ok="remove(row)">
                                    <Button type="error" size="small" v-if="row.status.code != 'enabled'">删除</Button>
                                </Poptip>
                            </template>
                        </Table>
                    </div>
                    <div class="tab-foot-page">
                        <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                            :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getGoodsCategoryTreeApi,  // 商品分类
    getGoodsInfoPageApi,  //  商品列表
    getSupplierListApi,  //  获取供应商列表
    postGoodsInfoStatusApi, // 商品状态
    postGoodsInfoRecycle, //进出回收站
} from '@/api/account.js'
import { jsonToArray2 } from "@/libs/util.js";
import { resolveComponent } from 'vue';
export default {
    name: 'healthCareGoods-healthList',
    data() {
        return {
            // 头部搜索框数据
            search: {},
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            classFlag: 0, // 全部0、在售1、下架2
            // 商品分类树状图
            dataTree: [],
            // 分类展开按钮
            btnFlag: true,
            supplier: {
                id: '',
                name: ''
            }, // 修改供应商
            searchSupplier: {
                id: '',
                name: ''
            }, // 搜索供应商
            supplierList: [], // 供应商列表
            // 表格头
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '药品id',
                    key: 'id',
                    align: 'center',
                    width: 180
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    width: 220
                },
                {
                    title: '图片',
                    slot: 'file',
                    align: 'center',
                    width: 180
                },
                {
                    title: '分类',
                    slot: "category",
                    align: 'center',
                    width: 180
                },
                {
                    title: '条形编码',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [params.row.barcode ? params.row.barcode : "---"]);
                    },
                },
                {
                    title: '品牌',
                    // key: 'address',
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        return h("div", [params.row.brand ? params.row.brand.name : "---"]);
                    },
                },
                {
                    title: '规格',
                    // key: 'address',
                    align: 'center',
                    width: 180
                },
                {
                    title: '生产日期',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [
                            this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                        ]);
                    },
                },
                {
                    title: '有效期',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", '---');
                        // return h("div", [this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm")]);
                    },
                },
                {
                    title: '生产企业',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [params.row.brand ? params.row.brand.name : "---"]);
                    },
                },
                {
                    title: '批准文号',
                    slot: 'zanWu',
                    align: 'center',
                    width: 180
                },
                {
                    title: '价格',
                    key: 'marketPrice',
                    align: 'center',
                    width: 180
                },
                {
                    title: '库存',
                    align: 'center',
                    slot: 'zanWu',
                    width: 180,
                    // render: (h, params) => {
                    //     return h("div", [
                    //         this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                    //     ]);
                    // },
                },
                {
                    title: '销量',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [params.row.initSales ? params.row.initSales : "---"]);
                    },
                },
                {
                    title: '状态',
                    align: 'center',
                    fixed: "right",
                    width: 90,
                    render: (h, params) => {
                        return h(resolveComponent('Switch'), {
                            modelValue: params.row.status.code == 'enabled' ? true : false,
                            onClick: () => {
                                // this.show(params.index, params.row)
                                let status = ''
                                if (params.row.status.code === 'enabled') {
                                    status = 'disabled'
                                } else {
                                    status = 'enabled'
                                }
                                postGoodsInfoStatusApi({
                                    id: params.row.id,
                                    value: status
                                }).then(res => {
                                    if (res) {
                                        this.$Message.success('修改成功')
                                        this.getGoodsList()
                                    }
                                }).catch(err => {
                                    this.getGoodsList();
                                })
                            }
                        })
                    }
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
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                    fixed: 'right'
                }
            ],
            // 商品列表 
            data: []
        }
    },
    created() {
        this.getClassifyList()  // 获取侧面的商品分类列表
        this.loading = true;
        this.getGoodsList()  // 获取商品列表
        this.getSupplierList();  // 获取供应商列表
    },
    methods: {
        // 商品分类被点击
        selectChange(row) {
            // console.log(row);
            if (row.length > 0) {
                this.search.categoryId = row[0].id
                // console.log(this.search.categoryId);
                this.getGoodsList()
            }
        },
        // 获取商品列表
        getGoodsList() {
            let data1 = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'medical',
                medicalType: 'health',
                recycled: false
            };
            if (this.classFlag == 0) {
            } else if (this.classFlag == 1) {
                data1.status = 'enabled'
            } else {
                data1.status = 'disabled'
            }
            let data2 = this.search; // 搜索数据
            for (var key in data2) {
                // console.log("key", data2.hasOwnProperty(key));
                // 过滤一下 空的搜素词
                if (data2.hasOwnProperty(key) && data2[key] !== "")
                    data1[key] = data2[key];
            }
            // console.log(data1);
            getGoodsInfoPageApi(data1)
                .then((res) => {
                    let arr = res.data;
                    // 数据列表
                    // console.log("🚀 ~ file: index.vue:445 ~ .then ~ arr <---> 数据列表:", arr)
                    this.total = res.totalElements;
                    this.data = []
                    this.data.push(...arr);
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        // 获取分类数据列表
        getClassifyList(parentId = '') {
            this.loading = true;
            getGoodsCategoryTreeApi({
                parentId,
                biz: 'medical'
            })
                .then(res => {
                    this.dataTree = []
                    let arr = jsonToArray2(res)
                    this.dataTree.push(...arr)
                    this.loading = false;
                    // console.log(arr);
                })
                .catch(err => {
                    this.loading = false;
                })
        },
        // 获取供应商列表
        getSupplierList() {
            getSupplierListApi()
                .then((res) => {
                    // console.log(res);
                    this.supplierList.push(...res)
                })
                .catch((err) => { });
        },
        // 编辑新增跳转
        jumpNew(row = '') {
            let data = {
                id: row.id,
            }
            // console.log(row);
            this.$router.push({
                path: 'newHealth',
                query: data
            })
        },
        // 进入回收站
        remove(row) {
            console.log(row);
            postGoodsInfoRecycle({ id: row.id, value: true })
                .then(res => {
                    console.log(res);
                    this.getGoodsList()
                }).catch(err => {
                    err;
                })
        },
        // 搜索时间改变
        timeStart(e) {
            this.search.timeCreatedBegin = e
            // console.log("🚀 ~ file: index.vue:570 ~ timeStart ~ this.search.timeCreatedBegin:", this.search.timeCreatedBegin)
        },
        timeEnd(e) {
            this.search.timeCreatedEnd = e
        },
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
.healthList {
    .healthList-main {
        margin-top: 24px;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;

        .search_top {
            width: 100%;
            padding-bottom: 20px;
            // height: 200px;
        }

        .healthList-table-box {
            // border: 1px solid #000;
            display: flex;

            :deep(.ivu-table-tbody) {
                font-size: 12px;
            }

            .list-tab-box-left {
                flex: 0;
                cursor: pointer;
                margin-right: 15px;

                .shop-tree {
                    padding-right: 22px;
                }
            }

            .list-tab-box-model {
                width: 30px;
                cursor: pointer;
                font-weight: 600;
                word-wrap: break-word;
                letter-spacing: 20px;
                display: flex;
            }

            .list-tab-box-right {
                flex: 1;
                width: 0;

                .tab-top-btn {
                    // width: 100%;
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;

                    button {
                        margin: 0 10px;
                    }

                    .btn-btm {
                        color: #57a3f3;
                        border: #57a3f3 1px solid;
                    }
                }

                .tab-foot-page {
                    margin-top: 20px;
                }
            }
        }
    }
}
</style>