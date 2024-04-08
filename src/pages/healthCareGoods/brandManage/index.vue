<template>
    <div class='brandManage'>
        <!-- <h5>品牌管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="品牌管理" hidden-breadcrumb />
        </div>
        <div class="brand_main">
            <div class="search_top">
                <Space size="large">
                    <Space>
                        <!-- <strong>品牌名称</strong> -->
                        <Input v-model="search.keywords" clearable size="small" placeholder="请输入品牌名称等关键字"></Input>
                    </Space>
                    <Space>
                        <Button type="primary" @click="pageNumber = 1; getBrandList()" size="small">查询</Button>
                        <Button @click="pageNumber = 1; search = {}; getBrandList();" size="small">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="table_main">
                <Space size="large" style="margin-bottom: 15px;">
                    <strong style="font-size: 16px;">
                        <Icon type="md-list"></Icon> 品牌列表
                    </strong>
                    <Button size="small" type="primary" @click="details(false)">增加</Button>
                </Space>
                <Table border :columns="columns" :data="branDataList" :loading="loading">
                    <template #file="{ row }">
                        <div v-viewer v-if="row.file && row.file.pic">
                            <img :src="row.file.pic" style="width: 80px;" alt="">
                        </div>
                        <div v-else></div>
                    </template>

                    <template #actionSlot="{ row }">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="details(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeBrandFn(row)">
                            <Button type="error" size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
                <Row style="margin: 20px 0 0;">
                    <Col span="24">
                    <Page :total="total" v-model="pageNumber" size="small" show-elevator show-sizer show-total
                        @on-page-size-change="pageSizeChange" @on-change="changePage" />
                    </Col>
                </Row>
            </div>
            <!-- 增加/编辑的弹框 -->
            <Modal class-name="vertical-center-modal" @on-visible-change="visibleChange" v-model="flag"
                :title="modalTitle">
                <Form ref="list" :rules="ruleValidate" :model="list" :label-width="140">
                    <FormItem label="品牌名：" prop="name">
                        <Input v-model="list.name" placeholder="请输入" style="width: 300px"></Input>
                    </FormItem>
                    <FormItem label="品牌logo：" :label-width="140">
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
                    <Button type="primary" @click="confirmBrand('list')">确认</Button>
                    <Button @click="flag = false;">取消</Button>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script>
import { getBrandPageApi, postBrandSaveApi, postBrandDelApi } from '@/api/account'
export default {
    name: 'goodwillGoods-brandManage',
    data() {
        return {
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            loading: false,
            columns: [
                {
                    width: 60,
                    align: "center",
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '品牌名',
                    key: 'name',
                    // width: 200,
                    align: "center"
                },
                {
                    title: '品牌LOGO',
                    // key: 'age',
                    slot: 'file',
                    // width: 200,
                    align: "center",
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    width: 150,
                    align: 'center'
                }
            ],
            branDataList: [],
            search: {},   // 搜索
            flag: false, // 弹窗的状态
            modalTitle: '', // 弹窗标题
            list: {
                name: '',
                pic: ''
            },
            pic: '',
            breakId: '',  // 编辑的品牌id

            ruleValidate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.getBrandList();
    },
    methods: {
        // 获取品牌列表
        getBrandList() {
            this.loading = true
            getBrandPageApi({
                ...this.search,
                pageSize: this.pageSize,
                pageNumber: this.pageNumber,
                biz: 'medical'
            })
                .then(res => {
                    this.total = res.totalElements;
                    this.branDataList = [];
                    this.branDataList.push(...res.data);
                    this.loading = false;
                    // console.log(res.data);
                })
        },
        // 删除
        removeBrandFn(row) {
            // console.log(row.id);
            postBrandDelApi({ id: row.id })
                .then(res => {
                    this.$Message.success('操作成功！');
                    this.getBrandList();
                })
        },
        // 编辑和添加
        details(row) {
            if (row) {
                this.modalTitle = '编辑品牌'
                this.flag = true
                this.breakId = row.id
                if (row.name !== '') {
                    this.list.name = row.name
                }
                // console.log(row.file);
                if (row.file !== undefined) {
                    this.list.pic = row.file.pic
                }
                // this.list = {
                //     name: row.name,
                //     pic: row.file.pic
                // }
            } else {
                this.modalTitle = '新增品牌'
                this.list = {
                    name: '',
                    pic: '',
                }
                this.flag = true
            }
        },
        // 增加，编辑，保存按钮
        confirmBrand(name) {
            // this.loading = true

            this.$refs[name].validate((valid) => {
                if (valid) {

                    let { name } = this.list;

                    let formData = new FormData();
                    formData.append('id', this.breakId ? this.breakId : '');
                    formData.append('name', name ? name : '');
                    formData.append('biz', 'medical');
                    if (this.pic !== null) {
                        formData.append('upload[pic]', this.pic);
                    }
                    // if (this.icon !== null) {
                    //     formData.append('upload[icon]', this.icon);
                    // }
                    postBrandSaveApi(formData, false).then((res) => {
                        this.flag = false;
                        this.$Message.success('添加成功');
                        this.getBrandList();
                        // console.log(res);
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.$Message.error('请补充必填项 !');
                }
            })
        },
        visibleChange(key) {
            if (!key) {
                this.list = {};
                this.$refs['list'].resetFields();
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
            this.getBrandList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getBrandList();
        },
    }
}
</script>

<style scoped lang='less'>
.brand_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .search_top {
        margin-bottom: 15px;
        text-align: center;
    }
}

:deep(.ivu-form-item-label) {
    width: 150px;
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