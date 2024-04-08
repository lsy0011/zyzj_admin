<template>
    <div class='rule'>
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="用户协议设置" hidden-breadcrumb />
        </div>
        <Card class="rule_main">
            <template #title>
                用户协议设置
            </template>

            <template #extra>
                <a href="#" @click.prevent="list = {}; modal = true; ifadd = true;">
                    补充
                </a>
            </template>
            <div class="ivu-text-center" style="margin-bottom: 20px; ">
                <Table border :columns="columns" :data="data" :loading="loading">

                    <template #lookDetail="{ row }">
                        <a @click="lookModalFn(row)">查看详情</a>
                    </template>

                    <template #actionSlot="{ row }">
                        <Button type="primary" @click="editFn(row)" style="margin-right: 10px;">编辑</Button>
                    </template>
                </Table>
            </div>
        </Card>
        <Modal v-model="modal" title="新建/编辑" width="800">
            <Form :model="list" :label-width="80">
                <FormItem label="标识：" v-if="ifadd">
                    <Select v-model="addType" placeholder="请输入约定的英文标识">
                        <Option v-for="(item, index) in typeArr" :key="index" :value="item.code">{{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="标题：">
                    <Input v-model="list.title" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem label="内容：">
                    <div style="width: 686px;border: 1px solid #ccc">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
                            mode="default" />
                        <Editor style="height: 300px; overflow-y: hidden" v-model="list.longtext"
                            :defaultConfig="editorConfig" mode="default" @onCreated="onCreated" />
                    </div>
                </FormItem>
            </Form>

            <template #footer>
                <Button type="primary" class="ivu-mr-16" @click="SubmitFn()">保存</Button>
                <Button @click="modal = false">取消</Button>
            </template>
        </Modal>
        <Modal v-model="lookModal" :title="detail.title || '协议标题'" width="430">
            <div class="modal_content" v-html="detail.longtext"></div>

            <template #footer>
                <div>

                </div>
            </template>
        </Modal>
    </div>
</template>

<script>
import {
    postCmsContentPolicySaveApi, // 协议保存
    getContentTypeLstestApi, // 协议详情
} from '@api/account'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
    name: 'rule',
    components: { Editor, Toolbar },
    data() {
        return {
            columns: [
                {
                    title: '标题',
                    key: 'title',
                    align: 'center'
                },
                {
                    title: '内容',
                    align: 'center',
                    slot: 'lookDetail'
                },
                {
                    title: '上传时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    align: 'center'
                }
            ],
            data: [],
            loading: false,
            modal: false,
            lookModal: false,
            editor: null,
            toolbarConfig: {},
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },
            list: { unique: 'true' },
            status: true,
            addType: '', // 新增时标识
            ifadd: false,
            typeArr: [
                { code: 'privacy', title: '隐私协议' },
                { code: 'userAgreement', title: '用户协议' },
                { code: 'ChildrensPS', title: '儿童隐私保护申明' },
            ], // 涵盖所有协议字段，如后续添加，在该处补充 （隐私协议privacy，用户协议userAgreement）

            detail: {}
        }
    },
    created() {
        this.getListFn();
    },
    unmounted() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
    methods: {
        lookModalFn(row) {
            this.detail = row
            this.lookModal = true
        },
        // 保存
        getListFn() {
            this.data = [];
            this.typeArr.map(item => {
                getContentTypeLstestApi(item.code).then(res => {
                    this.data.push(res);
                })
            })
        },
        // 编辑
        editFn(row) {
            this.ifadd = false;
            if (row) {
                let data = row

                this.addType = data.type
                this.list = {
                    title: data.title ? data.title : '',
                    longtext: data.longtext ? data.longtext : ''
                }
            } else {
                this.list = {
                    title: '',
                    longtext: '',
                    unique: 'true'
                }
            }
            this.modal = true
        },
        // 新建
        addFn() {
            this.modal = true;
            this.ifadd = true
            this.addType = ""

            this.list = {
                title: '',
                longtext: '',
                unique: 'true'
            }
        },
        // 新建 | 编辑  保存
        SubmitFn() {
            // if (this.ifadd && this.typeArr.indexOf(this.addType) == -1) {
            //     this.typeArr.push(this.addType)  // 在线协议数据
            // }
            this.list.unique = 'true';

            let formdata = new FormData();
            for (const key in this.list) {
                if (Object.hasOwnProperty.call(this.list, key)) {
                    const element = this.list[key];
                    formdata.append(key, element);
                };
            };
            postCmsContentPolicySaveApi(formdata, false, this.addType).then(res => {
                if (res) {
                    this.$Message.success('保存成功');
                    this.getListFn();
                    this.modal = false;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    },
}
</script>

<style scoped lang='less'>
.rule_main {
    margin-top: 24px;

    .modal_content {
        width: 100%;
        height: 660px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 5px;
            border-radius: 8px;
        }

        /* 滚动槽 */
        &::-webkit-scrollbar-track {
            /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
            background-color: #ffffff;
        }

        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background: #d3d3d3;
            /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
        }
    }
}

.modal_line {
    display: flex;
    margin-bottom: 15px;
    line-height: 32px;

    strong {
        display: inline-block;
        width: 50px;
    }
}
</style>

<style src="@wangeditor/editor/dist/css/style.css"></style>