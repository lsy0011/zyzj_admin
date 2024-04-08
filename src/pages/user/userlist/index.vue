<template>
    <div class="userlist">
        <!-- <h5>用户列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="用户管理" content="用户列表" hidden-breadcrumb />
        </div>
        <div class="list-main">
            <div class="top-search">
                <Space size="large" wrap>
                    <!-- <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择开始时间 ---" style="width: 200px" />
                    <DatePicker v-model="search.mExpiredTime" type="date" format="yyyy-MM-dd"
                        @on-change="(i) => search.mExpiredTime = i" placeholder="请选择截至时间" style="width: 200px" />
                    <Select placeholder="请选择城市 ---" clearable style="width:200px; ">
                    </Select>
                    <Select placeholder="请选择推广渠道 ---" clearable style="width:200px; ">
                    </Select>
                    <Select placeholder="是否已消费 ---" clearable style="width:200px; ">
                    </Select>
                    <Select placeholder="是否是种子用户 ---" clearable style="width:200px;">
                    </Select> 
                    <Select placeholder="是否通过分享来 ---" clearable style="width:200px; "> 
                    </Select> -->
                    <!-- <Select v-model="search.inviterId" placeholder="请选择邀请人" clearable filterable
                        :remote-method="remoteMethodInviterFn" :loading="inviterLoading" style="width:120px;">
                        <Option v-for="item in inviterList" :key="item.id" :value="item.id">
                            {{ item.name ? item.name : item.nickName ? item.nickName : item.mobile ? item.mobile : '未知' }}
                        </Option>
                    </Select> -->
                    <div class="atv_box">
                        <Input placeholder="请选择邀请人" v-model="inviterObj.name" v-width="120"
                            @on-change="remoteMethodInviterFn"></Input>
                        <div class="abs_box" v-show="inviterList.length">
                            <p v-for="item in inviterList" :key="item.id" @click="onInviterFn(item)">
                                {{
                            item.name ? item.name : item.nickName ? item.nickName : item.mobile ? item.mobile : '未知'
                        }}
                            </p>
                        </div>
                    </div>
                    <Input v-model="search.disCertNo" placeholder="请输入精准残疾证编号" clearable style="width: 200px"></Input>
                    <Select v-model="search.memberType" placeholder="角色类型" clearable style="width:120px;">
                        <Option value="Caring">爱心用户</Option>
                        <Option value="Disabled">残疾人</Option>
                        <Option value="DisabledFamily">残疾人家属</Option>
                    </Select>
                    <Input v-model="search.keywords" placeholder="请输入手机号姓名等关键字" clearable style="width: 200px" />
                    <Space>
                        <Button type="primary" @click="pageNumber = 1; getUserList()"> 查询</Button>
                        <Button @click="pageNumber = 1; pageSize = 10; search = {}; inviterObj = {}; getUserList()">
                            重置</Button>
                    </Space>
                </Space>
            </div>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #noHave>
                    <p> --- </p>
                </template>
                <template #statuSlot="{ row }">
                    <Switch v-model="row.active" @on-change="i => changeStatus(i, row)">
                        <template #open> <span>启用</span></template>
                        <template #close> <span>禁用</span></template>
                    </Switch>
                </template>
                <template #actionSlot="{ row }">
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn(row)">
                        <Button size="small" type="error">删除</Button>
                    </Poptip>
                    <!-- <Button size="small" style="margin: 0 10px;" type="primary">启用</Button> -->
                    <!-- <Button size="small" type="error">禁用</Button> -->
                </template>
            </Table>
            <Page :total="total" v-model="pageNumber" :page-size="pageSize" size="small" show-elevator
                :show-sizer="true" show-total @on-page-size-change="pageSizeChange" @on-change="changePage" />
        </div>
    </div>
