<template>
    <div class='goodsRecycle'>
        <!-- <h5>商品回收站</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城商品管理" content="商品回收站" hidden-breadcrumb />
        </div>
        <div class="goodRecycle-main">
            <div class="search_top">
                <Space size="large">
                    <!-- <Col span="4">
                    <strong>商品分类</strong>
                    <TreeSelect v-model="goodClassify" :data="dataTree" style="width:70%" placeholder="请选择商品分类" />
                    </Col> -->
                    <Space>
                        <strong>创建时间</strong>
                        <DatePicker :value="search.timeCreatedBegin" @on-change="search.timeCreatedBegin = $event"
                            type="date" placeholder="起始日期" transfer size="small">
                        </DatePicker>
                        <strong>至</strong>
                        <DatePicker :value="search.timeCreatedEnd" @on-change="search.timeCreatedEnd = $event"
                            type="date" size="small" placeholder="结束日期" transfer>
                        </DatePicker>
                    </Space>
                    <!-- <Col span="4">
                    <strong>商品编号</strong>
                    <Input v-model="search.code" size="small" placeholder="请选择商品编号" style="width: 70%" />
                    </Col> -->
                    <Space>
                        <strong>商品名称</strong>
                        <Input v-model="search.keywords" size="small" placeholder="请输入商品名称"></Input>
                    </Space>
                    <!-- <Col span="4">
                    </Col> -->
                    <Space>
                        <Button type="primary" size="small" @click="pageNumber = 1; getGoodsList();">查询</Button>
                        <Button style="margin: 0 10px;" size="small"
                            @click="pageNumber = 1; search = {}; getGoodsList(); getClassifyList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="goodRecycle-tab">
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
                    <Table border :columns="columns" :data="data" :loading="loading">
                        <template #fileSlot="{ row }">
                            <div v-viewer v-if="row.file">
                                <img :src="row.file.pic_0" style="width: 80px;" preview alt="" />
                            </div>
                            <div v-else> --- </div>
                        </template>

                        <!-- <template #rank="{ row, index }">
                            <div v-if="!row.rankType">
                                {{ row.rank }}
                                <Button size="small" style="margin-left: 5px" type="info"
                                    @click="data[index].rankType = true">编辑</Button>
                            </div>
                            <div v-else>
                                <Input v-model="data[index].rank" type="number" style="width: 50px" :min="0" size="small" />
                                <Button size="small" class="margin-left:5px" type="success"
                                    @click="contentRankClick(index)">
                                    保存
                                </Button>
                            </div>
                        </template> -->
                        <template #actionSlot="{ row }">
                            <Button type="primary" size="small" style="margin: 5px" @click="show(row)">编辑</Button>
                            <Poptip confirm transfer title="您确认恢复吗?" @on-ok="recover(row)">
                                <Button type="info" size="small" style="margin: 5px">恢复</Button>
                            </Poptip>
                            <Poptip confirm transfer title="您确认要永久删除吗?" @on-ok="remove(row)">
                                <Button type="error" size="small" style="margin-bottom: 5px">永久删除</Button>
                            </Poptip>
                        </template>
                    </Table>
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
    postGoodsInfoDelApi, // 永久删除
    postGoodsInfoRecycle, // 恢复
} from '@/api/account.js'
import { jsonToArray2 } from "@/libs/util.js";
export default {
    name: 'goodwillGoods-goodsRecycle',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            btnFlag: true,  // 分类展开按钮
            columns: [
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
                // {
                //     title: '规格',
                //     // key: 'address',
                //     align: 'center',
                //     width: 180
                // },
                // {
                //     title: '厂家',
                //     // key: 'address',
                //     align: 'center',
                //     width: 220,
                //     render: (h, params) => {
                //         return h("div", [params.row.merchant ? params.row.merchant.name : "---"]);
                //     },
                // },
                // {
                //     title: '有效期',
                //     // key: 'address',
                //     align: 'center',
                //     width: 180
                // },
                {
                    title: '市场价',
                    key: 'marketPrice',
                    align: 'center',
                    width: 180
                },
                {
                    title: '最低补贴价',
                    key: 'cyCardDiscount',
                    align: 'center',
                    width: 180
                },
                {
                    title: '成本价',
                    key: 'costPrice',
                    align: 'center',
                    width: 180
                },
                // {
                //     title: '商品毛利',
                //     // key: 'maoli',
                //     align: 'center',
                //     width: 180
                // },
                {
                    title: '库存',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '已销售',
                    key: 'initSales',
                    align: 'center',
                    width: 180
                },
                {
                    title: '运费模板',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [params.row.freightTmp ? params.row.freightTmp.name : '---']);
                    }
                },
                {
                    title: '供应商',
                    align: 'center',
                    width: 220,
                    render: (h, params) => {
                        return h("div", [params.row.merchant ? params.row.merchant.name : ""]);
                    },
                },
                // {
                //     title: '发货地址',
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
                            this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                        ]);
                    },
                },
                // {
                //     title: '创建者',
                //     // key: 'address',
                //     align: 'center',
                //     width: 180
                // },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 150,
                    align: 'center',
                    fixed: 'right'
                }
            ],
            data: [],  // 商品列表
            dataTree: [],  // 商品分类列表
            search: {}, // 头部搜索框数据
        }
    },
    created() {
        this.getGoodsList()  // 商品列表  
        this.getClassifyList()  //  商品分类列表
    },
    methods: {
        // 修改
        show(row = '') {
            let data = row.id
            this.$router.push({
                path: 'newGoods',
                query: { data }
            })
        },
        // 永久删除
        remove(row) {
            postGoodsInfoDelApi({ id: row.id })
                .then(res => {
                    this.$Message.success('操作成功！')
                    this.getGoodsList()
                }).catch(err => {
                    this.$Message.error('操作失败，请重试！')
                    this.getGoodsList()
                })
        },
        // 恢复到商品列表
        recover(row) {
            postGoodsInfoRecycle({ id: row.id, value: false })
                .then(res => {
                    this.$Message.success('操作成功！')
                    this.getGoodsList()
                }).catch(err => {
                    this.$Message.error('操作失败，请重试！')
                    this.getGoodsList()
                })
        },
        // 获取商品列表
        getGoodsList() {
            this.loading = true;
            let data1 = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'common',
                recycled: true
            };
            // this.clearSupplier()
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
                    // arr.forEach((v) => {
                    //     v.rankType = false;
                    // });
                    // 数据列表
                    // console.log(arr);
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
        // 商品分类被点击
        selectChange(row) {
            this.pageNumber = 1;
            this.search.categoryId = row[0].id
            // console.log(this.search.categoryId);
            this.getGoodsList()
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
.goodsRecycle {
    .goodRecycle-main {
        margin-top: 24px;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;

        .goodRecycle-tab {
            margin: 20px 0;
            display: flex;
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

            .tab-foot-page {
                margin-top: 20px;
            }
        }
    }
}
</style>