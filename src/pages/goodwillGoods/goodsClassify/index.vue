<template>
    <div class='goodsClassify'>
        <!-- <h5>商品分类管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城商品管理" content="商品分类管理" hidden-breadcrumb />
        </div>
        <div class="goodsClassify-main">
            <div class="search_top" style="text-align: center;">
                <Space size="large">
                    <Space>
                        <!-- <strong>分类名称</strong> -->
                        <Input v-model="search.keywords" placeholder="请输入名称关键字" size="small" v-width="180" />
                    </Space>
                    <!-- <Space>
                        <strong>分类名称</strong>
                        <Input v-model="search.keywords" placeholder="请输入类名关键字" size="small" />
                    </Space> -->
                    <Space>
                        <Button type="primary" @click="getClassifyList()" size="small">查询</Button>
                        <Button @click="search = {}; getClassifyList()" style="margin: 0 10px;" size="small">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="classify-list">
                <Space size="large">
                    <Space>
                        <strong style="font-size: 16px;">
                            <Icon type="md-list" />数据列表
                        </strong>
                    </Space>
                    <Space>
                        <Button type="primary" icon="md-add" size="small" style="margin: 0 10px;"
                            @click="details(false)">增加</Button>
                        <Poptip confirm transfer title="确认删除所选择的吗?" @on-ok="removeFn(selecAllId)">
                            <Button type="error" size="small" icon="ios-trash" ghost
                                :disabled="selecAllId.length == 0">删除</Button>
                        </Poptip>
                    </Space>
                </Space>
                <!-- 表格 -->
                <div style="margin: 20px 0;">
                    <Table row-key="id" :loading="loading" :columns="columns" :data="classifyList" border
                        @on-selection-change="selectionChange">
                        <template #statuSlot="{ row }">
                            <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                                @on-change="(i) => changeStatusFn(i, row)"></Switch>
                        </template>

                        <template #action="{ row }">
                            <Button type="primary" size="small" style="margin-right: 5px"
                                @click="details(row.id)">编辑</Button>
                            <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn([row])">
                                <Button type="error" v-if="row.status.code != 'enabled'" size="small">删除</Button>
                            </Poptip>
                        </template>
                    </Table>
                </div>
                <!-- 分页器 -->
                <!-- <Page :total="total" size="small" show-sizer show-total @on-page-size-change="pageSizeChange"
                        @on-change="changePage" /> -->
            </div>
            <!-- 增加的弹框 -->
            <Modal @on-visible-change="visibleChange" v-model="modal" :title="modalTitle">
                <Form ref="form" :model="list" label-position="right" :rules="ruleValidate" :label-width="100">
                    <FormItem label="分类级别">
                        <RadioGroup v-model="radioVal">
                            <Radio label="head">
                                <span>首级</span>
                            </Radio>
                            <Radio label="next">
                                <span>次级</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="上级分类" v-if="radioVal !== 'head'">
                        <TreeSelect v-model="list.parentId" :data="classifyList" transfer />
                    </FormItem>
                    <FormItem label="分类名称" prop="name">
                        <Input placeholder="请输入内容" v-model="list.name"></Input>
                    </FormItem>
                    <FormItem label="分类编码" prop="code">
                        <Input placeholder="请输入内容" v-model="list.code"></Input>
                    </FormItem>
                    <FormItem label="权重设定" prop="weight">
                        <Input placeholder="请输入内容" v-model="list.weight" type="number"
                            @on-blur="list.weight = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                    </FormItem>
                    <FormItem label="分类备注">
                        <Input v-model="list.remark" type="textarea" :rows="3" placeholder="请输入内容" />
                    </FormItem>
                    <FormItem label="分类图标" prop="icon">
                        <!-- <p>建议尺寸120*120</p> -->
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadIcon">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                        <div>
                            <img :src="list.icon" alt="" :data-source="list.icon" style="width:120px" />
                        </div>
                    </FormItem>
                    <FormItem label="分类图片" prop="pic">
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadImg">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                        <div>
                            <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                        </div>
                    </FormItem>
                </Form>

                <template #footer>
                    <Button type="primary" @click="confirm('form')">确认</Button>
                    <Button @click="modal = false; list = {};">取消</Button>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script>
