<template>
    <div class='goodsList'>
        <!-- <h5>商品列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城商品管理" content="商品列表" hidden-breadcrumb />
        </div>
        <div class="goodsList-main">
            <div class="goodsList-search-top">
                <div class="search-box">
                    <div class="search-box-left">
                        <Space size="large" wrap>
                            <!-- 供应商 -->
                            <Space>
                                <p>供应商</p>
                                <Select v-model="search.merchantId" size="small" v-width="200" filterable
                                    :remote-method="remoteMethodSearchMer" :loading="loadingMer">
                                    <Option v-for="(option, index) in supplierList" :value="option.id" :key="index">
                                        {{ option.name }}</Option>
                                </Select>
                            </Space>
                            <!-- 创建时间 -->
                            <Space>
                                <p>创建时间</p>
                                <DatePicker v-model="search.timeCreatedBegin" type="date" placeholder="起始日期"
                                    size="small" style="width: 130px">
                                </DatePicker>
                                <strong>至</strong>
                                <DatePicker v-model="search.timeCreatedEnd" type="date" size="small" placeholder="结束日期"
                                    style="width: 130px; margin-right: 20px">
                                </DatePicker>
                            </Space>
                            <!-- 累计销量 -->
                            <Space>
                                <p>累计销量</p>
                                <Input v-model="search.salesSumStart" size="small" style=" width: 120px;" type="number"
                                    placeholder="请输入内容"></Input>
                                <strong>至</strong>
                                <Input v-model="search.salesSumEnd" size="small" style=" width: 120px;" type="number"
                                    placeholder="请输入内容"></Input>
                            </Space>
                            <!-- 商品名字 -->
                            <Space>
                                <p>商品名字</p>
                                <Input v-model="search.keywords" size="small" style=" width: 180px;"
                                    placeholder="请输入商品名称"></Input>
                            </Space>
                            <!-- 推荐 -->
                            <Space>
                                <p>推荐</p>
                                <Select clearable v-model="search.hot" style=" width: 120px;" size="small"
                                    placeholder="请选择……">
                                    <Option value="true">是</Option>
                                    <Option value="false">否</Option>
                                </Select>
                            </Space>
                            <!-- 库存量区间 -->
                            <!-- <Space>
                            <p style="margin: 15px 10px 10px 0;">库存量区间</p>
                            <Input v-model="search.stocksSumStart" type="number" size="small" style=" width: 120px;"
                                placeholder="请输入内容"></Input>
                            <p style="margin: 0 5px;">至</p>
                            <Input v-model="search.stocksSumEnd" type="number" size="small" style=" width: 120px;"
                                placeholder="请输入内容"></Input>
                        </Space> -->
                            <!-- 零售价区间 -->
                            <Space>
                                <p>售价区间</p>
                                <Input v-model="search.salesPriceStart" style=" width: 120px;" size="small"
                                    placeholder="请输入内容"></Input>
                                <strong>至</strong>
                                <Input v-model="search.salesPriceEnd" style=" width: 120px;" size="small"
                                    placeholder="请输入内容"></Input>
                            </Space>
                        </Space>
                    </div>
                    <div class="search-box-right">
                        <Button type="primary" size="small"
                            @click="pageNumber = 1; classFlag = 0; loading = true; getGoodsList();">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; search = {}; classFlag = 0; getGoodsList(); getClassifyList();">重置</Button>
                    </div>
                </div>
            </div>
            <div class="goodsList-table-box">
                <div class="list-tab-box-left" v-show="btnFlag">
                    <strong @click="btnFlag = !btnFlag">
                        <Icon type="md-arrow-dropleft" />商品分类
                    </strong>
                    <div class="shop-tree">
                        <Tree :data="dataTree" @on-select-change="selectChange"></Tree>
                    </div>
                </div>
                <div class="list-tab-box-model" v-show="!btnFlag" @click="btnFlag = !btnFlag">
                    <div class="box-title">商品分类
                        <Icon type="md-arrow-dropright" />
                    </div>
                </div>
                <div class="list-tab-box-right">
                    <div class="tab-top-btn">
                        <div class="top-btn-r">
                            <Button :class="{ 'btn-btm': classFlag == 0 }"
                                @click="pageNumber = 1; search = {}; classFlag = 0; getGoodsList()">全部</Button>
                            <Button :class="{ 'btn-btm': classFlag == 1 }"
                                @click="pageNumber = 1; search = {}; classFlag = 1; getGoodsList()">在售</Button>
                            <Button :class="{ 'btn-btm': classFlag == 2 }"
                                @click="pageNumber = 1; search = {}; classFlag = 2; getGoodsList()">已下架</Button>
                        </div>
                        <div class="top-btn-l">
                            <Button type="primary" @click="jumpNew()">新建商品</Button>
                        </div>
                    </div>
                    <div class="tab-main">
                        <Table border :columns="columns" :data="data" :loading="loading"
                            @on-selection-change="tableSelectChange">
                            <!-- ================================ -->
                            <template #fileSlot="{ row }">
                                <div v-viewer v-if="row.pic && row.pic.length > 0">
                                    <img v-if="row.pic" :src="row.pic[0]" style="width: 100px;" alt="">
                                </div>
                                <div v-else> --- </div>
                            </template>
                            <template #statuSlot="{ row }">
                                <Switch v-if="row.status" v-model="row.status.code" true-value="enabled"
                                    false-value="disabled" @on-change="(i) => shopStatusChange(i, [row.id])"></Switch>
                                <Switch v-else true-value="enabled" false-value="disabled"
                                    @on-change="(i) => shopStatusChange(i, [row.id])"></Switch>
                            </template>
                            <template #hotSlot="{ row }">
                                <Switch v-model="row.hot" @on-change="(i) => changeHot(i, row)"></Switch>
                            </template>
                            <!-- <template #type="{ row }">
                                <Button type="success" ghost size="small" v-show="row.status.code === 'enabled'"
                                    @click="statusClick(row.id, 'disabled')">上架</Button>
                                <Button type="warning" ghost size="small" v-show="row.status.code !== 'enabled'"
                                    @click="statusClick(row.id, 'enabled')">下架</Button>
                            </template> -->
                            <!-- ================================ -->
                            <template #actionSlot="{ row }">
                                <Button type="primary" size="small" v-margin="5" @click="jumpNew(row)">编辑</Button>
                                <Poptip confirm transfer title="您确认删除吗?" @on-ok="remove(row)">
                                    <Button type="error" size="small"
                                        v-if="row.status && row.status.code != 'enabled'">删除</Button>
                                </Poptip>
                                <Button size="small" v-margin="5" @click="lookReview(row)">查看评论</Button>
                            </template>
                        </Table>
                    </div>
                    <div class="tab_foot_btn">
                        <Space>
                            <Poptip confirm transfer title="是否确认上架这些商品?"
                                @on-ok="shopStatusChange('enabled', batchShopId)">
                                <Button size="small" :disabled="batchShopId.length == 0">批量上架</Button>
                            </Poptip>
                            <Poptip confirm transfer title="是否确认下架这些商品?"
                                @on-ok="shopStatusChange('disabled', batchShopId)">
                                <Button size="small" :disabled="batchShopId.length == 0">批量下架</Button>
                            </Poptip>
                        </Space>
                    </div>
                    <div class="tab-foot-page">
                        <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                            @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]"
                            @on-page-size-change="pageSizeChange" />
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
    postGoodsInfoHotApi,   // 是否推荐
} from '@/api/account.js'
import { jsonToArray2 } from "@/libs/util.js";
export default {
    name: 'goodwillGoods-goodsList',
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
            loadingMer: false, // 模糊开关
            supplierList: [], // 供应商列表
            suppTime: null,    // 防抖
            // 表格头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '序号',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        return h('div', [params.index + 1 + (this.pageNumber - 1 < 0 ? 0 : this.pageNumber - 1) * this.pageSize])
                    }
                },
                {
                    title: '编号',
                    key: 'id',
                    align: 'center',
                    width: 200
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    width: 220
                },
                {
                    title: '图片',
                    slot: 'fileSlot',
                    align: 'center',
                    width: 180
                },
                {
                    title: '分类',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.category ? params.row.category.name : '---')
                    }
                },
                // {
                //     title: '规格',
                //     // key: 'address',
                //     align: 'center',
                //     width: 180
                // },
                {
                    title: '生产厂家',
                    align: 'center',
                    width: 220,
                    render: (h, params) => {
                        return h("div", [params.row.manuName ? params.row.manuName : "---"]);
                    },
                },
                {
                    title: '品牌',
                    align: 'center',
                    width: 160,
                    render: (h, params) => {
                        return h("div", params.row.brand ? params.row.brand.name : "---");
                    },
                },
                {
                    title: '市场价',
                    key: 'marketPrice',
                    align: 'center',
                    width: 120
                },
                {
                    title: '成本价',
                    key: 'costPrice',
                    align: 'center',
                    width: 120
                },
                {
                    title: '最低补贴价',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', params.row.cyCardDiscount ? params.row.cyCardDiscount : 0)
                    }
                },
                {
                    title: '商品毛利',
                    key: 'grossMargin',
                    align: 'center',
                    width: 120
                },
                {
                    title: '库存',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '已销售',
                    key: 'initSales',
                    align: 'center',
                    width: 120
                },
                {
                    title: '是否包邮',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h("div", [
                            params.row.freightFree ? '包邮' : '不包'
                        ]);
                    }
                },
                {
                    title: '运费模板',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [
                            params.row.freightTmp ? params.row.freightTmp.name : '其他'
                        ]);
                    }
                },
                {
                    title: '供应商',
                    align: 'center',
                    width: 220,
                    render: (h, params) => {
                        return h("div", [params.row.merchant ? params.row.merchant.name : "---"]);
                    },
                },
                // {
                //     title: '发货地',
                //     // key: 'area',
                //     align: 'center',
                //     width: 180
                // },
                {
                    title: '创建时间',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [
                            this.$Date(params.row.timeCreated).format("YYYY-MM-DD HH:mm"),
                        ]);
                    },
                },
                // {
                //     title: '创建人',
                //     // key: 'address',
                //     align: 'center',
                //     width: 180
                // },
                {
                    title: '是否推荐',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        return h("div", [params.row.hot ? '推荐' : "不推荐"]);
                    },
                },
                {
                    title: '推荐',
                    align: 'center',
                    fixed: "right",
                    slot: "hotSlot",
                    width: 90,
                },
                {
                    title: '状态',
                    align: 'center',
                    fixed: "right",
                    slot: "statuSlot",
                    width: 90,
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 150,
                    align: 'center',
                    fixed: 'right'
                }
            ],
            // 商品列表 
            data: [],
            batchShopId: [],   // 批量操作的商品ID
        }
    },
    created() {
        this.getClassifyList()  // 获取侧面的商品分类列表
        this.loading = true;
        this.getGoodsList()  // 获取商品列表
    },
    methods: {
        // 进入回收站
        remove(row) {
            postGoodsInfoRecycle({ id: row.id, value: true })
                .then(res => {
                    if (res.success) {
                        this.$Message.success('操作成功！');
                        this.getGoodsList();
                    }
                }).catch(err => {
                    this.getGoodsList();
                })
        },
        // 商品分类被点击
        selectChange(row) {
            this.pageNumber = 1;
            this.search.categoryId = row[0] ? row[0].id : '';
            // console.log(this.search.categoryId);
            this.getGoodsList();
        },
        // 获取商品列表
        getGoodsList() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'common',
                recycled: false
            };
            if (this.classFlag == 0) {
            } else if (this.classFlag == 1) {
                data.status = 'enabled'
            } else {
                data.status = 'disabled'
            }

            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (key == 'timeCreatedBegin' || key == 'timeCreatedEnd') {
                        data[key] = element ? this.$Date(element).format('YYYY-MM-DD') : '';
                    } else {
                        data[key] = element;
                    }
                }
            }
            // console.log(data1);
            getGoodsInfoPageApi(data).then((res) => {
                let arr = res.data;
                // 数据列表
                // console.log("🚀 ~ file: index.vue:445 ~ .then ~ arr <---> 数据列表:", arr)
                this.total = res.totalElements;
                this.data = arr;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            });
        },
        // 获取分类数据列表
        getClassifyList(parentId = '') {
            this.loading = true;
            getGoodsCategoryTreeApi({
                parentId,
                biz: 'common'
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
        // 修改商品状态
        shopStatusChange(type, ids) {
            let formData = new FormData();
            formData.append('value', type);
            ids.forEach(item => {
                formData.append('id', item)
            })
            postGoodsInfoStatusApi(formData, false).then(res => {
                if (res) {
                    this.$Message.success('修改成功');
                    this.getGoodsList();
                    this.batchShopId = [];
                }
            }).catch(err => {
                this.batchShopId = [];
                this.getGoodsList();
            })
        },
        // 模糊查询
        remoteMethodSearchMer(query) {
            if (query !== '') {
                if (this.suppTime) {
                    clearTimeout(this.suppTime);
                    this.suppTime = null;
                }
                this.suppTime = setTimeout(() => {
                    this.loadingMer = true;

                    getSupplierListApi({ keywords: query, biz: 'common', type: 'supplier' }).then((res) => {
                        this.loadingMer = false;
                        this.supplierList = res;
                    })

                }, 200);
            } else {
                this.supplierList = [];
            }
        },
        // 批量操作
        tableSelectChange(items) {
            this.batchShopId = [];
            items.forEach(element => {
                this.batchShopId.push(element.id);
            });
        },
        // 是否分类
        changeHot(value, row) {
            postGoodsInfoHotApi({ id: row.id, value }).then(res => {
                if (res) {
                    this.$Message.success('操作成功');
                    this.getGoodsList();
                }
            }).catch(err => {
                console.log(err);
                this.getGoodsList();
            })
        },
        // 编辑新增跳转
        jumpNew(row = '') {
            let data = row.id;
            // console.log(row);
            this.$router.push({
                path: 'newGoods',
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
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getGoodsList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getGoodsList();
        },
    },
    unmounted() {
        this.suppTime = null;
    }
}
</script>
<style scoped lang='less'>
.goodsList {
    .goodsList-main {
        margin-top: 24px;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;

        .goodsList-search-top {
            width: 100%;
            padding-bottom: 20px;
            // height: 200px;

            .search-box {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .search-box-left {
                    position: relative;

                    p {
                        font-size: 16px;
                        display: inline-block;
                    }

                    // :deep(input::placeholder) {
                    //     font-size: 120px;
                    //     // color: #DD5A5D;
                    // }

                    flex: 1;
                }

                .search-box-right {
                    flex: 0;
                    display: flex;

                    button {
                        margin: 0 10px;
                    }
                }
            }
        }

        .goodsList-table-box {
            // border: 1px solid #000;
            display: flex;

            :deep(.ivu-table-tbody) {
                font-size: 12px;
            }

            .list-tab-box-left {
                flex: 0;
                cursor: pointer;
                margin-right: 15px;
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

                .tab_foot_btn,
                .tab-foot-page {
                    margin-top: 15px;
                }
            }
        }
    }
}
</style>