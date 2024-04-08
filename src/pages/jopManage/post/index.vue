<template>
    <div class='post'>
        <!-- <h5>岗位管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="求职管理" content="岗位管理" hidden-breadcrumb />
        </div>
        <div class="box">
            <div class="search_top">
                <Space size="large" wrap>
                    <Space>
                        <DatePicker v-model="search.timeCreatedBegin" type="date" size="small" placeholder="请选择开始日期"
                            style="width: 140px" />
                        <strong>至</strong>
                        <DatePicker v-model="search.timeCreatedEnd" type="date" size="small" placeholder="请选择截止日期"
                            style="width: 140px" />
                    </Space>
                    <Space>
                        <strong>企业名称</strong>
                        <Select v-model="search.merchantId" size="small" filterable :remote-method="remoteMethodMer"
                            :loading="merLoading" placeholder="请输入企业名称关键字">
                            <Option v-for="(item) in merList" :key="item.code" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>行业分类</strong>
                        <Select size="small"></Select>
                    </Space>
                    <Space>
                        <strong>可接受残疾类型</strong>
                        <Select size="small" v-model="search.disTypeLevelId" placeholder="类型" clearable>
                            <Option v-for="(item) in dictList" :key="item.id" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </Space>
                    <Space>
                        <Input v-model="search.keywords" placeholder="请输入职位名称关键词" size="small"></Input>
                        <Button type="primary" size="small" @click="pageNumber = 1; getPostPage()">查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}; getPostPage()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_main">
                <div class="table_title">
                    <Space size="large">
                        <strong>
                            <Icon type="md-list"></Icon>
                            岗位列表
                        </strong>
                        <Button :class="{ 'btn_border': showBox == 0 }" @click="showBox = 0; getPostPage()">全部</Button>
                        <!-- <Button :class="{ 'btn_border': showBox == 1 }" @click="showBox = 1; getPostPage()">待审核</Button> -->
                        <Button :class="{ 'btn_border': showBox == 2 }" @click="showBox = 2; getPostPage()">未通过</Button>
                        <Button :class="{ 'btn_border': showBox == 3 }" @click="showBox = 3; getPostPage()">已通过</Button>

                    </Space>
                </div>
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #disTypeSlot="{ row }">
                        <div>
                            <div v-for="(item, index) in row.disTypeLevel" :key="index">
                                <p>{{ item.disType.name }}：{{ item.level.join() }}级</p>
                            </div>
                        </div>
                    </template>
                    <template #stateSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(v) => changeStatusFn(v, row)"></Switch>
                    </template>

                    <template #actionSlot="{ row }">
                        <div v-show="row.approvalInfo.state.code == 'wait'">
                            <Button size="small" type="success" v-margin="5"
                                @click="audit = { id: row.id, state: 'success' }; auditModal = true;">审核通过</Button>
                            <Button size="small" type="warning" v-margin="5"
                                @click="audit = { id: row.id, state: 'reject' }; auditModal = true;">驳回</Button>
                        </div>
                        <Button size="small" type="info" v-margin="5" @click="lookPostFn(row)">查看</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="postDelFn(row)">
                            <Button size="small" type="error" v-margin="5"
                                v-show="row.status.code != 'enabled'">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </div>
            <div class="foot_page">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]"
                    @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <Modal v-model="modal" title="职位管理详情">
            <Form label-position="right" :label-width="120">
                <FormItem label="企业名称：">{{ list.merchant ? list.merchant.name : '---' }}</FormItem>
                <FormItem label="职位名称：">{{ list.name || '---' }}</FormItem>
                <FormItem label="岗位月薪：">{{ list.amount || 0 }}元/月 </FormItem>
                <FormItem label="行业分类：">{{ list.industry ? list.industry.name : '---' }}</FormItem>
                <FormItem label="经验要求：">{{ list.expYear ? list.expYear.name : '---' }}</FormItem>
                <FormItem label="最低学历：">{{ list.education ? list.education.name : '---' }}</FormItem>
                <FormItem label="招聘人数：">{{ list.properModal || 0 }}人</FormItem>
                <FormItem label="接受残疾类型：">
                    <div v-for="(item, index) in list.disTypeLevel" :key="index">
                        <p>{{ item.disType.name }}-{{ item.level.join() }}级</p>
                    </div>
                </FormItem>
                <FormItem label="企业地址：">
                    <p>{{ list.region && list.region.extra ? list.region.extra.namePath.join(' / ') : '---' }}</p>
                </FormItem>
                <FormItem label="工作地址：">
                    {{ list.address || '---' }}
                </FormItem>
                <FormItem label="职位描述：">
                    <p v-html="list.duty"></p>
                    <!-- <Input type="textarea" v-model="list.duty" v-color="'#000'" :rows="15"></Input> -->
                </FormItem>
                <!-- <FormItem label="岗位职责：">省略一千字…………</FormItem>
                <FormItem label="任职要求：">省略一千字…………</FormItem> -->
                <FormItem label="不感兴趣人数：">10人--- </FormItem>
                <FormItem label="申请应聘人数：">10人--- </FormItem>
            </Form>
        </Modal>
        <Modal v-model="properModal">
            <h3>申请应聘人数</h3>
            <Table border :columns="columnsPro" :data="dataPro"></Table>
        </Modal>

        <Modal v-model="auditModal" title="审核">
            <Input type="textarea" v-model="audit.remark" :rows="4"></Input>
            <template #footer>
                <Button type="primary" @click="auditSaveFn()">确认</Button>
                <Button @click="auditModal = false; audit = {}">取消</Button>
            </template>
        </Modal>

    </div>
