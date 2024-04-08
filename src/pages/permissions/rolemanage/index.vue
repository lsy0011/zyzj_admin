<template>
    <div class="rolemanage">
        <!-- <h5>角色管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="权限管理" content="角色管理" hidden-breadcrumb />
        </div>
        <div class="role-main">
            <Card>
                <template #title>
                    <p> 角色列表</p>
                </template>
                <template #extra>
                    <Button size="small" @click="modal = true;">添加角色</Button>
                </template>
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #statuSlot="{ row }">
                        <Switch v-model="row.actived" @on-change="(i) => changeActived(i, row.id)"></Switch>
                    </template>
                    <template #actionSlot="{ row }">
                        <Button style="margin-right:10px;" size="small" @click="acreditFn(row)">授权</Button>
                        <Button style="margin-right:10px;" size="small" type="primary" @click="eidtRole(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="delRoleFn(row.id)">
                            <Button v-show="!row.actived" size="small" type="error">删除</Button>
                        </Poptip>
                    </template>
                </Table>
                <div class="foot_page">
                    <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                        :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
                </div>
            </Card>
        </div>
        <!-- 角色 -->
        <Modal v-model="modal" title="添加角色">
            <Form :model="list" label-position="right" :label-width="100">
                <FormItem label="角色名称：">
                    <Input v-model="list.name"></Input>
                </FormItem>
                <FormItem label="角色编号：">
                    <Input v-model="list.code"></Input>
                </FormItem>
                <!-- <FormItem label="备注：">
                    <Input v-model="list.remark"></Input>
                </FormItem> -->
                <!-- <FormItem label="分配权限：">
                    <TreeSelect v-model="checkedPower" multiple show-checkbox :data="powerData" />
                </FormItem> -->
            </Form>
            <template #footer>
                <Button type="primary" :loading="loadingAddBtn" @click="saveRoleFn()">添加角色</Button>
            </template>
        </Modal>
        <!-- 角色授权 -->
        <Modal v-model="accessModal" title="角色授权">
            <Form :model="list" label-position="right" :label-width="100">
                <FormItem label="角色名称：">
                    <Input v-model="accessList.name"></Input>
                </FormItem>
                <FormItem label="分配权限：">
                    <!-- <TreeSelect v-model="accessList.permission" multiple show-checkbox :data="powerData" /> -->
                    <div class="role_menu_box">
                        <Tree :data="powerData" v-model="accessList.permission" show-checkbox></Tree>
                    </div>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" :loading="loadingAddBtn" @click="accessSaveFn">确认</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {
    getAuthorityRolePageApi,  // 分页
    postAuthorityRoleSaveApi,  // 角色保存
    postAuthorityRoleActivateApi,  // 状态
    postAuthorityRoleRemoveApi,   // 删除
    getAuthorityRoleDetailApi,   // 详情

    getAuthorityPermissionTreeApi,  // 资源树

    postAuthorityRoleAccessSaveApi,   // 角色授权
    getAuthorityRoleAccessListApi,   // 角色已有权限
} from '@/api/account'
// import admin from '@/store'
export default {
    name: 'permissions-rolemanage',
    data() {
        return {
            columns: [
                {
                    title: '编号',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '角色名称',
                    key: 'name',
                    align: 'center'
                },
                // {
                //     title: '备注',
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', '---')
                //     }
                // },
                {
                    title: '添加时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss'))
                    }
                },
                {
                    title: '操作',
                    slot: 'statuSlot',
                    align: 'center',
                    width: 90,
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    align: 'center'
                }
            ],
            data: [],
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页数
            loading: false,
            modal: false,
            powerData: [],    // 侧边权限
            powerDataOld: [],   // 老数据
            checkedPower: [],   // 选中权限
            list: {},  // 添加数据
            loadingAddBtn: false,  // 添加

            accessList: {},   // 授权信息
            accessModal: false,  // 授权框
        }
    },
    computed: {
        ...mapState('admin/user', ['info']),
    },
    created() {
        this.getRolePage();
        this.getPremTree();
    },
    methods: {
        // 角色分页
        getRolePage() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            }
            getAuthorityRolePageApi(data).then(res => {
                this.total = res.totalPages;
                this.data = res.data;
            }).catch(err => {
                this.$router.push({ path: '/403' })
            })
        },
        // 新建角色
        saveRoleFn() {
            this.loadingAddBtn = true;
            if (this.list.name) {
                this.list.type = 'admin';
                postAuthorityRoleSaveApi(this.list).then(res => {
                    if (res.id) {
                        this.modal = false;
                        this.loadingAddBtn = false;
                        this.$Message.success('成功');
                        this.getRolePage();
                    }
                })
            } else {
                this.$Message.error('请填写')
            }
        },
        // 编辑角色
        eidtRole(row) {
            getAuthorityRoleDetailApi(row.id).then(res => {
                this.list = {
                    id: res.id,
                    name: res.name,
                    code: res.code || ''
                };
                this.modal = true;
            })
        },
        // 角色状态
        changeActived(tf, id) {
            postAuthorityRoleActivateApi({ id, tf }).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功！')
                    this.getRolePage();
                }
            })
        },
        // 角色删除
        delRoleFn(id) {
            postAuthorityRoleRemoveApi(id).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功！');
                    this.getRolePage();
                }
            })
        },
        // 获取资源树
        getPremTree() {
            getAuthorityPermissionTreeApi().then(res => {
                let data = res.map(item => {
                    item.children = [];
                    if (item.subset && item.subset.length) {
                        item.subset.forEach(itm => {
                            if (itm.name != '菜单树管理') { item.children.push(itm) };
                        })
                    }
                    return item;
                });
                this.powerData = this.siderToTree(data);
                this.powerDataOld = JSON.parse(JSON.stringify(this.powerData));
            })
        },
        siderToTree(arr = []) {
            let arrTree = arr;
            arrTree.forEach(item => {
                if (item.title != '前端日志') {
                    item.value = item.id;
                    item.title = item.name;
                    if (item.children && item.children.length > 0) {
                        this.siderToTree(item.children);
                    };
                }
            });
            return arrTree;
        },
        // 授权弹框
        acreditFn(row) {
            this.accessList = {
                roleId: row.id,
                name: row.name,
            }
            this.accessModal = true;
            this.powerData = JSON.parse(JSON.stringify(this.powerDataOld));
            getAuthorityRoleAccessListApi({ roleId: row.id }).then(res => {
                // console.log(res);
                let data = JSON.parse(JSON.stringify(res));
                let arr = data.map(item => {
                    return item.permission.id;
                })
                this.powerData.forEach(item => {
                    if (arr.indexOf(item.id) != -1) {
                        item.checked = true;
                    }
                    if (item.children.length) {
                        item.children.forEach(itm => {
                            if (arr.indexOf(itm.id) != -1) itm.checked = true;
                        })
                    }
                })
                this.accessList.permission = arr;
            })
        },
        // 角色授权保存
        accessSaveFn() {
            this.accessList.permission = [];
            this.powerData.forEach(item => {
                if (item.checked) {
                    this.accessList.permission.push({ id: item.id })
                };
                if (item.children.length) {
                    item.children.forEach(itm => {
                        if (itm.checked) {
                            this.accessList.permission.push({ id: itm.id })
                        };
                    })
                }
            })

            postAuthorityRoleAccessSaveApi(this.accessList, true).then(res => {
                if (res.length > 0) {
                    this.accessModal = false;
                    this.$Message.success('成功')
                }
            })
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getRolePage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getRolePage();
        },
    }
}
</script>
<style scoped lang="less">
.role-main {
    margin-top: 24px;

    .foot_page {
        margin-top: 15px;
    }

}

.role_menu_box {
    max-height: 370px;
    overflow: auto;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    padding: 0 10px;
    box-sizing: border-box;

    //设置滚动条显示隐藏
    /* 设置滚动条的样式 */
    &::-webkit-scrollbar {
        width: 5px;
        border-radius: 8px;
    }

    /* 滚动槽 */
    &:-webkit-scrollbar-track {
        /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
        background-color: #555;
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background: #b9b9b9;
        /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
    }
}
</style>