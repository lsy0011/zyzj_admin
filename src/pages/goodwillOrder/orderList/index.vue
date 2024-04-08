<template>
    <div class='orderlist'>
        <!-- <h5>订单列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城订单管理" content="订单列表" hidden-breadcrumb />
        </div>
        <div class="orderlist_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>日期</strong>
                        <DatePicker v-model="search.startDate" @on-change="search.startDate = $event" type="date"
                            format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择开始日期" size="small"
                            style="width: 140px;" />
                        <strong>至</strong>
                        <DatePicker v-model="search.endDate" @on-change="search.endDate = $event" type="date"
                            format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择结束日期" size="small"
                            style="width: 140px;" />
                    </Space>
                    <Space>
                        <strong>用户类型</strong>
                        <Select v-model="search.userMemberType" placeholder="请选择类型" clearable size="small">
                            <Option value="Caring">爱心用户 </Option>
                            <Option value="Disabled">残疾人</Option>
                            <Option value="DisabledFamily">残疾家属</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>商品分类</strong>
                        <TreeSelect v-model="search.categoryId" :data="categoryTree" placeholder="请选择分类" clearable
                            size="small" />
                    </Space>
                    <Space>
                        <Input v-model="search.keywords" placeholder="请输入关键词 (商品名、用户、手机)" clearable size="small"
                            v-width='240' />
                        <Button type="primary" size="small" @click="pageNumber = 1; getOrderPage()"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}, getOrderPage(), classBtn = 0">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="modul_add" style="margin: 15px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <Space size="large" wrap>
                        <strong style="font-size: 15px;">
                            <Icon type="md-reorder" />订单列表
                        </strong>
                        <Button :class="{ 'btn_border': classBtn == 0 }" size="small"
                            @click=" pageNumber = 1; classBtn = 0; search.status = ''; getOrderPage()">全部</Button>

                        <Button :class="{ 'btn_border': classBtn == item.id }" size="small"
                            @click=" pageNumber = 1; classBtn = item.id; search.status = item.code; getOrderPage();"
                            v-for="(item) in orderStatus" :key="item.id">
                            {{ item.name }}
                        </Button>
                    </Space>
                    <Button type="success" size="small" style="margin-right: 10px;" @click="exportOrderFn()">导出</Button>
                </div>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #kong="{ }">
                    <p>---</p>
                </template>
                <template #action="{ row }">
                    <!-- <Button type="info" size="small" style="margin-right: 10px;" v-show="row.age == 18"
                        @click="edit(row)">审核上架</Button> -->
                    <Button type="primary" size="small" style="margin-right: 10px;" @click="edit(row)">详情</Button>
                    <Button type="info" size="small" v-if="row.status.code == 'wait_deliver'"
                        @click="sendOut(row)">发货</Button>
                </template>
            </Table>
            <div class="tab-foot-page">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <Modal @on-visible-change="visibleChange" v-model="modal" footer-hide width="70%" title="订单详情">
            <!-- 订单状态 步进条 -->
            <div class="steps_box" style="padding: 30px 50px">
                <!-- 当前步骤的状态，可选值为process、wait、finish、error -->
                <Steps :current="current">
                    <!-- <Step title="用户支付" :content="DateFn(list.statusTime.wait_pay)"></Step> -->
                    <Step title="用户下单" :content="this.$Date(list.timeCreated).format('YYYY-MM-DD  HH:mm')"></Step>
                    <Step title="用户支付"
                        :content="list.statusTime && list.statusTime.wait_pay ? this.$Date(list.statusTime.wait_pay).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="权益卡补贴"
                        :content="list.statusTime && list.statusTime.wait_pay ? this.$Date(list.statusTime.wait_pay).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="平台待发货"
                        :content="list.statusTime && list.statusTime.wait_pay ? this.$Date(list.statusTime.wait_pay).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="申请退货中" v-if="list.status.code == 'refunding'"
                        :content="list.statusTime && list.statusTime.refunding ? this.$Date(list.statusTime.refunding).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="平台发货" v-else
                        :content="list.statusTime && list.statusTime.wait_confirm ? this.$Date(list.statusTime.wait_confirm).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="用户收货-交易完成"
                        :content="list.statusTime && list.statusTime.success ? this.$Date(list.statusTime.success).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                    <Step title="用户评价"
                        :content="list.statusTime && list.statusTime.success ? this.$Date(list.statusTime.success).format('YYYY-MM-DD  HH:mm') : ''">
                    </Step>
                </Steps>
            </div>
            <!-- 订单详情数据   物流信息 -->
            <div class="detail_box">
                <!-- 订单详情数据 -->
                <div class="orderinfi_box_l">
                    <Row style="font-size: 16px; margin: 20px 10px ;">
                        <Col span="24"><strong>订单信息</strong></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>订单编号:</strong></Col>
                        <Col span="7"><span>{{ list.orderNo || '---' }}</span></Col>
                        <Col span="5"><strong>下单时间:</strong></Col>
                        <Col span="7"><span>{{ this.$Date(list.timeCreated).format("YYYY-MM-DD HH:mm:ss ") }}</span></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>商品名称:</strong></Col>
                        <Col span="7"><span>{{ list.itemDesc || '---' }}</span></Col>
                        <Col span="5"><strong>商品分类:</strong></Col>
                        <Col span="7"><span> {{ list.itemCategory ? list.itemCategory[0].name || '' : '--' }} </span></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>数量:</strong></Col>
                        <Col span="7"><span>{{ list.itemSize || '---' }}</span></Col>
                        <Col span="5"><strong>权益卡补贴金额:</strong></Col>
                        <Col span="7"><span>{{ list.cyCardDiscount || '---' }}</span></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>实付金额:</strong></Col>
                        <Col span="7"><span>￥{{ list.payPrice || '---' }}（含运费：￥00.00）</span></Col>
                        <Col span="5"><strong>支付方式:</strong></Col>
                        <Col span="7"><span> {{ list.payInfo && list.payInfo.channel ? list.payInfo.channel.name : '--' }}
                        </span></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>用户昵称:</strong></Col>
                        <Col span="7"><span>{{ list.buyerInfo ? list.buyerInfo.nickName : '---' }}</span></Col>
                        <Col span="5"><strong>用户手机号:</strong></Col>
                        <Col span="7"><span> {{ list.buyerInfo ? list.buyerInfo.mobile : '---' }} </span></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>用户类型:</strong></Col>
                        <Col span="7"><span> {{ list.buyerInfo && list.buyerInfo.type ? list.buyerInfo.type.name : '---' }}
                        </span>
                        </Col>
                        <Col span="5"><strong>收货人姓名:</strong></Col>
                        <Col span="7"><span>{{ list.addr && list.addr.addr ? list.addr.addr.linkman : '---' }}</span></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>供应商:</strong></Col>
                        <Col span="7"><span>{{ list.merchant ? list.merchant.name : '---' }}</span></Col>
                        <Col span="5"><strong>收货人手机号:</strong></Col>
                        <Col span="7"><span>{{ list.addr && list.addr.addr ? list.addr.addr.mobile : '---' }}</span></Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>发货地址:</strong></Col>
                        <Col span="7"><span>--深圳--</span></Col>
                        <Col span="5"><strong>收货人地址:</strong></Col>
                        <Col span="7">
                        <span> {{ list.addr && list.addr.addr ? list.addr.addr.regionName.join(' / ') : '---' }}
                        </span>
                        /
                        <span> {{ list.addr && list.addr.addr ? list.addr.addr.address : '---' }}
                        </span>
                        </Col>
                    </Row>
                    <Row style=" margin: 15px 0px ;">
                        <Col span="5"><strong>状态:</strong></Col>
                        <Col span="7"><span>{{ list.status ? list.status.name : '---' }}</span></Col>
                        <!-- <Col span="5"><strong>商品分类:</strong></Col>
                        <Col span="7"><span>手机</span></Col> -->
                    </Row>
                </div>
                <!-- 物流信息  -->
                <div class="orderinfi_box_r">
                    <div class="orderinfi_up">
                        <p><strong>订单状态：{{ list.status ? list.status.name : '---' }}</strong></p>
                        <div class="receiving" v-if="list.status && list.status.code == 'wait_confirm'"> 平台已发货 </div>
                        <div class="cancel" v-else-if="list.status.code == 'cancel' || list.status.code == 'expired'">
                            交易已终止
                        </div>
                        <div class="success" v-else-if="list.status.code == 'success'">
                            交易完成
                        </div>
                        <div class="deliver" v-else>平台交易中</div>
                    </div>
                    <div class="orderinfi_down">
                        <p><strong>订单物流状态：</strong></p>
                        <div class="down_u"
                            v-if="list.status.code == 'wait_confirm' || list.status.code == 'wait_confirm' || list.status.code == 'success'">
                            <div>
                                <strong>快递公司：</strong>
                                <span>{{ logisticsSummary.corp ? logisticsSummary.corp.name : '---' }}</span>
                            </div>
                            <div><strong>运单单号：</strong><span>{{ logisticsSummary.trackingNumber || '---' }}</span></div>
                            <div style="display: flex;height: 150px; ">
                                <div><strong>物流状态：</strong></div>
                                <div class="logistics_detail">
                                    <Timeline>
                                        <TimelineItem v-for="item in logisticsList" :key="item.id">
                                            <p class="time">{{ this.$Date(item.time).format('YYYY-MM-DD HH:mm:ss') }}</p>
                                            <p class="content">{{ item.desc }}</p>
                                        </TimelineItem>
                                    </Timeline>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: center;" v-else>
                            <strong style="color: #ff0000;font-size: 60px;">
                                {{ list.status ? list.status.name : '---' }}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 订单里-商品信息 -->
            <div class="goods_box">
                <Table :columns="orderDetail" :data="item" border class="top20" size="small">
                    <!-- <template #file="{ row }">
                        <div v-viewer>
                            <img :src="row.file.pic_0" :alt="row.file.pic_0" width="60px" height="60px"
                                :data-source="row.file.pic_0" />
                        </div>
                    </template> -->
                    <template #kong="{ }">
                        <p>---</p>
                    </template>
                </Table>
            </div>
        </Modal>
        <!-- 发货 -->
        <Modal v-model="sendFlag" title="填写运单号" width="330" @on-visible-change="visibleChangeSend">
            <div>
                <div style="margin-right: 15px;display: inline-block;">输入单号</div>
                <Input v-model="sendGoodCode" style="width: 200px;"></Input>
            </div>
            <template #footer>
                <Button type="primary" :disabled="!sendGoodCode" @click="submitSend()"> 确认</Button>
                <Button @click="sendFlag = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getGoodsOrderPageApi, // 订单分页
    getGoodsOrderDetailApi,  // 订单详情
    getGoodsOrderStatusListApi,  // 订单状态
    postLogisticsDeliverApi, // 发货
    getLogisticsSummaryApi, // 物流概要
    getLogisticsTrackingListApi, // 物流跟踪
    getGoodsOrderExportApi,    // 订单导出

    getGoodsCategoryTreeApi,   // 分类
} from '@/api/account';
import { jsonToArray } from "@/libs/util.js";
export default {
    name: 'orderManage',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            search: {}, // 搜索查询
            columns: [
                {
                    width: '60',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '订单号',
                    key: 'orderNo',
                    width: 210,
                    align: "center"
                },
                {
                    title: '下单时间',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '商品名',
                    key: 'itemDesc',
                    minWidth: 240,
                    align: "center"
                },
                {
                    title: '商品分类',
                    width: '140',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.itemCategory ? params.row.itemCategory[0].name || '' : '---')
                    }
                },
                {
                    title: '数量',
                    key: 'itemSize',
                    width: '140',
                    align: "center"
                },
                // {
                //     title: '原价',
                //     key: 'totalPrice',
                //     width: '140',
                //     align: "center"
                // },
                // {
                //     title: '权益卡补贴金额',
                //     key: 'cyCardDiscount',
                //     width: '140',
                //     align: "center"
                // },
                {
                    title: '实付金额',
                    key: 'payPrice',
                    width: '140',
                    align: "center"
                },
                // {
                //     title: '基金补贴（残疾人）',
                //     slot: 'kong',
                //     width: '220',
                //     align: "center"
                // },
                // {
                //     title: '公益捐款（普通用户）',
                //     slot: 'kong',
                //     width: '220',
                //     align: "center"
                // },
                // {
                //     title: '支付方式',
                //     slot: 'odd',
                //     width: '140',
                //     align: "center"
                // },
                {
                    title: '用户昵称',
                    width: 140,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.buyerInfo ? params.row.buyerInfo.realName ? params.row.buyerInfo.realName : params.row.buyerInfo.nickName || params.row.buyerInfo.mobile || '--' : '---')
                    }
                },
                {
                    title: '用户类型',
                    width: 140,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.buyerInfo && params.row.buyerInfo.type ? params.row.buyerInfo.type.name : '---')
                    }
                },
                {
                    title: '用户手机号',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.buyerInfo ? params.row.buyerInfo.mobile || '---' : '---')
                    }
                },
                // {
                //     title: '收货人姓名',
                //     width: '140',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', params.row.buyerInfo.nickName)
                //     }
                // },
                // {
                //     title: '收货人手机号',
                //     slot: 'kong',
                //     width: '140',
                //     align: "center"
                // },
                {
                    title: '收货人地址',
                    minWidth: 240,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.addr && params.row.addr.addr ? params.row.addr.addr.regionName.join() + params.row.addr.addr.address : '---')
                    }
                },
                // {
                //     title: '发货地址',
                //     slot: 'kong',
                //     width: '140',
                //     align: "center"
                // },
                {
                    title: '供应商',
                    minWidth: 240,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.merchant ? params.row.merchant.name : '---')
                    }
                },
                {
                    title: '状态',
                    width: '140',
                    align: "center",
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', params.row.status ? params.row.status.name : '---')
                    }
                },
                {
                    title: '快递及运单号',
                    minWidth: 240,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.row.status ? params.row.status.name : '---')
                    }
                },
                {
                    title: '结算状态',
                    width: '140',
                    align: "center",
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', params.row.settleStatus ? params.row.settleStatus.name : '---')
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表,
            modal: false,  // 订单详情
            list: {
                buyerInfo: {
                    nickName: ''
                },
                merchant: {
                    name: ''
                },
                status: {
                    name: ''
                }
            }, // 订单信息
            orderDetail: [
                {
                    title: '商品编号',
                    key: 'id',
                    width: 200,
                    align: "center"
                },
                // {
                //     title: '下单时间',
                //     width: '160',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', this.$Date(params.row.timeCreated).format('YYYY-D-M HH:mm:ss'))
                //     }
                // },
                {
                    title: '商品名',
                    key: 'goodsInfo',
                    // width: '240',
                    align: "center"
                },
                // {
                //     title: '商品分类',
                //     slot: 'kong',
                //     width: '140',
                //     align: "center"
                // },
                {
                    title: '数量',
                    key: 'quantity',
                    width: '140',
                    align: "center"
                },
                {
                    title: '实付金额',
                    key: 'payPriceTotal',
                    width: '140',
                    align: "center"
                },
                {
                    title: '原价',
                    key: 'memberPrice',
                    width: '140',
                    align: "center"
                },
                // {
                //     title: '供应商',
                //     width: '240',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', params.row.merchant.name)
                //     }
                // },
                {
                    title: '权益卡补贴金额',
                    key: 'cyCardDiscount',
                    width: '140',
                    align: "center"
                },
                {
                    title: '基金补贴（残疾人）',
                    key: 'fundDiscount',
                    width: '220',
                    align: "center"
                },
                {
                    title: '公益捐款（普通用户）',
                    slot: 'kong',
                    width: '220',
                    align: "center"
                },
                // {
                //     title: '支付方式',
                //     slot: 'odd',
                //     width: '140',
                //     align: "center"
                // },
                // {
                // {
                //     title: '收货人姓名',
                //     width: '140',
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', params.row.buyerInfo.nickName)
                //     }
                // },
                // {
                //     title: '收货人地址',
                //     slot: 'kong',
                //     width: '140',
                //     align: "center"
                // },
                // {
                //     title: '收货人手机号',
                //     slot: 'kong',
                //     width: '140',
                //     align: "center"
                // },
                // {
                //     title: '发货地址',
                //     slot: 'kong',
                //     width: '140',
                //     align: "center"
                // },
                // {
                //     title: '快递及运单号',
                //     slot: 'odd',
                //     width: '240',
                //     align: "center",
                // },
                // {
                //     title: '状态',
                //     slot: 'odd',
                //     width: '140',
                //     align: "center",
                //     fixed: 'right',
                //     // render: (h, params) => {
                //     //     return h('div', params.row.status.name)
                //     // }
                // },
            ],
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
            item: [], // 商品信息
            categoryTree: [],   // 分类树
            classBtn: 0,
            current: 0, // 详情进度条
            sendFlag: false, // 发货弹框
            sendGoodId: '', // 发货商品id
            sendGoodCode: '', // 发货运单号
            logisticsSummary: [], // 物流概要
            logisticsList: [], // 物流跟踪信息
        }
    },
    mounted() {
        this.getOrderPage();
        this.getGoodStatus();
    },
    methods: {
        // 订单列表
        getOrderPage() {
            this.loading = true
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'common',
            }
            for (let i in this.search) {
                if (this.search.hasOwnProperty(i) && this.search[i] != '') {
                    data[i] = this.search[i]
                }
            }
            getGoodsOrderPageApi(data).then(res => {
                this.total = res.totalElements;
                this.data = [];
                this.data.push(...res.data);
                this.loading = false
                // console.log(res);
            })
        },
        // 订单状态
        getGoodStatus() {
            getGoodsOrderStatusListApi().then(res => {
                let data = JSON.parse(JSON.stringify(res));
                if (data.length > 0) {
                    data.forEach((item, index) => {
                        item.id = index + 1;
                    });
                    this.orderStatus = data;
                }
            });
            getGoodsCategoryTreeApi({ biz: 'common' }).then(res => {
                this.categoryTree = jsonToArray(res, false);
            })
        },
        // 状态 区分
        selectState(state) {
            let str = '';
            switch (state) {
                case 'expired':
                    str = '已过期'
                    this.current = 0;
                    break;
                case 'wait_pay':
                    str = '待支付'
                    this.current = 0;
                    break;
                case 'wait_deliver':
                    str = '待发货'
                    this.current = 3;
                    break;
                case 'wait_confirm':
                    str = '待收货'
                    this.current = 3;
                    break;
                case 'refunding':
                    str = '退款中'
                    this.current = 4;
                    break;
                case 'success':
                    str = '完成'
                    this.current = 5;
                    break;
                case 'cancel':
                    str = '取消'
                    this.current = 0;
                    break;
                case 'refund':
                    str = '已退款'
                    this.current = 0;
                    break;

                default:
                    break;
            }
            return str;
        },
        // 订单状态 步进条 到哪一步了
        currentFn(orderStatusData, list) {
            function findOranges(fruit) {
                return fruit.id === list.status.code;
            }
            let myObj = orderStatusData.findIndex(findOranges);
            // console.log("订单状态------:", myObj);
            if (myObj === -1) return 0; //已过期
            if (myObj === 6) {
                // 已取消
                var myarr = Object.keys(list.statusTime);
                if (myarr.length > 1) {
                    function findOranges1(fruit) {
                        return fruit.id === myarr[myarr.length - 2] || "";
                    }
                    let myObj1 = orderStatusData.findIndex(findOranges1);
                    return myObj1;
                } else {
                    return 0;
                }
            }
            return myObj;
        },
        // 详情 // 物流信息
        edit(row) {
            this.modal = true;
            getGoodsOrderDetailApi(row.id).then(res => {
                let data = JSON.parse(JSON.stringify(res));
                this.item = data.items;
                this.list = data;
                this.getSummaryDetail();
                this.selectState(data.status.code);
            })
            getLogisticsTrackingListApi({ bizId: row.id }).then(res => {
                this.logisticsList = res
            })
        },
        // 物流信息
        getSummaryDetail() {
            if (this.list.status.code == 'wait_confirm' || this.list.status.code == 'success')
                getLogisticsSummaryApi({ bizId: this.list.id, bizType: 'gdOrder' }).then(res => {
                    this.logisticsSummary = res
                })
        },
        // 发货按钮
        sendOut(row) {
            this.sendGoodId = row.id;
            this.sendFlag = true
        },
        // 确认发货
        submitSend() {
            let data = {
                bizId: this.sendGoodId,
                trackingNumber: this.sendGoodCode,
                bizType: 'gdOrder'
            }
            postLogisticsDeliverApi(data)
                .then(res => {
                    if (res) {
                        this.$Message.success('发货成功！')
                        this.getOrderPage();
                        this.sendFlag = false;
                    }
                })
        },
        // 订单导出
        exportOrderFn() {
            getGoodsOrderExportApi({ ...this.search, biz: 'common' }).then(res => {
                const a = document.createElement('a');
                a.href = res;
                a.download = this.$Date(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                a.click();
            })
        },
        visibleChange(key) {
            if (!key) {
                this.list = {};
                this.Statusnum = { type: "info", name: "平台交易中" };
                this.goodsdata = [];
                this.columnsDetail = [];
                this.logisticsSummary = {};
                this.logisticsTracking = [];
            }
            this.pic = [];
            this.video = null;
            this.gbCommunityQr = null;
        },
        visibleChangeSend(key) {
            if (!key) {
                this.sendGoodCode = '';
            }
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
.orderlist_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .search_top {
        width: 100%;
        padding: 10px 0 10px;
    }


    :deep(.ivu-page.mini) {
        margin-top: 20px;
    }
}

.detail_box {
    width: 100%;
    padding: 10px 0;
    display: flex;
    flex-wrap: nowrap;

    .orderinfi_box_l {
        width: 60%;
        border-right: 1px dashed saddlebrown;
    }

    .orderinfi_box_r {
        width: 40%;
        float: right;

        .orderinfi_up {
            padding: 20px 30px 30px 30px;
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

            .receiving {
                background-color: #ff9900;
            }

            .deliver {
                background-color: #3a86ff;
            }

            .cancel {
                background-color: #e53e31;
            }

            .success {
                background-color: #00a846;
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

                    .time {
                        font-size: 15px;
                        font-weight: bold;
                    }

                    .content {
                        font-size: 14px;
                        padding-left: 5px;
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
    }

    .ivu-col-span-5 {
        padding-right: 15px;
        text-align: right;
        color: darkgrey;
    }

    .ivu-col-span-7 {
        font-weight: 600;
    }
}

.btn_border {
    color: #57a3f3;
    border-color: #57a3f3;
    border-radius: 3px;
}
</style>