<template>
    <div class='buyNotes'>
        <!-- <h5>购买须知</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="购买须知" hidden-breadcrumb />
        </div>
        <div class="notes_main">
            <div class="main_titel">
                <strong>设置购买须知</strong>
            </div>
            <div class="main_details">
                <!-- <richText :details="list.details"></richText> -->
                <div style="border: 1px solid #ccc; height: 382px;">
                    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
                        mode="default" />
                    <Editor style="height: 339px; overflow-y: hidden" v-model="details" :defaultConfig="editorConfig"
                        mode="default" @onCreated="onCreated" />
                </div>
            </div>
            <div class="main_btn">
                <Button @click="submitFn()" type="primary" style="width: 120px;">确认</Button>
            </div>
        </div>
    </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
    postSysSettingSaveApi,   // 写入
    getSysSettingReadApi,   // 读取
} from '@/api/account'
export default {
    name: 'buyNotes',
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
            details: `<p><strong>有效期</strong></p>
                    <p>购买后1年内有效</p>
                    <p><strong>预约信息</strong></p>
                    <p>请您提前一天预约，预约保留详情请您咨询商家</p>
                    <p><strong>使用人数</strong></p><p>每张团购券不限使用人数</p>
                    <p><strong>规则提醒</strong></p>
                    <p>可与其他优惠同享</p>
                    <p><strong>温馨提醒</strong></p>
                    <p>如需团购券发票，请您在消费时间向商户咨询</p>
                    <p>为了保障您的权益，建议只用助友之家平台线上支付，若使用其他支付方式导致纠纷，本平台不承担任何责任，感谢您的支持！</p>
                    `,
            type: 'notes',
        }
    },
    created() {
        this.getDetailsFn();
    },
    methods: {
        // 获取
        getDetailsFn() {

            getSysSettingReadApi({ type: this.type }).then(res => {
                this.details = res.buynotes;
            })
        },

        // 保存
        submitFn() {

            postSysSettingSaveApi({ type: this.type, key: 'buynotes', value: this.details }).then(res => {
                this.$Message.success('保存成功！')
            })

        },
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    },
    beforeDestroy() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
        this.timer = null
    },
}
</script>
<style scoped lang='less'>
.notes_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .main_titel {
        font-size: 20px;
        margin-bottom: 15px;
        text-align: center;
    }

    .main_details {
        width: 85%;
        margin: 0 auto;
        height: 382px;
        overflow: hidden;
    }

    .main_btn {
        margin-top: 20px;
        text-align: center;
    }
}
</style>