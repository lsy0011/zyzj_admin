<template>
    <div class='remedyRecycle'>
        <!-- <h5>药品回收站</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="医药回收站" hidden-breadcrumb />
        </div>
        <div class="remedyRecycle-main">
            <div class="class_type">
                <Button :class="{ 'btn_on': medicalType == 'drug' }"
                    @click="biz = 'medical'; medicalType = 'drug'; loading = true; getGoodsList()">药品</Button>
                <Button :class="{ 'btn_on': medicalType == 'health' }"
                    @click="biz = 'health'; medicalType = 'health'; loading = true; getGoodsList()">保健品</Button>
            </div>
            <div class="search_top">
                <Space size="large">
                    <!-- <Col span="4">
                    <strong>商品分类</strong>
                    <TreeSelect v-model="goodClassify" :data="dataTree" style="width:70%" placeholder="请选择商品分类" />
                    </Col> -->
                    <!-- <Col span="6">
                    <div style="display: inline-block;">
                        <strong>创建时间</strong>
                        <DatePicker :value="search.timeCreatedBegin" @on-change="search.timeCreatedBegin = $event"
                            type="date" placeholder="起始日期" transfer size="small" style="width: 35%" class="mr8">
                        </DatePicker>
                        <p style="margin: 0 5px; display: inline-block;">至</p>
                        <DatePicker :value="search.timeCreatedEnd" @on-change="search.timeCreatedEnd = $event" type="date"
                            size="small" placeholder="结束日期" transfer style="width: 35%; margin-right: 20px" class="mr8">
                        </DatePicker>
                    </div>
                    </Col> -->
                    <!-- <Col span="4">
                    <strong>商品编号</strong>
                    <Input v-model="search.code" size="small" placeholder="请选择商品编号" style="width: 70%" />
                    </Col> -->
                    <Space>
                        <strong>条形编码</strong>
                        <Input v-model="search.code" size="small" placeholder="请输入编码" />
                    </Space>
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
                        <Input v-model="search.keywords" size="small" placeholder="请输入商品名称关键字"></Input>
                        <Button type="primary" size="small" @click="pageNumber = 1; getGoodsList();">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; search = {}; getGoodsList(); getClassifyList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="remedyRecycle-tab">
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
                    <Table border :columns="columns" :data="data" :loading="loading"
                        style="width: 100%; font-size: 15px;">
                        <template #fileSlot="{ row }">
                            <div v-viewer v-if="row.pic && row.pic.length > 0">
                                <img v-if="row.pic" :src="row.pic[0]" style="width: 80px;" alt="">
                            </div>
                            <div v-else> --- </div>
                        </template>
                        <template #statuSlot="{ row }">
                            <div v-if="row.status.code">
                                <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                                    @on-change="(i) => changeStatus(i, row)">
                                </Switch>
                            </div>
                            <div v-else>
                                <Switch true-value="enabled" false-value="disabled"
                                    @on-change="(i) => changeStatus(i, row)">
                                </Switch>
                            </div>
                        </template>
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
    postGoodsInfoStatusApi,  // 商品状态
} from '@/api/account.js'
import { jsonToArray2 } from "@/libs/util.js";
export default {
    name: 'healthCareGoods-remedyRecycle',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            btnFlag: true,  // 分类展开按钮
            goodClassify: '', // 商品分类
            stateDate: [],  // 起始时间
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    width: 90,
                    render: (h, params) => {
                        return h('div', params.index + 1 + this.pageSize * (this.pageNumber - 1 < 0 ? 0 : this.pageNumber - 1))
                    }
                },
                {
                    title: '药品id',
                    key: 'id',
                    align: 'center',
                    width: 135
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
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        return h("div", [params.row.brand ? params.row.brand.name : "---"]);
                    },
                },
                // {
                //     title: '规格',
                //     // key: 'address',
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
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h("div", [params.row.validity ? params.row.validity : "---"]);
                    },
                },
                {
                    title: '生产企业',
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
                        return h("div", [params.row.approval ? params.row.approval : "---"]);
                    },
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
                    title: '价格',
                    key: 'marketPrice',
                    align: 'center',
                    width: 120
                },
                {
                    title: '销量',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h("div", [params.row.initSales ? params.row.initSales : "---"]);
                    },
                },
                // {
                //     title: '状态',
                //     align: 'center',
                //     fixed: "right",
                //     width: 90,
                //     slot: 'statuSlot',
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
            medicalType: 'drug',  // drug药品   、保健品 health
            loadingSupplier: false,  // 供应商 搜索
            optionsSupplier: [],  // 数据
            timeSupplier: null,  // 
        }
    },
    created() {
        this.getGoodsList()  // 商品列表  
        this.getClassifyList()  //  商品分类列表
    },
    methods: {
        // 修改
        show(row = '') {
            let data = {
                id: row.id,
                type: this.medicalType,
            }
            let url = 'newsRemedy';
            this.$router.push({
                path: url,
                query: data
            })
        },
        // 永久删除
        remove(row) {
            postGoodsInfoDelApi({ id: row.id })
                .then(res => {
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getGoodsList();
                    }
                }).catch(err => {
                    this.$Message.error('操作失败，请重试！')
                    this.getGoodsList()
                })
        },
        // 恢复到商品列表
        recover(row) {
            postGoodsInfoRecycle({ id: row.id, value: false })
                .then(res => {
                    if (res) {
                        this.$Message.success("操作成功！");
                        this.getGoodsList();
                    }
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
                biz: 'medical',
                medicalType: this.medicalType,
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
        // 商品状态
        changeStatus(value, row) {
            postGoodsInfoStatusApi({
                id: row.id,
                value
            }).then(res => {
                if (res) {
                    this.$Message.success('修改成功');
                    this.getGoodsList();
                }
            }).catch(err => {
                this.getGoodsList();
                this.$Message.warning('该商品尚未设置规格，请设置规格后再上架')
            })
        },
        // 供应商模糊查询 // 获取供应商列表
        remoteMethod1(query) {
            if (query !== '') {
                this.loading1 = true;
                if (this.timeSupplier) {
                    clearTimeout(this.timeSupplier);
                }
                this.timeSupplier = setTimeout(() => {
                    this.loading1 = false;
                    getSupplierListApi({ keywords: query })
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
.remedyRecycle-main {
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

    .remedyRecycle-tab {
        margin: 20px 0;
        display: flex;
    }

    .list-tab-box-left {
        flex: 0;
        cursor: pointer;
        margin-right: 15px;

        .shop-tree {
            padding: 10px;
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
</style>