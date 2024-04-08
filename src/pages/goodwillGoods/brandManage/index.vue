<template>
    <div class='brandManage'>
        <!-- <h5>品牌管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城商品管理" content="品牌管理" hidden-breadcrumb />
        </div>
        <div class="brandManage-main">
            <div class="search_top" style="text-align: center;">
                <Space size="large">
                    <Space>
                        <!-- <strong>品牌名称</strong> -->
                        <Input v-model="search.keywords" clearable size="small" placeholder="请输入品牌名称关键字"></Input>
                    </Space>
                    <Space>
                        <Button type="primary" @click="pageNumber = 1; getBrandList()" size="small">查询</Button>
                        <Button @click="pageNumber = 1; search = {}; getBrandList();" size="small">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="brand-main-m">
                <Space size="large" style="margin-bottom: 15px;">
                    <strong style="font-size: 16px;">
                        <Icon type="md-list"></Icon> 品牌列表
                    </strong>
                    <Button size="small" type="primary" @click="details">增加</Button>
                </Space>
                <Table border :columns="columns" :data="branDataList" :loading="loading">
                    <template #fileSlot="{ row }">
                        <div v-viewer>
                            <img :src="row.file.pic" style="width: 80px;" alt="">
                        </div>
                    </template>

                    <template #actionSlot="{ row }">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="details(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="remove(row)">
                            <Button type="error" size="small">删除</Button>
                        </Poptip>

                    </template>
                </Table>
                <div style="margin: 20px 0 0;">
                    <Page :total="total" v-model="pageNumber" size="small" show-elevator show-sizer show-total
                        @on-page-size-change="pageSizeChange" @on-change="changePage" />
                </div>
            </div>
            <!-- 增加/编辑的弹框 -->
            <Modal class-name="vertical-center-modal" @on-visible-change="visibleChange" v-model="flag"
                :title="modalTitle">
                <Form ref="list" :model="list" :label-width="140">
                    <FormItem label="品牌名：">
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
                    <Button type="primary" @click="confirmBrand()">确认</Button>
                    <Button @click="flag = false;">取消</Button>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script>
import {
    getBrandPageApi,
    postBrandSaveApi,
    postBrandDelApi,

} from '@/api/account'
export default {
    name: 'goodwillGoods-brandManage',
    data() {
        return {
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
                    slot: 'fileSlot',
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
            search: {},  // 搜索
            flag: false, // 弹窗的状态
            modalTitle: '', // 弹窗标题
            list: {
                name: '',
                pic: ''
            },
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            pic: '',
            breakId: '',  // 编辑的品牌id
        }
    },
    created() {
        this.getBrandList()
    },
    methods: {
        // 获取品牌列表
        getBrandList() {
            this.loading = true
            getBrandPageApi({
                ...this.search,
                pageSize: this.pageSize,
                pageNumber: this.pageNumber,
                biz: 'common'
            })
                .then(res => {
                    this.total = res.totalElements;
                    this.branDataList = []
                    this.branDataList.push(...res.data)
                    this.loading = false
                    // console.log(res.data);
                }).catch(err => {
                    console.log(err);
                })
        },
        // 删除
        remove(row) {
            // console.log(row.id);
            postBrandDelApi({ id: row.id })
                .then(res => {
                    // console.log(res);
                    if (res) {
                        this.$Message.success('操作成功');
                        this.getBrandList('');
                    }
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

                if (row.file !== undefined) {
                    this.list.pic = row.file.pic
                }
                // this.list = {
                //     name: row.name,
                //     pic: row.file.pic
                // }
            } else {
                this.modalTitle = '新增品牌'
                // console.log('9090909090');
                this.list = {
                    name: '',
                    pic: '',
                }
                this.flag = true
            }
        },
        // 增加，编辑，保存按钮
        confirmBrand() {
            // this.loading = true

            let { name } = this.list;

            let formData = new FormData();
            formData.append('id', this.breakId ? this.breakId : '');
            formData.append('name', name ? name : '');
            formData.append('biz', 'common');
            if (this.pic !== null) {
                formData.append('upload[pic]', this.pic);
            }
            // if (this.icon !== null) {
            //     formData.append('upload[icon]', this.icon);
            // }
            if (name) {
                postBrandSaveApi(formData, false).then((res) => {
                    this.flag = false;
                    this.$Message.success('添加成功');
                    this.getBrandList();
                    // console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                this.$Message.warning('请补充品牌名称！')
            }
        },
        visibleChange(key) {
            if (!key) {
                this.list = {};
                this.$refs['list'].resetFields();
            }
            this.icon = null;
            this.pic = null;
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
.brandManage {
    .search_top {
        margin-bottom: 20px;
    }

    .brandManage-main {
        margin-top: 24px;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;
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