<template>
    <div class='personageEntrust'>
        <!-- <h5>个人委托方管理</h5> -->

        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="个人委托方管理" hidden-breadcrumb />
        </div>
        <div class="personage_main">
            <div class="search_top">
                <Space size="large">
                    <Space>
                        <strong>时间</strong>
                        <DatePicker type="date" v-model="search.regTimeStart" placeholder="请选择日期时间" size="small"
                            style="width: 180px" />
                        <strong>至</strong>
                        <DatePicker type="date" v-model="search.regTimeEnd" placeholder="请选择日期时间" size="small"
                            style="width: 180px" />
                    </Space>
                    <!-- <Space>
                        <strong>委托方</strong>
                        <Input placeholder="模糊查询" size="small"></Input>
                    </Space> -->
                    <Space>
                        <Input v-model="search.keywords" clearable placeholder="请输入联系人/手机号等关键字" size="small"
                            v-width="220"></Input>
                        <Button size="small" type="primary" @click="pageNumber = 1; getMerList();">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; pageSize = 10; search = {}; statuType = 1; getMerList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_tit">
                <Space size="large">
                    <Space>
                        <Icon type="md-list"></Icon>
                        <strong>列表</strong>
                    </Space>

                    <Button size="small" v-for="item in statusList" :class="{ 'show_btn': statuType == item.id }"
                        :key="item.id" @click="changeStatuType(item)">{{ item.title }}</Button>

                </Space>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #statuSlot="{ row }">
                    <div v-if="row.status">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => changeSatusFn(i, row)"></Switch>
                    </div>
                    <div v-else>
                        <Switch true-value="enabled" false-value="disabled" @on-change="(i) => changeSatusFn(i, row)">
                        </Switch>
                    </div>
                </template>
                <template #actionSlot="{ row }">
                    <template v-if="row.approvalInfo.state.code == 'wait'">
                        <Button type="success" size="small"
                            @click="remarkModal = true; checkList.id = row.id; checkList.state = 'success'">审核通过</Button>
                        <Button type="error" size="small"
                            @click="remarkModal = true; checkList.id = row.id; checkList.state = 'reject'">驳回</Button>
                    </template>
                    <Button size="small" type="warning" v-if="row.approvalInfo.state.code == 'reject'"
                        @click="remarkModal = true; checkList.id = row.id; repeateFlag = true;">重新审批</Button>
                    <Button type="info" size="small" @click="seeDetailsFn(row)">查看详情</Button>
                    <!-- <Button type="primary" size="small">编辑</Button> -->
                </template>
            </Table>
            <div class="foot_page" style="margin: 20px 0 0;">
                <Page :total="total" v-model="pageNumber" :page-size="pageSize" size="small" show-elevator show-sizer
                    show-total @on-page-size-change="pageSizeChange" @on-change="changePage" />
            </div>
        </div>
        <!-- 详情 -->
        <Modal v-model="modal" title="委托方详情" width="600">
            <div class="title_top">基本信息</div>
            <Form label-position="right" :label-width="160">
                <FormItem label="委托方姓名:">
                    <strong>{{ detailsData.name || '' }}</strong>
                </FormItem>
                <FormItem label="联系人身份证:">
                    <strong>{{ detailsData.creditCode || '' }}</strong>
                </FormItem>
                <FormItem label="联系方式:">
                    <strong>{{ detailsData.linkTel || '' }}</strong>
                </FormItem>
                <FormItem label="所在区域:">
                    <strong>
                        {{ detailsData.region && detailsData.region.extra ? detailsData.region.extra.namePath.join(' / ') ||
                            '' : ''
                        }}
                    </strong>
                </FormItem>
                <FormItem label="具体地址:">
                    <strong>{{ detailsData.address || '' }}</strong>
                </FormItem>
                <FormItem label="开户行类别:">
                    <strong>{{ detailsData.bankType || '' }}</strong>
                </FormItem>
                <FormItem label="开户名:">
                    <strong>{{ detailsData.bankName || '' }}</strong>
                </FormItem>
                <FormItem label="银行账号:">
                    <strong>{{ detailsData.bankAccNo || '' }}</strong>
                </FormItem>
            </Form>
            <div class="title_top">资质类型</div>
            <div class="info_table">
                <Table stripe :columns="columnsInfo" :data="dataInfo" size="small" border>
                    <template #actionInfoSlot="{ row }">
                        <a href="javascript:;" @click="imgName = row.filePath; visible = true;">查看</a>
                    </template>
                </Table>
            </div>
            <div class="title_top">详情信息</div>
            <div class="footer_box">
                <div>
                    <span>拍品委托数:</span>
                    <strong>{{ detailsData.stat ? detailsData.stat.goodsCount : '0' }}</strong>
                </div>
                <div>
                    <span>拍品总成交额:</span>
                    <strong>￥{{ detailsData.stat ? detailsData.stat.turnover : '0' }}</strong>
                </div>
                <div>
                    <span>总分账成交金额:</span>
                    <strong>￥{{ detailsData.stat ? detailsData.stat.turnoverFz : '0' }}</strong>
                </div>
            </div>
        </Modal>
        <!-- 审核备注 -->
        <Modal v-model="remarkModal" @on-visible-change="visibleChange" title="备注" width="300">
            <div v-if="repeateFlag" style="margin-bottom: 15px;">
                <RadioGroup v-model="checkList.state">
                    <Radio label="success">
                        <span>通过</span>
                    </Radio>
                    <Radio label="reject">
                        <span>驳回</span>
                    </Radio>
                </RadioGroup>
            </div>

            <Input v-model="checkList.remark" type="textarea" :rows="3" placeholder="请输入备注内容" />
            <template #footer>
                <Button type="primary" @click="merCheckFn()" :disabled="!checkList.remark">确认</Button>
                <Button @click="remarkModal = false;">取消</Button>
            </template>
        </Modal>

        <!-- 查看图片 -->
        <ImagePreview v-model="visible" :preview-list="[imgName]" />
    </div>
