<template>
    <div class='auctionDeal'>
        <!-- <h5>拍卖协议管理</h5> -->
        <!-- 将服务协议管理 和 参拍细则管理 总和为一个页面 -->
        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="拍卖协议管理" hidden-breadcrumb />
        </div>
        <div class="main_deal">

            <Menu mode="horizontal" :theme="theme" active-name="1">
                <MenuItem name="1" @click="key = 'deal'">
                <Icon type="ios-people" />
                服务协议管理
                </MenuItem>
                <MenuItem name="2" @click="key = 'rule'">
                <Icon type="ios-paper" />
                参拍细则管理
                </MenuItem>
                <MenuItem name="3" @click="key = 'explain'">
                <Icon type="md-information-circle" />
                竞拍说明
                </MenuItem>
                <MenuItem name="4" @click="key = 'issues'">
                <Icon type="md-list-box" />
                竞拍事项
                </MenuItem>
            </Menu>

            <div class="deal_box">
                <!-- <Input v-model="value" type="textarea" :rows="20" placeholder="请输入协议/规则" /> -->

                <div class="edit_bar" v-if="key != 'issues'">
                    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
                        mode="default" />
                    <Editor style="height: 332px; overflow-y: hidden" v-model="value" :defaultConfig="editorConfig"
                        mode="default" @onCreated="onCreated" />
                </div>
                <div class="edit_bar" v-else>
                    <Input v-model="issuesList[index]" v-for="(item, index) in issuesList" :key="index"
                        v-margin="5"></Input>
                    <div style="text-align: center;">
                        <Button @click="addArr()">添加补充事项</Button>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <Button type="primary" @click="saveDealFn()">保存修改</Button>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getSysSettingReadApi,   // 读取
    postSysSettingSaveApi,   // 写入
} from '@/api/account'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
    name: 'auctionDeal',
    components: { Editor, Toolbar },
    data() {
        return {
            editor: null,
            toolbarConfig: {},
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },
            type: 'auction',
            key: 'deal',     // deal:协议  rule:规则
            value: '',
            data: {},
            timer: null,
            issuesList: [],
        }
    },
    created() {
        this.getReadDeal();
    },
    watch: {
        key(newVal, oldVal) {
            
            if (newVal == 'issues') {
                this.issuesList = JSON.parse(this.data[newVal]);
            } else {
                this.value = this.data[newVal];
            }

        }

    },
    methods: {
        // 读取协议
        getReadDeal() {

            getSysSettingReadApi({ type: this.type }).then(res => {

                this.data = JSON.parse(JSON.stringify(res));
                this.value = res[this.key]
            })
        },
        // 写入保存
        saveDealFn() {

            this.value = JSON.stringify(this.issuesList);

            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                postSysSettingSaveApi({
                    type: this.type,
                    key: this.key,
                    value: this.value
                }).then(res => {
                    this.$Message.success('保存修改成功！')
                })
            }, 400);

        },
        addArr() {
            let flag = true;
            this.issuesList.forEach(item => {
                if (item == '') {
                    flag = false;
                }
            });
            if (flag) {
                this.issuesList.push('');
            } else {
                this.$Message.warning('已有空白项，请补充后再添加！');
            }

        },
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    },
}
</script>
<style scoped lang='less'>
.main_deal {
    margin-top: 24px;
    padding: 0 20px 20px;
    box-sizing: border-box;
    background-color: #fff;

    .deal_box {
        width: 60%;
        margin: 20px auto 0;

        // margin-top: 20px;   
        .edit_bar {
            width: 92.6%;
            height: 415px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
    }

    .ivu-menu-item {
        width: 24.7%;
        text-align: center;
    }
}
</style>