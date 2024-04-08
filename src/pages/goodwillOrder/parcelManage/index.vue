<template>
    <div class='parcelmanage'>
        <!-- <h5>包裹管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城订单管理" content="包裹管理" hidden-breadcrumb />
        </div>
        <div class="parcel_main">
            <div class="search_top">
                <Space style="margin-bottom: 10px;">
                    <strong>日期</strong>
                    <DatePicker type="date" format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择开始日期" size="small"
                        style="width: 140px;" />
                    <strong>至</strong>
                    <DatePicker type="date" format="yyyy-MM-dd" placement="bottom-end" placeholder="请选择结束日期" size="small"
                        style="width: 140px;margin-right: 10px;" />
                </Space>
                <Space style="margin-bottom: 10px;">
                    <strong>包裹状态</strong>
                    <Select placeholder="请选择类型" clearable size="small" style="width:140px;margin-right: 10px; ">
                        <Option value="000">已发货</Option>
                        <Option value="0001">未揽收</Option>
                    </Select>
                </Space>
                <Space style="margin-bottom: 10px;">
                    <strong>处理状态</strong>
                    <Select placeholder="请选择状态" clearable size="small" style="width:140px;margin-right: 10px;">
                        <Option value="0002">已处理</Option>
                        <Option value="0001">未处理</Option>
                    </Select>
                </Space>
                <Space style="margin-bottom: 10px;">
                    <strong>快递公司</strong>
                    <Select placeholder="请选择快递公司" clearable size="small" style="width:140px;margin-right: 10px; ">
                        <Option value="000">1</Option>
                        <Option value="0001">2</Option>
                    </Select>
                </Space>
                <!-- <Space style="margin-bottom: 10px;">
                    <strong>商品类型</strong>
                    <Select v-model="consume" placeholder="请选择类型" clearable size="small"
                        style="width:140px;margin-right: 10px; ">
                        <Option value="000">1</Option>
                        <Option value="0001">2</Option>
                    </Select>
                </Space> -->

                <Space style="margin-bottom: 10px;">
                    <strong>收货人手机号</strong>
                    <Input placeholder="请输入地址关键字" clearable size="small" style="width: 140px;margin-right: 10px;" />
                </Space>
                <Space style="margin-bottom: 10px;">
                    <strong>订单号</strong>
                    <Input placeholder="请输入地址关键字" clearable size="small" style="width: 140px;margin-right: 10px;" />
                </Space>
                <Space style="margin-bottom: 10px;">
                    <strong>快递单号</strong>
                    <Input placeholder="请输入地址关键字" clearable size="small" style="width: 140px;margin-right: 10px;" />
                </Space>
                <Space style="margin-bottom: 10px;">
                    <strong>供应商</strong>
                    <Input placeholder="请输入地址关键字" clearable size="small" style="width: 140px;margin-right: 10px;" />
                </Space>
                <Space style="margin-bottom: 10px;">
                    <Button type="primary" size="small"> 查询</Button>
                    <Button style="margin-right: 10px;" size="small">重置</Button>
                </Space>
            </div>
            <Row class="modul_add" style="margin-bottom: 15px;">
                <Col span="2">
                <strong style="font-size: 17px; line-height: 32px;">
                    <Icon type="md-reorder" />包裹列表
                </strong>
                </Col>
                <Col span="14">
                <Button style="margin: 0 10px;">全部</Button>
                <Button style="margin: 0 10px;">揽收异常</Button>
                <Button style="margin: 0 10px;">运转异常</Button>
                <Button style="margin: 0 10px;">派签异常</Button>
                <Button style="margin: 0 10px;">无异常</Button>
                </Col>
                <Col span="6">
                </Col>
                <Col span="2"><Button type="success" style="margin: 0 10px;">导出</Button></Col>
            </Row>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #action="{ row }">
                    <Button type="error" size="small" @click="handle(row)">删除</Button>
                </template>
            </Table>
            <Page show-total :total="48" size="small" show-elevator show-sizer />
        </div>
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
                    title: '供应商',
                    key: 'age',
                    width: '240',
                    align: "center"
                },
                {
                    title: '快递公司',
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
                    title: '发货时间',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '订单号',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '包裹状态',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '收货人姓名',
                    key: 'age',
                    width: '240',
                    align: "center"
                },
                {
                    title: '收货人手机号',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '下单用户手机号',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '异常状态',
                    key: 'address',
                    width: '140',
                    align: "center"
                },
                {
                    title: '异常时间',
                    key: 'address',
                    width: '240',
                    align: "center"
                },
                {
                    title: '处理状态',
                    key: 'address',
                    width: '140',
                    align: "center"
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 140,
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
        }
    },
    methods: {
        handle(row) {
            console.log(row);
        },
    },
}
</script>
<style scoped lang='less'>
.parcel_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .search_top {
        width: 100%;
        padding: 10px 0 10px;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-around;
        align-items: center;
    }

    :deep(.ivu-page.mini) {
        margin-top: 20px;
    }
}
</style>