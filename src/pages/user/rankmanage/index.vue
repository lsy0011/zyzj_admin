<template>
    <div>
        <!-- <h5>等级管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="用户管理" content="等级管理" hidden-breadcrumb />
        </div>
        <div class="rankmanage-main">
            <Card>
                <template #title>
                    <strong>等级列表</strong>
                </template>
                <template #extra>
                    <Button type="primary" @click="editFn(false, 'listName')">新增</Button>
                </template>
                <Table border :columns="columns" :data="data">
                    <template #actionSlot="{ row }">
                        <Button type="primary" size="small" style="margin-right: 5px"
                            @click="editFn(row, 'listName')">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn(row)">
                            <Button type="error" size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </Card>
        </div>
        <!-- 添加编辑 -->
        <Modal v-model="modal" title="添加/编辑">
            <Form :model="list" ref="listName" :rules="ruleValidate" label-position="right" :label-width="130">
                <FormItem label="等级名称：" prop="name">
                    <Input v-model="list.name"></Input>
                </FormItem>
                <FormItem label="等级：" prop="grade">
                    <Input v-model="list.grade" type="number"></Input>
                </FormItem>
                <FormItem label="购买现金：" prop="price">
                    <Input v-model="list.price" type="number"></Input>
                </FormItem>
                <FormItem label="爱心值兑换：" prop="coin">
                    <Input v-model="list.coin" type="number"></Input>
                </FormItem>
                <FormItem label="会员生效天数：" prop="validityDays">
                    <Input v-model="list.validityDays" type="number"></Input>
                </FormItem>
                <!-- <FormItem label="主图">
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadMainpic">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="list['upload[mainpic]']" alt="" :data-source="list['upload[mainpic]']"
                            style="width:120px" />
                    </div>
                </FormItem>
                <FormItem label="个人中心背景">
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadBg">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="list['upload[bg]']" alt="" :data-source="list['upload[bg]']" style="width:120px" />
                    </div>
                </FormItem>
                <FormItem label="订单logo">
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadLogo">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="list['upload[logo]']" alt="" :data-source="list['upload[logo]']" style="width:120px" />
                    </div>
                </FormItem> -->
            </Form>
            <template #footer>
                <Button type="primary" @click="saveFn('listName')">确认</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getBasicMemberLevelListApi,   // 等级列表
    postMemberLevelSaveApi,  // 保存
    postMemberLevelRemoveApi,  // 删除
} from "@/api/account";
export default {
    name: 'rankmanage',
    data() {
        return {
            modal: false,
            columns: [
                {
                    title: '等级名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '等级',
                    key: 'grade',
                    align: 'center'
                },
                {
                    title: '爱心值兑换',
                    key: 'coin',
                    align: 'center'
                },
                {
                    title: '购买现金',
                    key: 'price',
                    align: 'center'
                },
                {
                    title: '有效期',
                    key: 'price',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [params.row.validityDays ? params.row.validityDays + '天' : '---'])
                    }
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    align: 'center'
                }
            ],
            data: [],
            list: {
                'upload[mainpic]': '',
                'upload[bg]': '',
                'upload[logo]': '',
            },  // 编辑数据
            'upload[mainpic]': null,  // 主图
            'upload[bg]': null,  // 个人中心背景
            'upload[logo]': null,  // 订单logo

            ruleValidate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                grade: [
                    { required: true, message: '请输入等级', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请输入购买所需现金', trigger: 'blur' }
                ],
                coin: [
                    { required: true, message: '请输入兑换所需爱心值', trigger: 'blur' }
                ],
                validityDays: [
                    { required: true, message: '请输入有效天数', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.getLevelList()
    },
    methods: {
        // 等级列表
        getLevelList() {
            getBasicMemberLevelListApi().then(res => {
                this.data = res
            }).catch(err => {
                console.log(err);
            })
        },
        // 编辑
        editFn(row, name) {
            this.$refs[name].resetFields();
            if (row.id) {
                this.list = {
                    id: row.id,
                    name: row.name,
                    grade: row.grade,
                    price: row.price,
                    coin: row.coin,
                    validityDays: row.validityDays,
                    // 'upload[mainpic]': row.file ? row.file.mainpic : '',
                    // 'upload[bg]': row.file ? row.file.logo : '',
                    // 'upload[logo]': row.file ? row.file.bg : '',
                }
            } else {
                this.list = {
                    id: '',
                    name: '',
                    grade: '',
                    price: '',
                    coin: '',
                    validityDays: '',
                    'upload[mainpic]': '',
                    'upload[bg]': '',
                    'upload[logo]': '',
                }
            }
            this.modal = true;
        },
        // 新建  保存
        saveFn(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let formData = new FormData()

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (element && key != 'upload[mainpic]' && key != 'upload[bg]' && key != 'upload[logo]') {
                                formData.append(key, element)
                            }
                            if (key == 'upload[mainpic]' && this['upload[mainpic]']) {
                                formData.append('upload[mainpic]', this['upload[mainpic]'])
                            }
                            if (key == 'upload[bg]' && this['upload[bg]']) {
                                formData.append('upload[bg]', this['upload[bg]'])
                            }
                            if (key == 'upload[logo]' && this['upload[logo]']) {
                                formData.append('upload[logo]', this['upload[logo]'])
                            }
                        }
                    }
                    postMemberLevelSaveApi(formData, false).then(res => {
                        if (res.id) {
                            this.$Message.success('成功！')
                            this.getLevelList()
                        }
                    }).catch(err => {
                        console.log(err);
                    })

                } else {
                    this.$Message.error('请先补充必填项 !');
                }
            })
        },
        // 删除
        removeFn(row) {
            postMemberLevelRemoveApi({ id: row.id }).then(res => {
                if (res) {
                    this.$Message.success('操作成功！')
                    this.getLevelList()
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 主图
        handleBeforeLicenseUrlUploadMainpic(file) {
            this['upload[mainpic]'] = file;
            this.list['upload[mainpic]'] = window.URL.createObjectURL(file);
            return false;
        },
        // 个人中心背景
        handleBeforeLicenseUrlUploadBg(file) {
            this['upload[bg]'] = file;
            this.list['upload[bg]'] = window.URL.createObjectURL(file);
            return false;
        },
        // 订单logo
        handleBeforeLicenseUrlUploadLogo(file) {
            this['upload[logo]'] = file;
            this.list['upload[logo]'] = window.URL.createObjectURL(file);
            return false;
        },
    }
}
</script>
<style lang="less" scoped>
.rankmanage-main {
    margin-top: 24px;

    .ivu-table-wrapper.ivu-table-wrapper-with-border {
        margin: 20px 0;
    }

    :deep(.ivu-card-head) {
        padding: 20px 16px;
        font-size: 16px;
    }
}
</style>