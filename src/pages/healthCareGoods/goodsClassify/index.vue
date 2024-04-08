<template>
    <div class='goodsClassify'>
        <!-- <h5>商品分类管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="商品分类管理" hidden-breadcrumb />
        </div>
        <div class="goodsClassify-main">
            <div class="search_top" style="text-align: center;">
                <Space size="large">
                    <!-- <Space>
                        <strong>分类名称</strong>
                        <TreeSelect v-model="search.parentId" :data="treeData" v-width="180" size="small" />
                    </Space> -->
                    <Space>
                        <!-- <strong>分类名称</strong> -->
                        <Input v-model="search.keywords" placeholder="请输入名称关键字" size="small" v-width="180" />
                    </Space>
                    <Space>
                        <Button size="small" type="primary" @click="pageNumber = 1; getClassifyList()">查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}; getClassifyList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="classify-list">
                <Space size="large">
                    <Space>
                        <Icon type="md-list" />
                        <strong style="font-size: 16px;"> 数据列表 </strong>
                    </Space>
                    <Button type="primary" icon="md-add" size="small" @click="details(false)">增加</Button>
                    <Poptip confirm transfer title="确认删除所选择的吗?" @on-ok="removeFn(selecAllId)">
                        <Button type="error" icon="ios-trash" size="small" ghost
                            :disabled="selecAllId.length == 0">删除</Button>
                    </Poptip>
                </Space>
                <!-- 表格 -->
                <div style="margin: 20px 0;">
                    <Table row-key="id" :loading="loading" :columns="columns" :data="classifyList" border
                        @on-selection-change="selectionChange">
                        <template #index1="{ index }">
                            <p>{{ index + 1 }}</p>
                        </template>

                        <template #statuSlot="{ row }">
                            <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                                @on-change="(i) => changeStatusFn(i, row)"></Switch>
                        </template>

                        <template #action="{ row }">
                            <Button type="primary" size="small" style="margin-right: 5px"
                                @click="details(row.id)">编辑</Button>
                            <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn([row])">
                                <Button type="error" size="small" v-if="row.status.code != 'enabled'">删除</Button>
                            </Poptip>
                        </template>
                    </Table>
                </div>
                <!-- 分页器 -->
                <!-- <div>
                    <Page :total="total" show-total @on-change="changePage" show-sizer
                        :page-size-opts="[5, 10, 20, 50, 100]" @on-page-size-change="pageSizeChange"></Page>
                </div> -->
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
                        <Input placeholder="请输入内容" type="number" v-model="list.weight"
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
    postGoodsCategorySaveApi, // 更改添加
    postGoodsCategoryDelApi,  // 删除
} from '@/api/account.js'
import { jsonToArray } from "@/libs/util.js";
export default {
    name: "goodsClassify",
    data() {
        return {
            loading: false,
            total: 0,
            pageSize: 10,
            pageNumber: 1,
            modal: false,
            columns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center",
                },
                {
                    title: "序号",
                    width: 90,
                    key: "indexOf_",
                    align: "center"
                },
                {
                    title: "分类名称",
                    key: "name",
                    tree: true,
                    // width: 260,
                    align: "center"
                },
                {
                    title: '分类ID',
                    key: 'id',
                    // width: 180,
                    align: 'center'
                },
                {
                    title: "分类编码",
                    key: "code",
                    // width: 180,
                    align: "center"
                },
                {
                    title: "分类权重",
                    key: "weight",
                    minWidth: 120,
                    align: "center"
                },
                {
                    title: "状态",
                    align: "center",
                    width: 90,
                    slot: 'statuSlot',
                },
                {
                    title: "操作",
                    slot: "action",
                    width: 150,
                    align: "center",
                    fixed: "right"
                }
            ],
            classifyList: [],
            treeData: [],
            treeId: "",
            search: {},
            modalTitle: "编辑商品分类",
            list: {
                id: "",
                pic: ""
            },
            icon: "",
            pic: "",
            radioVal: "head", // 是否添加下级
            selecAllId: [],  // 选中分类

            // 表单验证
            ruleValidate: {
                name: [
                    { required: true, message: '该项为必填项', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '该项为必填项', trigger: 'blur' }
                ],
                weight: [
                    { required: true, type: "number", message: '该项为必填项', trigger: 'blur' }
                ],
                icon: [
                    { required: true, message: '分类图标必须上传', trigger: 'chnage' }
                ],
                pic: [
                    { required: true, message: '分类图片必须上传', trigger: 'change' }
                ],
            }
        };
    },
    created() {
        this.getClassifyList();
        getGoodsCategoryTreeApi({ parentId: "", biz: "medical" })
            .then(res => {
                // console.log(res);
                res.forEach(item => {
                    if (item.subset && item.subset.length) {
                        let children = [];
                        item.subset.forEach(itm => {
                            let threeCld = [];
                            if (itm.subset !== undefined && itm.subset.length) {
                                // console.log(itm.subset);
                                itm.subset.forEach(it => {
                                    // itm.push({ children: it })
                                    if (it.subset !== undefined && itm.subset.length) {
                                        threeCld.push({
                                            title: it.name,
                                            expand: true,
                                            value: it.id,
                                            selected: false,
                                            checked: false,
                                        });
                                    }
                                });
                                // children.push({ children: itm })
                                children.push({
                                    title: itm.name,
                                    expand: true,
                                    value: itm.id,
                                    selected: false,
                                    checked: false,
                                    children: threeCld
                                });
                            }
                        });
                        // res.push({ children })
                        this.treeData.push({
                            title: item.name,
                            expand: true,
                            value: item.id,
                            selected: false,
                            checked: false,
                            children
                        });
                    }
                });
            });
    },
    methods: {
        // 获取分类数据列表
        getClassifyList() {
            this.loading = true;
            getGoodsCategoryTreeApi({
                // pageNumber: this.pageNumber,
                // pageSize: this.pageSize,
                biz: "medical",
                ...this.search
            })
                .then(res => {
                    this.total = res.length;
                    this.classifyList = [];
                    let arr = jsonToArray(res, true);
                    this.classifyList.push(...arr);
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
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        // 删除
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
                    }
                }).catch(err => {
                    this.getClassifyList();
                });
            // console.log(row.id);
        },
        // 编辑和添加
        details(id) {
            if (id) {
                getGoodsCategoryDetailApi(id).then(res => {
                    this.modalTitle = "编辑商品分类";
                    this.list = {
                        id: res.id,
                        parentId: res.node.parentId,
                        name: res.name,
                        code: res.code,
                        weight: res.weight,
                        rank: res.rank,
                        remark: res.remark,
                        pic: res.file && res.file.pic ? res.file.pic : "",
                        icon: res.file && res.file.icon ? res.file.icon : "",
                    };
                    this.modal = true;
                }).catch(err => {
                    console.log(err);
                });
            }
            else {
                this.modalTitle = "新增商品分类";
                this.list = {
                    id: "",
                    pic: "",
                    icon: "",
                };
                this.modal = true;
            }
        },
        // 弹框的确认,提交新增/编辑
        confirm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    let formData = new FormData();

                    this.list.biz = 'medical';

                    if (this.pic !== null) {
                        formData.append("upload[pic]", this.pic);
                    }
                    if (this.icon !== null) {
                        formData.append("upload[icon]", this.icon);
                    }

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key != 'pic' && key != 'icon') {
                                formData.append(key, element)
                            };
                        };
                    };

                    this.loading = true;
                    postGoodsCategorySaveApi(formData, false).then((res) => {
                        let messageT = "";
                        messageT = this.modalTitle == "新增商品属性" ? "添加成功！" : "修改成功！";
                        this.$Message.success(messageT);
                        this.getClassifyList();
                        this.modal = false;
                        this.loading = false;
                    }).catch((err) => {
                        this.loading = false;
                        console.log(err);
                    });
                } else {
                    this.$Message.error('请先补充必填项!');
                }
            })
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
        // 表格选中状态
        selectionChange(selection) {
            this.selecAllId = [];
            this.selecAllId = selection;
        },
        // 上传图标
        handleBeforeLicenseUrlUploadIcon(file) {
            this.icon = file;
            this.list.icon = window.URL.createObjectURL(file);
            return false;
        },
        // 上传图标
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
            this.getClassifyList(this.treeId);
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getClassifyList(this.treeId);
        },
    },
}
</script>

<style scoped lang='less'>
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

:deep(.ivu-col-span-7) {
    font-weight: 600;
    text-align: right;
    padding: 0 15px 0 0;
    margin-bottom: 10px;
    line-height: 33px;


}

:deep(.ivu-table-tip) {
    overflow: hidden;
}

:deep(.ivu-col-span-10) {
    padding-top: 5px;
}
</style>