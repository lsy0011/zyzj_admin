<template>
    <div class='healthRecycle'>
        <!-- <h5>保健品回收站</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="保健品回收站" hidden-breadcrumb />
        </div>
        <div class="healthRecycle-main">
            <div class="search_top">
                <Space size="large">
                    <Space>
                        <strong>商品名称</strong>
                        <Input v-model="search.keywords" size="small" placeholder="请输入商品名称"></Input>
                    </Space>
                    <Space>
                        <strong>条形编码</strong>
                        <Input v-model="search.code" size="small" placeholder="请输入编码" />
                    </Space>
                    <Space>
                        <Button type="primary" size="small" @click="pageNumber = 0; getGoodsList();">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 0; search = {}; getGoodsList(); getClassifyList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="healthRecycle-tab">
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
                    <Table border :columns="columns" :data="data" :loading="loading" style="width: 100%; font-size: 15px;">
                        <template #file="{ row }">
                            <div v-viewer>
                                <img :src="row.file.pic_0" style="width: 80px;" preview alt="" />
                                <!-- <img :src="row.file.pic_0" :alt="row.file.pic_0" width="60px" height="60px"
                                    :data-source="row.file.pic_0" /> -->
                            </div>
                        </template>
                        <template #zanWu="{}">
                            <div>--</div>
                        </template>
                        <template #category="{ row }">
                            <div v-if="row.category">
                                {{ row.category.name }}
                            </div>
                            <div v-else-if="row.categoryId">
                                {{ CategoryIdToName(row.categoryId, categoryTree) }}
                            </div>
                            <div v-else>--</div>
                        </template>

                        <template #rank="{ index }">
                            <div>{{ index + 1 }}</div>
                        </template>
                        <template #action="{ row }">
                            <Button type="primary" size="small" style="margin: 5px" @click="show(row)">编辑</Button>
                            <Poptip confirm transfer title="您确认恢复吗?" @on-ok="recover(row)">
                                <Button type="info" size="small" style="margin: 5px">恢复</Button>
                            </Poptip>
                            <Poptip confirm transfer title="您确认恢复吗?" @on-ok="remove(row)">
                                <Button type="error" size="small" style="margin-bottom: 5px">永久删除</Button>
                            </Poptip>
                        </template>
                    </Table>
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
    postGoodsInfoDelApi, // 永久删除
    postGoodsInfoRecycle, // 恢复
} from '@/api/account.js'
import { jsonToArray2 } from "@/libs/util.js";
export default {
    name: 'healthCareGoods-healthRecycle',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            btnFlag: true,  // 分类展开按钮
            goodClassify: '', // 商品分类
            columns: [
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
                    slot: 'zanWu',
                    align: 'center',
                    width: 180
                },
                {
                    title: '品牌',
                    // key: 'address',
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        return h("div", [params.row.brand ? params.row.brand.name : ""]);
                    },
                },
                {
                    title: '规格',
                    // key: 'address',
                    slot: 'zanWu',
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
                    slot: 'zanWu',
                    align: 'center',
                    width: 180,
                    // render: (h, params) => {
                    //     return h("div", [
                    //         this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                    //     ]);
                    // },
                },
                {
                    title: '生产企业',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [params.row.brand ? params.row.brand.name : ""]);
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
                    slot: 'zanWu',
                    align: 'center',
                    width: 180
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
                                    }
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
            console.log(row);
            this.$router.push({
                path: 'newGoods',
                query: { data }
            })
        },
        // 永久删除
        remove(row) {
            postGoodsInfoDelApi({ id: row.id })
                .then(res => {
                    console.log(res);
                    this.getGoodsList()
                }).catch(err => {
                    err;
                })
        },
        // 恢复到商品列表
        recover(row) {
            console.log(row);
            postGoodsInfoRecycle({ id: row.id, value: false })
                .then(res => {
                    this.getGoodsList()
                }).catch(err => {
                    err;
                })
        },
        // 获取商品列表
        getGoodsList() {
            this.loading = true;
            let data1 = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'medical',
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
        // 商品分类被点击
        selectChange(row) {
            // console.log(row);
            if (row.length > 0) {
                this.search.categoryId = row[0].id
                // console.log(this.search.categoryId);
                this.getGoodsList()
            }
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
.healthRecycle-main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .healthRecycle-tab {
        margin: 20px 0;
        display: flex;
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

        .tab-foot-page {
            margin-top: 20px;
        }
    }
}
</style>