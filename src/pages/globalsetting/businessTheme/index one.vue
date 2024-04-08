<template>
    <div class='businessTheme'>
        <!-- <h5>业务主题</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="控件权限字典" hidden-breadcrumb />
        </div>
        <div class="theme_box">
            <Card dis-hover>
                <template #title>
                    命名说明：xx _ xxxx : '模块分组字母简称 ( 分组依据 例如：所处位置 )' _ '相关控件名称字母简写'；全局控制开关已'APP_' 命名开头，内部页面控件以'zy_'命名开头
                    <Poptip title="开关说明" placement="bottom">
                        <template #content>
                            <tbody>

                                <tr v-for="(item, key, index) in contentText" :key="index">{{ key }}: {{ item }}
                                </tr>

                                <!-- <tr> zy_yybj：医药保健</tr>
                                <tr> zy_ylfw：医疗服务</tr>
                                <tr> zy_yzp：益助拍</tr>
                                <tr> zy_sysc：善意商城</tr>
                                <tr> zy_gafw：关爱服务</tr>
                                <tr> zy_pltj：评论添加</tr>
                                <tr> zy_plzs：评论展示</tr>
                                <tr> zy_hzdw：合作单位</tr>
                                <tr> zy_fwdt：服务大厅</tr>
                                <tr> zy_chlb：超惠礼包</tr>
                                <tr> zy_zygc：助友广场</tr>
                                <tr> zy_qzzw：求职职位</tr>
                                <tr> zy_flj：福利金</tr>
                                <tr> zy_flwz：福利物资</tr>
                                <tr> zy_qtfl：其他福利</tr>
                                <tr> zy_DefRole：默认角色</tr>

                                <tr> zy_hdax：获得爱心</tr>
                                <tr> zy_kjye：卡金余额</tr>
                                <tr> zy_qbye：钱包余额</tr>
                                <tr> zy_qgjx：勤工俭学</tr>
                                <tr> zy_qybt：权益补贴</tr> -->

                            </tbody>
                        </template>
                        <Icon type="md-help-circle" />
                    </Poptip>
                </template>
                <template #extra>
                    <a size="small" href="javescript:;" @click.prevent="addType = 'right'; modal = true;">添加</a>
                </template>

                <Grid border hover :square="true" padding="0">

                    <GridItem v-for="(item, index) in data" :key="index" style="height: auto;width: 30%;"
                        v-show="index == 1">
                        <div class="card_main_box">
                            <div class="main_box_line" v-bg-color="'#ffd'">
                                <div v-width="'22%'">key</div>
                                <div v-width="'52%'">名称</div>
                                <div v-width="'26%'">类型</div>
                            </div>
                            <div class="main_box_line" v-for="(itm, indx) in item.children" :key="indx">
                                <div v-width="'22%'">
                                    <strong v-width="80">{{ itm.key }}</strong>
                                </div>
                                <div v-width="'52%'">
                                    <strong v-width="80">{{ contentText[itm.key] }}</strong>
                                </div>
                                <div v-width="'26%'">
                                    <span v-show="itm.valueType == 'switch'">开关</span>
                                    <span v-show="itm.valueType == 'text'">文本</span>
                                </div>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem v-for="(item, index) in data" :key="index" style="height: auto;width: 17.5%;">
                        <!-- <div class="card_head_title">
                            <strong> {{ item.title }}</strong>
                            <span v-if="index > 1" v-color="'#fa0'"> ( 优先级高于APP全端' ) </span>
                        </div> -->
                        <div class="card_main_box">
                            <div class="main_box_line" v-bg-color="'#eee'">
                                <div v-width="'6%'"></div>
                                <!-- <div v-width="'20%'">key</div>
                                <div v-width="'20%'">名称</div>
                                <div v-width="'15%'">类型</div> -->
                                <div v-width="'90%'">{{ item.title }}</div>
                            </div>
                            <div class="main_box_line" v-for="(itm, indx) in item.children" :key="indx">
                                <div v-width="'6%'">
                                    <Poptip confirm title="确认删除此项吗？" @on-ok="clearItemFn(item.type, itm, index)">
                                        <!-- <Icon type="ios-close-circle-outline" color="#ed0322" />
                                        <Icon type="md-close" /> -->
                                        <Tooltip content="请先关闭" placement="top" :disabled="itm.value == false">
                                            <Button size="small" type="error" shape="circle" ghost icon="md-close"
                                                :disabled="itm.value == false"></Button>
                                        </Tooltip>
                                    </Poptip>
                                </div>
                                <!-- <div v-width="'20%'">
                                    <Tooltip :content="contentText[itm.key]" placement="top">
                                        <strong v-width="80">{{ itm.key }}</strong>
                                    </Tooltip>
                                </div>
                                <div v-width="'20%'">
                                    <strong v-width="80">{{ contentText[itm.key] }}</strong>
                                </div>
                                <div v-width="'15%'">
                                    <span v-show="itm.valueType == 'switch'">开关</span>
                                    <span v-show="itm.valueType == 'text'">文本</span>
                                </div> -->
                                <div v-width="'90%'">
                                    <Switch v-if="itm.valueType == 'switch'" v-model="itm.value"
                                        @on-change=" saveFn(itm, item.type)">
                                    </Switch>
                                    <Input v-else v-model="itm.value" v-width="'100%'"></Input>
                                </div>
                            </div>
                            <!-- <div>
                                <Button icon="md-add" long
                                    @click="list.type = item.type; addType = 'table'; modal = true;">
                                    添加
                                </Button>
                            </div> -->
                        </div>
                    </GridItem>
                </Grid>
            </Card>
        </div>
        <Card :dis-hover="true">
            备注：微信小程序审核方面，可能需要临时下架某些类目和商品：（<a href="/goodwillGoods/goodsClassify">善意商城商品管理 -- 商品分类管理</a>、<a
                href="/healthCareGoods/goodsClassify">医药保健商品管理 -- 商品分类管理</a>），
            <strong>zy_DefRole</strong> 状态打开时为爱心人士、关闭则为残疾人士；
        </Card>
        <!-- 添加 -->
        <Modal v-model="modal" title="增加" width="380">
            <Form :model="list" label-position="right" :label-width="100">
                <!-- 
                    <Option value="appModule">APP全端 ( IOS , Android )</Option>
                    <Option value="MpWxModule">微信小程序</Option>
                    <Option value="appIOS">IOS版</Option>
                    <Option value="appAndroid">安卓版</Option>
                 -->
                <FormItem label="用户端" v-if="addType == 'right'">
                    <Select v-model="list.type">
                        <Option v-for="(item, index) in typeList" :key="index" :value="item.value">{{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="key：">
                    <Input v-model="list.key" placeholder="请输入KEY"
                        @on-blur="list.key = $event.target.value.trim()"></Input>
                </FormItem>
                <FormItem label="内容类型：">
                    <RadioGroup v-model="valueType">
                        <Radio label="switch">
                            <span>开关</span>
                        </Radio>
                        <Radio label="text">
                            <span>文本</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="内容：">
                    <Switch v-if="valueType == 'switch'" v-model="list.value"></Switch>
                    <Input v-else v-model="list.value" placeholder="请输入内容"> </Input>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="saveFn(list, list.type)" :disabled="!list.type">保存</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getSysSettingReadApi,
    postSysSettingSaveApi,
    postSysSettingClearApi,
} from '@/api/account'
export default {
    name: 'businessTheme',
    data() {
        return {
            modal: false,
            typeList: [
                { title: '微信小程序', value: 'MpWxModule' },
                { title: 'APP全端 ( IOS , Android )', value: 'appModule' },
                { title: 'IOS版', value: 'appIOS' },
                { title: 'Android版', value: 'appAndroid' },
            ],   // 端 类型
            valueType: 'switch',   // 内容类型
            list: {},   // 增加
            data: [],   // 数据
            dataAll: [],
            time1: null,   // 保存
            addType: 'table',   // 添加方式

            contentText: {
                zy_yybj: "医药保健",
                zy_ylfw: "医疗服务 ",
                zy_yzp: "益助拍 ",
                zy_sysc: "善意商城 ",
                zy_gafw: "关爱服务 ",
                zy_pltj: "评论添加 ",
                zy_plzs: "评论展示 ",
                zy_hzdw: "合作单位 ",
                zy_fwdt: "服务大厅 ",
                zy_chlb: "超惠礼包 ",
                zy_zygc: "助友广场 ",
                zy_qzzw: "求职职位 ",
                zy_flj: "福利金 ",
                zy_flwz: "福利物资 ",
                zy_qtfl: "其他福利 ",
                zy_DefRole: "默认角色 ",
                zy_hdax: "获得爱心 ",
                zy_kjye: "卡金余额 ",
                zy_qbye: "钱包余额 ",
                zy_qgjx: "勤工俭学 ",
                zy_qybt: "权益补贴 ",
            },   // 缩写说明

            ifShow: null,

        }
    },
    created() {
        this.getDataFn();
    },
    methods: {
        // 获取
        getDataFn() {
            this.data = [];
            this.typeList.forEach((item, index) => {
                this.getOnlyData(item, index)
            });
        },
        // 获取某一个
        getOnlyData(item, index) {
            this.data[index] = { title: item.title, type: item.value };
            this.dataAll[index] = { title: item.title, type: item.value };
            getSysSettingReadApi({ type: item.value }).then(res => {
                this.data[index].children = [];
                this.dataAll[index].children = [];
                for (const key in res) {
                    if (Object.hasOwnProperty.call(res, key)) {
                        let element = res[key];
                        console.log("🚀  getSysSettingReadApi  key:", key.includes('zy_'));
                        let valueType = '';
                        if (!key.includes('zy_')) {
                            if (element == 'false' || element == 'true') {
                                valueType = 'switch';
                                element = element == 'true' ? true : false;
                            } else {
                                valueType = 'text';
                                element = element;
                            }
                            this.data[index].children.push({ key: key, value: element, valueType });
                        } else {
                            if (element == 'false' || element == 'true') {
                                valueType = 'switch';
                                element = element == 'true' ? true : false;
                            } else {
                                valueType = 'text';
                                element = element;
                            }
                            this.dataAll[index].children.push({ key: key, value: element, valueType });
                        }
                    }
                };
                console.log(this.data);

                // this.globalData = uniqueKeys.filter(item => !item.includes('zy_')); //不含 zy_ 字段，表示全局控件,  包括 “APP_”
                // this.partData = uniqueKeys.filter(item => item.includes('zy_')); //含有 zy_ 字段，表示页面局部控件

                // this.tableData = JSON.parse(JSON.stringify(this.globalData))

                this.ifShow = false // 点击展开(false => true)与  点击折叠(true => false)



            })
        },
        // 保存
        saveFn(row, type = '') {
            if (this.time1) {
                clearTimeout(this.time1);
                this.time1 = null;
            }
            let data = JSON.parse(JSON.stringify(row));
            if (!data.type) {
                data.type = type;
            }
            if (data.valueType) {
                delete data.valueType;
            }
            if (data.value === undefined) {
                data.value = 'false';
            } else {
                if (typeof data.value === 'boolean') {
                    data.value = data.value.toString();
                }
            }
            let num = 0;
            this.typeList.forEach((item, index) => {
                if (item.value == type) num = index;
            })
            if (!data.key) {
                this.$Message.warning('请补充KEY值')
            } else {
                this.time1 = setTimeout(() => {
                    postSysSettingSaveApi(data).then(res => {
                        this.modal = false;
                        this.getOnlyData(this.typeList[num], num);
                        this.$Message.success('操作成功！');
                        this.list = {};
                    }).catch(err => {
                        this.$Message.error('操作失败!')
                    })
                }, 500);
            }
        },
        // 删除
        clearItemFn(type, row, index) {
            postSysSettingClearApi({ type, key: row.key }).then(res => {
                this.$Message.success('操作成功！')
                this.getOnlyData(this.typeList[index], index)
            })
        },
    }
}
</script>
<style scoped lang='less'>
.theme_box {
    margin-top: 24px;
    margin-bottom: 12px;

    strong {
        cursor: pointer;
    }

    .card_head_title {
        padding-bottom: 10px;
        padding-left: 10px;
        box-sizing: border-box;
        border-bottom: 2px solid #ddd;
    }

    .card_main_box {
        padding-top: 20px;
        box-sizing: border-box;

        .main_box_line {
            // height: 23px;
            max-height: 44px;
            line-height: 24px;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;

            padding: 10px;
            box-sizing: border-box;
            text-align: center;
            display: flex;
            align-items: center;

            // justify-content: space-around;
            .ivu-btn-icon-only {
                width: 14px;
                height: 14px;
                padding: 0;
                font-size: 9px;
            }

            span {
                padding-right: 8px;
                box-sizing: border-box;
            }
        }
    }

}
</style>