import {
    getGoodsCategoryTreeApi,
    postGoodsCategoryStatusApi,
    getGoodsCategoryDetailApi,
    postGoodsCategorySaveApi, // 更改添加  携带biz
    postGoodsCategoryDelApi,  // 删除
    getGoodsPropertyListApi,  // 属性列表
} from '@/api/account.js'
import { jsonToArray } from "@/libs/util.js";
export default {
    name: 'goodwillGoods-goodsClassify',
    data() {
        return {
            loading: false,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '序号',
                    width: 90,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [params.row.indexOf_])
                    }
                },
                {
                    title: '分类名称',
                    key: 'name',
                    tree: true,
                    align: 'center'
                },
                {
                    title: '分类ID',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '分类编码',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '分类权重',
                    key: 'weight',
                    align: 'center'
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 90,
                    slot: 'statuSlot',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                    fixed: 'right'
                }
            ],
            classifyList: [], // 列表
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            modalTitle: '编辑商品分类',  // 弹窗的字段
            modal: false, // 弹窗的状态
            list: {
                icon: '',
                pic: ''
            },
            icon: '',  // 图标
            pic: '',  // 图片
            selecAllId: [],
            search: {},  // 查询
            radioVal: 'head',  // 是否添加下级

            // 表单验证
            ruleValidate: {
                name: [
                    { required: true, message: '该项为必填项', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '该项为必填项', trigger: 'blur' }
                ],
                weight: [
                    { required: true, type: 'number', message: '该项为必填项', trigger: 'blur' }
                ],
                icon: [
                    { required: true, message: '分类图标必须上传', trigger: 'chnage' }
                ],
                pic: [
                    { required: true, message: '分类图片必须上传', trigger: 'change' }
                ],
            }
        }
    },
    created() {
        this.getClassifyList();
    },
    methods: {
        // 获取分类数据列表
        getClassifyList() {
            this.loading = true;
            getGoodsCategoryTreeApi({
                // pageNumber: this.pageNumber,
                // pageSize: this.pageSize,
                biz: 'common',
                ...this.search
            }).then(res => {
                this.total = res.length
                this.classifyList = []
                let arr = jsonToArray(res, true)
                this.classifyList.push(...arr)
                this.loading = false;
                this.classifyList.forEach((item, index) => {
                    item.indexOf_ = index + 1;

                    if (item.children.length > 0) {
                        item.children.forEach((itm, ind) => {
                            let indx = ind + 1;
                            itm.indexOf_ = index + 1 + '.' + indx;

                            if (itm.children.length > 0) {
                                itm.children.forEach((it, inx) => {
                                    let ix = inx + 1;
                                    it.indexOf_ = itm.indexOf_ + '.' + ix;
                                })
                            }
                        })
                    }
                })
            }).catch(err => {
                this.loading = false;
            })
        },
        // 编辑和添加
        details(id) {
            if (id) {
                getGoodsCategoryDetailApi(id).then(res => {
                    // console.log(res);
                    this.modalTitle = '编辑商品分类'
                    this.list = {
                        id: res.id,
                        parentId: res.node.parentId,
                        name: res.name,
                        code: res.code,
                        weight: res.weight,
                        rank: res.rank,
                        remark: res.remark,
                        pic: res.file && res.file.pic ? res.file.pic : '',
                        icon: res.file && res.file.icon ? res.file.icon : '',
                    };

                    this.modal = true;
                }).catch(err => {
                    console.log(err);
                })
            } else {
                this.modalTitle = '新增商品分类';
                this.list = {
                    id: '',
                    parentId: '',
                    name: '',
                    code: '',
                    weight: '',
                    rank: '',
                    remark: '',
                    pic: '',
                    icon: '',
                }
                this.modal = true;
            }
        },
        // 弹框的确认,提交新增/编辑
        confirm(formName) {

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let formData = new FormData();

                    formData.append('biz', 'common');

                    if (this.pic !== null) {
                        formData.append('upload[pic]', this.pic);
                    }
                    if (this.icon !== null) {
                        formData.append('upload[icon]', this.icon);
                    };

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key != 'pic' && key != 'icon') {
                                formData.append(key, element);
                            };
                        };
                    };

                    postGoodsCategorySaveApi(formData, false).then((res) => {
                        if (res.id) {
                            let messageT = '';
                            messageT = this.modalTitle == '新增商品属性' ? '添加成功！' : '修改成功！'
                            this.$Message.success(messageT);
                            this.modal = false;
                            this.getClassifyList();
                        };
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.$Message.error('请先补充必填项!');
                }
            })
        },
        // 删除按钮
        removeFn(row = []) {
            let formData = new FormData();
            row.forEach(item => {
                formData.append('id', item.id)
            })
            postGoodsCategoryDelApi(formData, false)
                .then(res => {
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getClassifyList();
                    };
                }).catch(err => {
                    console.log(err);
                })
        },
        // 表格选中状态
        selectionChange(selection) {
            this.selecAllId = []
            this.selecAllId.push(...selection)
        },
        // 修改状态
        changeStatusFn(i, row) {

            postGoodsCategoryStatusApi({
                id: row.id,
                value: i
            }).then(res => {
                this.loading = false;
                this.getClassifyList();
                // console.log(res, status);
            });

        },
        // 上传图标
        handleBeforeLicenseUrlUploadIcon(file) {
            this.icon = file;
            this.list.icon = window.URL.createObjectURL(file);
            return false;
        },
        // 上传图片
        handleBeforeLicenseUrlUploadImg(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
        visibleChange(key) {
            if (!key) {
                this.list = {};
                this.$refs['form'].resetFields();
            }
            this.icon = null
            this.pic = null
        },
        // 分页
        changePage(page) {
            // console.log(page);
            this.pageNumber = page;
            this.getClassifyList(this.search);
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getClassifyList(this.search);
        },
    }
}

</script>

<style scoped lang='less'>
.goodsClassify {
    .goodsClassify-main {
        margin-top: 24px;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;

        .classify-list {
            width: 100%;
            margin: 20px 0;
        }
    }


    :deep(.ivu-table) {
        width: 100%;
    }
}

:deep(.ivu-col-span-7) {
    font-weight: 600;
    text-align: right;
    padding: 0 15px 0 0;
    margin-bottom: 10px;
    line-height: 33px;


}

:deep(.ivu-col-span-10) {
    padding-top: 5px;
}
</style>