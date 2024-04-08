<template>
    <div class='addsupplier'>
        <!-- <h5>添加供应商</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="药品供应商管理" :content="editTitle" hidden-breadcrumb />
        </div>
        <div class="add_supplier">
            <div class="title_body">{{ editTitle }}</div>
            <Form ref="formValidate" :model="list" :rules="ruleValidate" :label-width="160">
                <FormItem label="名称：" prop="name">
                    <Input v-model="list.name" placeholder="请输入名称" />
                </FormItem>
                <!-- <FormItem label="选择用户：" prop="name">
                    <Select v-model="list.userId" placeholder="输入手机号搜索用户">
                        <Option :value="item.id" v-for="item in userList" :key="item.code">
                            {{ item.name ? item.name : item.nickName ? item.nickName : item.username ? item.username : '' }}
                        </Option>
                    </Select>
                </FormItem> -->
                <FormItem label="统一信用代码：" prop="creditCode">
                    <Input v-model="list.creditCode" @on-blur="list.creditCode = $event.target.value.trim()"
                        placeholder="请输入统一信用代码" />
                </FormItem>
                <FormItem label="区域：" prop="regionId">
                    <TreeSelect v-model="list.regionId" :data="treeData" placeholder="请选择区域" />
                </FormItem>
                <FormItem label="地址：" prop="address">
                    <Input v-model="list.address" placeholder="请输入详细地址" />
                </FormItem>
                <FormItem label="联系人：" prop="linkman">
                    <Input v-model="list.linkman" @on-blur="list.linkman = $event.target.value.trim()"
                        placeholder="请输入联系人" />
                </FormItem>
                <FormItem label="联系方式：" prop="linkmanTel">
                    <Input v-model="list.linkmanTel" @on-blur="list.linkmanTel = $event.target.value.trim()"
                        type="number" maxlength="11" show-word-limit placeholder="请输入联系方式" />
                </FormItem>
                <FormItem label="联系人身份证：" prop="linkmanIdNo">
                    <Input v-model="list.linkmanIdNo" @on-blur="list.linkmanIdNo = $event.target.value.trim()"
                        maxlength="18" show-word-limit placeholder="请输入联系人身份证" />
                </FormItem>
                <FormItem label="售后联系人：">
                    <Input v-model="list.afterSaleLinkman" @on-blur="list.afterSaleLinkman = $event.target.value.trim()"
                        placeholder="请输入售后联系人" />
                </FormItem>
                <FormItem label="售后电话：">
                    <Input v-model="list.afterSaleTel" type="number"
                        @on-blur="list.afterSaleTel = $event.target.value.trim()" maxlength="11" show-word-limit
                        placeholder="请输入售后电话" />
                </FormItem>
                <FormItem label="售后地址：">
                    <Input v-model="list.afterSaleAddress" placeholder="请输入售后地址" />
                </FormItem>
                <FormItem label="结算周期：" prop="paymentPeriod">
                    <Input v-model="list.paymentPeriod" type="number" placeholder="输入整数/单位(天)"
                        @on-blur="list.paymentPeriod = $event.target.value < 0 ? 0 : $event.target.value * 1">
                    <template #append> <span>天</span> </template>
                    </Input>
                </FormItem>
                <FormItem props="remark" label-for="introduction">

                    <template #label>备注<span v-color="'#808695'">（选填）</span>：</template>
                    <Input v-model="list.introduction" type="textarea" placeholder="请输入备注" />
                </FormItem>
                <FormItem :label="item.name + '：'" v-for="item in dictList" :key="item.id">
                    <!--  v-for="(itm, index) in showFile[item.code]" :key="index" -->
                    <div class="uploadImg" v-if="showFile[item.code].img">
                        <div v-viewer class="imgs">
                            <img :src="showFile[item.code].img" alt="" :data-source="showFile[item.code].img"
                                style="width: 100%;" />
                        </div>
                        <Icon type="md-close" @click="imgDel(showFile[item.code].ids, item.code)" class="uploadImg_icon"
                            size="25" />
                    </div>
                    <Upload :before-upload="(file) => beforeUploadFile(file, item)" action="">
                        <Button style="color:#ddd;">点击上传文件</Button>
                    </Upload>
                </FormItem>

                <FormItem style="text-align: center;">
                    <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存</Button>
                    <Button class="ivu-ml" @click="this.$router.back()">取消</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import {
    getAreaTreeApi,  // 城市列表
    getMerchantBaseSaveApi,  // 保存
    getMerchantBaseDetailApi,  // 基础详情
    getUserInfoPageApi,  // 用户列表
    getSysDictItemTreeApi,  // 资质类型

    getMerchantCertListApi,  // 资质列表
    getMerchantCertSaveApi,  // 资质保存
    postMerchantCertRemoveApi,  // 资质删除
} from '@/api/account.js'
import { jsonToArea } from '@/libs/util.js'
export default {
    name: 'addsupplier',
    data() {
        return {
            loading: false,
            treeData: [],  // 区域
            list: {},  // 添加信息
            id: '', // 编辑id
            userList: [],  // 用户列表
            dictList: [],  // 资质类型

            showFile: {},   // 展示用
            saveFile: {},   // 提交用
            fileIds: {},   // 图片ID

            ruleValidate: {
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                regionId: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                linkman: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                linkmanTel: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                linkmanIdNo: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { type: 'string', min: 18, message: '请输入正确的身份证号码', trigger: 'blur' }
                ],
                creditCode: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                paymentPeriod: [
                    { required: true, type: "number", message: '不能为空', trigger: 'blur' }
                ],
            },  // 表单验证

            editTitle: '添加供应商',
        }
    },
    created() {
        this.getTreeList();
        // this.getUserList();
        this.getDictItem();
        this.id = this.$route.query.id
        if (this.id) {
            this.editTitle = '编辑供应商'
            getMerchantBaseDetailApi(this.id).then(res => {
                // console.log(res);
                this.list = {
                    id: res.id,
                    name: res.name,
                    regionId: res.region ? res.region.code : '',
                    address: res.address ? res.address : '',
                    creditCode: res.creditCode ? res.creditCode : '',
                    userId: res.user ? res.user.id : '',

                    linkman: res.linkman ? res.linkman : '',
                    linkmanTel: res.linkmanTel ? res.linkmanTel : '',
                    afterSaleLinkman: res.afterSaleLinkman ? res.afterSaleLinkman : '',
                    afterSaleTel: res.afterSaleTel ? res.afterSaleTel : '',
                    afterSaleAddress: res.afterSaleAddress ? res.afterSaleAddress : '',
                    linkmanIdNo: res.linkmanIdNo ? res.linkmanIdNo : '',
                    introduction: res.introduction ? res.introduction : '',
                    paymentPeriod: res.paymentPeriod ? res.paymentPeriod : '',
                }
            })
        } else {
            this.editTitle = '添加供应商';
            this.list = {
                name: '',
                regionId: '',
                address: '',
                creditCode: '',

                linkman: '',
                linkmanTel: '',
                afterSaleLinkman: '',
                afterSaleTel: '',
                afterSaleAddress: '',

                introduction: '',
                paymentPeriod: '',
            }
        }
    },
    methods: {
        // 保存
        handleSubmit(name) {
            this.list.biz = 'medical';
            this.list.type = 'supplier';


            this.$refs[name].validate((valid) => {
                if (valid) {

                    getMerchantBaseSaveApi(this.list).then(res => {
                        if (res.id) {
                            this.$Message.success('添加/修改 成功')
                            this.id = res.id;
                            this.fileSaveFn();
                            this.$router.back();
                        }
                    }).catch(err => {
                        console.log(err);
                    })

                } else {
                    this.$Message.error('请先补全必填项 !');
                }
            })
        },
        // 获取城市列表
        getTreeList() {
            getAreaTreeApi().then(res => {
                let data = JSON.parse(JSON.stringify(res))
                this.treeData = jsonToArea(data, 'code', false)
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取资质
        getDictItem() {
            // dict=mer_cert_supplier
            getSysDictItemTreeApi({ dict: 'mer_cert_supplier' }).then(res => {
                let data = JSON.parse(JSON.stringify(res));
                this.dictList = data;
                let arr = data.map(item => {
                    return item.code
                })
                arr.forEach(item => {
                    this.showFile[item] = {};
                    this.saveFile[item] = '';
                    this.fileIds[item] = 0;
                });

                if (this.id) {
                    this.getImgList();
                };

            }).catch(err => {
                console.log(err);
            })
        },
        // 人员列表
        getUserList() {
            getUserInfoPageApi({ type: 'provider' }).then(res => {
                // console.log(res);
                let data = res.data
                this.userList = data
            })
        },
        // 文件保存
        fileSaveFn() {
            let that = this;
            for (const key in this.dictList) {
                if (Object.hasOwnProperty.call(this.dictList, key)) {
                    const element = this.dictList[key];
                    let formData = new FormData()

                    formData.append('merchantId', that.id);
                    formData.append('typeCode', element.id);
                    formData.append('name', element.name)

                    if (this.saveFile[element.code]) {

                        // this.saveFile[element.code].forEach(item => {
                        formData.append('file', this.saveFile[element.code]);
                        // })
                        if (element && key.length > 0) {
                            getMerchantCertSaveApi(formData, false).then(res => {
                                // console.log(res);
                                if (res.id) {
                                    this.$Message.success()
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    }

                }
            }
        },
        // 图片列表
        getImgList() {
            getMerchantCertListApi({
                'merchantId': this.id,
                // 'tag': key
            }).then(res => {
                let data = JSON.parse(JSON.stringify(res))
                if (data.length > 0) {
                    // this.showFile[key] = []
                    // data.forEach(itm => {
                    //     this.showFile[key].push({
                    //         ids: itm.id,
                    //         img: itm.filePath
                    //     })
                    // })
                    data.forEach(item => {
                        let key = item.type.code;
                        this.showFile[key] = {};
                        this.showFile[key] = {
                            ids: item.id,
                            img: item.filePath
                        };
                    });
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 图片删除
        imgDel(i, code) {
            if (i.length > 15) {
                postMerchantCertRemoveApi({ id: i }).then(res => {
                    if (res.success) {
                        this.$Message.success('操作成功！');
                        this.getImgList(code);
                        this.showFile[code] = '';
                    };

                }).catch(err => {
                    console.log(err);
                })
            } else {
                this.saveFile[code] = {};
                this.showFile[code] = '';
            }
        },
        // 上传文件
        beforeUploadFile(file, row) {
            file.ids = this.fileIds[row.code];
            // if (this.list.pic.length > 9) {
            //     this.$Message.error('请注意最多上传10张')
            // } else {
            this.showFile[row.code] = {
                ids: this.fileIds[row.code],
                img: window.URL.createObjectURL(file),
            };
            this.saveFile[row.code] = file;
            this.fileIds[row.code]++;
            return false;
            // }
        }
    },
}
</script>

<style scoped lang='less'>
.add_supplier {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .title_body {
        margin-bottom: 15px;
        text-align: center;
        font-weight: 600;
        font-size: 18px;
    }

    .uploadImg {
        position: relative;
        display: inline-block;
        margin-right: 16px;
        width: 19%;

        .imgs {
            margin: 10px 10px 0 0;
        }

        .uploadImg_icon {
            position: absolute;
            right: -3px;
            top: -3px;
            cursor: pointer;
        }

    }

    .ivu-form.ivu-form-label-right {
        width: 700px;
        margin: 0 auto;
    }
}
</style>