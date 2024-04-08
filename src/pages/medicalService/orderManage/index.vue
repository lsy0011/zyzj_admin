<template>
    <div class='orderManage'>
        <!-- <h5>订单管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医疗服务管理" content="订单管理" hidden-breadcrumb />
        </div>
        <div class="orderManage_main">
            <div class="search_top">
                <Space size="large">
                    <!-- <Space style="margin-bottom: 10px;">
                    <strong>创建日期</strong>
                    <DatePicker type="date" format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择开始日期" size="small"
                        style="width: 140px;" />
                    <strong>至</strong>
                    <DatePicker type="date" format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择结束日期" size="small"
                        style="width: 140px;margin-right: 10px;" />
                </Space> -->
                    <!-- <Space style="margin-bottom: 10px;">
                    <strong>城市</strong>
                </Space> -->
                    <!-- <Space style="margin-bottom: 10px;">
                    <strong>类型</strong>
                    <Select v-model="consume" placeholder="请选择类型" clearable size="small"
                        style="width:140px;margin-right: 10px; ">
                        <Option value="000">线上</Option>
                        <Option value="0001">线下</Option>
                    </Select>
                </Space> -->
                    <!-- <Space style="margin-bottom: 10px;">
                    <strong>机构</strong>
                    <Select v-model="seed" placeholder="请选择机构" clearable size="small"
                        style="width:140px;margin-right: 10px;">
                        <Option value="0002">牙科</Option>
                        <Option value="0001">脑壳</Option>
                    </Select>
                </Space> -->
                    <!-- <Space style="margin-bottom: 10px;">
                    <strong>门店</strong>
                    <Select v-model="consume" placeholder="请选择门店" clearable size="small"
                        style="width:140px;margin-right: 10px; ">
                        <Option value="000">是</Option>
                        <Option value="0001">否</Option>
                    </Select>
                </Space> -->
                    <!-- <Space style="margin-bottom: 10px;">
                    <strong>套餐分类</strong>
                    <Select v-model="consume" placeholder="请选择套餐分类" clearable size="small"
                        style="width:140px;margin-right: 10px; ">
                        <Option value="000">1</Option>
                        <Option value="0001">2</Option>
                    </Select>
                </Space> -->
                    <Space style="margin-bottom: 10px;">
                        <Input v-model="search.keywords" placeholder="请输入订单号关键字" clearable size="small" />
                        <Button type="primary" size="small" @click=" pageNumber = 1; pageSize = 10; getOrderList()">
                            查询</Button>
                        <Button style="margin-right: 10px;" size="small"
                            @click="search = {}; pageNumber = 1; pageSize = 10; classBtn = 0; getOrderList();">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="modul_add" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between;">
                    <Space size="large" wrap>
                        <strong style="font-size: 15px;">
                            <Icon type="md-reorder" />订单列表
                        </strong>

                        <Button :class="{ 'btn_border': classBtn == 0 }" size="small"
                            @click="pageNumber = 1; classBtn = 0; search.status = ''; getOrderList();">全部</Button>
                        <Button :class="{ 'btn_border': classBtn == item.id }" size="small"
                            @click="pageNumber = 1; classBtn = item.id; search.status = item.code; getOrderList();"
                            v-for="item in orderStatus" :key="item.code">
                            {{ item.name }}
                        </Button>
                    </Space>
                    <Button type="success" size="small" style="margin-right: 10px;"
                        @click="this.$Message.info('开发中')">导出</Button>
                </div>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #kong="{ }">
                    <p>--</p>
                </template>
                <template #index="{ index }">
                    <p>{{ index + 1 }}</p>
                </template>
                <template #imgPic="{ row }">
                    {{ row.servicePic }}
                </template>
                <template #action="{ row }">
                    <Button type="info" size="small" @click="orderMessage(row)">查看详情</Button>
                </template>
            </Table>
            <div style="margin-top: 15px;">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <!-- 查看详情 -->
        <Modal v-model="modal1" width="980" :closable="false">
            <template #header>
                <p style="color:#000;text-align:center;">
                    <Icon type="ios-barcode"></Icon>
                    <span>订单详情</span>
                </p>
            </template>
            <Steps :current="current">
                <Step title="用户下单"
                    :content="list.statusTime && list.statusTime.wait_pay ? this.$Date(list.statusTime.wait_pay).format('YYYY-MM-DD HH:mm') : ''">
                </Step>
                <Step title="等待支付"
                    :content="list.statusTime && list.statusTime.wait_confirm ? this.$Date(list.statusTime.wait_confirm).format('YYYY-MM-DD HH:mm') : ''">
                </Step>
                <Step title="支付成功"
                    :content="list.statusTime && list.statusTime.wait_confirm ? this.$Date(list.statusTime.wait_confirm).format('YYYY-MM-DD HH:mm') : ''">
                </Step>
                <Step title="待核销"
                    :content="list.statusTime && list.statusTime.wait_confirm ? this.$Date(list.statusTime.wait_confirm).format('YYYY-MM-DD HH:mm') : ''">
                </Step>
                <Step title="入店核销"
                    :content="list.statusTime && list.statusTime.success ? this.$Date(list.statusTime.success).format('YYYY-MM-DD HH:mm') : ''">
                </Step>
                <Step title="用户评价"
                    :content="list.statusTime && list.statusTime.success ? this.$Date(list.statusTime.success).format('YYYY-MM-DD HH:mm') : ''">
                </Step>
            </Steps>
            <div class="modal_main">
                <div style="display: flex;justify-content: space-between;margin-bottom: 15px;">
                    <strong v-font="17">订单详细信息</strong>
                    <strong v-font="18" v-color="'#2d8cf0'">{{ verificationStatusFn(list.items) }}</strong>
                </div>
                <Row style="margin-bottom: 10px;">
                    <Col span="2">
                    </Col>
                    <Col span="22" style="display: flex ; align-items: center;" v-viewer>
                    <img :src="list.buyerInfo.portrait" alt="" width="60" height="60"
                        style="border-radius: 50%; margin-right: 10px;">
                    <p v-if="list.buyerInfo.realName">姓名：{{ list.buyerInfo.realName }}</p>
                    <p v-else>姓名：{{ list.buyerInfo.nickName || '---' }}</p>
                    <p style="margin-left: 15px;">手机号： {{ list.buyerInfo ? list.buyerInfo.mobile || '---' : '' }}</p>
                    </Col>
                    <!-- <Col span="7"></Col> -->
                </Row>
                <Row style="margin-bottom: 10px;">
                    <Col span="2">
                    </Col>
                    <Col span="3">订单编号：</Col>
                    <Col span="7">{{ list.orderNo }}</Col>
                </Row>
                <Row style="margin-bottom: 10px;">
                    <Col span="2">
                    </Col>
                    <Col span="3">下单时间：</Col>
                    <Col span="7">{{ list.timeCreated ?
                        this.$Date(list.timeCreated).format('YYYY-MM-DD HH:mm:ss') : '' }}</Col>
                </Row>
                <Row style="margin-bottom: 10px;">
                    <Col span="2">
                    </Col>
                    <Col span="3">套餐名称：</Col>
                    <Col span="7">{{ list.serviceInfo || '' }}</Col>
                </Row>
                <Row style="margin-bottom: 10px;">
                    <Col span="2">
                    </Col>
                    <Col span="2">金额：</Col>
                    <Col span="2">￥{{ list.payPrice || '' }}</Col>
                    <Col span="3" style="text-align: right;">服务费：</Col>
                    <Col span="2">￥{{ list.payPrice || '' }}</Col>
                    <Col span="3" style="text-align: right;">数量：</Col>
                    <Col span="2">￥{{ list.quantity || '' }}</Col>
                </Row>
                <Row style="margin-bottom: 10px;">
                    <Col span="2">
                    </Col>
                    <Col span="3">支付时间：</Col>
                    <Col span="7">{{ list.payInfo ?
                        this.$Date(list.payInfo.payTime || '').format('YYYY-MM-DD HH:mm:ss') : '未支付' }}</Col>
                </Row>
                <Row style="margin-bottom: 10px;">
                    <Col span="2">
                    </Col>
                    <Col span="3">套餐图片：</Col>
                    <Col span="19">
                    <img :src="'http://admin.zyzj.iisu.cn/' + list.servicePic" alt="" width="80" height="80">
                    </Col>
                </Row>
                <div v-for="(item, index) in list.items" :key="item.id" style="border: #ddd dashed 1px;">
                    <Row style="margin-bottom: 10px;">
                        <Col span="2">
                        </Col>
                        <Col span="3">核销时间：</Col>
                        <Col span="7">
                        {{ item.wo ? this.$Date(item.wo.time).format('YYYY-MM-DD HH:mm:ss') : '---' }}
                        </Col>
                        <Col span="11" style="text-align: right;font-weight: 600;"> 核销单{{ index + 1 }}：
                        <span v-color="(item.wo ? '#129646' : '#ee0324')">{{ item.wo ? '已使用' : '未使用' }}</span>
                        </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2">
                        </Col>
                        <Col span="3">核销门店：</Col>
                        <Col span="7"> {{ item.woStore ? item.woStore.name || '---' : '---' }} </Col>
                    </Row>
                    <Row style="margin-bottom: 10px;">
                        <Col span="2">
                        </Col>
                        <Col span="3">核销店员：</Col>
                        <Col span="7">
                        {{ item.wo && item.wo.clerk ? item.wo.clerk.name : item.woClerk ? item.woClerk.name || '---' : '---'
                        }}
                        </Col>
                    </Row>
                </div>
            </div>
            <template #footer>
                <Button type="info" size="large" long @click="this.modal_loading = false;
                this.modal1 = false;">确认</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getServiceOrderPageApi, // 订单列表
    getServiceOrderDetailApi,  // 订单详情
    getServiceOrderStatusListApi,  // 订单状态列表
} from '@/api/account.js'
export default {
    name: 'orderManage',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
                {
                    title: '序号',
                    slot: 'index',
                    width: '90',
                    align: "center"
                },
                {
                    title: '订单号',
                    key: 'orderNo',
                    width: 200,
                    align: "center"
                },
                {
                    title: '创建时间',
                    minWidth: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.timeCreated ? this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss') : '---')
                    },
                },
                // {
                //     title: '服务类型',
                //     slot: 'kong',
                //     width: '240',
                //     align: "center"
                // },
                {
                    title: '所属机构',
                    minWidth: 240,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.merchant ? params.row.merchant.name || '---' : '---')
                    }
                },
                {
                    title: '服务名称',
                    key: 'serviceInfo',
                    minWidth: 180,
                    align: "center",
                },
                {
                    title: '数量',
                    key: 'quantity',
                    width: 100,
                    align: "center"
                },
                // {
                //     title: '服务图片',
                //     slot: 'imgPic',
                //     width: '240',
                //     align: "center"
                // },
                {
                    title: '市场价',
                    key: 'totalPrice',
                    width: 100,
                    align: "center",
                },
                {
                    title: '用户手机号',
                    width: '140',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.buyerInfo ? params.row.buyerInfo.mobile || '--' : '---')
                    }
                },
                // {
                //     title: '门店名称',
                //     slot: 'kong',
                //     width: '240',
                //     align: "center"
                // },
                // {
                //     title: '核销人员',
                //     slot: 'kong',
                //     width: '240',
                //     align: "center"
                // },
                // {
                //     title: '核销时间',
                //     width: '120',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', params.row.statusTime && params.row.statusTime.success ? this.$Date(params.row.statusTime.success).format('YYYY-MM-DD HH:mm:ss') : '---')
                //     }
                // },
                // {
                //     title: '城市',
                //     slot: 'kong',
                //     width: '240',
                //     align: "center"
                // },
                // {
                //     title: '权益卡可补贴最大金额',
                //     key: 'fundDiscount',
                //     width: '220',
                //     align: "center"
                // },
                // {
                //     title: '补贴后最低价',
                //     key: 'payPrice',
                //     width: '180',
                //     align: "center"
                // },
                // {
                //     title: '有效期',
                //     // key: 'address',
                //     width: '240',
                //     align: "center",
                //     render: (h, params) => {
                //         return h("div", [
                //             this.$Date(params.row.expiredTime).format("YYYY-M-D HH:mm"),
                //         ]);
                //     },
                // },
                // {
                //     title: '已销售',
                //     slot: 'kong',
                //     width: '140',
                //     align: "center"
                // },
                // {
                //     title: '创建者',
                //     width: '140',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', params.row.buyerInfo.name ? params.row.buyerInfo.name : params.row.buyerInfo.nickName)
                //     }
                // },
                {
                    title: '支付时间',
                    minWidth: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.payInfo ? this.$Date(params.row.payInfo.payTime || '---').format('YYYY-MM-DD HH:mm:ss') : '---')
                    },
                },
                {
                    title: '结算状态',
                    key: 'address',
                    width: '120',
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.settleStatus ? params.row.settleStatus.name || '---' : '---');
                    },
                },
                {
                    title: '订单状态',
                    key: 'address',
                    width: '120',
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.status ? params.row.status.name || '---' : '---');
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 120,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
            orderStatus: [
                {
                    id: 1,
                    code: "wait_pay",
                    name: "待支付" //规则名称
                },
                {
                    id: 2,
                    code: "wait_confirm",
                    name: "待使用" //规则名称
                },
                {
                    id: 3,
                    code: "success",
                    name: "完成" //规则名称
                },
                {
                    id: 4,
                    code: "cancel",
                    name: "取消" //规则名称
                },
                {
                    id: 5,
                    code: "refund",
                    name: "已退款" //规则名称
                }
            ],  // 订单状态列表
            search: {}, // 搜索
            modal1: false, // 弹框
            list: { buyerInfo: {} }, // 详细信息
            current: 0,  // 步骤条
            classBtn: 0, // 按钮样式
        }
    },
    created() {
        this.getOrderList();
        this.getOrderStatusFn();
    },
    methods: {
        // 获取订单列表
        getOrderList() {
            this.loading = true
            let data = {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber,
                biz: 'medical'
            }
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    data[key] = element
                }
            }
            getServiceOrderPageApi(data).then(res => {
                this.total = res.totalElements;
                this.loading = false;
                this.data = res.data;
            })
        },
        // 获取订单状态
        getOrderStatusFn() {
            getServiceOrderStatusListApi().then(res => {
                let data = JSON.parse(JSON.stringify(res));
                if (data.length > 0) {
                    data.forEach((item, index) => {
                        item.id = index + 1;
                    })
                    this.orderStatus = data;
                }
            })
        },
        //  订单详情
        orderMessage(row) {
            getServiceOrderDetailApi(row.id).then(res => {
                this.modal1 = true;
                switch (res.status.code) {
                    case "expired":
                        this.current = 0
                        break;
                    case "wait_pay":
                        this.current = 0
                        break;
                    case "wait_deliver":
                        this.current = 2
                        break;
                    case "wait_receiving":
                        this.current = 3
                        break;
                    case "success":
                        this.current = 5
                        break;
                    case "cancel":
                        this.current = 0
                        break;

                    default:
                        break;
                }
                this.list = res;
                // this.list.timeCreated = this.$Date(res.timeCreated).format("YYYY年M月D日 HH:mm");
                // this.list.serverTime = this.$Date(res.serverTime).format("YYYY年M月D日 HH:mm");
            })
        },
        // 详情 核销情况
        verificationStatusFn(arr = []) {
            let useArrLength = 0;
            let str = '';
            arr.forEach(item => {
                if (item.wo) {
                    useArrLength++;
                }
            })

            if (useArrLength == 0) {
                str = '全部未使用';
            } else if (useArrLength == arr.length) {
                str = '全部已核销';
            } else if (useArrLength < arr.length) {
                str = '部分已核销';
            }
            return str;
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getOrderList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getOrderList();
        },
    }
}
</script>
<style scoped lang='less'>
.orderManage_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .search_top {
        width: 100%;
        padding: 10px 0 10px;
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: space-around;
        // align-items: center;
    }

}

.modal_main {
    width: 880px;
    margin: 10px auto;
    border: 1px solid #000;
    border-radius: 20px;
    padding: 10px 30px;
}

.btn_border {
    color: #57a3f3;
    border-color: #57a3f3;
    border-radius: 3px;
}
</style>