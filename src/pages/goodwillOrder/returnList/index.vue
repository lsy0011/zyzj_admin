<template>
    <div class='returnlist'>
        <!-- <h5>退换货列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城订单管理" content="退换货列表" hidden-breadcrumb />
        </div>
        <div class="return_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <strong>换货单号</strong>
                        <Input placeholder="请输入订单号" clearable size="small" style="width: 140px; " />
                    </Space>
                    <Space>
                        <strong>快递单号</strong>
                        <Input placeholder="请输入快递单号" clearable size="small" style="width: 140px; " />
                    </Space>
                    <Space>
                        <strong>退货人手机号</strong>
                        <Input placeholder="请输入手机号" clearable size="small" style="width: 140px; " />
                    </Space>
                    <Space>
                        <strong>申请时间</strong>
                        <DatePicker type="date" format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择开始日期"
                            size="small" style="width: 140px;" />
                        <strong>至</strong>
                        <DatePicker type="date" format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择结束日期"
                            size="small" style="width: 140px; " />
                    </Space>
                    <Space>
                        <strong>退货人昵称</strong>
                        <Input placeholder="请输入手机号" clearable size="small" style="width: 140px; " />
                    </Space>
                    <!-- <Space >
                    <strong>包裹状态</strong>
                    <Select placeholder="请选择类型" clearable size="small" style="width:140px;  ">
                        <Option value="000">已发货</Option>
                        <Option value="0001">未揽收</Option>
                    </Select>
                </Space> -->
                    <Space>
                        <strong>快递公司</strong>
                        <Select placeholder="请选择快递公司" clearable size="small" style="width:140px;  ">
                            <Option value="000">1</Option>
                            <Option value="0001">2</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>换货原因</strong>
                        <Select placeholder="请选择状态" clearable size="small" style="width:140px; ">
                            <Option value="0002">已处理</Option>
                            <Option value="0001">未处理</Option>
                        </Select>
                    </Space>
                    <Space>
                        <Button type="primary" size="small"> 查询</Button>
                        <Button style=" " size="small">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_list">
                <div class="table_top">
                    <Space size="large">
                        <Space>
                            <Icon type="md-list" />
                            <strong>
                                数据列表
                            </strong>
                        </Space>
                        <Space>
                            <Button size="small">全部（50）</Button>
                            <Button size="small">待审核（5）</Button>
                            <Button size="small">待收货（5）</Button>
                            <Button size="small">待退款（3）</Button>
                            <Button size="small">待到账（5）</Button>
                            <Button size="small">拒绝退货（3）</Button>
                            <Button size="small">完成（50）</Button>
                        </Space>
                        <Space>
                            <Button size="small" type="success" @click="exportData">导出列表</Button>
                        </Space>
                    </Space>
                </div>
                <Table :columns="columns" :data="data" ref="table" :loading="loading"
                    @on-selection-change="selectionChange">
                    <template #detailsSlot>
                        <Button size="small" @click="lookDetailsFn()">查看详情</Button>
                    </template>
                    <template #actionSlot="{ row }">
                        <Button type="error" size="small" @click="handle(row)">删除</Button>
                    </template>
                </Table>
                <div class="action_all">
                    <Button icon="ios-trash" size="small" :disabled="selectionAll == 0">删除</Button>
                    <Button type="info" size="small" :disabled="selectionAll == 0">批量收货</Button>
                    <Button type="info" size="small" :disabled="selectionAll == 0">批量退款</Button>
                    <Button type="info" size="small" :disabled="selectionAll == 0">批量审核</Button>
                </div>
            </div>
            <Page show-total :total="48" size="small" show-elevator show-sizer />
        </div>
        <Modal v-model="modal" title="详情" width="1000">
            <div class="all_box">
                <div class="top_box">
                    <div class="top_left_box">
                        <Input placeholder="退货单号"></Input>
                        <Input placeholder="当前状态"></Input>
                        <Button>确认收货</Button>
                    </div>
                    <div class="top_right_box">
                        <Steps :current="1">
                            <Step title="" content="提交退货申请"></Step>
                            <Step title="" content="审核通过"></Step>
                            <Step title="" content="收货"></Step>
                            <Step title="" content="退款"></Step>
                            <Step title="" content="完成"></Step>
                        </Steps>
                    </div>
                </div>
                <div class="main_box">
                    <div class="main_top_title">退货商品</div>
                    <div class="goods_info_body">
                        <div class="goods_only_25">
                            <p>商品信息</p>
                            <div class="info_25_box">
                                <img src="" width="70" height="70" alt="">
                                <div>
                                    <h4>商品名称</h4>
                                    <span>颜色：</span>
                                    <span>规格：</span>
                                </div>
                            </div>
                        </div>
                        <div class="goods_only_15">
                            <p>单价</p>
                            <div>
                                ￥34
                            </div>
                        </div>
                        <div class="goods_only_15">
                            <p>数量</p>
                            <div>
                                1
                            </div>
                        </div>
                        <div class="goods_only_15">
                            <p>小计</p>
                            <div>
                                ￥34
                            </div>
                        </div>
                        <div class="goods_only_15">
                            <p>实付金额</p>
                            <div>
                                ￥34
                            </div>
                        </div>
                        <div class="goods_only_15">
                            <p>应退金额</p>
                            <div>
                                ￥34
                            </div>
                        </div>
                    </div>
                    <div class="return_goods_info">
                        <h4>退货原因：<span>七天无理由</span></h4>
                        <h4>退货描述：<span>不舒服，不一样</span></h4>
                        <h4>退货图片：<img src="" width="60" height="60" alt=""></h4>
                    </div>
                </div>
                <div class="foot_box">
                    <div class="return_odd_title">退货单信息</div>
                    <div class="foot_return_odd">
                        <div class="return_odd_left">
                            <div class="box_only">
                                <strong>商品返回方式</strong>
                                <span>自寄</span>
                            </div>
                            <div class="box_only">
                                <strong>退货原因</strong>
                                <span>七天无理由</span>
                            </div>
                            <!-- <div class="box_only">
                                <strong>取件地址</strong>
                                <span>上海上海上海</span>
                            </div> -->
                            <div class="box_only">
                                <strong>联系人</strong>
                                <span>某某</span>
                            </div>
                            <div class="box_only">
                                <strong>手机号</strong>
                                <span>1746763845</span>
                            </div>
                            <div class="box_only">
                                <strong>收货地址</strong>
                                <span>上海上海上海</span>
                            </div>
                            <div class="box_only">
                                <strong>申请时间</strong>
                                <span>2023-12-20</span>
                            </div>
                            <div class="box_only">
                                <strong>退款方式</strong>
                                <span>原路返回</span>
                            </div>
                            <div class="box_only">
                                <strong>订单号</strong>
                                <span>no877887677352</span>
                            </div>
                            <div class="box_only">
                                <strong>编码邮箱</strong>
                                <span>654866</span>
                            </div>
                        </div>
                        <div class="return_odd_right">
                            <div class="box_only">
                                <strong>商品应退金额</strong>
                                <span> ￥12 </span>
                            </div>
                            <div class="box_only">
                                <strong>是否退运费</strong>
                                <span>不退运费</span>
                            </div>
                            <div class="box_only">
                                <strong>退款金额</strong>
                                <span> ￥12</span>
                            </div>
                            <div class="box_only">
                                <strong>退货物流单号</strong>
                                <span><Button size="small">查看快递详情</Button></span>
                            </div>
                            <div class="box_only">
                                <strong>收货地址</strong>
                                <span>地址地址a</span>
                            </div>
                            <div class="box_only">
                                <strong>收货人姓名</strong>
                                <span>某某某</span>
                            </div>
                            <div class="box_only">
                                <strong>收货人手机号</strong>
                                <span>187857384543</span>
                            </div>
                            <div class="box_only">
                                <strong>收货地址</strong>
                                <span>北京北京</span>
                            </div>
                            <div class="box_only">
                                <strong>详细地址</strong>
                                <span>快意民商</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: 'parcelmanage',
    data() {
        return {
            loading: false,
            search: {},
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '退货单号',
                    key: 'age',
                    width: '240',
                    align: "center"
                },
                {
                    title: '快递单号',
                    key: 'age',
                    width: '240',
                    align: "center"
                },
                {
                    title: '申请时间',
                    key: 'age',
                    width: '240',
                    align: "center"
                },
                {
                    title: '商品数量',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '金额（元）',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '原因',
                    key: 'address',
                    // width: '240',
                    align: "center"
                },
                {
                    title: '退货状态',
                    key: 'age',
                    width: 240,
                    align: "center"
                },
                {
                    title: '查看详情',
                    width: 240,
                    align: "center",
                    slot: 'detailsSlot'
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 80,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [
                {
                    name: 'John',
                    age: 18,
                    address: '上海'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: '上海'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: '上海'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: '上海'
                }
            ], // 数据列表

            modal: false,
            selectionAll: []
        }
    },
    methods: {
        lookDetailsFn(row) {
            this.modal = true;
            console.log("🚀 ~ file: index.vue:201 ~ lookDetailsFn ~ row:", row)

        },
        handle(row) {
            console.log(row);
        },
        selectionChange(selection) {
            // console.log(selection);
            this.selectionAll = selection
        },
        exportData() {
            this.$refs.table.exportCsv({
                filename: 'table'
            });
        }
    },
}
</script>
<style scoped lang='less'>
.return_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .search_top {
        // width: 100%;
        margin-bottom: 20px;
    }

    .table_list {
        width: 100%;

        .ivu-col-span-2 {
            line-height: 32px;
        }

        .table_top {
            margin-bottom: 15px;

            strong {
                font-size: 16px;
            }
        }

        .action_all {
            margin-top: 15px;

            button {
                margin: 0 5px;
            }
        }
    }

    :deep(.ivu-page.mini) {
        margin-top: 15px;
    }
}

