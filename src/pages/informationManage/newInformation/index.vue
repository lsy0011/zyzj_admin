<template>
    <div class='newInformation'>
        <!-- <h5>新建资讯</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="资讯管理" content="新建资讯" hidden-breadcrumb />
        </div>
        <div class="newInfor_main">
            <div class="main_title"><strong>新建发布</strong></div>
            <div class="main_body">

                <Form ref="formList" :model="list" :label-width="180" :rules="ruleValidate">
                    <FormItem label="标题：" prop="title">
                        <Input placeholder="请输入标题" v-model="list.title"></Input>
                    </FormItem>
                    <FormItem label="副标题：" prop="subhead">
                        <Input placeholder="请输入副标题" v-model="list.subhead"></Input>
                    </FormItem>
                    <FormItem label="作者：" prop="author">
                        <Input placeholder="请输入作者" v-model="list.author"></Input>
                    </FormItem>
                    <FormItem label="来源：" prop="from">
                        <Input placeholder="请输入来源" v-model="list.from"></Input>
                    </FormItem>
                    <FormItem label="外部地址：" prop="url">
                        <Input placeholder="请输入来源" v-model="list.url"></Input>
                    </FormItem>
                    <FormItem label="所属分类：" prop="categoryId">
                        <Select v-model="list.categoryId">
                            <Option :value="item.value" v-for="item in policyList" :key="item.id">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="文章内容：">
                        <div class="fauter_box" style="width: 100%; overflow: hidden;">
                            <div class="fauter_box" style="border: 1px solid #ccc;">
                                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor"
                                    :defaultConfig="toolbarConfig" mode="default" />
                                <Editor class="form_editor" v-model="list.longtext" :defaultConfig="editorConfig"
                                    mode="default" @onCreated="onCreated" />
                            </div>
                        </div>
                        <!-- <p>
                            <strong style="color: #ffa000;">友情提示：</strong>
                            <i style="color: #c7c9cd;"> 上传的图片宽度参差不齐时，没有与屏幕宽度保持一致，解决方案如下</i>
                        </p>
                        <p style="padding: 5px 60px;">点击图片(鼠标左击)，会弹出 "30%、50%、100% …… " 的浮窗，选择点击 "100%" 使图片与手机宽度保持一致。上传多张图时
                            重复该操作即可使多图保持同宽 (手机屏幕宽度)
                        </p> -->
                    </FormItem>
                    <FormItem label="上传图片：">
                        <div class="uploadImg" v-if="list.pic">
                            <div v-viewer>
                                <img :src="list.pic" alt="" :data-source="list.pic" style="width: 110px" />
                            </div>
                        </div>
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="上传附件：">
                        <div style="" class="uploadImg" v-if="list.pdf">
                            <a :href="list.pdf" target="_blank" style="font-size: 32px;margin-right: 10px;"
                                title="点击预览">
                                {{ list.pdfName }}
                            </a>
                            <Icon type="ios-trash-outline" size="20" color="#ff0000" @click="delPdfFn"
                                title="已经保存的文件不允许删除，但可以替换" />
                        </div>
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload1">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </FormItem>
                </Form>
                <!-- <Row style="border-top: 1px solid #ccc; padding: 15px 0;">
                    <Col span="24" style="text-align: center;">
                    </Col>
                    <Col span="24" style="text-align: center;">
                    </Col>
                </Row> -->
            </div>
            <div class="footer_box">
                <Space>
                    <Button type="primary" @click="submitFn('formList')" style="margin-right: 10px;">确认</Button>
                    <Button @click="this.$router.back()">返回</Button>
                </Space>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getCmsCategoryPolicyListApi,  // 分类列表
    postCmsContentPolicySaveApi,  // 保存
    getCmsContentPolicyDetailApi,  // 详情
} from '@api/account.js'

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
    name: 'newInformation',
    components: { Editor, Toolbar },
    data() {
        return {
            toolbarConfig: {},
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },
            editor: null,
            list: {
                pic: '',// 提交的图片
                pdf: '',// 提交的文件
                pdfName: '',// 提交的文件名
                longtext: ''
            }, // 提交的内容
            pic: '', // 上传的图片
            pdf: '', // 上传的附件
            policyList: [], // 分类列表
            essayId: '', // 详情的id
            uploadImgKey: 0,
            uploadImgKey1: 0,

            ruleValidate: {
                title: [
                    { required: true, message: '请填写标题', trigger: 'blur' }
                ],
                subhead: [
                    { required: true, message: '请填写副标题', trigger: 'blur' },
                ],
                author: [
                    { required: true, message: '请填写作者', trigger: 'blur' }
                ],
                from: [
                    { required: true, message: '请填写来源', trigger: 'blur' }
                ],
                url: [
                    { required: false, message: '请填写外部地址', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请选择分类', trigger: 'change' }
                ],

            }
        }
    },
    created() {
        this.essayId = this.$route.query.id;
        this.getClassifyList();
        if (this.essayId) {
            getCmsContentPolicyDetailApi(this.essayId, 'information').then(res => {
                // console.log(res);
                this.list = {
                    author: res.author ? res.author : '',
                    categoryId: res.category ? res.category.id : '',
                    longtext: res.longtext ? res.longtext : '',
                    subhead: res.subhead ? res.subhead : '',
                    title: res.title ? res.title : '',
                    from: res.from ? res.from : '',
                    url: res.url ? res.url : '',
                    issueTime: res.issueTime ? res.issueTime : '',
                    pic: res.file && res.file.cover1 ? res.file.cover1 : '',
                    pdf: res.pdfFile ? res.pdfFile : '',
                    pdfName: 'pdf文件',
                }
            })
        } else {
            this.list = {};
        }
    },
    methods: {
        // 资讯分类 列表
        getClassifyList() {
            getCmsCategoryPolicyListApi().then(res => {
                let data = JSON.parse(JSON.stringify(res));
                data.forEach(item => {
                    item.label = item.name;
                    item.value = item.id;
                });
                this.policyList.push(...data);
                // console.log(res);
            })
        },
        // 提交
        submitFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    let formData = new FormData();
                    formData.append('id', this.essayId || '');
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key == 'pic' && this.pic) {
                                formData.append('upload[cover1]', this.pic);
                            } else if (key == 'pdf' && this.pdf) {
                                formData.append(key, this.pdf);
                            } else {
                                formData.append(key, element);
                            };
                        };
                    };

                    // 保存时间
                    let date = Date.parse(new Date());
                    formData.append('issueTime', this.$Date(date).format('YYYY-MM-DD'));

                    postCmsContentPolicySaveApi(formData, false)
                        .then(res => {
                            if (res.id) {
                                this.$Message.success('添加成功');
                                this.$router.back();
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });

                } else {
                    this.$Message.error('请先补充必填项!');
                }
            });

        },
        // 选择状态
        apiChangeGet(type) {
            this.policyList = [];
            getCmsCategoryPolicyListApi(type).then(res => {
                let data = JSON.parse(JSON.stringify(res));
                data.forEach(item => {
                    item.label = item.name;
                    item.value = item.id;
                });
                this.policyList.push(...data);
            })
        },
        // 上传图片
        handleBeforeLicenseUrlUpload(file) {
            file.ids = this.uploadImgKey;
            this.list.pic = window.URL.createObjectURL(file);
            this.pic = file;
            this.uploadImgKey++;
            return false;
        },
        // 上传图片  pdf文件
        handleBeforeLicenseUrlUpload1(file) {

            let fileType = file.type.split('/')[0];
            if (fileType == 'image' || fileType == 'video') {
                this.$Message.warning('请上传文件（pdf）格式');
            } else {
                this.list.pdf = window.URL.createObjectURL(file);
                this.list.pdfName = file.name;
                this.pdf = file;
                this.uploadImgKey1++;
            }
            return false;
        },
        // 图片删除
        imgDel(arr, item, index) {
            if (item.id) {
                let data = {
                    id: this.essayId,
                    key: item.id,
                };
                // postServiceInfoFileRemoveApi(data).then((res) => {
                this.$Message.success("删除成功");
                // this.list.img = ''
                arr.splice(index, 1);
                // });
            } else {
                arr.splice(index, 1);
                for (let i = 0; i < this.pic.length; i++) {
                    if (this.pic[i].ids === item.ids) {
                        this.pic.splice(i, 1);
                        break;
                    }
                }
            }
        },
        // pdf文件删除
        delPdfFn() {
            let titType = this.list.pdf.slice(0, 4);
            if (titType == 'http') {
                this.$Message.warning('已经保存的文件暂不允许删除，但可以替换')
            } else {
                this.list.pdf = '';
                this.list.pdfName = '';
                this.pdf = '';
            };
        },
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    },
    beforeDestroy() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
}
</script>
<style scoped lang='less'>
.newInfor_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .main_title {
        width: 100%;
        text-align: center;
        font-size: 20px;
        margin-bottom: 15px;
    }

    .main_body {
        width: 61%;
        margin: 0 auto;

        .uploadImg {
            position: relative;
            display: inline-block;
            margin-right: 16px;

            .uploadImg_icon {
                position: absolute;
                right: -10px;
                top: -10px;
                cursor: pointer;
            }
        }
    }

    .footer_box {
        border-top: 1px solid #ddd;
        text-align: center;
        padding-top: 20px;
    }
}

.fauter_box {
    height: 440px;
}

@media (min-width: 2930px) {


    .form_editor {
        height: 396px;
        overflow-y: hidden;
    }
}

@media (min-width: 1826px) and (max-width: 2929px) {
    .form_editor {
        height: 355px !important;
        overflow-y: hidden;
    }
}

@media (min-width: 1500px) and (max-width: 1825px) {
    .form_editor {
        height: 315px !important;
        overflow-y: hidden;
    }
}

@media (max-width: 1495px) {
    .form_editor {
        height: 276px !important;
        overflow-y: hidden;
    }
}
</style>