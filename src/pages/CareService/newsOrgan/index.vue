<template>
    <div class='newsOrgan'>
        <!-- <h5>新建机构管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="关爱服务管理" :content="pageTitle" hidden-breadcrumb />
        </div>
        <div class="newsOrgan_main">
            <div class="top_title">{{ this.pageTitle }}</div>
            <div class="new_body">

                <Form ref="listForm" :model="list" label-position="right" :rules="ruleValidate" :label-width="130">
                    <FormItem label="机构分类：" prop="categoryId">
                        <Select v-model="list.categoryId" placeholder="请">

                        </Select>
                    </FormItem>
                    <FormItem label="机构名称：" prop="name">
                        <Input v-model="list.name" placeholder="请输入机构名称"></Input>
                    </FormItem>
                    <FormItem label="统一信用代码：" prop="creditCode">
                        <Input v-model="list.creditCode" placeholder="请输入统一信用代码"></Input>
                    </FormItem>
                    <FormItem label="机构类型：">
                        <Select placeholder="请输入姓名">
                            <Option>公立</Option>
                            <Option>私立</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="法人姓名：" prop="lpName">
                        <Input v-model="list.lpName" placeholder="请输入法人姓名"></Input>
                    </FormItem>
                    <FormItem label="法人证件号码：" prop="lpIdNo">
                        <Input v-model="list.lpIdNo" placeholder="请输入证件号码"></Input>
                    </FormItem>
                    <FormItem label="联系人：" prop="linkman">
                        <Input v-model="list.linkman" placeholder="请输入联系人"></Input>
                    </FormItem>
                    <FormItem label="联系方式：" prop="linkmanTel">
                        <Input v-model="list.linkmanTel" type="number" show-word-limit maxlength="11"
                            placeholder="请输入联系方式"></Input>
                    </FormItem>
                    <FormItem label="地区：" prop="regionId">
                        <TreeSelect v-model="list.regionId" :data="areaTree" />
                    </FormItem>
                    <FormItem label="联系地址：" prop="address">
                        <Input v-model="list.address" placeholder="请输入地址"></Input>
                    </FormItem>
                    <FormItem label="资质">
                    </FormItem>
                    <FormItem :label="item.name + '：'" v-for="(item, index) in fileList" :key="index">
                        <template v-if="item.url">
                            <div v-viewer @contextmenu.prevent.stop="deleteImgFn(item, index)">
                                <img :src="item.url" width="120" alt="">
                            </div>
                        </template>
                        <Upload ref="upload" action=""
                            :before-upload="(file) => handleBeforeLicenseUrlUpload(file, index)">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </FormItem>
                </Form>
            </div>
            <div class="footer_btn">
                <Space size="large">
                    <Button type="primary" @click="saveOrganFn('listForm')">确认</Button>
                    <Button @click="$router.back();">取消</Button>
                </Space>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getAreaTreeApi, // 地区
    getMerchantBaseSaveApi, // 编辑/新建机构保存
    getMerchantBaseDetailApi,  // 机构详情
    getUserInfoPageApi, // 用户列表

    getSysDictItemTreeApi,  // 资质类型

    getMerchantCertListApi,  // 资质列表
    getMerchantCertSaveApi,  // 资质保存
    postMerchantCertRemoveApi,  // 资质删除
} from '@api/account.js'
import { jsonToArea } from "@/libs/util.js"
export default {
    name: 'newsOrgan',
    data() {
        return {
            organId: '', // 编辑时的机构id
            pageTitle: '',  // 标题
            areaTree: [], // 地域列表
            classList: [], // 分类
            list: {},
            fileType: [],

            fileList: [
                // { id: '文件id', file: '文件路径', url: '文件url', name: '文件名称', code: '字典id' }
            ],

            ruleValidate: {
                name: [
                    { required: true, message: '请输入机构名称', trigger: 'blur' }
                ],
                // categoryId: [
                //     { required: true, message: '请选择分类', trigger: 'change' },
                // ],
                creditCode: [
                    { required: true, message: '请输入统一信用码', trigger: 'blur' }
                ],
                lpName: [
                    { required: true, message: '请输入法人姓名', trigger: 'blur' }
                ],
                lpIdNo: [
                    { required: true, message: '请输入证件号码', trigger: 'blur' },
                ],
                regionId: [
                    { required: true, message: '请选择地区', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ],
                linkman: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                linkmanTel: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' }
                ],
            },
        }
    },
    created() {
        this.organId = this.$route.query.id;

        if (!this.organId) {
            this.pageTitle = '新建机构管理';
        } else {
            this.pageTitle = '编辑机构管理';
            getMerchantBaseDetailApi(this.organId)
                .then(res => {
                    this.list = {
                        name: res.name,
                        linkman: res.linkman || '',
                        linkmanTel: res.linkmanTel || '',
                        creditCode: res.creditCode || '',
                        afterSaleLinkman: res.afterSaleLinkman ? res.afterSaleLinkman : '',
                        afterSaleTel: res.afterSaleTel ? res.afterSaleTel : '',
                        lpName: res.lpName || '',
                        lpIdNo: res.lpIdNo || '',
                        address: res.address ? res.address : '',
                        regionId: res.region ? res.region.code : '',
                    }
                })
        }
        this.getAreaTree(); // 地区
        this.getDictFileFn();  // 资质
    },
    methods: {
        // 获取地区
        getAreaTree() {
            getAreaTreeApi().then(res => {
                this.areaTree = jsonToArea(res, 'code', false)
            })
        },
        // 获取资质
        getDictFileFn() {
            // 获取所需资质
            getSysDictItemTreeApi({ dict: 'mer_cert_service' }).then(res => {
                let data = JSON.parse(JSON.stringify(res));

                data.forEach(item => {
                    this.fileList.push({
                        id: '',   // 文件id
                        file: '',   // 文件路径
                        url: '',   // 文件url
                        name: item.name,   // 文件名称
                        code: item.id,    // 字典id
                    })
                });

                // 获取商家资质
                if (this.organId) {
                    getMerchantCertListApi({ 'merchantId': this.organId })
                        .then(res => {
                            this.fileList.forEach(item => {
                                res.forEach(itm => {
                                    if (item.name == itm.name) {
                                        item.id = itm.id;
                                        item.url = itm.filePath;
                                    }
                                });
                            });
                        });
                }
            })

        },
        // 新建保存 / 提交
        saveOrganFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    let formData = new FormData();
                    formData.append('biz', 'common');
                    formData.append('type', 'service');

                    formData.append('id', this.organId || '');

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            formData.append(key, element);
                        };
                    };

                    getMerchantBaseSaveApi(formData, false)
                        .then(res => {
                            if (res.id) {
                                this.organId = res.id;
                                this.fileSaveFn(res.id);
                                this.$Message.success(`${this.pageTitle}成功！`);
                                this.$router.back();
                            }
                        }).catch(err => {
                            console.log(err);
                        })

                } else {
                    this.$Message.error('请补全必填项 !');
                }
            })
        },
        // 资质保存
        fileSaveFn(id) {

            this.fileList.forEach(item => {
                if (item.file) {

                    let formData = new FormData();
                    if (item.id) {
                        formData.append('id', item.id);
                    }
                    formData.append('merchantId', id);
                    formData.append('typeCode', item.code);
                    formData.append('name', item.name);
                    formData.append('file', item.file);

                    getMerchantCertSaveApi(formData, false).then(res => {
                        this.$Message.success('资质保存成功！')
                    });
                };
            });
        },
        // 上传图片
        handleBeforeLicenseUrlUpload(file, index) {
            this.fileList[index].url = window.URL.createObjectURL(file);
            this.fileList[index].file = file;

            // this.pic = file;
            // this.list.pic = 
            return false;
        },
        // 图片删除
        deleteImgFn(item, i) {
            if (item.id) {
                postMerchantCertRemoveApi({ id: item.id }).then(res => {

                    this.fileList[i].id = '';
                    this.fileList[i].url = '';
                    this.fileList[i].file = '';
                    this.$Message.warning('资质移除成功 ！')
                })
            } else {
                this.fileList[i].url = '';
                this.fileList[i].file = '';
            }
        },
    },
    beforeUnmount() {

    }
}
</script>
<style scoped lang='less'>
.newsOrgan_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;


    .top_title {
        font-weight: 600;
        text-align: center;
        font-size: 20px;
        margin-bottom: 15px;
    }

    .new_body {
        width: 50%;
        margin: 0 auto;
    }

}

.footer_btn {
    border-top: 1px solid #ddd;
    padding-top: 15px;
    text-align: center;
}
</style>