.all_box {
    width: 100%;

    .top_box {
        width: 100%;
        // height: 100px;
        padding: 10px 20px;
        border: 1px solid #ddd;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        flex-wrap: nowrap;

        .top_left_box {
            width: 35%;
            padding: 0 20px;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px dashed #dddddd;
        }

        .top_right_box {
            width: 65%;
            padding: 0 20px;
            padding-top: 30px;
            box-sizing: border-box;

        }

        :deep(.ivu-steps-horizontal .ivu-steps-content) {
            padding: 0;
        }
    }

    .main_box {
        margin: 20px 10px;
        border: 1px solid #ddd;
        border-radius: 5px;

        .main_top_title {
            // height: 35px;
            // line-height: 26px;
            padding: 20px;
            // font-weight: 600;
            box-sizing: border-box;
        }

        // border-radius: 3px;
        .goods_info_body {
            width: 100%;
            text-align: center;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;


            .goods_only_25 {
                width: 25%;

                .info_25_box {
                    border: 1px solid #ddd;
                    height: 90px;
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    align-items: center;

                    div {
                        padding-left: 10px;
                        box-sizing: border-box;
                    }
                }
            }

            .goods_only_15 {
                width: 15%;

                div {
                    border: 1px solid #ddd;
                    height: 90px;
                    line-height: 90px;
                }
            }

            p {
                height: 40px;
                line-height: 40px;
                background-color: #f8f8f9;
                border: 1px solid #ddd;
            }
        }

        .return_goods_info {
            padding-top: 10px;
            padding-left: 10px;

            h4 {
                margin-bottom: 5px;

                span {
                    color: #ff0000;
                }
            }
        }
    }

    .foot_box {
        margin: 20px 10px;
        border: 1px solid #ddd;
        border-radius: 5px;

        .return_odd_title {
            padding: 20px;
            box-sizing: border-box;
            border-bottom: 1px solid #ddd;
        }

        ;

        .foot_return_odd {
            width: 100%;
            display: flex;

            .return_odd_left,
            .return_odd_right {
                width: 50%;

                .box_only {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;

                    strong {
                        display: inline-block;
                        width: 40%;
                        height: 40px;
                        padding-left: 10px;
                        box-sizing: border-box;
                        background-color: #f8f8f9;
                        border-bottom: 1px solid #ddd;
                    }

                    span {
                        display: inline-block;
                        width: 60%;
                        height: 40px;
                        padding-left: 10px;
                        box-sizing: border-box;
                        border-bottom: 1px solid #ddd;
                    }
                }
            }
        }
    }
}
</style>