</template>
<script>
import {
    getAuctionConsignerPageApi,   // 分页
    postAuctionConsignerStatusApi,   // 状态
    postAuctionConsignerApprovalApi,    // 审核
    getAuctionConsignerDetailApi,    // 详情
    postAuctionConsignerRemoveApi,    // 删除
    getConsignerCertListApi,   // 资质列表
} from '@api/account'
export default {
    name: 'personageEntrust',
    data() {
        return {
            loading: false,
            modal: false,
            remarkModal: false,
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
                    title: '注册时间',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '委托方名称',
                    align: 'center',
                    minWidth: 160,
                    key: 'name',
                },
                {
                    title: '联系方式',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', params.row.lpMobile || '---')
                    }
                },
                {
                    title: '所在区域',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [params.row.region && params.row.region.extra && params.row.region.extra.namePath ? params.row.region.extra.namePath.join(' / ') : '---'])
                    }
                },
                {
                    title: '具体地址',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [params.row.address ? params.row.address : '---'])
                    }
                },
                {
                    title: '拍品总委托数',
                    align: 'center',
                    width: 140,
                    render: (h, params) => {
                        return h('div', [params.row.stat ? params.row.stat.goodsCount : '---'])
                    }
                },
                {
                    title: '总成交额',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', [params.row.stat ? params.row.stat.turnover : '---'])
                    }
                },
                {
                    title: '审核状态',
                    align: 'center',
                    width: 120,
                    render: (h, params) => {
                        return h('div', [params.row.approvalInfo && params.row.approvalInfo.state ? params.row.approvalInfo.state.name : '---'])
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 90,
                    slot: 'statuSlot'
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 210,
                    slot: 'actionSlot'
                },
            ],
            data: [],
            columnsInfo: [
                {
                    title: '内容',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '附件',
                    align: 'center',
                    slot: 'actionInfoSlot'
                },
            ],
            dataInfo: [
                { title: '身份证正面' },
                { title: '身份证反面' },
                { title: '银行卡正面' },
                { title: '银行卡反面' },
                { title: '委托协议' },
            ],   // 详情资质
            detailsData: {},  // 详情
            search: {},   // 查询
            statusList: [
                { title: '全部', key: '', id: 1 },
                { title: '待审批', key: 'wait', id: 2 },
                { title: '审批中', key: 'underway', id: 3 },
                { title: '已通过', key: 'success', id: 4 },
                { title: '未通过', key: 'reject', id: 5 },
            ],   // 状态列表
            statuType: 1,
            checkList: {},    // 审核
            repeateFlag: false,    // 重新审核

            visible: false,   // 查看图片
            imgName: '',   // 图片
        }
    },
    created() {
        this.getMerList();
    },
    methods: {
        // 商家分页
        getMerList() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                type: 'individual',
            }

            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (key == 'regTimeStart' || key == 'regTimeEnd') {

                        if (element) data[key] = element.getTime();

                    } else {
                        data[key] = element;
                    }
                }
            }

            this.loading = true;
            getAuctionConsignerPageApi(data).then(res => {
                this.data = res.data;
                this.total = res.totalElements;
                this.loading = false;
            })
        },
        // 修改状态
        changeSatusFn(value, row) {
            // 被驳回 不允许起开
            // if (row.approvalInfo && row.approvalInfo.state.code == 'reject') {
            //     this.$Message.warning('已被驳回！')
            //     this.getMerList();
            // } else {
            postAuctionConsignerStatusApi({ id: row.id, value }).then(res => {
                this.$Message.success('操作成功！');
                this.getMerList();
            }).catch(err => {
                this.getMerList();
            })
            // }
        },
        // 审核状态查询
        changeStatuType(item) {
            this.pageNumber = 1;
            this.statuType = item.id;
            this.search.approState = item.key;
            this.getMerList();
        },
        // 审核
        merCheckFn() {
            postAuctionConsignerApprovalApi(this.checkList).then(res => {
                // 被驳回修改状态
                // if (this.checkList.state == 'reject') {
                //     this.changeSatusFn('disabled', this.checkList)
                // } else {
                this.$Message.success('操作成功！');
                //     this.getMerList();
                // }
                this.remarkModal = false;
            })
        },
        // 查看详情
        seeDetailsFn(row) {

            getAuctionConsignerDetailApi(row.id).then(res => {
                this.detailsData = JSON.parse(JSON.stringify(res));
                this.modal = true;
            })
            // 获取资质
            getConsignerCertListApi({ consignerId: row.id }).then(res => {
                this.dataInfo = res;
            })
        },
        visibleChange(flag) {
            if (!flag) {
                this.checkList = {};
                this.repeateFlag = false;
            }
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getMerList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getMerList();
        },
    }
}
</script>
<style scoped lang='less'>
.personage_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .table_tit {
        margin: 20px 0;
        font-size: 15px;

        .show_btn {
            border: 1px solid #2d8cf0;
            color: #2d8cf0;
        }
    }
}

.title_top {
    font-size: 15px;
    font-weight: 600;
    border-left: 5px solid #ed0321;
    padding-left: 12px;
    box-sizing: border-box;
}

.info_table {
    width: 92%;
    margin: 10px auto;
}

.footer_box {
    width: 92%;
    margin: 10px auto;
    display: flex;
    flex-wrap: wrap;

    div {
        width: 33%;
        margin-bottom: 10px;
    }
}

.ivu-form-item {
    margin-bottom: 0px;
}

.ivu-table-cell-slot {
    button {
        margin: 5px;
    }
}
</style>