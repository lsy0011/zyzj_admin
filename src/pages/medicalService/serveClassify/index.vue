<template>
    <div class='serveClassify'>
        <!-- <h5>服务分类管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医疗服务管理" content="服务分类管理" hidden-breadcrumb />
        </div>
        <div class="shopManage_main">
            <div class="search_top" style="text-align: center;">
                <Space size="large">
                    <Space>
                        <!-- <strong>分类</strong> -->
                        <Input v-model="keywords" placeholder="请输入手机号/姓名等关键字" size="small" clearable
                            style="width: 200px;" />
                    </Space>
                    <Space>
                        <Button type="primary" size="small" @click="getList(keywords)"> 查询</Button>
                        <Button size="small" @click="keywords = ''; getList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <Space size="large" style="margin-bottom: 15px;">
                <strong style="font-size: 16px; ">
                    <Icon type="md-reorder" /> 机构分类列表
                </strong>
                <Button type="primary" size="small" @click=" detailsClassifyFn(0)">添加</Button>
            </Space>
            <Table border :columns="columns" :data="data" :loading="loading">
                <template #kong="{ }">
                    <p>---</p>
                </template>

                <template #statuSlot="{ row }">
                    <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                        @on-change="(i) => changeStatusFn(i, row)"></Switch>
                </template>

                <template #action="{ row }">
                    <Button type="primary" size="small" style="margin-right: 10px;"
                        @click=" detailsClassifyFn(row.id)">编辑</Button>
                    <Poptip confirm transfer title="确认删除所选择的吗?" @on-ok=" removeFn(row)">
                        <Button type="error" size="small" style="margin-right: 10px;"
                            v-show="row.status.code != 'enabled'">删除</Button>
                    </Poptip>
                    <!-- <Button size="small" style="margin-right: 10px;">上移</Button>
                    <Button size="small">下移</Button> -->
                </template>
            </Table>
            <!-- <Page :total="total" show-total @on-change="changePage" show-sizer :page-size-opts="[5, 10, 20, 50, 100]"
                @on-page-size-change="pageSizeChange"></Page> -->
            <!-- <Page show-total :total="48" size="small" show-elevator show-sizer /> -->
        </div>
        <!-- 增加/编辑的弹框 -->
        <Modal @on-visible-change="visibleChange" v-model="flag" :title="modalTitle">
            <Form ref="form" :model="list" label-position="right" :rules="ruleValidate" :label-width="100">
                <!-- <FormItem label="分类级别">
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
                </FormItem> -->
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
                <!-- <FormItem label="当前状态">
                    <Switch v-model="state" @on-change="td => state = td" />
                </FormItem> -->
            </Form>

            <template #footer>
                <Button type="primary" @click="confirmSaveFn('form')">确认</Button>
                <Button @click="flag = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import {
    getServiceCategoryListApi, // 分类列表 -
    postServiceCategorySaveApi, // 新建/修改-->保存
    getServiceCategoryDetailApi, // 服务分类详情
    postServiceCategoryStatuslApi, // 服务分类  状态
    postServiceCategoryRemovelApi, // 服务分类  删除
} from '@api/account'
export default {
    name: 'organClassify',
    data() {
        return {
            loading: false,
            total: 0,  // 总条数
            pageSize: 10,  // 条数
            pageNumber: 1,  // 页码数
            keywords: "", // 关键字
            modalTitle: '新增分类', // 弹窗的标题
            flag: false, // 弹窗的状态
            list: {
                id: '',
                icon: '',
                pic: ''
            },
            icon: null,
            pic: null,
            breakId: '',  // 编辑的品牌id
            columns: [
                {
                    width: 60,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '分类名称',
                    key: 'name',
                    align: "center"
                },
                {
                    title: '分类ID',
                    key: 'id',
                    // width: 180,
                    align: 'center'
                },
                {
                    title: '分类编码',
                    key: 'code',
                    align: "center"
                },
                {
                    title: '分类权重',
                    key: 'weight',
                    align: "center"
                },
                {
                    title: '状态',
                    align: 'center',
                    width: 90,
                    slot: 'statuSlot',
                },
                {
                    title: '操作',
                    width: '260',
                    align: "center",
                    slot: 'action'
                },
            ], // 表头
            data: [], // 数据列表
            state: false,  // 弹框中的修改状态

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
    mounted() {
        this.getList()
    },
    methods: {
        // 获取列表
        getList(keywords = '') {
            this.loading = true
            getServiceCategoryListApi({ keywords, biz: 'medical' })
                .then(res => {
                    this.data = res;
                    this.loading = false;
                    // console.log(res);
                })
        },
        // 弹窗的方法👇
        // 编辑和添加
        // 编辑和添加
        detailsClassifyFn(id) {
            this.$refs['form'].resetFields();
            if (id) {
                getServiceCategoryDetailApi(id).then(res => {
                    this.loading = false;
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
                    }
                    if (res.status == undefined || res.status.code !== 'enabled') {
                        this.state = false
                    } else {
                        this.state = true
                    }
                    this.flag = true
                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
            } else {
                this.modalTitle = '新增商品分类'
                this.list = {
                    id: '',
                    pic: '',
                    icon: '',
                }
                this.state = false
                this.flag = true
            }
        },
        // 弹框的确认,提交新增/编辑
        confirmSaveFn(formName) {

            this.$refs[formName].validate((valid) => {
                if (valid) {


                    let formData = new FormData();

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key == 'pic' && this.pic) {
                                formData.append('upload[pic]', this.pic);
                            } else if (key == 'icon' && this.icon) {
                                formData.append('upload[icon]', this.icon);
                            } else {
                                formData.append(key, element || '');
                            }
                        }
                    }

                    formData.append('biz', 'medical');
                    this.loading = true;
                    postServiceCategorySaveApi(formData, false).then((res) => {
                        if (this.state == true) {
                            this.state = 'enabled'
                        } else {
                            this.state = 'disabled'
                        }
                        // postServiceCategoryStatuslApi({
                        //     id: res.id,
                        //     value: this.state
                        // }).then(rs => {
                        let messageT = ''
                        messageT = this.modalTitle == '新增商品属性' ? '添加成功！' : '修改成功！'
                        this.$Message.success(messageT);
                        this.flag = false;
                        this.getList();
                        this.loading = false;
                        // });
                    }).catch((err) => {
                        this.loading = false;
                    });
                } else {
                    this.$Message.error('请先补充必填项!');
                }
            })
        },
        // 状态修改
        changeStatusFn(value, row) {

            postServiceCategoryStatuslApi({
                id: row.id,
                value
            }).then(res => {
                this.$Message.success('状态修改成功')
                this.getList()
            }).catch(err => {
                this.getList();
            })
        },
        // 删除
        removeFn(row) {
            // console.log(row);
            postServiceCategoryRemovelApi({ id: row.id })
                .then(res => {
                    if (res) {
                        this.$Message.success('操作成功！');
                        this.getList();
                    }
                })
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
        // 分页
        changePage(page) {
            // console.log(page);
            this.pageNumber = page;
            this.getList(this.keywords);
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getList(this.keywords);
        },
        visibleChange(key) {
            if (!key) {
                this.list = {}
            }
            this.icon = null
            this.pic = null
        },
    }
}
</script>

<style scoped lang='less'>
.shopManage_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .search_top {
        width: 100%;
        padding: 10px 0 20px;
    }

    :deep(.ivu-page.mini) {
        margin-top: 20px;
    }

    :deep(.ivu-city-rel) {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

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