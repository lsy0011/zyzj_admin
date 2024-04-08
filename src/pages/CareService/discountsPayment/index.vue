<template>
    <div class='discountsPayment'>
        <!-- <h5>优惠付订单管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="关爱服务管理" content="优惠付订单管理" hidden-breadcrumb />
        </div>
        <div class="payment_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>日期</strong>
                        <DatePicker type="date" size="small" placeholder="请选择日期" @on-change="search.startDate = $event"
                            style="width: 200px" />
                        <strong>至</strong>
                        <DatePicker type="date" size="small" placeholder="请选择日期" @on-change="search.endDate = $event"
                            style="width: 200px" />
                    </Space>
                    <Space>
                        <strong>机构</strong>
                        <Select v-model="search.merchantId" filterable size="small" :remote-method="remoteMethodMerchant"
                            :loading="merchantLoading" placeholder="请输入机构关键字" style="width: 200px">
                            <Option v-for="(option, index) in merchantList" :value="option.id" :key="index">
                                {{ option.name }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>门店</strong>
                        <Select v-model="search.storeId" filterable size="small" :remote-method="remoteMethodStore"
                            :loading="storeLoading" placeholder="请输入门店关键字" style="width: 200px">
                            <Option v-for="(option, index) in storeList" :value="option.id" :key="index">
                                {{ option.name }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <!-- <Input size="small" placeholder="请输入商户关键字" style="width: 200px"></Input> -->
                        <!-- 支持模糊查询 -->
                        <Button type="primary" size="small"
                            @click="pageNumber = 1; pageSize = 10; getOrderList()">查询</Button>
                        <Button size="small" title="日期时间需手动清除"
                            @click="search = { status: '' }; pageNumber = 1; pageSize = 10; getOrderList();">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_title">
                <Space size="large" wrap>
                    <Space>
                        <Icon type="md-list" />
                        <strong>列表</strong>
                    </Space>
                    <Button size="small" :class="{ 'btn_border': search.status == '' }"
                        @click="pageNumber = 1; pageSize = 10; search.status = ''; getOrderList();">全部</Button>
                    <Button size="small" v-for="item in statusList" :key="item.code"
                        :class="{ 'btn_border': search.status == item.code }"
                        @click="pageNumber = 1; pageSize = 10; search.status = item.code; getOrderList();">
                        {{ item.name }}</Button>
                </Space>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading"></Table>
            <div class="table_footer">
                <Page :total="total" v-model="pageNumber" :page-size="pageSize" show-total size="small" show-elevator
                    show-sizer @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]"
                    @on-page-size-change="pageSizeChange" />
            </div>
        </div>
    </div>
</template>
<script>
import {
    getDirectOrderPageApi,   // 订单列表
    getDirectOrderStatusListApi,   // 状态
    getDirectOrderDetailApi,  // 详情

    getMerchantBasePageApi,   // 机构
    getStoreInfoPageApi,  // 门店
} from '@/api/account'
export default {
    name: 'discountsPayment',
    data() {
        return {
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
                    title: '订单号',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.orderNo)
                    }
                },
                {
                    title: '支付时间',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.statusTime ? params.row.statusTime.wait_confirm ? this.$Date(params.row.statusTime.wait_confirm).format('YYYY-MM-DD HH:mm:ss') : params.row.status.name : '---')
                    }
                },
                {
                    title: '机构名称',
                    align: 'center',
                    width: 220,
                    render: (h, params) => {
                        return h('div', params.row.merchant ? params.row.merchant.name : '---')
                    }
                },
                {
                    title: '门店名称',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.storeInfo ? params.row.storeInfo.name : '---')
                    }
                },
                {
                    title: '服务名称',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '订单金额',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.totalPrice ? params.row.totalPrice : '---')
                    }
                },
                {
                    title: '最大补贴比例',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.storePayCardDisPer ? params.row.storePayCardDisPer : '---')
                    }
                },
                {
                    title: '权益卡实际补贴金额',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.cardFundUsed ? params.row.cardFundUsed : '---')
                    }
                },
                {
                    title: '实付金额',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.payPrice ? params.row.payPrice : '---')
                    }
                },
                {
                    title: '支付方式',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '用户昵称',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', params.row.buyerInfo ? params.row.buyerInfo.name ? params.row.buyerInfo.name : params.row.buyerInfo.nickName : '---')
                    }
                },
                {
                    title: '用户手机号',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '结算金额',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('div', '---')
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 120,
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', params.row.status ? params.row.status.name : '---')
                    }
                },
            ],
            data: [],
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数

            statusList: [{
                code: "wait_pay",
                name: "待支付" //规则名称
            },
            {
                code: "wait_confirm",
                name: "待使用" //规则名称
            },
            {
                code: "success",
                name: "完成" //规则名称
            },
            {
                code: "cancel",
                name: "取消" //规则名称
            },
            {
                code: "refund",
                name: "已退款" //规则名称
            }],   // 订单状态
            search: { status: '' },  // 查询
            // 机构模糊查询
            merchantList: [],
            merchantLoading: false,
            merchantTime: null,
            // 门店模糊查询
            storeList: [],
            storeLoading: false,
            storeTime: null,
        }
    },
    created() {
        this.getOrderList();
        this.getStatusList();
    },
    methods: {
        // 订单分页
        getOrderList() {
            this.loading = true;
            let data = {
                biz: 'common',
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
            }
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (element) {
                        data[key] = element;
                    }
                }
            }
            getDirectOrderPageApi(data).then(res => {
                this.total = res.totalElements;
                let data = res.data;
                this.data = data;
                this.loading = false;
            })
        },
        // 订单状态
        getStatusList() {
            getDirectOrderStatusListApi().then(res => {
                // console.log(res);
            })
        },
        // 机构 关键字查询
        remoteMethodMerchant(query) {
            if (query !== '') {
                this.merchantLoading = true;
                if (this.merchantTime) {
                    clearTimeout(this.merchantTime);
                }
                this.merchantTime = setTimeout(() => {
                    getMerchantBasePageApi({
                        keywords: query,
                        biz: 'common',
                        type: 'service'
                    }).then(res => {
                        this.merchantList = res.data;
                        this.merchantLoading = false;
                    })
                }, 200);
            } else {
                this.merchantList = [];
            }
        },
        // 门店 关键字查询
        remoteMethodStore(query) {
            if (query !== '') {
                this.storeLoading = true;
                if (this.storeTime) {
                    clearTimeout(this.storeTime);
                }
                this.storeTime = setTimeout(() => {
                    this.storeLoading = false;
                    getStoreInfoPageApi({
                        keywords: query,
                        biz: 'common',
                        // type: 'service'
                    }).then(res => {
                        this.storeList = res.data;
                    })
                }, 200);
            } else {
                this.storeList = [];
            }
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getRolePage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getRolePage();
        },
    }
}
</script>
<style scoped lang='less'>
.payment_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .table_title {
        width: 100%;
        font-size: 15px;
        margin: 15px 0;
    }

    .table_footer {
        margin-top: 15px;
    }
}

.btn_border {
    color: #57a3f3;
    border-color: #57a3f3;
    border-radius: 3px;
}
</style>