</template>
<script>
import {
    getUserInfoPageApi,  // 用户列表
    postUserInfoActiveApi,  // 状态
    postUserInfoRemoveApi,    // 用户删除
} from '@/api/account'
export default {
    name: 'userlist',
    data() {
        return {
            loading: false,
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            columns: [
                {
                    title: '注册时间',
                    key: 'name',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.registerTime).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                // {
                //     title: '渠道来源',
                //     slot: 'noHave',
                //     width: 180,
                //     align: "center"
                // },
                // {
                //     title: '区域城市',
                //     slot: 'noHave',
                //     width: 180,
                //     align: "center"
                // },
                {
                    title: '手机号',
                    key: 'mobile',
                    width: 180,
                    align: "center",
                },
                // {
                //     title: '微信ID',
                //     slot: 'noHave',
                //     width: 180,
                //     align: "center",
                // },
                {
                    title: '用户名',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.name ? params.row.name : params.row.nickName ? params.row.nickName : params.row.username ? params.row.username : params.row.mobile ? params.row.mobile : '---'])
                    }
                },
                // {
                //     title: '等级',
                //     width: 180,
                //     align: "center",
                //     render: (h, params) => {
                //         return h('div', [params.row.member ? params.row.member.levelGrade : '---'])
                //     }
                // },
                {
                    title: '角色',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.memberType ? params.row.memberType.name : '---'])
                    }
                },
                {
                    title: '邀请人',
                    width: 150,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.inviter ? params.row.inviter.name ? params.row.inviter.name : params.row.inviter.mobile ? params.row.inviter.mobile : '---' : '---'])
                    }
                },
                {
                    title: '邀请人类型',
                    width: 150,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [params.row.inviter && params.row.inviter.memberType ? params.row.inviter.memberType.name : '---'])
                    }
                },
                {
                    title: '钱包余额',
                    slot: 'noHave',
                    width: 180,
                    align: "center"
                },
                {
                    title: '权益卡余额',
                    slot: 'noHave',
                    width: 180,
                    align: "center"
                },
                {
                    title: '订单数',
                    slot: 'noHave',
                    width: 180,
                    align: "center"
                },
                {
                    title: '最近登录',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '登录次数',
                    slot: 'noHave',
                    width: 180,
                    align: "center"
                },
                {
                    title: '购买次数',
                    slot: 'noHave',
                    width: 180,
                    align: "center"
                },
                {
                    title: '购买金额',
                    slot: 'noHave',
                    width: 180,
                    align: "center"
                },
                {
                    title: '权益卡补贴金额',
                    slot: 'noHave',
                    width: 180,
                    align: "center"
                },
                {
                    title: '状态',
                    width: 100,
                    align: "center",
                    fixed: 'right',
                    slot: 'statuSlot'
                },
            ], // 表头
            data: [], // 数据列表
            search: {},
            inviterList: [],   // 邀请过人
            inviterLoading: false,
            inviterTime: null,

            inviterObj: {
                name: '',
                id: '',
            },
        }
    },
    created() {
        let appId = process.env.VUE_APP_ID;
        if (appId != 'release:aid-2023') {
            this.columns.push({
                title: '操作',
                slot: 'actionSlot',
                width: 80,
                align: 'center',
                fixed: 'right',
            })
        }
        this.getUserList();   // 列表
    },
    methods: {
        // 用户列表
        getUserList() {
            if (this.inviterObj.id) {
                this.search.inviterId = this.inviterObj.id;
            }
            let data = {
                type: 'member',
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                ...this.search
            }
            getUserInfoPageApi(data).then(res => {
                let data = res.data;
                this.total = res.totalElements;
                this.data = JSON.parse(JSON.stringify(data));

                // 过滤有邀请人
                // this.inviterList = data.filter(item => {
                //     if (item.inviter && item.inviter.id) {
                //         return item;
                //     }
                // })
                // 提取出 邀请人
                // this.inviterList = this.inviterList.map(item => {
                //     return item.inviter;
                // })
            }).catch(err => {
                console.log(err);
            })
        },
        // 修改状态
        changeStatus(value, row) {
            postUserInfoActiveApi({ id: row.id, value }).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功！')
                    this.getUserList()
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 删除
        removeFn(row) {
            postUserInfoRemoveApi({ id: row.id }).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功');
                    this.getUserList();
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 邀请人模糊查询
        remoteMethodInviterFn() {
            let keywords = this.inviterObj.name;
            if (keywords.length != 24) {
                if (keywords !== '') {
                    this.inviterLoading = true;
                    if (this.inviterTime) {
                        clearTimeout(this.inviterTime);
                    }
                    this.inviterTime = setTimeout(() => {
                        this.inviterLoading = false;
                        getUserInfoPageApi({ keywords }).then(res => {
                            let data = res.data;

                            // // 过滤有邀请人
                            // this.inviterList = data.filter(item => {
                            //     if (item.inviter && item.inviter.id) {
                            //         return item;
                            //     }
                            // })
                            // // 提取出 邀请人
                            // this.inviterList = this.inviterList.map(item => {
                            //     return item.inviter;
                            // })
                            this.inviterList = data;
                        })

                    }, 200);
                } else {
                    this.inviterList = [];
                }
            }
        },
        onInviterFn(item) {
            this.inviterObj = {
                name: item.name ? item.name : item.nickName ? item.nickName : item.mobile ? item.mobile : '未知',
                id: item.id
            }
            this.inviterList = [];

        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getUserList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getUserList();
        },
    },
    unmounted() {
        this.inviterTime = null;
    }
}
</script>
<style scoped lang="less">
.list-main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .ivu-table-wrapper.ivu-table-wrapper-with-border {
        width: 100%;
        overflow: auto;
        margin: 10px 0 30px 0;

    }

    .top-search {
        width: 100%;
        padding: 10px 0 20px;
    }
}

.atv_box {
    display: flex;
    flex-wrap: wrap;
    width: 120px;
    position: relative;

    .abs_box {
        min-width: 120px;
        // max-width: 140px;
        max-height: 200px;
        position: absolute;
        top: 35px;
        /* right: 0; */
        left: 0;
        /* bottom: 0; */
        background-color: #fff;
        z-index: 999;
        border: 1px solid #ddd;
        border-radius: 5px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 5px 0;
        box-sizing: border-box;

        p {
            padding: 7px 16px;
            line-height: normal;
            box-sizing: border-box;
            // overflow: hidden;
            // text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;

            &:hover {
                background-color: #f3f3f3;
            }
        }
    }
}
</style>