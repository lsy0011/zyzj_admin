<template>
    <div class='orderManage'>
        <!-- <h5>订单管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="订单管理" hidden-breadcrumb />
        </div>
        <div class="order_main">
            <div class="search_top" style="text-align: center;">
                <Space size="large">
                    <!-- <Space>
                        <strong>订单编号</strong>
                        <Input v-model="search.orderNo" placeholder="请输入订单编号" size="small"></Input>
                    </Space> -->
                    <!-- <Space>
                        <strong>是否支付</strong>
                        <Select v-model="search.payed" size="small">
                            <Option :value="true">是</Option>
                            <Option :value="false">否</Option>
                        </Select>
                    </Space> -->
                    <Space>
                        <Input v-model="search.keywords" placeholder="关键字查询(支持：参拍人姓名/证件号或拍品名称)" clearable size="small"
                            style="width: 330px;" />
                        <Button type="primary" size="small" @click="pageNumber = 1; getOrderPage()"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}, getOrderPage(), classBtn = 0">重置</Button>
                    </Space>
                </Space>
            </div>
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <Space size="large" wrap>
                        <strong v-font="15">
                            <Icon type="md-reorder" />订单列表
                        </strong>
                        <Button :class="{ 'btn_border': classBtn == 0 }" size="small"
                            @click=" pageNumber = 1; classBtn = 0; search.faState = ''; getOrderPage()">全部</Button>
                        <Button :class="{ 'btn_border': classBtn == item.id }" size="small" v-for="(item) in orderStatus"
                            :key="item.id"
                            @click=" pageNumber = 1; classBtn = item.id; search.faState = item.code; getOrderPage();">
                            {{ item.name }}
                        </Button>
                    </Space>
                    <Button type="success" size="small" style="margin-right: 10px;"
                        @click=" this.$Message.warning('功能待实现')">导出</Button>
                </div>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #actionSlot="{ row }">
                    <Button size="small" v-margin="5" @click="lookDetailsFn(row)">查看详情</Button>
                    <Button type="info" size="small" v-margin="5" v-if="row.orderInfo" @click="detailsFn(row)">查看订单</Button>
                </template>
            </Table>
            <div style="margin-top: 15px;">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <!-- 申请单详情 -->
        <Modal v-model="detailModal" :title="`申请单详情 （ ${applyDetail.faState ? applyDetail.faState.name : ''} ） `">
            <div class="details_box">
                <div class="details_box_all" v-viewer>
                    <span>证件照片 : </span>
                    <template v-for="(item, index) in applyDetail.certs" :key="index">
                        <img :src="item.filePath" :alt="item.type.name" :title="item.type.name">
                    </template>
                </div>
                <div class="details_box_only">
                    <span>申请人姓名 : </span>
                    <strong>{{ applyDetail.name || "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>身份证号 : </span>
                    <strong>{{ applyDetail.idNo || "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>支付保证金 : </span>
                    <strong>{{ applyDetail.payInfo ? applyDetail.payInfo.amount : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>支付时间 : </span>
                    <strong>{{ applyDetail.payInfo && applyDetail.payInfo.payTime ?
                        $Date(applyDetail.payInfo.payTime).format('YYYY-MM-DD HH:mm:ss') : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>拍品状态 : </span>
                    <strong>{{ applyDetail.auctionInfo && applyDetail.auctionInfo.auctionState ?
                        applyDetail.auctionInfo.auctionState.name || '' : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>拍品名称 : </span>
                    <strong>{{ applyDetail.goods ? applyDetail.goods.name : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>拍品规格 : </span>
                    <strong>{{ applyDetail.auctionInfo ? applyDetail.auctionInfo.spec : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>数量单位 : </span>
                    <strong>{{ applyDetail.auctionInfo ? applyDetail.auctionInfo.quantityUnit : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>起拍价格 : </span>
                    <strong>{{ applyDetail.auctionInfo ? applyDetail.auctionInfo.priceStart : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>预估价格 : </span>
                    <strong>{{ applyDetail.auctionInfo ? applyDetail.auctionInfo.priceAssess : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>开拍时间 : </span>
                    <strong>{{ applyDetail.auctionInfo && applyDetail.auctionInfo.saleStartTime ?
                        $Date(applyDetail.auctionInfo.saleStartTime).format('YYYY-MM-DD HH:mm:ss') : "---" }}
                    </strong>
                </div>
                <div class="details_box_only">
                    <span>结束时间 : </span>
                    <strong>{{ applyDetail.auctionInfo && applyDetail.auctionInfo.saleEndTime ?
                        $Date(applyDetail.auctionInfo.saleEndTime).format('YYYY-MM-DD HH:mm:ss') : "---" }}
                    </strong>
                </div>
                <div class="details_box_only">
                    <span>委托方 : </span>
                    <strong>{{ applyDetail.auctionInfo && applyDetail.auctionInfo.entrustOrg ?
                        applyDetail.auctionInfo.entrustOrg.name || '---' : "---" }}</strong>
                </div>
                <div class="details_box_only">
                    <span>拍品公司 : </span>
                    <strong>{{ applyDetail.auctionInfo && applyDetail.auctionInfo.merchant ?
                        applyDetail.auctionInfo.merchant.name || '---' : "---" }}</strong>
                </div>
                <div class="details_box_all">
                    <span>交付地址 : </span>
                    <strong>{{ applyDetail.auctionInfo &&
                        applyDetail.auctionInfo.deliveryRegion && applyDetail.auctionInfo.deliveryRegion.extra ?
                        applyDetail.auctionInfo.deliveryRegion.extra.namePath.join(' / ') : "---" }} /
                        {{ applyDetail.auctionInfo ? applyDetail.auctionInfo.deliveryAddr : "---" }}
                    </strong>
                </div>
                <div class="details_box_only">
                    <span>交付方式 : </span>
                    <strong>{{ applyDetail.auctionInfo && applyDetail.auctionInfo.deliveryType ?
                        applyDetail.auctionInfo.deliveryType.name || '---' : "---" }}</strong>
                </div>
            </div>
        </Modal>
        <!-- 详情 -->
        <Modal @on-visible-change="visibleChange" v-model="modal" footer-hide width="60%" title="订单详情">
            <!-- 订单状态 步进条 -->
            <div class="steps_box" style="padding: 30px 50px">
                <!-- 当前步骤的状态，可选值为process、wait、finish、error -->

                <Steps :current="current">
                    <Step title="已拍中" v-if="list.faState && (list.faState.code != 'fail')"
                        :content="list.statusTime && list.statusTime.wait_pay ? this.$Date(list.statusTime.wait_pay).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="未拍中" v-else
                        :content="list.statusTime && list.statusTime.fail ? this.$Date(list.statusTime.fail).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="拍中-待付款"
                        :content="list.statusTime && list.statusTime.wait_pay ? this.$Date(list.statusTime.wait_pay).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="已流拍" v-if="list.faState.code == 'abortive'"
                        :content="list.statusTime && list.statusTime.abortive ? this.$Date(list.statusTime.abortive).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="拍品已支付" v-else
                        :content="list.statusTime && list.statusTime.wait_confirm ? this.$Date(list.statusTime.wait_confirm).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="完成"
                        :content="list.statusTime && list.statusTime.success ? this.$Date(list.statusTime.success).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                </Steps>
            </div>
            <!-- 订单详情数据   物流信息 -->
            <div class="detail_box">
                <!-- 订单详情数据 -->
                <div class="orderinfi_box_l">
                    <div class="box_left_title">订单信息</div>
                    <div class="box_left_box">
                        <div class="left_box_only">
                            <span>拍品照片 :</span>
                            <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F3676b0ae-f176-4b66-8825-bbd4cd015c21%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1695436155&t=0cc43b60512e95c9cb7978042884675c"
                                alt="图片" width="90" height="72"> ---
                        </div>
                        <div class="left_box_only">
                            <span>订单编号 :</span>
                            <strong> {{ list.orderInfo ? list.orderInfo.orderNo || '' : '---' }} </strong>
                        </div>
                        <div class="left_box_only">
                            <span>支付方式 :</span>
                            <strong>{{ list.payInfo && list.payInfo.channel ? list.payInfo.channel.name || '' : '' }}
                            </strong>
                        </div>
                        <div class="left_box_only"
                            v-if="list.auctionInfo && list.auctionInfo.deliveryType && list.auctionInfo.deliveryType.code == 'finished'">
                            <span>收货人姓名 :</span>
                            <strong>{{ list.addr ? list.addr.linkman || '' : "---" }}</strong>
                        </div>
                        <div class="left_box_only">
                            <span>拍成时间 :</span>
                            <strong>{{ $Date(list.timeCreated).format('YYYY-MM-DD HH:mm:ss') }}</strong>
                        </div>
                        <div class="left_box_only"
                            v-if="list.auctionInfo && list.auctionInfo.deliveryType && list.auctionInfo.deliveryType.code == 'finished'">
                            <span>收货人手机号 :</span>
                            <strong>{{ list.orderInfo && list.orderInfo.addr ? list.orderInfo.addr.mobile || '' : "---"
                            }}</strong>
                        </div>
                        <div class="left_box_only">
                            <span>拍品名称 :</span>
                            <strong>{{ list.goods ? list.goods.name || '---' : '' }}</strong>
                        </div>
                        <div class="left_box_only"
                            v-if="list.auctionInfo && list.auctionInfo.deliveryType && list.auctionInfo.deliveryType.code == 'finished'">
                            <span>收货人地址 :</span>
                            <strong>
                                {{ list.orderInfo && list.orderInfo.addr && list.orderInfo.addr.regionName ?
                                    list.orderInfo.addr.regionName.join(' / ') || '' : "---" }}
                                {{ list.orderInfo && list.orderInfo.addr ? ' / ' + list.orderInfo.addr.address || '' : '' }}
                            </strong>
                        </div>
                        <div class="left_box_only">
                            <span>数量规格 :</span>
                            <strong> {{ list.auctionInfo ? list.auctionInfo.quantityUnit || '---' : '---' }} </strong>
                        </div>
                        <template v-show="list.logisticsInfo">
                            <div class="left_box_only">
                                <span>快递单号 :</span>
                                <strong> {{ list.logisticsInfo ? list.logisticsInfo.trackingNumber : '' }} </strong>
                            </div>
                            <div class="left_box_only">
                                <span>物流公司 :</span>
                                <strong>
                                    {{ list.logisticsInfo && list.logisticsInfo.corp ? list.logisticsInfo.corp.name || '' :
                                        '--' }}
                                </strong>
                            </div>
                        </template>
                        <div class="left_box_only">
                            <span>实付金额 :</span>
                            <strong> ￥{{ list.orderInfo ? list.orderInfo.payPrice || '' : '0' }}</strong>
                        </div>
                        <div class="left_box_only">
                            <span>付款时间 :</span>
                            <strong> {{ $Date(list.timeCreated).format('YYYY-MM-DD HH:mm:ss') }} </strong>
                        </div>
                        <!-- <div class="left_box_only">
                            <span>商品总额 :</span>
                            <strong> ￥1</strong>
                        </div> -->
                        <div class="left_box_only">
                            <span>拍卖委托方 :</span>
                            <strong>{{ list.auctionInfo && list.auctionInfo.entrustOrg ? list.auctionInfo.entrustOrg.name ||
                                '---' : '---' }} </strong>
                        </div>
                        <div class="left_box_only">
                            <span>拍卖公司 :</span>
                            <strong> {{ list.auctionInfo && list.auctionInfo.merchant ? list.auctionInfo.merchant.name || ''
                                : '---' }} </strong>
                        </div>
                        <div class="left_box_only">
                            <span>抵扣保证金 :</span>
                            <strong> ￥{{ list.depositPrice ? list.depositPrice : '0' }}</strong>
                        </div>
                        <div class="left_box_only">
                            <span>发货地址 :</span>
                            <strong>
                                {{ list.auctionInfo && list.auctionInfo.deliveryRegion &&
                                    list.auctionInfo.deliveryRegion.extra &&
                                    list.auctionInfo.deliveryRegion.extra.namePath.join(' / ') || '' +
                                    ' / ' }}
                                {{ list.auctionInfo ? list.auctionInfo.deliveryAddr || '' : '' }}
                            </strong>
                        </div>
                        <div class="left_box_only">
                            <span>运费金额 :</span>
                            <strong> ￥{{ list.freightPrice ? list.freightPrice : '0' }} </strong>
                        </div>
                        <div class="left_box_only">
                            <span>基金会 :</span>
                            <strong>
                                {{ list.auctionInfo && list.auctionInfo.foundation ? list.auctionInfo.foundation.name || ''
                                    : '---' }}
                            </strong>
                        </div>
                        <div class="left_box_only">
                            <span>捐赠金额比例 :</span>
                            <strong>
                                {{ list.auctionInfo && list.auctionInfo.auServiceCharge ? (list.auctionInfo.auServiceCharge
                                    * 100 || 0) : '0' }} %
                            </strong>
                        </div>
                        <div class="left_box_only">
                            <span>交付方式 :</span>
                            <strong>
                                {{ list.auctionInfo && list.auctionInfo.deliveryType ? list.auctionInfo.deliveryType.name
                                    || '---' : '---' }}
                            </strong>
                        </div>
                        <div class="left_box_only">
                            <span>平台通道费 :</span>
                            <strong> ￥{{ list.platformCharge ? list.platformCharge : '0' }}</strong>
                        </div>
                        <div class="left_box_only">
                            <span>用户类型 :</span>
                            <strong> {{ list.buyerInfo && list.buyerInfo.type ? list.buyerInfo.type.name || '' : '---' }}
                            </strong>
                        </div>
                        <div class="left_box_only">
                            <span>佣金比例 :</span>
                            <strong> {{ list.auctionInfo && list.auctionInfo.auServiceCharge ?
                                list.auctionInfo.auServiceCharge * 100 || 0 + ' %' : '0' }} </strong>
                        </div>
                        <div class="left_box_only">
                            <span>用户昵称 :</span>
                            <strong> {{ list.buyerInfo ?
                                list.buyerInfo.realName ? list.buyerInfo.realName : list.buyerInfo.nickName : '---'
                            }}</strong>
                        </div>
                        <!-- <div class="left_box_only">
                            <span>拍品人身份证 :</span>
                            <strong> --- </strong>
                        </div> -->
                        <div class="left_box_only">
                            <span>状态 :</span>
                            <strong> {{ list.orderInfo && list.orderInfo.status ? list.orderInfo.status.name || '' : '' }}
                            </strong>
                        </div>
                    </div>
                </div>
                <!-- 物流信息  -->
                <div class="orderinfi_box_r">
                    <div class="orderinfi_up">
                        <p>
                            <strong>订单状态：
                                {{ list.orderInfo && list.orderInfo.status ?
                                    patStatusFn(list.orderInfo.status.code || '').title :
                                    '' }}</strong>
                        </p>
                        <div class="ord_state_receiving"
                            v-if="list.orderInfo && list.orderInfo.status && list.orderInfo.status.code == 'wait_confirm'">
                            用户已支付
                        </div>
                        <div class="ord_state_cancel"
                            v-else-if="list.orderInfo && list.orderInfo.status && list.orderInfo.status.code == 'cancel' || list.orderInfo && list.orderInfo.status && list.orderInfo.status.code == 'expired'">
                            交易已终止
                        </div>
                        <div class="ord_state_success"
                            v-else-if="list.orderInfo && list.orderInfo.status && list.orderInfo.status.code == 'success'">
                            交易已完成</div>
                        <div class="ord_state_deliver" v-else>平台交易中</div>
                    </div>
                    <div class="orderinfi_down"
                        v-if="list.auctionInfo && list.auctionInfo.deliveryType && list.auctionInfo.deliveryType.code != 'offline'">
                        <p>
                            <strong>订单物流状态：</strong>
                        </p>
                        <div class="down_u" v-if="logisticsSummary.corp">
                            <div>
                                <strong>快递公司：</strong>
                                <span>{{ logisticsSummary.corp ? logisticsSummary.corp.name || '' : '' }}</span>
                            </div>
                            <div>
                                <strong>运单单号：</strong>
                                <span>{{ logisticsSummary.trackingNumber || "" }}</span>
                            </div>
                            <div style="display: flex;height: 150px; ">
                                <div><strong>物流状态：</strong></div>
                                <div class="logistics_detail">
                                    <Timeline>
                                        <TimelineItem v-for="item in logisticsList" :key="item.id">
                                            <p class="time">{{ this.$Date(item.time).format('YYYY-MM-DD HH:mm:ss') }}</p>
                                            <p class="content">{{ item.desc || '' }}</p>
                                        </TimelineItem>
                                    </Timeline>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: center;" v-else>
                            <strong style="color: #ffb300;font-size: 40px;">
                                暂未获取到物流信息
                            </strong>
                        </div>
                    </div>
                    <div class="delType_off" v-else>
                        <strong> 该商品是由线下交付！</strong>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import {
    getAuctionOrderStatusListApi,   // 状态列表
    getAuctionOrderPageApi,   // 订单列表
    getAuctionOrderDetailApi,    // 详情
    getGoodsInfoDetailApi,     // 商品详情

    getAuctionApplyStateListApi,    // 申请单状态
    getAuctionApplyPageApi,   // 申请单分页
    getAuctionApplyDetailApi,   // 申请单详情

    getLogisticsSummaryApi,   // 物流概要
    getLogisticsTrackingListApi,   // 物流跟踪
} from '@/api/account'
export default {
    name: 'orderManage',
    data() {
        return {
            loading: false,
            modal: false,     // 查看订单
            detailModal: false,   // 查看详情
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
                {
                    width: '60',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '参拍人姓名',
                    key: 'name',
                    width: '120',
                    align: "center"
                },
                {
                    title: '身份证号',
                    key: 'idNo',
                    width: '200',
                    align: "center"
                },
                {
                    title: '支付保证金',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.payInfo ? params.row.payInfo.amount || "" : '--')
                    }
                },
                {
                    title: '支付时间',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.payInfo && params.row.payInfo.payTime ? this.$Date(params.row.payInfo.payTime).format('YYYY-MM-DD HH:mm:ss') : '---')
                    }
                },
                {
                    title: '拍品名称',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.goods ? params.row.goods.name || '' : '--')
                    }
                },
                {
                    title: '拍品起始价',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo ? params.row.auctionInfo.priceStart || '' : '--')
                    }
                },
                {
                    title: '数量单位',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo ? params.row.auctionInfo.quantityUnit || '' : '--')
                    }
                },
                {
                    title: '拍品规格',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo ? params.row.auctionInfo.spec || '' : '--')
                    }
                },
                {
                    title: '交付方式',
                    width: '160',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo && params.row.auctionInfo.deliveryType ? params.row.auctionInfo.deliveryType.name || '' : '--')
                    }
                },
                {
                    title: '交付区域',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo && params.row.auctionInfo.deliveryRegion ? params.row.auctionInfo.deliveryRegion.extra.namePath.join(' / ') || '' : '--')
                    }
                },
                {
                    title: '详细地址',
                    width: '220',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo ? params.row.auctionInfo.deliveryAddr || '' : '--')
                    }
                },
                {
                    title: '委托方',
                    width: '220',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo && params.row.auctionInfo.entrustOrg ? params.row.auctionInfo.entrustOrg.name || '' : '--')
                    }
                },
                {
                    title: '拍卖公司',
                    width: '220',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.auctionInfo && params.row.auctionInfo.merchant ? params.row.auctionInfo.merchant.name || '' : '--')
                    }
                },
                // {
                //     title: '拍卖状态',
                //     width: '150',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', params.row.auctionInfo && params.row.auctionInfo.auctionState ? params.row.auctionInfo.auctionState.name : '--')
                //     }
                // },
                {
                    title: '拍品状态',
                    width: '150',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.faState ? params.row.faState.name || "" : '--')
                    }
                },
                {
                    title: '操作',
                    width: '120',
                    align: "center",
                    slot: 'actionSlot',
                    fixed: 'right',
                },

            ],   // 申请单标头 表头
            data: [],   // 申请单数据列表
            search: {},
            classBtn: 0,
            orderStatus: [
                {
                    id: 1,
                    code: "wait_pay",
                    name: "待支付" //规则名称
                },
                {
                    id: 2,
                    code: "wait_deliver",
                    name: "待发货" //规则名称
                },
                {
                    id: 3,
                    code: "wait_confirm",
                    name: "待收货" //规则名称
                },
                {
                    id: 4,
                    code: "success",
                    name: "完成" //规则名称
                },
                {
                    id: 5,
                    code: "cancel",
                    name: "取消" //规则名称
                },
                {
                    id: 6,
                    code: "refund",
                    name: "已退款" //规则名称
                }
            ],  // 订单状态
            current: 0,  // 步骤条
            list: {},   // 详情信息
            goodsDet: {},   // 商品信息
            modalData: [],   // 商品

            applyDetail: {},
            logisticsSummary: {},  // 物流概要
            logisticsList: [],  // 物流跟踪信息
        }
    },
    created() {
        this.getStatusList();
        this.getOrderPage();
    },
    methods: {
        // 状态列表
        getStatusList() {
            getAuctionApplyStateListApi().then(res => {
                res.forEach((item, index) => {
                    item.id = index + 1;
                })
                this.orderStatus = res;
            })
        },
        // 订单分页
        getOrderPage() {

            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
            };
            this.loading = true;
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (element) data[key] = element;
                }
            }

            getAuctionApplyPageApi(data).then(res => {
                this.data = res.data;
                this.total = res.totalElements;
                this.loading = false;
            })

        },

        // 详情订单 // 物流信息
        detailsFn(row) {

            getAuctionApplyDetailApi({ goodsId: row.goods.id }).then(res => {

                let data = JSON.parse(JSON.stringify(res));
                this.list = data;

                if (res.auctionInfo.deliveryType.code == 'offline') {
                    // console.log("🚀 ~ file: index.vue:639 ~ getAuctionApplyDetailApi ~ this.list.orderInfo:", this.list.orderInfo)
                    // this.list.orderInfo = false;
                };

                getAuctionOrderDetailApi(row.orderInfo.id).then(rs => {
                    let data1 = JSON.parse(JSON.stringify(rs));
                    this.list.statusTime = data1.statusTime;
                    this.list.buyerInfo = data1.buyerInfo;

                    this.selectState(data1.status.code);
                    this.modal = true;

                    if (this.list.logisticsInfo) {
                        this.getSummaryDetail(this.list.logisticsInfo.bizId);
                        this.logisticsSummary = this.list.logisticsInfo || '';
                    };
                });
            });
        },
        // 物流信息
        getSummaryDetail() {
            if (this.list.status.code == 'wait_confirm' || this.list.status.code == 'success') {
                // 物流概要
                getLogisticsSummaryApi({ bizId: this.list.id, bizType: 'auOrder' }).then(res => {
                    this.logisticsSummary = res;
                });
                // 物流跟踪
                getLogisticsTrackingListApi({ bizId: this.list.id }).then(res => {
                    this.logisticsList = res;
                })
            }
        },
        // 详情
        lookDetailsFn(row) {

            getAuctionApplyDetailApi({ goodsId: row.goods.id }).then(res => {

                this.applyDetail = JSON.parse(JSON.stringify(res));
                this.detailModal = true;

            })
        },

        // 状态 区分
        selectState(state) {
            let str = '';
            switch (state) {
                case 'fail':
                    str = '未拍中'
                    this.current = 0
                    break;
                case 'wait_pay':
                    str = '拍中-待付款'
                    this.current = 1
                    break;
                case 'wait_deliver':
                    str = '待发货'
                    this.current = 2
                    break;
                case 'abortive':
                    str = '流拍'
                    this.current = 2
                    break;
                case 'wait_confirm':
                    str = '拍品已支付'
                    this.current = 2
                    break;
                case 'success':
                    str = '完成'
                    this.current = 3
                    break;

                default:
                    break;
            }
            return str
        },
        // 拍品状态
        patStatusFn(stat) {
            let obj = {};
            this.orderStatus.forEach(item => {

                if (stat == item.code) {
                    obj = item;
                }
            })
            return obj;
        },
        // 弹框状态
        visibleChange(flag) {

        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getOrderPage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getOrderPage();
        },
    }
}
</script>
<style scoped lang='less'>
.order_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;
}