</template>
<script>
import {
    getRecruitPageApi,  // 分页
    postRecruitStatusApi,  // 状态
    postRecruitRemoveApi,  // 删除
    getRecruitDetailApi,  // 详情
    postRecruitApprovalApi,  // 审核
    getMerchantBasePageApi,   // 企业
    getSysDictItemTreeApi,   // 残疾类型
} from '@/api/account.js'
export default {
    name: 'post',
    data() {
        return {
            columns: [
                {
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '企业名称',
                    minWidth: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.merchant ? params.row.merchant.name : '---')
                    }
                },
                {
                    title: '职位名称',
                    width: 260,
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '行业分类',
                    minWidth: 140,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.industry ? params.row.industry.name : '---')
                    }
                },
                {
                    title: '岗位月薪',
                    width: 160,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.amount ? params.row.amount + '元/月' : '---')
                    }
                },
                {
                    title: '最低学历',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.education ? params.row.education.name : '---')
                    }
                },
                {
                    title: '经验要求',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.expYear ? params.row.expYear.name : '---')
                    }
                },
                {
                    title: '招聘人数',
                    width: 130,
                    align: 'center',
                    key: 'peopleNum'
                },
                {
                    title: '可接受残疾类型及等级',
                    width: 180,
                    align: 'center',
                    slot: 'disTypeSlot'
                },
                // {
                //     title: '接受残疾等级',
                //     width: 160,
                //     align: 'center',
                //     key: 'disgrade'
                // },
                {
                    title: '申请应聘人数',
                    width: 130,
                    align: 'center',
                    // key: 'age',
                    render: (h, params) => {
                        return h('span', {
                            style: {
                                borderBottom: '1px solid #474747',
                                cursor: 'pointer',//悬浮时变手指
                            },
                            onClick: () => {
                                this.properModal = true;
                            }
                        }, {
                            default() {
                                return ' ---- ';
                            }
                        })
                    }
                },
                {
                    title: '发布时间',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '审核状态',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.approvalInfo && params.row.approvalInfo.state ? params.row.approvalInfo.state.name : '---')
                    }
                },
                {
                    title: '审核备注',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', params.row.approvalInfo ? params.row.approvalInfo.approveResult ? params.row.approvalInfo.approveResult : '---' : '---')
                    }
                },
                {
                    title: '状态',
                    width: 80,
                    align: 'center',
                    slot: 'stateSlot',
                    fixed: 'right',
                },
                // {
                //     title: '推荐',
                //     width: 80,
                //     align: 'center',
                //     slot: 'stateSlot'
                // },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    fixed: 'right',
                    width: 200,
                    align: 'center'
                }
            ],
            data: [],
            loading: false,
            modal: false,
            pageNumber: 1,
            pageSize: 10,
            total: '',
            search: {},
            list: {},   // 查看
            dictList: [],   // 残疾类型

            columnsPro: [
                {
                    width: 50,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '求职人姓名',
                    // minWidth: 180,
                    align: 'center',
                    key: 'age'
                },
                {
                    title: '手机号',
                    // width: 260,
                    align: 'center',
                    key: 'age'
                },
                {
                    title: '详情',
                    width: 90,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {
                            style: {
                                // borderBottom: '1px solid #474747',
                                color: '#ed0321',
                                cursor: 'pointer',//悬浮时变手指
                            },
                            onClick: () => {
                                this.properModal = true;
                            }
                        }, {
                            default() {
                                return '查看'
                            }
                        })
                    }
                },
            ],
            dataPro: [{ age: '99' }],    
            properModal: false,
            auditModal: false,  // 审核
            audit: {},   // 信息 
            showBox: 0,
            merLoading: false,
            merList: [],   // 商家
        }
    },
    created() {
        this.getPostPage();
        getSysDictItemTreeApi({ dict: 'dis_type' }).then(res => {
            this.dictList = res;
        })
    },
    methods: {
        // 岗位分页
        getPostPage() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
            };

            switch (this.showBox) {
                case 0:
                    data.approvalInfo = '';
                    break;
                case 1:
                    data.approvalInfo = 'wait,underway';
                    break;
                case 2:
                    data.approvalInfo = 'reject';
                    break;
                case 3:
                    data.approvalInfo = 'success';
                    break;

                default:
                    break;
            };

            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];

                    if (key == 'timeCreatedBegin' || key == 'timeCreatedEnd') {
                        data[key] = element ? this.$Date(element).format('YYYY-MM-DD') : '';
                    } else {
                        data[key] = element;
                    };

                };
            };
            this.loading = true;
            getRecruitPageApi(data).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;
            })
        },
        // 查看
        lookPostFn(row) {
            getRecruitDetailApi(row.id).then(res => {
                this.list = res;
                this.list.duty = res.duty.replace(/\n/g, '<br />')
                this.modal = true;
            })
        },
        // 岗位删除
        postDelFn(row) {
            postRecruitRemoveApi({ id: row.id }).then(res => {
                this.$Message.success('操作成功！');
                this.getPostPage();
            }).catch(err => {
                this.$Message.error('操作失败！')
            })
        },
        // 修改状态
        changeStatusFn(value, row) {

            postRecruitStatusApi({ value, id: row.id }).then(res => {
                this.$Message.success('修改成功 ！')
            }).catch(err => {
                this.$Message.error('修改失败 ！');
                this.getPostPage();
            })
        },
        // 审核
        auditSaveFn() {

            postRecruitApprovalApi(this.audit).then(res => {
                this.auditModal = false;
                this.audit = {};
            })
        },

        // 模糊查
        remoteMethodMer(keywords) {

            if (keywords !== '') {
                this.merLoading = true;

                let data = {
                    pageSize: 900,
                    biz: 'recruit',
                    type: 'Enterprise',
                    keywords
                };
                getMerchantBasePageApi(data).then(res => {
                    this.merList = res.data;
                    this.merLoading = false;
                })
            } else {
                this.merList = [];
            }
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getPostPage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPostPage();
        },
    }
}
</script>
<style scoped lang='less'>
.box {
    margin-top: 24px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
}


.search_top {
    margin-bottom: 20px;
}

.table_title {
    margin-bottom: 15px;
    font-size: 16px;

    .btn_border {
        border: 2px solid #58a3f3;
        border-radius: 3px;
        color: #58a3f3;
        font-weight: 600;
    }
}

.foot_page {
    margin-top: 20px;
}

:deep(.ivu-form-item) {
    margin-bottom: 5px;
}
</style>