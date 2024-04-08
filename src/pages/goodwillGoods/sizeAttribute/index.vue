<template>
    <div class='sizeAttribute'>
        <!-- <h5>规格属性管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城商品管理" content="规格属性管理" hidden-breadcrumb />
        </div>
        <div class="sizeAttribute-main">
            <div class="attri-main-top">
                <Space size="large">
                    <Space>
                        <strong>属性名称</strong>
                        <Input v-model="search.keywords" size="small" placeholder="请输入属性名称"></Input>
                    </Space>
                    <Space>
                        <strong>分类</strong>
                        <TreeSelect v-model="search.categoryId" size="small" :data="categoryTree" v-width="120"
                            transfer />
                    </Space>
                    <Space v-if="false">
                        <strong>状态</strong>
                        <Select v-model="search.status" placeholder="请选择" size="small">
                            <Option value="1">开启</Option>
                            <Option value="0">禁用</Option>
                        </Select>
                    </Space>
                    <Space>
                        <Button type="primary" size="small" @click="pageNumber = 1; getAttrList()">查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}; getAttrList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="attri-main-modle">
                <Space size="large" style="margin-bottom: 15px;">
                    <Space style="font-size: 16px;">
                        <Icon type="md-list" />
                        <strong> 规格属性列表</strong>
                    </Space>
                    <Space>
                        <Button type="primary" size="small" @click="detailSizeFn(false)">增加</Button>
                    </Space>
                </Space>
                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #classifySlot="{ row }">
                        <span v-for="(item, index) in row.categoryInfo" :key="index">{{ item.name }},</span>
                    </template>
                    <!-- 图片 -->

                    <template #imgSlot="{ row }">
                        <div v-viewer v-if="row.file">
                            <img style="width: 80px;" :key="row" :src="row.file.pic" alt="" />
                        </div>
                        <div v-else> --- </div>
                    </template>

                    <template #stateSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="(i) => changeStatusFn(i, row)" />
                    </template>

                    <template #actionSlot="{ row }">
                        <Button type="primary" size="small" style="margin-right: 5px"
                            @click="detailSizeFn(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeSizeFn(row)">
                            <Button type="error" size="small" v-show="row.status.code != 'enabled'">删除</Button>
                        </Poptip>
                    </template>
                </Table>
                <div style="margin: 20px 0 0;">
                    <Page :total="total" v-model="pageNumber" size="small" show-elevator show-sizer show-total
                        @on-page-size-change="pageSizeChange" @on-change="changePage" />
                </div>
            </div>
            <!-- 增加的弹框 -->
            <Modal @on-visible-change="visibleChange" v-model="modal" :title="modalTitle">
                <Form ref="listFrom" :model="list" :rules="ruleValidate" :label-width="120">
                    <FormItem label="属性名称：" prop="name">
                        <Input v-model="list.name" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem label="商品分类：" prop="categoryId">
                        <TreeSelect v-model="list.categoryId" multiple :data="categoryTree" transfer />
                    </FormItem>
                    <FormItem label="排序：" prop="rank">
                        <Input v-model="list.rank" placeholder="请输入" type="number"
                            @on-blur="list.rank = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                    </FormItem>
                    <FormItem label="图片：" prop="pic">
                        <p>建议尺寸120*120</p>
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload1">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                        <div>
                            <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                        </div>
                    </FormItem>
                </Form>

                <template #footer>
                    <Button type="primary" @click="confirmSizeFn('listFrom')">确认</Button>
                    <Button @click="modal = false; this.list = {}">取消</Button>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script>
