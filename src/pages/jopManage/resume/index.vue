<template>
    <div class='resume'>
        <!-- <h5>简历管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="求职管理" content="简历管理" hidden-breadcrumb />
        </div>
        <div class="box">
            <div class="search_top">
                <Space size="large">
                    <Space>
                        <strong>所在区域</strong>
                        <Select size="small"></Select>
                    </Space>
                    <Space>
                        <strong>简历名称</strong>
                        <Input size="small" placeholder="请输入简历名称关键字"></Input>
                    </Space>
                    <Space>
                        <Input placeholder="请输入姓名、联系电话关键词" size="small" v-width="220"> </Input>
                        <Button type="primary" size="small">查询</Button>
                        <Button size="small">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_main">
                <div class="table_title">
                    <strong>
                        <Icon type="md-list"></Icon>
                        简历列表
                    </strong>
                </div>
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #stateSlot="{ }">
                        <Switch></Switch>
                    </template>
                    <template #actionSlot="{ }">
                        <Button size="small" type="info" v-margin="5" @click="modal = true;">查看</Button>
                    </template>
                </Table>
            </div>
            <div class="foot_page">
                <Page :total="total" v-model="pageNumber" show-total size="small" show-elevator show-sizer
                    @on-change="changePage" :page-size-opts="[5, 10, 20, 30, 50]"
                    @on-page-size-change="pageSizeChange" />
            </div>
        </div>
        <Modal v-model="modal" title="简历详情">
            <h2>基本信息</h2>
            <Form label-position="right" :label-width="120">
                <FormItem label="姓名：">小丁</FormItem>
                <FormItem label="性别：">女</FormItem>
                <FormItem label="年龄：">24</FormItem>
                <FormItem label="联系电话：">1867346375</FormItem>
                <FormItem label="残疾类型：">听力残疾</FormItem>
                <FormItem label="残疾等级：">二级</FormItem>
                <FormItem label="所在城市：">上海静安区</FormItem>
            </Form>
            <h2>教育经历</h2>
            <Form label-position="right" :label-width="120">
                <FormItem label="毕业学校：">上海大学</FormItem>
                <FormItem label="学历：">本科</FormItem>
                <FormItem label="专业：">商务英语</FormItem>
                <FormItem label="时间：">2018-09至2022-07</FormItem>
            </Form>
            <h2>工作经历</h2>
            <Form label-position="right" :label-width="120">
                <FormItem label="公司名称：">华药联合</FormItem>
                <FormItem label="在职时间：">2023-09至今</FormItem>
                <FormItem label="担任职位：">经理</FormItem>
                <FormItem label="工作内容：">很多，1、………………</FormItem>
            </Form>
            <h2>自我评价</h2>
            <p>
                1,
            </p>
            <p> 2,
            </p>
            <p> 3,
            </p>
        </Modal>
        <Modal v-model="properModal">
            <h3>申请应聘人数</h3>
            <Table border :columns="columnsPro" :data="dataPro"></Table>
        </Modal>
    </div>
</template>
<script>
import {
    getUsrResumeListApi,
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
                    title: '姓名',
                    width: 120,
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '联系电话',
                    width: 260,
                    align: 'center',
                    key: 'tel'
                },
                {
                    title: '性别',
                    width: 140,
                    align: 'center',
                    key: 'gender'
                },
                {
                    title: '年龄',
                    width: 160,
                    align: 'center',
                    key: 'age'
                },
                {
                    title: '简历名称',
                    align: 'center',
                    key: 'resumeName'
                },
                {
                    title: '残疾类型',
                    width: 130,
                    align: 'center',
                    key: 'disClass'
                },
                {
                    title: '残疾等级',
                    width: 130,
                    align: 'center',
                    key: 'disgrade'
                },
                {
                    title: '所在城市',
                    align: 'center',
                    key: 'city'
                },
                {
                    title: '区域',
                    align: 'center',
                    key: 'address'
                },
                {
                    title: '已投递数量',
                    width: 160,
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
                                return params.row.number;
                            }
                        })
                    }
                },
                {
                    title: '生成时间',
                    width: 130,
                    align: 'center',
                    key: 'date'
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    fixed: 'right',
                    width: 100,
                    align: 'center'
                }
            ],
            data: [
                {
                    name: '小丁',
                    tel: '1867346375',
                    gender: '女',
                    age: 18,
                    resumeName: '销售',
                    disClass: '听力残疾',
                    disgrade: '二级',
                    city: '上海市',
                    address: '静安区',
                    date: '2016-10-03',
                    number: 3
                },
            ],
            loading: false,
            modal: false,

            columnsPro: [
                {
                    width: 50,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '企业名称',
                    // minWidth: 180,
                    align: 'center',
                    key: 'age'
                },
                {
                    title: '岗位名称',
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
        }
    },
    created() {
        // getUsrResumeListApi().then(res => {
        //     console.log(res);
        // })
    },
    methods: {

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
    text-align: center;
}

.table_title {
    margin-bottom: 15px;
    font-size: 16px;
}

.foot_page {
    margin-top: 20px;
}

:deep(.ivu-form-item) {
    margin-bottom: 5px;
}
</style>