<template>
    <div class='sidebarMenu'>
        <!-- <h5>侧边栏菜单</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="权限管理" content="侧边栏菜单" hidden-breadcrumb />
        </div>
        <div class="menu_main">
            <Card>
                <template #title>
                    菜单栏
                </template>
                <template #extra>
                    <Button size="small" @click="modal = true;">添加菜单项</Button>
                </template>
                <Table row-key="id" :columns="columns" :data="data" border>
                    <template #actionSlot="{ row }">
                        <Button size="small" type="primary" style="margin-right: 10px;" @click="editMenu(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn(row.id)">
                            <Button size="small" type="error">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </Card>
        </div>
        <!-- 侧边栏 -->
        <Modal v-model="modal" title="添加资源" @on-visible-change="visibleChange" :styles="{ top: '30%' }">

            <Form :model="list" label-position="right" :label-width="100">
                <FormItem label="父级：">
                    <Select v-model="list.parentId" clearable>
                        <Option v-for="item in permParentList" :key="item.id" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="名称：">
                    <Input v-model="list.name"></Input>
                </FormItem>
                <FormItem label="标识：">
                    <Input v-model="list.key"></Input>
                </FormItem>
                <FormItem label="路由：">
                    <Input v-model="list.route"></Input>
                </FormItem>
                <FormItem label="路径：">
                    <Input v-model="list.url"></Input>
                </FormItem>
                <FormItem label="类型：">
                    <RadioGroup v-model="list.type">
                        <Radio label="page">
                            <span>页面</span>
                        </Radio>
                        <Radio label="button">
                            <span>按钮</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否菜单：">
                    <RadioGroup v-model="list.menu">
                        <Radio label="true">
                            <span>是</span>
                        </Radio>
                        <Radio label="false">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" :loading="loading" @click="savePermFn">添加角色</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getAuthorityPermissionTreeApi,  // 资源树
    postAuthorityPermissionSaveApi,   // 资源保存
    postAuthorityPermissionRemoveApi,  // 资源删除
} from '@/api/account'
export default {
    name: 'sidebarMenu',
    data() {
        return {
            columns: [
                {
                    title: '菜单名',
                    key: 'name',
                    tree: true,
                    // align: 'center',
                },
                {
                    title: 'key值',
                    key: 'key',
                    align: 'center',
                },
                {
                    title: 'route值',
                    key: 'route',
                    align: 'center',
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    align: 'center',
                },
            ],
            data: [],
            loading: false,
            list: {},  // 资源保存
            modal: false,  // 资源弹窗
            permParentList: [],   // 首级资源
        }
    },
    created() {
        this.getPremTree();
    },
    methods: {

        // 获取资源树
        getPremTree() {
            getAuthorityPermissionTreeApi().then(res => {
                this.permParentList = JSON.parse(JSON.stringify(res));
                let data = JSON.parse(JSON.stringify(res));
                this.data = this.siderToTree(data);
            }).catch(err => {
                this.$router.push({ path: '/403' })
            })
        },
        // 编辑
        editMenu(row) {
            this.list = {
                id: row.id,
                parentId: row.node ? row.node.parentId : '',
                name: row.name,
                key: row.key,
                route: row.route,
                url: row.url ? row.url[0] : '',
                type: row.type ? row.type.value : '',
                menu: row.menu.toString(),
            }
            this.modal = true;
        },
        // 资源保存
        savePermFn() {
            postAuthorityPermissionSaveApi(this.list).then(res => {
                if (res.id) {
                    this.$Message.success('添加成功');
                    this.modal = false;
                    this.getPremTree();
                }
            })
        },
        removeFn(id) {
            postAuthorityPermissionRemoveApi(id).then(res => {
                res;
                this.$Message.success('操作成功！')
                this.getPremTree();
            })
        },
        // 修整数据
        siderToTree(arr = []) {
            let arrTree = arr;
            arrTree.forEach(item => {
                if (item.subset && item.subset.length > 0) {
                    item.children = item.subset;
                };
            });
            return arrTree;
        },
        // 弹框状态
        visibleChange(flag) {
            if (!flag) {
                this.list = {};
            }
        }
    }
}
</script>
<style scoped lang='less'>
.menu_main {
    margin-top: 24px;
}
</style>