import {
    getGoodsPropertyPageApi,
    getGoodsPropertyDetailApi,
    postGoodsPropertySaveApi,
    postGoodsPropertyRemoveApi,
    postGoodsPropertyStatusApi,
    getGoodsCategoryTreeApi
} from '@/api/account.js'
import { jsonToArray } from "@/libs/util.js";
export default {
    name: 'goodwillGoods-sizeAttribute',
    data() {
        return {
            loading: false,
            columns: [
                {
                    title: '序号',
                    width: 80,
                    key: 'rank',
                    align: "center",
                },
                {
                    title: '属性名称',
                    key: 'name',
                    minWidth: 200,
                    align: "center",
                },
                {
                    title: '分类',
                    slot: 'classifySlot',
                    minWidth: 200,
                    align: "center"
                },
                {
                    title: '图片',
                    slot: 'imgSlot',
                    align: "center",
                },
                {
                    title: '状态',
                    align: 'center',
                    slot: 'stateSlot',
                    width: 90,
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 150,
                    align: 'center'
                }
            ],
            data: [], // 属性列表
            search: {},  // 搜索内容
            modal: false, // 弹窗的状态
            modalTitle: '新增商品属性',
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            categoryTree: [],
            pic: '',
            list: {
                categoryId: '',
                pic: ''
            },

            ruleValidate: {
                name: [
                    { required: true, message: '请填写属性名', trigger: 'blur' }
                ],
                rank: [
                    { required: true, type: 'number', message: '请输入排序值', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, type: 'array', min: 1, message: '请选择分类', trigger: 'change' },
                ],
                pic: [
                    { required: true, message: '请上传图片', trigger: 'change' }
                ],
            },
        }
    },
    created() {
        // 获取分类树
        getGoodsCategoryTreeApi({ biz: 'common' })
            .then((res) => {
                let arr = jsonToArray(res, true);
                this.categoryTree = arr;
            })
            .catch((err) => { });
        this.getAttrList()
    },
    methods: {
        // 获取列表
        getAttrList() {
            this.loading = true
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                biz: 'common'
            }
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (element) {
                        data[key] = element
                    }
                }
            }
            getGoodsPropertyPageApi(data).then(res => {
                // 总条数
                this.total = res.totalElements;
                this.data = res.data;
                this.loading = false;

            }).catch(err => {
                console.log(err);
            })
        },
        // 编辑和添加
        detailSizeFn(row) {
            if (row) {

                this.modalTitle = '编辑商品规格'
                getGoodsPropertyDetailApi(row.id).then(res => {
                    let arr = [];
                    if (res.categoryInfo) {
                        arr = res.categoryInfo.map(item => {
                            return item.id
                        })
                    }

                    this.list = {
                        id: res.id,
                        name: res.name,
                        rank: res.rank,
                        categoryId: arr,
                        pic: res.file && res.file.pic ? res.file.pic : '',
                    }
                    this.modal = true;
                }).catch(err => {
                    console.log(err);
                })
            } else {
                this.modalTitle = '新增商品属性'
                this.modal = true;
                this.list = {
                    id: '',
                    pic: '',
                }
            }
        },
        // 弹框的确认
        confirmSizeFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    let formData = new FormData();
                    formData.append('biz', 'common');

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key == 'categoryId') {
                                element.forEach(v => {
                                    formData.append(key, v);
                                });
                            } else if (key == 'pic') {
                                formData.append('upload[pic]', this.pic || '');
                            } else {
                                formData.append(key, element || "");
                            }

                        }
                    }

                    postGoodsPropertySaveApi(formData, false).then((res) => {
                        let messageT = '';
                        messageT = this.modalTitle == '新增商品属性' ? '添加成功！' : '修改成功！';
                        this.$Message.success(messageT);
                        this.getAttrList();
                        this.modal = false;
                    }).catch((err) => {
                        console.log(err);
                    });

                } else {
                    this.$Message.error('请先补充必填项 !');
                }
            })
        },
        // 修改状态
        changeStatusFn(value, row) {

            let data = {
                id: row.id,
                value
            };
            postGoodsPropertyStatusApi(data).then((res) => {
                this.$Message.success('成功');
                this.getAttrList();
            }).catch((err) => {
                this.getAttrList();
            });
        },
        // 删除
        removeSizeFn(row) {

            postGoodsPropertyRemoveApi({ id: row.id })
                .then(res => {
                    if (res.success) {
                        this.$Message.success('操作成功！')
                    }
                    this.getAttrList()
                }).catch(err => {
                    console.log(err);
                    this.getAttrList()
                })
        },
        visibleChange(key) {
            if (!key) {
                this.list = {};
                this.$refs['listFrom'].resetFields();
            }
            this.icon = null
            this.pic = null
        },
        handleBeforeLicenseUrlUpload1(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getAttrList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getAttrList();
        },
    }
}
</script>

<style scoped lang='less'>
.attri-main-top {
    margin-bottom: 20px;
}

.sizeAttribute-main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;
}

.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-center-modal .ivu-modal {
    top: 0;
}
</style>