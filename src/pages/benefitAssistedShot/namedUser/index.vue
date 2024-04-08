<template>
    <div class='namedUser'>
        <!-- <h5>指定用户管理</h5> -->

        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="指定用户管理" hidden-breadcrumb />
        </div>
        <div class="named_main">
            <Card>
                <template #title>
                    <Icon type="md-list"></Icon>
                    指定用户
                </template>

                <template #extra>
                    <a href="#" @click.prevent="changeLimit">
                        添加
                    </a>
                </template>
                <Table border :columns="columns" :data="data" :loading="loading">

                    <template #switchSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => statusChange(i, row)"></Switch>
                    </template>
                    <!-- 可见名单 -->

                    <template #lookUsers="{ row }">
                        <Button size="small" @click="getList(row.goods.id); userModal = true;">查看用户</Button>
                    </template>
                    <!-- 操作 -->

                    <template #actionSlot="{ row }">
                        <Button type="primary" size="small" @click="editWhitelFn(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeManageFn(row)">
                            <Button type="error" size="small"
                                v-if="row.status && row.status.code != 'enabled'">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </Card>
        </div>
        <Modal v-model="userModal">

        </Modal>
        <Modal v-model="modal" title="新增用户管理">
            <Form ref="formList" v-model="list" :label-width="120" :rules="ruleValidate">
                <FormItem label=" 商品编码：">
                    <Input v-model="list.goodsId" disabled></Input>
                </FormItem>
                <FormItem label="商品名称：" prop="goodsId">
                    <Select v-model="list.goodsId" filterable :remote-method="remoteMethodGoods"
                        :loading="loadingGoods">
                        <Option v-for="(item, index) in goodsList" :key="index" :value="item.id">
                            {{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="可见人名单：" prop="userId">
                    <Select v-model="list.userId" filterable multiple :remote-method="remoteMethodUser"
                        :loading="loadingUser">
                        <Option v-for="(item, index) in userList" :key="index" :value="item.id">
                            {{ (item.name || item.nickName || item.mobile) || (item.extra ? item.extra.nickName : '') ||
                        ''
                            }}
                        </Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="" style="margin: 0;">
                    <div>
                        <Tag closable size="large" v-for=" item  in  6 " :key="item" @on-close="handleClose(item)">
                            {{ item }}号选手
                        </Tag>
                    </div>
                </FormItem> -->
            </Form>

            <template #footer>
                <Button type="primary" @click="saveWhitelFn('formList')">确认</Button>
                <Button @click="modal = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import {
    postGoodsWhitelistSaveApi,   // 保存
    getGoodsWhitelistPageApi,    // 分页
    getGoodsWhitelistDetailApi,   // 详情
    postGoodsWhitelistRemoveApi,   // 删除
    postGoodsWhitelistStatusApi,   // 状态

    getGoodsInfoPageApi,   // 拍品
    getUserInfoListApi,    // 用户
} from '@api/account'
export default {
    name: 'namedUser',
    data() {
        return {
            columns: [
                {
                    title: '序号',
                    width: 90,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '商品名称',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.row.goods ? params.row.goods.name || '' : "---")
                    }
                },
                {
                    title: '商品编码',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.row.goods ? params.row.goods.id || '' : "---")
                    }
                },
                {
                    title: '可见人名单',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', (params.row.user ? params.row.user.name || (params.row.user.extra ? params.row.user.extra.nickName : '') : "---") + (params.row.user.extra ? '(' + params.row.user.extra.mobile.slice(-4) + ')' : ''))
                    }
                },
                // {
                //     title: '可见人名单',
                //     minWidth: 120,
                //     align: 'center',
                //     slot: 'lookUsers',
                // },
                {
                    title: '是否开启',
                    align: 'center',
                    width: 120,
                    slot: 'switchSlot'
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 160,
                    slot: 'actionSlot'
                }
            ],
            data: [],
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            loading: false,
            modal: false,
            loadingGoods: false,
            goodsList: [],   // 拍品

            loadingUser: false,
            userList: [],   // 用户
            list: {
                userId: []
            },    // 添加

            ruleValidate: {
                // goodsId: [
                //     { required: true, message: '请选择商品', trigger: 'change' }
                // ],
                // userId: [
                //     { required: true, type: 'array', message: '请最少选择一个用户', trigger: 'change' },
                //     // { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
                // ],
            }
        }
    },
    created() {
        this.getList();    // 获取分页
    },
    methods: {
        // 获取分页
        getList(goodsId = '') {

            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                goodsId,
            };
            getGoodsWhitelistPageApi(data).then(res => {

                this.total = res.totalElements;
                this.data = res.data;

            })
        },
        // 保存
        saveWhitelFn(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {

                    let formData = new FormData();

                    let { id, goodsId, userId } = this.list;

                    formData.append('id', id || '');
                    formData.append('goodsId', goodsId || '');
                    if (userId.length > 0) {
                        userId.forEach(item => {
                            formData.append('userId', item || '');
                        })
                    } else {
                        formData.append('userId', '');
                    }

                    let flag1, flag2 = false;

                    if (userId.length <= 0) {
                        flag1 = false;
                        this.$Message.warning('请最少选择一个用户')
                    } else {
                        flag1 = true;
                    };
                    if (!goodsId) {
                        flag2 = false;
                        this.$Message.warning('请选择一个商品')
                    } else {
                        flag2 = true;
                    }
                    if (flag1 && flag2) {
                        postGoodsWhitelistSaveApi(formData, false).then(res => {

                            if (res) {
                                this.$Message.success('添加成功');
                                this.modal = false;
                                this.getList();
                            }
                        });
                    }
                } else {
                    this.$Message.error('请先补充必填项 !');
                }
            })
        },
        // 编辑
        editWhitelFn(row) {

            getGoodsWhitelistDetailApi(row.id).then(res => {

                this.goodsList = [res.goods];
                this.userList = [res.user];

                let arrId = [res.user.id];

                this.list.id = res.id || '';
                this.list.goodsId = res.goods ? res.goods.id : '';
                this.list.userId = arrId;

                this.modal = true;
            })

        },
        // 状态
        statusChange(value, row) {

            postGoodsWhitelistStatusApi({ id: row.id, value }).then(res => {
                this.$Message.success('修改成功！');
                this.getList();
            }).catch(err => {
                this.getList();
            });

        },
        // 删除
        removeManageFn(row) {

            postGoodsWhitelistRemoveApi({ id: row.id }).then(res => {
                this.$Message.success('操作成功！')
                this.getList();
            })
        },
        // 拍品查询
        remoteMethodGoods(query) {
            if (query.length != 24) {
                if (query !== '') {
                    this.loadingGoods = true;
                    getGoodsInfoPageApi({
                        keywords: query,
                        biz: 'auction',
                        recycled: false,
                        // auState: 'wait',
                    }).then(res => {
                        this.goodsList = res.data;
                        this.loadingGoods = false;
                    })

                } else {
                    this.goodsList = [];
                }
            }
        },
        // 用户查询
        remoteMethodUser(keywords) {

            if (keywords.length != 24) {
                if (keywords !== '') {
                    this.loadingUser = true;
                    getUserInfoListApi({
                        keywords,
                        type: 'member',
                    }).then(res => {
                        this.userList = res;
                        this.loadingUser = false;
                    })

                } else {
                    this.userList = [];
                }
            }
        },
        changeLimit() {
            this.modal = true;
        },
        handleClose(event, name) {
            console.log("🚀 ~ file: index.vue:131 ~ handleClose ~ event, name:", event, name)
        }
    }
}
</script>

<style scoped lang='less'>
.named_main {
    margin-top: 24px;

    .ivu-table-cell-slot {
        button {
            margin: 5px;
        }
    }
}
</style>