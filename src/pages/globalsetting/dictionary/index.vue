<template>
    <div>
        <!-- <h5>数据字典</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="数据字典" hidden-breadcrumb />
        </div>
        <div class="dictionary-main">
            <div class="search_top">
                <Space>
                    <span>字典编号/名称:</span>
                    <Input v-model="search.keywords" placeholder="请输入编号/名称" style="width: 300px;"></Input>
                    <Button icon="md-search" type="primary" @click="pageNumber = 1; getDictList();">查询</Button>
                    <Button icon="md-refresh" type="primary" @click="pageNumber = 1; search = {}; getDictList()">重置</Button>
                </Space>
            </div>
            <Table :columns="columns" :data="data" :loading="loading">
                <template #kong="{ }">
                    <p>---</p>
                </template>
                <template #action="{ row }">
                    <p class="dice_set" @click=" onlyDict(row);">
                        <Icon type="md-cog" />字典配置
                    </p>
                </template>
            </Table>
            <!-- <div class="foot_page">
                <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                    :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div> -->
        </div>
        <!-- 字典侧边栏 -->
        <Drawer :title="drawFarth.name || '' + ' -- 配置项列表'" :closable="true" width="50%" v-model="drawerFlag">
            <div class="children_table">
                <div class="children_btn">
                    <Button @click="editAndAddFn(false), disabled = false">新增</Button>
                </div>
                <Table row-key="id" :columns="drawColumns" :data="drawData" :loading="drawLoading">
                    <template #action="{ row }">
                        <Space split>
                            <Link @click="editAndAddFn(row), disabled = false">编辑</Link>
                            <Link v-if="treeStatus" @click="editAndAddFn(row, true), disabled = true">添加下级</Link>
                            <Link style="color: #ff0000;">
                            <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeItemFn(row)">
                                <Icon type="ios-close-circle-outline" />
                            </Poptip>
                            </Link>
                        </Space>
                    </template>
                </Table>
            </div>
        </Drawer>
        <!-- 编辑弹窗 -->
        <Modal v-model="modal" title="新增/编辑">
            <Form :model="addList" label-position="right" :label-width="100">
                <FormItem v-if="treeStatus" label="上级：">
                    <TreeSelect v-model="addList.parentId" :disabled="disabled" :data="drawData" />
                </FormItem>
                <FormItem label="名称：">
                    <Input v-model="addList.name"></Input>
                </FormItem>
                <FormItem label="数据值：">
                    <Input v-model="addList.code"></Input>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="saveChildrenFn()">确认</Button>
                <Button @click="modal = false; addList = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getSysDictListApi,  // 字典列表
    getSysDictItemTreeApi,  // 配置树状图
    postSysDictItemSaveApi,  // 配置项保存
    postSysDictItemRemoveApi,  // 配置项删除
} from '@api/account'
import { jsonToArray2 } from '@/libs/util.js'
export default {
    name: 'globalsetting-dictionary',
    data() {
        return {
            loading: false,
            drawerFlag: false, // 侧边栏
            total: 0,  // 总条数
            limit: 10,  // 条数
            pageNumber: 1,  // 页数
            columns: [
                {
                    title: '字典名称',
                    key: 'name'
                },
                {
                    title: '字典编号',
                    key: 'code'
                },
                {
                    title: '描述',
                    slot: 'kong'
                },
                {
                    title: '操作',
                    align: 'center',
                    slot: 'action',
                    width: 120
                }
            ],
            data: [],
            drawColumns: [
                {
                    title: '名称',
                    key: 'name',
                    tree: true
                },
                {
                    title: '数据值',
                    key: 'code'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 220,
                    align: 'center'
                }
            ], // 侧边表头
            drawData: [], // 侧边数据
            drawLoading: false,
            modal: false, // 添加/编辑
            addList: {}, // 添加时信息
            dictCode: '',  // 当前的所属字典
            disabled: true, // 下拉框
            treeStatus: false, // 是否能添加下级
            search: {},  // 搜索
            drawFarth: {},    // 侧边
        }
    },
    mounted() {
        this.getDictList();
    },
    computed: {
        start() {
            return this.pageNumber * this.limit
        },
    },
    methods: {
        // 获取字典列表
        getDictList() {
            this.loading = true
            let data = {
                limit: this.limit,  // 条数
                start: this.start,  // 页数
            }
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (element) data[key] = element;
                };
            };
            getSysDictListApi(data).then(res => {
                this.data = res;
                this.total = res.length;
                this.loading = false;
            })
        },
        // 单个字典设置
        onlyDict(row) {
            this.drawFarth = JSON.parse(JSON.stringify(row));
            this.dictCode = row.code;
            this.treeStatus = row.tree;
            this.drawLoading = true;
            this.drawerFlag = true;

            let type = '';
            if (this.treeStatus) {
                type = 'tree';
            } else {
                type = 'list';
            }
            getSysDictItemTreeApi({ dict: this.dictCode }, type).then(res => {
                this.drawData = jsonToArray2(res)
                this.drawLoading = false
            })
        },
        // 编辑
        editAndAddFn(row, down) {
            this.modal = true;
            if (row && !down) {

                this.addList = {
                    id: row.id,
                    name: row.name,
                    code: row.code,
                    dict: this.dictCode,
                    // parentId: row.node.parentId ? row.node.parentId : ''
                };
            } else if (row && down) {

                this.addList = {
                    id: '',
                    name: '',
                    code: '',
                    dict: this.dictCode,
                    parentId: row.id,
                };
            } else {

                this.addList = {
                    id: '',
                    name: '',
                    code: '',
                    dict: this.dictCode,
                };
            };
        },
        // 确认
        saveChildrenFn() {
            let data = JSON.parse(JSON.stringify(this.addList));
            postSysDictItemSaveApi(data).then(res => {

                this.onlyDict(this.drawFarth);
                this.$Message.success('添加/编辑成功！');
                this.modal = false;
            }).catch(err => {
                this.onlyDict(this.drawFarth);
                this.modal = false;
            })
        },
        // 删除
        removeItemFn(row) {
            let data = {
                id: row.id,
                dict: this.dictCode,
                name: row.name,
                code: row.code,
            }
            postSysDictItemRemoveApi(data).then(res => {
                this.onlyDict(this.drawFarth);
                this.$Message.success('删除成功！');
            })
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getDictList();
        },
        pageSizeChange(limit) {
            this.limit = limit;
            this.getDictList();
        },
    }
}
</script>
<style scoped lang="less">
.dictionary-main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .search_top {
        text-align: center;
        margin-bottom: 15px;
    }

    .dice_set {
        color: #57a3f3;
        cursor: pointer;
    }

    .foot_page {
        margin-top: 15px;
    }

}

.children_table {
    width: 100%;
    padding: 15px;
    border: 1px solid #c2c2c2;

    :deep(.ivu-typography) {
        color: #4801f4;
    }

    .children_btn {
        margin-bottom: 15px;

        button {
            color: #fff;
            letter-spacing: 5px;
            background-color: #4801f4;
        }
    }
}
</style>