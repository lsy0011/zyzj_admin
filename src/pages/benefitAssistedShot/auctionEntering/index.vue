<template>
    <div class='auctionEntering'>
        <!-- <h5>拍品录入管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="拍品管理" hidden-breadcrumb />
        </div>
        <div class="entering_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>拍卖公司</strong>
                        <Select v-model="search.merchantId" size="small" clearable filterable
                            :remote-method="remoteMethodMerFn" :loading="merLoading">
                            <Option v-for="(item, index) in merchantList" :value="item.id" :key="index"> {{ item.name }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>拍卖阶段</strong>
                        <Select v-model="search.auState" size="small">
                            <Option value="wait"> 未开始</Option>
                            <Option value="underway">进行中</Option>
                            <Option value="finished">已结束</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>拍品名称</strong>
                        <Input v-model="search.keywords" size="small" clearable placeholder="请输入名称关键字"></Input>
                    </Space>
                    <Space>
                        <Button size="small" type="primary" @click="pageNumber = 1; getGoodsPage()">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; pageSize = 10; statuType = 1; search = {}; getGoodsPage()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_tit">
                <Space size="large" wrap>
                    <Space>
                        <Icon type="md-list"></Icon>
                        <strong>拍品列表</strong>
                    </Space>
                    <Button size="small" v-for="item in statusList" :class="{ 'show_btn': statuType == item.id }"
                        :key="item.id" @click="searchStatusFn(item)">{{ item.title }}</Button>
                    <!-- <Button size="small">未审核</Button>
                    <Button size="small">未通过</Button>
                    <Button size="small">已通过</Button> -->
                    <!-- <Button @click="addGoodsAction()">添加</Button> -->
                </Space>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #imgSlot="{ row }">
                    <div v-if="row.pic">
                        <img :src="row.pic[0]" @click="perviewList = row.pic; visibleImg = true;" class="table_img" alt="">
                    </div>
                    <div v-else> 暂未上传 </div>
                </template>
                <!-- 上架 -->
                <template #rackSlot="{ row }">
                    <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                        @on-change="i => rackChangeFn(i, row, true)"></Switch>
                </template>
                <!-- 推荐 -->
                <template #suggestSlot="{ row }">
                    <Switch v-model="row.hot" @on-change="i => onOkHotFn(i, row.id)"></Switch>
                </template>
                <template #actionSlot="{ row }">
                    <!-- 待审核状态下 显示编辑 -->
                    <template v-if="!row.approvalInfo">
                        <Button type="success" size="small" @click="passAuditFn(row, 'success')">审核通过</Button>
                        <Button type="error" size="small" @click="passAuditFn(row, 'reject')">驳回</Button>
                    </template>

                    <Button type="info" size="small" @click="seeDetailsFn(row)">查看详情</Button>

                    <!-- 审核通过状态下显示 -->
                    <!-- <template v-if="row.approvalInfo && row.approvalInfo.state.code == 'success'">
                        <Button size="small" @click="setRuleFn(row)">设置捐赠规则</Button>
                    </template> -->
                </template>
            </Table>
            <div style="margin: 20px 0 0;">
                <Page :total="total" v-model="pageNumber" :page-size="pageSize" size="small" show-elevator show-sizer
                    show-total @on-page-size-change="pageSizeChange" @on-change="changePage" />
            </div>
        </div>
        <!-- 审核 -->
        <Modal v-model="modal" title="备注" width="300">
            <Input v-model="approvalList.remark" type="textarea" :rows="3" placeholder="请输入备注内容" />
            <template #footer>
                <Button type="primary" @click="approvalGoodsFn()">提交</Button>
                <Button @click="modal = false; approvalList = {}">取消</Button>
            </template>
        </Modal>
        <!-- 详情 -->
        <Modal v-model="dtsModal" :title="`拍品详情 (${detailsData.auctionState ? detailsData.auctionState.name : ''}) `"
            width="660">
            <div class="see_box">
                <div class="only_data">
                    <span>拍卖公司：</span>
                    <strong>{{ detailsData.merchant ? detailsData.merchant.name : '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>委托方：</span>
                    <strong>{{ detailsData.entrustOrg ? detailsData.entrustOrg.name : '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>拍品名称：</span>
                    <strong>{{ detailsData.name || '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>拍品编号：</span>
                    <strong>{{ detailsData.barcode || '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>拍品分类：</span>
                    <strong>{{ detailsData.category ? detailsData.category.name : '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>规格：</span>
                    <strong>{{ detailsData.spec || '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>数量单位：</span>
                    <strong>{{ detailsData.quantityUnit || '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>起拍价：</span>
                    <strong>{{ detailsData.priceStart || '---' }} 元 </strong>
                </div>
                <div class="only_data">
                    <span>预估价：</span>
                    <strong>{{ detailsData.priceAssess || '---' }} 元 </strong>
                </div>
                <div class="only_data">
                    <span>保证金：</span>
                    <strong>{{ detailsData.priceDeposit || '---' }} 元 </strong>
                </div>
                <div class="only_data">
                    <span>起拍时间：</span>
                    <strong>
                        {{ detailsData.saleStartTime ? $Date(detailsData.saleStartTime).format('YYYY-MM-DD HH:mm') :
                            '---' }}
                    </strong>
                </div>
                <div class="only_data">
                    <span>截止时间：</span>
                    <strong>
                        {{ detailsData.saleStartTime ? $Date(detailsData.saleEndTime).format('YYYY-MM-DD HH:mm') :
                            '---' }}
                    </strong>
                </div>
                <div class="only_data">
                    <span>拍卖周期：</span>
                    <strong>{{ setFormattingTime(detailsData.saleTimeLength) || '---' }} </strong>
                </div>
                <div class="only_data">
                    <span>加价档：</span>
                    <strong>{{ detailsData.priceAddLevel ? detailsData.priceAddLevel.name : '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>佣金：</span>
                    <strong>{{ detailsData.auServiceCharge * 100 || '' }} % </strong>
                </div>
                <div class="only_data">
                    <span>交付方式：</span>
                    <strong>{{ detailsData.deliveryType ? detailsData.deliveryType.name : '---' }}</strong>
                </div>
                <div class="only_data">
                    <span>基金会：</span>
                    <strong>{{ detailsData.foundation ? detailsData.foundation.name : '---' }}</strong>
                </div>
                <div class="only_data" v-if="detailsData.freightFee">
                    <span>所需运费：</span>
                    <strong>{{ detailsData.freightFee ? detailsData.freightFee : '---' }} 元 </strong>
                </div>
                <div class="only_data_all">
                    <span>拍品图片：</span>
                    <div v-if="detailsData.pic && detailsData.pic.length">
                        <img :src="item" v-for="(  item, index  ) in   detailsData.pic  " :key="index" width="120" alt="">
                    </div>
                    <strong v-else>暂无图片</strong>
                </div>
                <div class="only_data_all">
                    <span>图文详情：</span>
                    <Button type="primary" ghost size="small"
                        @click="detaTitle = '图文详情'; modalDeta = true; detaData = detailsData.details">查看</Button>
                    <!-- <div class="wang_box" v-html="detailsData.details"></div> -->
                </div>
                <div class="only_data_div">
                    <span>重要提示：</span>
                    <Button type="primary" ghost size="small"
                        @click="detaTitle = '重要提示'; modalDeta = true; detaData = detailsData.section.au_notice">查看</Button>
                    <!-- <div>{{ detailsData.section ? detailsData.section.au_notice : '---' }}</div> -->
                </div>
                <div class="only_data_div">
                    <span>竞买协议：</span>
                    <Button type="primary" ghost size="small"
                        @click="detaTitle = '竞买协议'; modalDeta = true; detaData = detailsData.section.au_agreement">查看</Button>
                    <!-- <div>{{ detailsData.section ? detailsData.section.au_agreement : '---' }}</div> -->
                </div>
                <div class="only_data_div">
                    <span>特别规定：</span>
                    <Button type="primary" ghost size="small"
                        @click="detaTitle = '特别规定'; modalDeta = true; detaData = detailsData.section.au_stipulation">查看</Button>
                    <!-- <div>{{ detailsData.section ? detailsData.section.au_stipulation : '---' }}</div> -->
                </div>
                <div class="only_data_div">
                    <span>竞买公告：</span>
                    <Button type="primary" ghost size="small"
                        @click="detaTitle = '竞买公告'; modalDeta = true; detaData = detailsData.section.au_affiche">查看</Button>
                    <!-- <div>{{ detailsData.section ? detailsData.section.au_affiche : '---' }} </div> -->
                </div>
                <div class="only_data_div">
                    <span>竞拍规则：</span>
                    <Button type="primary" ghost size="small"
                        @click="detaTitle = '竞拍规则'; modalDeta = true; detaData = detailsData.section.au_donate">查看</Button>
                    <!-- <div>{{ detailsData.section ? detailsData.section.au_donate : '---' }} </div> -->
                </div>
            </div>
        </Modal>
        <!-- 图文详情 -->
        <Modal v-model="modalDeta" :title="detaTitle" width="450">
            <div class="vhtem_box">
                <div v-html="handleDetailsLib(detaData)"></div>
            </div>
        </Modal>
        <!-- 图片查看 -->
        <ImagePreview v-model="visibleImg" :preview-list="perviewList" />
    </div>
</template>
<script>
import {
    getGoodsCategoryTreeApi,  // 商品分类
    getGoodsInfoPageApi,  //  商品列表
    getGoodsInfoDetailApi,     // 拍品详情
    getSupplierListApi,  //  获取供应商列表
    postGoodsInfoStatusApi, // 商品状态
    postGoodsInfoRecycle, //进出回收站
    postGoodsInfoHotApi,   // 是否推荐

    postGoodsInfoApprovalApi,   // 审核拍品

    getMerchantBasePageApi,   // 拍卖公司
} from '@/api/account.js'
export default {
    name: 'auctionEntering',
    data() {
        return {
            loading: false,
            modal: false,
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
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
                    title: '拍品名称',
                    align: 'center',
                    minWidth: 160,
                    key: 'name'
                },
                {
                    title: '图片',
                    slot: 'imgSlot',
                    align: 'center',
                    minWidth: 130,
                },
                {
                    title: '规格',
                    key: 'spec',
                    align: 'center',
                    minWidth: 130,
                },
                // {
                //     title: '数量',
                //     key: 'initSales',
                //     align: 'center',
                //     minWidth: 130,
                // },
                {
                    title: '起拍价',
                    key: 'priceStart',
                    align: 'center',
                    width: 130,
                },
                {
                    title: '预估价',
                    key: 'priceAssess',
                    align: 'center',
                    width: 130,
                },
                {
                    title: '交付方式',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        return h('div', params.row.deliveryType.name)
                    }
                },
                {
                    title: '拍卖公司',
                    align: 'center',
                    minWidth: 190,
                    render: (h, params) => {
                        return h('div', params.row.merchant ? params.row.merchant.name || '--' : '---')
                    }
                },
                {
                    title: '拍卖周期',
                    align: 'center',
                    width: 190,
                    render: (h, params) => {
                        return h('div', this.$Date(params.row.saleStartTime).format('YYYY-MM-DD HH:mm:ss') + ' 至 ' + this.$Date(params.row.saleEndTime).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '拍卖状态',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('div', params.row.auctionState.name)
                    }
                },
                {
                    title: '审核状态',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', params.row.approvalInfo ? params.row.approvalInfo.state.name || '' : '---')
                    }
                },
                {
                    title: '审核备注',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', params.row.approvalInfo ? params.row.approvalInfo.approveResult || '' : '---')
                    }
                },
                {
                    title: '推荐',
                    align: 'center',
                    width: 90,
                    slot: 'suggestSlot'
                },
                {
                    title: '上架状态',
                    align: 'center',
                    width: 100,
                    slot: 'rackSlot',
                    fixed: 'right'
                    // render: (h, params) => {
                    //     return h('div', params.row.auctionState.name)
                    // }
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 180,
                    slot: 'actionSlot',
                    fixed: 'right'
                },
            ],
            data: [],
            search: {},   // 查询
            dtsModal: false,
            detailsData: {},   // 详情
            statusList: [
                { title: '全部', key: '', id: 1 },
                { title: '待审批', key: 'wait', id: 2 },
                { title: '未通过', key: 'reject', id: 3 },
                { title: '审批中', key: 'underway ', id: 4 },
                { title: '已通过', key: 'success', id: 5 },
            ],   // 状态列表
            statuType: 1,
            modalDeta: false,   // 图文详情
            detaData: '',    // 信息
            detaTitle: '',   // 弹框头
            visibleImg: false,   // 查看图片
            perviewList: [],    // 图片集合

            approvalList: {},   // 审核

            merchantList: [],    // 拍卖公司
            merLoading: false,
            merTime: null,

        }
    },
    created() {
        this.getGoodsPage();
    },
    methods: {
        // 拍品分页
        getGoodsPage() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'auction',
                recycled: false,
                ...this.search,
            }
            this.loading = true;
            getGoodsInfoPageApi(data).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;
            })
        },
        // 上架
        rackChangeFn(value, row, key) {

            // 通过审核后 直接上架
            if (!key) {
                postGoodsInfoStatusApi({ id: row.id, value }).then(res => {
                    this.$Message.success('操作成功！');
                    this.getGoodsPage();
                }).catch(err => {
                    this.getGoodsPage();
                });
            } else {

                // 审核通过后操作状态
                if (!row.approvalInfo) {

                    this.$Message.warning('未进行审核，请先审核！');
                    this.getGoodsPage();

                } else {

                    if (row.approvalInfo.state.code == 'success') {

                        if (row.auctionState.code == 'wait') {
                            postGoodsInfoStatusApi({ id: row.id, value }).then(res => {
                                this.$Message.success('操作成功！');
                                this.getGoodsPage();
                            }).catch(err => {
                                this.getGoodsPage();
                            })

                        } else {
                            let title = row.auctionState.code == 'underway' ? '该拍品正在进行中，无法不能下架' : '该拍品已结束，无法再次上架';

                            this.$Message.warning(title);
                            this.getGoodsPage();
                        }

                    } else {
                        this.$Message.error('审核未通过！')
                    };
                };
            };
        },
        // 是否推荐
        onOkHotFn(key, id) {
            postGoodsInfoHotApi({ value: key, id }).then(res => {
                this.$Message.success('操作成功！');
                this.getGoodsPage();
            }).catch(err => {
                this.getGoodsPage();
            })

        },
        // 查看详情
        seeDetailsFn(row) {
            getGoodsInfoDetailApi(row.id).then(res => {
                this.detailsData = res;
                this.dtsModal = true;
                if (row.pic) {
                    this.detailsData.pic = row.pic;
                } else {
                    this.detailsData.pic = [];
                }
            })
        },
        // 详情，编辑
        editGoodsFn(row) {
            this.$router.push({
                path: 'enteringDetails',
                query: { id: row.id }
            })
        },
        // 添加
        addGoodsAction() {
            this.$router.push({
                path: '/benefitAssistedShot/enteringDetails',
            })
        },
        // 切换审批状态
        searchStatusFn(item) {
            this.statuType = item.id;
            this.search.approState = item.key;
            this.getGoodsPage();

        },
        // 处理图片显示100%
        handleDetailsLib(mycontent) {
            let newStr = '';
            if (mycontent) {
                newStr = mycontent.replace(/\<img/gi, `<img style="width:100%;" `);
                newStr = newStr.replace(/style=""/gi, '');
            }
            return newStr
        },
        passAuditFn(row, type) {
            this.approvalList = {
                id: row.id,
                state: type,
            };
            this.modal = true;
        },
        // 审批拍品
        approvalGoodsFn() {

            postGoodsInfoApprovalApi(this.approvalList).then(res => {

                if (this.approvalList.state == 'success') {
                    this.rackChangeFn('enabled', this.approvalList, false)
                }

                // this.$Message.success('审核完成');
                this.modal = false;
                this.getGoodsPage();
            })
        },
        // 拍卖公司模糊查询
        remoteMethodMerFn(keywords) {
            if (keywords !== '') {
                this.merLoading = true;
                this.merTime = setTimeout(() => {
                    this.merLoading = false;
                    getMerchantBasePageApi({
                        keywords,
                        pageNumber: 1,
                        pageSize: 100,
                        biz: 'auction',
                        type: 'FACO',
                        approState: 'success',
                    }).then(res => {
                        this.merchantList = res.data;
                    })
                }, 200);
            } else {
                this.merchantList = [];
            }
        },
        // 设置捐赠规则
        setRuleFn(row) {

            this.$router.push({
                path: 'donateRule',
                query: {
                    id: row.id
                }
            });
        },
        // 格式化时间 
        setFormattingTime(time) {
            let min = Math.floor(time / 60);
            return (min ? min + 'h ' : '') + ((time - min * 60) + ' min');
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getGoodsPage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getGoodsPage();
        },
    },
    unmounted() {
        this.merTime = null;
    }

}
</script>
<style scoped lang='less'>
.entering_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .search_top {
        margin-bottom: 16px;
    }

    .table_tit {
        margin-bottom: 16px;
        font-size: 15px;

        .show_btn {
            border: 1px solid #2d8cf0;
            color: #2d8cf0;
        }
    }

    .table_img {
        width: 120px;
        max-height: 120px;
        margin-top: 5px;
    }
}

.see_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &>div {
        margin-bottom: 20px;

        span {
            display: inline-block;
            width: 85.2px; // 30%
            text-align: right;
            // padding-right: 8px;
            // box-sizing: border-box;
        }

    }

    .only_data {
        width: 50%;
    }

    .only_data_all {
        width: 100%;
        display: flex;

        &>div {
            width: 84.8%;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 5px 10px;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            height: 130px;
            overflow: auto;

            //滚动条css
            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 5px;
                /*高宽分别对应横竖滚动条的尺寸*/
                height: 5px;
            }

            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 5px;
                // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                background: #cecece;
            }

            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                /*border-radius: 5px;*/
                background: #fff;
            }

            img {
                margin-right: 5px;
                // height: auto;
                // max-height: 120px;
            }

        }

        .wang_box {

            :deep(img) {
                width: 100%;
                margin: 0;
            }
        }
    }

    .only_data_div {
        width: 50%;
        display: flex;
        flex-wrap: nowrap;

        &>div {
            width: 70%;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 5px 10px;
            box-sizing: border-box;
            height: 120px;
            overflow: auto;

            //滚动条css
            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 5px;
                /*高宽分别对应横竖滚动条的尺寸*/
                height: 5px;
            }

            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 5px;
                // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                background: #cecece;
            }

            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                /*border-radius: 5px;*/
                background: #fff;
            }
        }
    }
}

.vhtem_box {
    max-height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
}

.ivu-table-cell-slot {
    button {
        margin: 5px;
    }
}
</style>