.detail_box {
    width: 100%;
    padding: 10px 0;
    display: flex;
    flex-wrap: nowrap;

    .orderinfi_box_l {
        width: 60%;
        padding-left: 20px;
        box-sizing: border-box;
        border-right: 1px dashed saddlebrown;

        .box_left_title {
            width: 100%;
            font-weight: 600;
            font-size: 16px;
        }

        .box_left_box {
            width: 100%;
            margin-top: 15px;
            padding-left: 30px;
            box-sizing: border-box;
            // display: flex;
            // flex-wrap: wrap;

            .left_box_only {
                width: 50%;
                margin-bottom: 10px;
                float: left;

                span {
                    display: inline-block;
                    width: 30%;
                    text-align: right;
                    padding-right: 15px;
                    box-sizing: border-box;
                }
            }
        }
    }

    .orderinfi_box_r {
        width: 40%;
        float: right;

        .orderinfi_up {
            padding: 20px 30px 30px 30px;
            height: 40%;
            box-sizing: border-box;
            border-bottom: 1px dashed saddlebrown;

            p {
                font-size: 17px;
            }

            div {
                display: inline-block;
                padding: 15px 25px;
                margin: 15px 0;
                border-radius: 2px;
                color: #fff;
            }

            .ord_state_receiving {
                background-color: #ff9900;
            }

            .ord_state_deliver {
                background-color: #3a86ff;
            }

            .ord_state_cancel {
                background-color: #e53e31;
            }

            .ord_state_success {
                background-color: #188038;
            }

        }

        .orderinfi_down {
            padding: 30px;
            padding-bottom: 15px;

            p {
                margin-bottom: 5px;
                font-size: 17px;
            }

            .down_u {
                .logistics_detail {
                    border: 1px #aab6c3 dashed;
                    flex: 1;
                    overflow-y: auto;
                    padding: 5px;

                    /* 滚动条滑块 */

                    &::-webkit-scrollbar {
                        width: 5px;
                        // height: 10px; // 高度写不写，都不影响，因为会根据内容的长度自动计算
                    }

                    &::-webkit-scrollbar-thumb {
                        background: #ccc; // 滑块颜色
                        border-radius: 5px; // 滑块圆角
                    }

                    // &::-webkit-scrollbar-thumb:hover {
                    //     background: #f40; // 鼠标移入滑块变红
                    // }
                }

                div {
                    padding: 3px 0;
                }
            }
        }

        .delType_off {
            width: 100%;
            text-align: center;
            line-height: 120px;
            font-size: 24px;
            color: #fa0;
        }
    }
}

.details_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &_only {
        width: 50%;
        margin-bottom: 10px;
    }

    &_all {
        width: 100%;
        margin-bottom: 10px;

        img {
            width: 33%;
            margin: 0 10px;
            max-height: 110px;
        }
    }
}

.btn_border {
    color: #57a3f3;
    border-color: #57a3f3;
    border-radius: 3px;
}
</style>