<template>
    <div class='problemLis'>
        <!-- <h5>问题列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="常见问题管理" content="问题列表" hidden-breadcrumb />
        </div>
        <div class="list_box">
            <Card>
                <template #title>
                    <Icon type="ios-film-outline"></Icon>
                    问题列表
                    <Select placeholder="问题类型" clearable v-width="120" @on-change="(i) => changeSearch(i)">
                        <Option :value="item.id" v-for="item in searchProblem" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </template>
                <template #extra>
                    <a href="#" @click.prevent="addProplemFn()" style="line-height: 32px;">
                        <Icon type="ios-loop-strong"></Icon>
                        补充添加
                    </a>
                </template>
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #statusSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => changeStatus(i, row, true)"></Switch>
                    </template>
                    <template #actionSlot="{ row }">
                        <Button type="info" size="small" style="margin-right: 10px">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeProFn(row.id)">
                            <Button type="error" size="small" v-if="row.status.code == 'disabled'">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </Card>
        </div>
        <!-- 增加/编辑的弹框 -->
        <Modal width="460" v-model="modal" title="添加问题">
            <Form ref="list" :model="list" :label-width="100">
                <FormItem label="问题类型：">
                    <Select v-model="list.categoryId">
                        <Option :value="item.id" v-for="item in policyList" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="问题名称：">
                    <Input v-model="list.title" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="问题解答：">
                    <Input v-model="list.longtext" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
                        placeholder="请输入"></Input>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="saveProblemFn()">确认</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getCmsContentPolicyPageApi,  // 列表
    postCmsContentPolicyStatusApi,  // 修改状态
    postCmsContentPolicyRemoveApi, // 删除
    getCmsCategoryPolicyListApi,   // 问题分类
    postCmsContentPolicySaveApi,  // 保存
    getCmsContentPolicyDetailApi,  // 详情
} from '@/api/account.js'
export default {
    name: 'problemList',
    data() {
        return {
            loading: false,
            modal: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            columns: [
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center'
                // },
                {
                    title: '',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '分类',
                    // key: 'name',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.row.category.name)
                    }
                },
                {
                    title: '标题',
                    key: 'title',
                    align: 'center'
                },
                // {
                //     title: '内容简介',
                //     key: 'subhead',
                //     align: 'center'
                // },
                // {
                //     title: '作者',
                //     key: 'author',
                //     align: 'center'
                // },
                // {
                //     title: '来源',
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', [params.row.from ? params.row.from : '---'])
                //     }
                // },
                {
                    title: '发布时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"))
                    }
                },
                {
                    title: '状态',
                    slot: 'statusSlot',
                    align: 'center',
                    width: 90,
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    align: 'center',
                    width: 150
                }
            ], // 表头
            data: [],   // 表体
            policyList: [], // 分类列表
            searchProblem: [],   // 查询问题分类
            list: {},  // 添加
            search: {},   // 查询
        }
    },
    created() {
        this.getProblemFn();
        this.getClassifyList();
    },
    methods: {
        // 获取列表
        getProblemFn() {
            this.loading = true;
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                ...this.search,
            };
            getCmsContentPolicyPageApi(data, 'problem').then(res => {
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;
                // console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        // 修改状态
        changeStatus(status, row, type) {
            if (status != 'disabled' || type) {
                if (status == 'enabled' && !type) {
                    status = 'disabled'
                }
                postCmsContentPolicyStatusApi({ id: row.id, value: status }, 'problem').then(res => {
                    if (res) {
                        this.$Message.success('修改成功！')
                        this.getProblemFn();
                    }
                }).catch(err => {
                    this.getProblemFn();
                })
            } else {
                this.$Message.warning('已被下架!')
            }
        },
        // 资讯分类 列表
        getClassifyList() {
            getCmsCategoryPolicyListApi('problem').then(res => {
                let data = JSON.parse(JSON.stringify(res));
                this.policyList = data;
                this.searchProblem = data;
            })
        },
        // 添加
        addProplemFn() {
            this.modal = true;
        },
        // 保存
        saveProblemFn() {

            let { title, longtext, categoryId } = this.list;

            let formData = new FormData();
            formData.append('title', title);
            formData.append('subhead', title);
            formData.append('longtext', longtext);
            formData.append('categoryId', this.list.categoryId);

            postCmsContentPolicySaveApi(formData, false, 'problem').then(res => {
                if (res.id) {
                    this.$Message.success('添加成功');
                    this.modal = false;
                    this.getProblemFn();
                }
            }).catch(err => {
            })
        },
        // 查询
        changeSearch(i) {
            if (i) {
                this.search.categoryId = i;
            } else {
                this.search.categoryId = '';
            }
            this.getProblemFn();
        },
        // 删除
        removeProFn(id) {
            postCmsContentPolicyRemoveApi({ id }, 'problem').then(res => {
                if (res) {
                    this.$Message.success('操作成功！');
                    this.getProblemFn();
                }
            }).catch(err => {
                this.$Message.error('失败！');
                this.getProblemFn();
            })
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getProblemFn();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getProblemFn();
        },
    }
}
</script>
<style scoped lang='less'>
.list_box {
    margin-top: 24px;

}
</style>