<template>
    <div class='remedyList'>
        <!-- <h5>药品列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="药品列表" hidden-breadcrumb />
        </div>
        <div class="remedyList-main">
            <div class="class_type">
                <Button :class="{ 'btn_on': medicalType == 'drug' }"
                    @click="medicalType = 'drug'; loading = true; getGoodsList()">药品</Button>
                <Button :class="{ 'btn_on': medicalType == 'health' }"
                    @click=" medicalType = 'health'; loading = true; getGoodsList()">保健品</Button>
            </div>
            <div class="search_top">
                <Space size="large" wrap>
                    <!-- 商品名字 -->
                    <Space>
                        <strong>{{ medicalType == 'drug' ? '药品' : '保健品' }}名称</strong>
                        <Input v-model="search.keywords" size="small" style=" width: 200px;"
                            placeholder="请输入商品名称或条码关键字"></Input>
                    </Space>
                    <!-- 商品id -->
                    <Space>
                        <strong>{{ medicalType == 'drug' ? '药品' : '保健品' }}ID</strong>
                        <Input v-model="search.id" size="small" style=" width: 200px;" placeholder="请输入完整的商品ID"></Input>
                    </Space>
                    <!-- 条形编码 -->
                    <Space>
                        <strong>条形编码</strong>
                        <Input v-model="search.barcode" size="small" style=" width: 180px;" placeholder="请输入编码"></Input>
                    </Space>
                    <!-- 品牌 -->
                    <Space>
                        <strong>品牌</strong>
                        <Select v-model="search.brandId" filterable :remote-method="remoteMethodBrand" size="small"
                            v-width="180" :loading="loadingBrand">
                            <Option :value="item.id" v-for="item in brandList" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </Space>
                    <!-- 供应商 -->
                    <Space>
                        <strong>供应商</strong>
                        <Select v-model="search.merchantId" filterable :remote-method="remoteMethod1"
                            :loading="loadingSupplier" size="small" v-width="180">
                            <Option v-for="(option, index) in optionsSupplier" :value="option.id" :key="index">
                                {{ option.name }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <Button type="primary" size="small"
                            @click="pageNumber = 1; classFlag = 0; loading = true; getGoodsList();">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; search = {}; classFlag = 0; optionsSupplier = []; getGoodsList(); getClassifyList();">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="remedyList-table-box">
                <div class="list-tab-box-left" v-show="btnFlag">
                    <strong @click="btnFlag = !btnFlag">
                        <Icon type="md-arrow-dropleft" />药品分类
                    </strong>
                    <div class="shop-tree">
                        <Tree :data="dataTree" @on-select-change="selectChange"></Tree>
                    </div>
                </div>
                <div class="list-tab-box-model" v-show="!btnFlag" @click="btnFlag = !btnFlag">
                    <div class="box-title">药品分类
                        <Icon type="md-arrow-dropright" />
                    </div>
                </div>
                <div class="list-tab-box-right">
                    <div class="tab-top-btn">
                        <div class="top-btn-r">
                            <Button :class="{ 'btn-btm': classFlag == 0 }"
                                @click="pageNumber = 1; classFlag = 0; getGoodsList()">全部</Button>
                            <Button :class="{ 'btn-btm': classFlag == 1 }"
                                @click="pageNumber = 1; classFlag = 1; getGoodsList()">在售</Button>
                            <Button :class="{ 'btn-btm': classFlag == 2 }"
                                @click="pageNumber = 1; classFlag = 2; getGoodsList()">已下架</Button>
                        </div>
                        <div class="top-btn-l">
                            <Button type="primary" @click="jumpNew()">{{ medicalType == 'drug' ? '新建药品' : '新建保健品'
                            }}</Button>
                        </div>
                    </div>
                    <div class="tab-main">
                        <Table border :columns="columns" :data="data" :loading="loading"
                            @on-selection-change="tableSelectChange">
                            <!-- ================================ -->
                            <template #rank="{ index }">
                                <div>{{ index + 1 + pageSize * (pageNumber - 1 < 0 ? 0 : pageNumber - 1) }}</div>
                            </template>
                            <template #fileSlot="{ row }">
                                <div v-viewer v-if="row.pic && row.pic.length > 0">
                                    <img v-if="row.pic" :src="row.pic[0]" style="width: 80px;" alt="">
                                </div>
                                <div v-else> --- </div>
                            </template>
                            <template #hotSlot="{ row }">
                                <Switch v-if="row.hot" v-model="row.hot" @on-change="(i) => changeHot(i, row)"></Switch>
                                <Switch v-else v-model="row.hot" @on-change="(i) => changeHot(i, row)"></Switch>
                            </template>
                            <template #statuSlot="{ row }">
                                <div v-if="row.status && row.status.code">
                                    <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                                        @on-change="(i) => shopStatusChange(i, [row.id])">
                                    </Switch>
                                </div>
                                <div v-else>
                                    <Switch true-value="enabled" false-value="disabled"
                                        @on-change="(i) => shopStatusChange(i, [row.id])">
                                    </Switch>
                                </div>
                            </template>
                            <!-- <template #type="{ row }">
                                <Button type="success" ghost size="small" v-show="row.status.code === 'enabled'"
                                    @click="statusClick(row.id, 'disabled')">上架</Button>
                                <Button type="warning" ghost size="small" v-show="row.status.code !== 'enabled'"
                                    @click="statusClick(row.id, 'enabled')">下架</Button>
                            </template> -->
                            <!-- ================================ -->
                            <template #action="{ row }">
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
                            <Poptip confirm transfer title="是否确认上架这些商品?" @on-ok="shopStatusChange('enabled', batchShopId)">
                                <Button size="small" :disabled="batchShopId.length == 0">批量上架</Button>
                            </Poptip>
                            <Poptip confirm transfer title="是否确认下架这些商品?" @on-ok="shopStatusChange('disabled', batchShopId)">
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
    getBrandPageApi,  // 品牌
    postGoodsInfoHotApi,   // 是否推荐
} from '@/api/account.js'
import { jsonToArray2 } from "@/libs/util.js";
export default {
    name: 'goodwillGoods-remedyList',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '序号',
                    slot: 'rank',
                    align: 'center',
                    width: 90
                },
                {
                    title: '药品id',
                    key: 'id',
                    align: 'center',
                    width: 120
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
                        return h("div", [params.row.category ? params.row.category.name : "---"]);
                    },
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
                // {
                //     title: '规格',
                //     // key: 'address',
                //     slot: 'zanWu',
                //     align: 'center',
                //     width: 180
                // },
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
                    key: 'validity',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [params.row.validity ? params.row.validity : "---"]);
                    },
                },
                {
                    title: '生产厂家',
                    key: 'manuName',
                    align: 'center',
                    width: 220,
                    render: (h, params) => {
                        return h("div", [params.row.manuName ? params.row.manuName : "---"]);
                    },
                },
                {
                    title: '批准文号',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.approval ? params.row.approval : '---')
                    }
                },
                {
                    title: '医药类型',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h("div", [params.row.drugType ? params.row.drugType.name : params.row.medicalType ? params.row.medicalType.name : "---"]);
                    },
                },
                {
                    title: '供应商',
                    align: 'center',
                    width: 240,
                    render: (h, params) => {
                        return h("div", [params.row.merchant ? params.row.merchant.name : "---"]);
                    },
                },
                {
                    title: '市场价',
                    // key: 'marketPrice',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', params.row.marketPrice.toFixed(2))
                    }
                },
                {
                    title: '最低补贴价',
                    // key: 'cyCardDiscount',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', (params.row.marketPrice - params.row.cyCardDiscount).toFixed(2))
                    }
                },
                {
                    title: '成本价',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.costPrice.toFixed(2))
                    }
                },
                // {
                //     title: '库存',
                //     align: 'center',
                //     slot: 'zanWu',
                //     width: 120,
                // },
                {
                    title: '销量',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h("div", [params.row.initSales ? params.row.initSales : "---"]);
                    },
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
                    title: '推荐',
                    align: 'center',
                    fixed: "right",
                    width: 90,
                    slot: 'hotSlot'
                },
                {
                    title: '状态',
                    align: 'center',
                    fixed: "right",
                    width: 90,
                    slot: 'statuSlot',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                    fixed: 'right'
                }
            ], // 表格头
            data: [],  // 商品列表 
            search: {},  // 头部搜索框数据
            medicalType: 'drug',  // drug药品   、保健品 health
            supplier: {
                id: '',
                name: ''
            }, // 修改供应商
            dimFlag: false, // 模糊开关
            classFlag: 0, // 全部0、在售1、下架2
            dataTree: [], // 商品分类树状图
            btnFlag: true, // 分类展开按钮
            brandList: [],  // 品牌列表
            loadingBrand: false,
            loadingSupplier: false,  // 供应商 搜索
            optionsSupplier: [],  // 数据
            timeSupplier: null,  // 

            batchShopId: [],   // 批量操作的商品ID
        }
    },
    created() {
        this.getClassifyList()  // 获取侧面的商品分类列表
        this.loading = true;
        this.getGoodsList()  // 获取商品列表
    },
    methods: {
        // 获取商品列表
        getGoodsList() {
            let data1 = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'medical',
                medicalType: this.medicalType,
                recycled: false
            };
            if (this.classFlag == 0) {
            } else if (this.classFlag == 1) {
                data1.status = 'enabled'
            } else {
                data1.status = 'disabled'
            }
            this.loading = true;
            let data2 = this.search; // 搜索数据
            for (var key in data2) {
                // console.log("key", data2.hasOwnProperty(key));
                // 过滤一下 空的搜素词
                if (data2.hasOwnProperty(key) && data2[key] !== "")
                    data1[key] = data2[key];
            };

            getGoodsInfoPageApi(data1).then((res) => {
                let arrAll = res.data;
                this.loading = false;
                this.data = [];
                this.data = arrAll;
                this.total = res.totalElements;
            }).catch((err) => {
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
        // 商品分类被点击
        selectChange(row) {
            // console.log(row);
            this.search.categoryId = row[0] ? row[0].id : '';
            this.pageNumber = 1;
            this.getGoodsList();
        },
        // 供应商模糊查询 // 获取供应商列表
        remoteMethod1(query) {
            if (query !== '') {
                this.loadingSupplier = true;
                if (this.timeSupplier) {
                    clearTimeout(this.timeSupplier);
                }
                this.timeSupplier = setTimeout(() => {
                    this.loadingSupplier = false;
                    getSupplierListApi({ biz: 'medical', keywords: query })
                        .then((res) => {
                            this.optionsSupplier = [];
                            this.optionsSupplier.push(...res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }, 300);
            } else {
                this.optionsSupplier = [];
            }
        },
        // 品牌模糊查询
        remoteMethodBrand(query) {
            if (query !== '') {
                this.loadingBrand = true;
                if (this.timeSupplier) {
                    clearTimeout(this.timeSupplier);
                }
                this.timeSupplier = setTimeout(() => {
                    this.loadingBrand = false;
                    getBrandPageApi({ biz: 'medical', keywords: query })
                        .then((res) => {
                            this.brandList = res.data;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }, 300);
            } else {
                this.brandList = [];
            }
        },
        // 是否分类
        changeHot(value, row) {
            postGoodsInfoHotApi({ id: row.id, value }).then(res => {
                if (res) {
                    this.$Message.success('操作成功')
                    this.getGoodsList();
                }
            }).catch(err => {
                console.log(err);
                this.getGoodsList();
            })
        },
        // 商品状态
        shopStatusChange(value, ids) {
            let formData = new FormData();
            formData.append('value', value);
            ids.forEach(item => {
                formData.append('id', item);
            })
            postGoodsInfoStatusApi(formData, false).then(res => {
                if (res) {
                    this.$Message.success('修改成功');
                    this.getGoodsList();
                    this.batchShopId = [];
                }
            }).catch(err => {
                this.getGoodsList();
                this.batchShopId = [];
            })
        },
        // 批量操作
        tableSelectChange(items) {
            this.batchShopId = [];
            items.forEach(element => {
                this.batchShopId.push(element.id);
            });
        },
        // 编辑新增跳转
        jumpNew(row = '') {
            let data = {
                id: row.id,
                type: this.medicalType,
            }
            let url = ''
            if (this.medicalType == 'drug') {
                url = 'newsRemedy'
            }
            if (this.medicalType == 'health') {
                url = 'newsRemedy'
            }
            this.$router.push({
                path: url,
                query: data
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
        // 进入回收站
        remove(row) {
            // console.log(row);
            postGoodsInfoRecycle({ id: row.id, value: true })
                .then(res => {
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getGoodsList();
                    }
                }).catch(err => {
                    this.getGoodsList();
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
    }
}
</script>
<style scoped lang='less'>
.remedyList-main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .class_type {
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;

        button {
            display: block;
            width: 49.5%;
            height: 40px;
        }
    }

    .btn_on {
        // border: 1px solid #57a3f3;
        background-color: #fbbf6b;
        color: #ffffff;
    }

    .search_top {
        width: 100%;
        margin-bottom: 20px;
    }

    .remedyList-table-box {
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
                padding-right: 10px;
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

            .tab_foot_btn,
            .tab-foot-page {
                margin-top: 15px;
            }
        }
    }
}
</style>