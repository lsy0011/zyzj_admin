<template>
    <div class='informationClassify'>
        <!-- <h2>资讯管理</h2>
        <h5>资讯分类设置</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="资讯管理" content="资讯分类设置" hidden-breadcrumb />
        </div>
        <div class="inforClassify">
            <Space size="large">
                <strong style="font-size: 17px;">
                    <Icon type="md-menu" />数据列表
                </strong>
                <!-- <Button :class="{ 'btn_border': essayType == 'policy' }" @click="changeBtn('policy')">助残政策</Button>
                <Button :class="{ 'btn_border': essayType == 'news' }" @click="changeBtn('news')">助残新闻</Button>
                <Button :class="{ 'btn_border': essayType == 'outcome' }" @click="changeBtn('outcome')">助残成果</Button> -->
                <Button type="primary" icon="md-add" @click="details(false)">增加</Button>
                <!-- <Poptip confirm transfer title="确认删除所选择的吗?" @on-ok="allRemove">
                    <Button type="error" icon="ios-trash" ghost>删除</Button>
                </Poptip> -->
            </Space>
            <!-- 表格 -->
            <div class="tab-main">
                <Table border row-key="id" :columns="columns" :data="data" :loading="loading">
                    <template #statusSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => changeStatusFn(i, row)"></Switch>
                    </template>
                    <template #action="{ row }">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="details(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="remove(row.id)">
                            <Button v-show="row.status.code != 'enabled'" type="error" style="margin-right: 5px"
                                size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </div>
            <!-- 分页器 -->
            <!-- <div class="tab-foot-page">
                <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                    :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
            </div> -->
            <!-- 增加/编辑的弹框 -->
            <Modal v-model="modal" :title="modalTitle" width="430">
                <Form ref="list" :model="list" :label-width="120">
                    <FormItem label="所属分类：">
                        <Select placeholder="请选择父级分类(不选为一级)" v-model="list.parentId" clearable>
                            <Option v-for="item in data" :key="item.id" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分类名称：">
                        <Input v-model="list.name" placeholder="请输入"></Input>
                    </FormItem>
                    <!-- <FormItem label="分类封面：">
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload1">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                        <div>
                            <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                        </div>
                    </FormItem> -->
                </Form>
                <template #footer>
                    <Button type="primary" :disabled="!list.name" @click="confirm()">确认</Button>
                    <Button @click="modal = false; list = {}">取消</Button>
                </template>
            </Modal>
        </div>
    </div>
</template>
<script>
import {
    getCmsCategoryPolicyListApi,  //  资讯列表
    getCmsCategoryPolicyTreeApi,   // 分类树
    postCmsCategoryPolicySaveApi, // 资讯分类保存
    postCmsCategoryPolicyRemoveApi, // 资讯分类删除
    postCmsCategoryPolicyStatusApi,   // 状态
} from '@api/account.js'
import { jsonToArray } from "@/libs/util.js";
export default {
    name: 'informationClassify',
    data() {
        return {
            loading: false,
            total: 10,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            columns: [
                {
                    title: '排序',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '分类名称',
                    tree: true,
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
                {
                    title: '文章数',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [params.row.contentCount ? params.row.contentCount : '0'])
                    }
                },
                {
                    title: '新建时间',
                    key: 'date',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                        ])
                    }
                },
                {
                    title: '修改时间',
                    key: 'date',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                        ])
                    }
                },
                {
                    title: '状态',
                    slot: 'statusSlot',
                    align: 'center',
                    width: 120,
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    fixed: 'right'
                }
            ], // 表头
            data: [],// 表体 
            // essayType: 'policy',  // 政策：policy 、 新闻：news 、 成果：outcome
            modal: false, // 弹窗
            modalTitle: '新增分类',
            list: {
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
            getCmsCategoryPolicyTreeApi('information').then(res => {
                // console.log(res);

                this.data = jsonToArray(res, false)
                this.loading = false;
            })
        },
        // 编辑和添加
        details(row) {
            if (row) {
                this.modalTitle = '编辑分类'
                this.modal = true;
                this.list.id = row.id;
                if (row.name !== '') {
                    this.list.name = row.name
                }
                if (row.file !== undefined) {
                    this.list.pic = row.file.pic
                }
            } else {
                this.modalTitle = '新增分类'
                this.list = {
                    id: '',
                    pic: '',
                }
                this.modal = true
            }
        },
        // 增加，编辑，保存按钮
        confirm() {
            this.loading = true;
            let formData = new FormData();
            for (const key in this.list) {
                if (Object.hasOwnProperty.call(this.list, key)) {
                    const element = this.list[key];
                    
                    if (element) formData.append(key, element);

                }
            }

            if (this.pic) {
                formData.append('upload[cover1]', this.pic);
            }
            postCmsCategoryPolicySaveApi(formData, false, 'information').then((res) => {
                if (res.id) {
                    this.modal = false;
                    this.loading = false;
                    this.$Message.success('添加成功');
                    this.getPolicyList();
                }
            }).catch((err) => {
                console.log(err);
                this.loading = false;
            });
        },
        // 删除
        remove(id) {

            postCmsCategoryPolicyRemoveApi({ id }, 'information').then(res => {
                this.loading = false
                if (res) {
                    this.$Message.success('操作成功！');
                    this.getPolicyList();
                }

            }).catch(err => {
                console.log(err);
            })
        },
        changeStatusFn(i, row) {

            let data = {
                id: row.id,
                value: i,
            };
            postCmsCategoryPolicyStatusApi(data).then(res => {
                this.$Message.success('操作成功！');
                this.getPolicyList();
            })

        },
        handleBeforeLicenseUrlUpload1(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
        // 切换分类
        changeBtn(i) {
            if (this.essayType != i) {
                this.essayType = i;
                this.pageNumber = 1;
                this.getPolicyList();
            }
        },
        // 分页
        changePage(page) {
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
.inforClassify {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .tab-main {
        margin-top: 20px;
    }

    .tab-foot-page {
        margin-top: 20px;
    }

    .btn_border {
        border: 1px solid #58a3f3;
        border-radius: 3px;
    }
}
</style>