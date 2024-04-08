<template>
    <div class='problemClassify'>
        <!-- <h5>问题分类</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="常见问题管理" content="问题分类" hidden-breadcrumb />
        </div>
        <div class="main_box">
            <Card>
                <template #title>
                    <Icon type="ios-film-outline"></Icon>
                    常见类型
                </template>
                <template #extra>
                    <a href="#" @click.prevent="addClassifyFn(false)">
                        <Icon type="ios-loop-strong"></Icon>
                        补充添加
                    </a>
                </template>

                <Table border :columns="columns" :data="data" :loading="loading" style="width: 100%; font-size: 15px;">
                    <template #actionSlot="{ row }">
                        <Button type="primary" size="small" style="margin-right: 5px"
                            @click="addClassifyFn(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="remove(row.id)">
                            <Button type="error" style="margin-right: 5px" size="small">删除</Button>
                        </Poptip>
                        <!-- <Button size="small" style="margin-right: 5px">上移</Button>
                        <Button size="small">下移</Button> -->
                    </template>
                </Table>
            </Card>
        </div>
        <!-- 增加/编辑的弹框 -->
        <Modal width="460" v-model="modal" :title="modalTitle">
            <Form ref="list" :model="list" :label-width="120">
                <FormItem label="问题类型：">
                    <Input v-model="list.name" placeholder="请输入"></Input>
                </FormItem>
                <!-- <FormItem label="分类图标：">
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload1">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                    </div>
                </FormItem> -->
            </Form>
            <template #footer>
                <Button type="primary" @click="saveClassifyFn()">确认</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getCmsCategoryPolicyListApi,  //  资讯列表
    postCmsCategoryPolicySaveApi, // 资讯分类保存
    postCmsCategoryPolicyRemoveApi, // 资讯分类删除
} from '@api/account.js'
export default {
    name: 'problemClassify',
    data() {
        return {
            loading: false,
            total: 10,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '分类名称',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '分类图',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [params.row.pic ? params.row.pic : '---'])
                    }
                },
                // {
                //     title: '文章数',
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', [params.row.num ? params.row.num : '---'])
                //     }
                // },
                {
                    title: '创建时间',
                    key: 'date',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                        ])
                    }
                },
                // {
                //     title: '修改时间',
                //     key: 'date',
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', [
                //             this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                //         ])
                //     }
                // },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    align: 'center',
                    fixed: 'right',
                    width: 150
                }
            ], // 表头
            data: [],// 表体 
            modal: false, // 弹窗
            modalTitle: '新增分类',
            list: {
                name: '',
                pic: ''
            },
            pic: '',
        }
    },
    mounted() {
        this.getPolicyList()
    },
    methods: {
        // 获取列表
        getPolicyList() {
            this.loading = true;
            getCmsCategoryPolicyListApi('problem')
                .then(res => {
                    // console.log(res);
                    this.data = res;
                    this.loading = false;
                })
        },
        // 编辑和添加
        addClassifyFn(row) {
            if (row) {
                this.modalTitle = '编辑类型'
                this.list.id = row.id;
                if (row.name !== '') {
                    this.list.name = row.name
                }
                if (row.file !== undefined) {
                    this.list.pic = row.file.pic
                }
            } else {
                this.modalTitle = '添加类型'
                this.list = {
                    id: '',
                    name: '',
                    pic: '',
                }
            }
            this.modal = true;
        },
        // 增加，编辑，保存按钮
        saveClassifyFn() {
            this.loading = true
            let formData = new FormData()
            formData.append('id', this.list.id)
            formData.append('name', this.list.name);
            if (this.pic) {
                formData.append('pic', this.pic);
            }
            postCmsCategoryPolicySaveApi(formData, false, 'problem').then((res) => {
                if (res.id) {
                    this.modal = false;
                    this.loading = false;
                    this.$Message.success('添加成功');
                    this.getPolicyList();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        // 删除
        remove(id) {
            // this.loading = true
            // this.$Message.error('接口暂时不能使用')
            postCmsCategoryPolicyRemoveApi({ id }, 'problem')
                .then(res => {
                    this.loading = false
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getPolicyList();
                    }
                    // console.log(res);
                }).catch(err => {
                    console.log(err);
                })
        },
        // 上传
        handleBeforeLicenseUrlUpload1(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
        // 分页
        changePage(page) {
            // console.log(page);
            this.pageNumber = page;
            this.getPolicyList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPolicyList();
        },
    }
}
</script>
<style scoped lang='less'>
.main_box {
    margin-top: 24px;
    background-color: #fff;
}
</style>