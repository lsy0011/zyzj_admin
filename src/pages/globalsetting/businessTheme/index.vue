<template>
    <div class='businessTheme'>
        <!-- <h5>业务主题</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="控件权限字典" hidden-breadcrumb />
        </div>
        <div class="theme_box">
            <Card dis-hover>
                <template #title>
                    命名说明：xx _ xxxx : '模块分组字母简称 ( 分组依据 例如：所处位置 )' _ '相关控件名称字母简写'；全局控制开关已'App_' 命名开头，内部页面控件以'zy_'命名开头
                    <Poptip title="开关说明" placement="bottom">
                        <template #content>
                            <tbody>
                                <tr v-for="(item, key, index) in contentText" :key="index">{{ key }}: {{ item }}
                                </tr>
                            </tbody>
                        </template>
                        <Icon type="md-help-circle" />
                    </Poptip>
                </template>
                <template #extra>
                    <a size="small" href="javescript:;" @click.prevent=" modal = true;">添加</a>
                </template>

                <Grid border hover :square="true" padding="0">

                    <GridItem style="height: auto; width: 100%;">
                        <div class="card_main_box">
                            <div class="main_box_line" v-bg-color="'#ffd'">
                                <div v-width="'12%'">key</div>
                                <div v-width="'30%'">名称</div>
                                <div v-width="'6%'">类型</div>
                                <div v-width="'12%'" v-for="(item, index) in typeList" :key="index"
                                    style="margin: 0 5px;">
                                    {{ item.title }}
                                </div>
                            </div>
                            <div class="main_box_line" v-for="(item, index) in data" :key="index">
                                <div v-width="'12%'">
                                    <strong v-width="80">{{ item.key }}</strong>
                                </div>
                                <div v-width="'30%'">
                                    <div>{{ contentText[item.key] }}</div>
                                </div>
                                <div v-width="'6%'">
                                    <span v-show="item.type == 'switch'">开关</span>
                                    <span v-show="item.type == 'text'">文本</span>
                                </div>
                                <div v-width="'12%'" style="margin: 0 5px;" v-for="(itm, indx) in arrType" :key="item">
                                    <div v-show="typeList[indx].codeList[item.key] !== undefined"
                                        style="display: flex; flex-wrap: nowrap;">
                                        <Poptip confirm title="确认删除此项吗？" @on-ok="clearItemFn(item, itm)">
                                            <Tooltip content="请先关闭" placement="top">
                                                <Button size="small" type="error" shape="circle" ghost v-margin="5"
                                                    icon="md-close"></Button>
                                            </Tooltip>
                                        </Poptip>
                                        <template v-if="(typeof typeList[indx].codeList[item.key] == 'boolean')">
                                            <!-- {{ typeList[indx].codeList[item.key] }} -->
                                            <Switch v-model="typeList[indx].codeList[item.key]"
                                                @on-change="setEditFn(typeList[indx].codeList[item.key], item.key, indx)">
                                            </Switch>
                                        </template>
                                        <template v-else>
                                            <Input v-model="typeList[indx].codeList[item.key]" icon="md-checkmark"
                                                v-width="'90%'"
                                                @on-click="setEditFn(typeList[indx].codeList[item.key], item.key, indx)"></Input>
                                        </template>
                                    </div>
                                    <div v-show="typeList[indx].codeList[item.key] === undefined">
                                        <Button type="small" icon="md-add" @click="repItemFn(item, indx)"> 补充</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GridItem>

                    <!-- <GridItem style="height: auto;width: 17.5%;">
                        <div class="card_main_box">
                            <div class="main_box_line" v-bg-color="'#eee'">
                                <div v-width="'6%'"></div>
                                <div v-width="'90%'">微信小程序</div>
                            </div>
                            <div class="main_box_line" v-for="(itm, indx) in data" :key="indx">
                                <div v-width="'9%'">
                                    <Tooltip content="请先关闭" placement="top">
                                        <Button size="small" type="error" shape="circle" ghost icon="md-close"
                                            :disabled="itm.value == false"></Button>
                                    </Tooltip>
                                </div>
                                <div v-width="'90%'"></div>
                            </div>

                        </div>
                    </GridItem> -->


                </Grid>
                <Button long v-margin="1" v-show="ifShow" @click="showDataAllFn(false)" title="开关模板设定好后, 无需经常改动">
                    <span v-color="'#000'">开关模板</span> 展开 》》》
                </Button>
                <Button long v-margin="1" v-show="!ifShow" @click="showDataAllFn(true)" title="开关模板设定好后, 无需经常改动">
                    <span v-color="'#000'">开关模板</span> 收起 》》》
                </Button>
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
                <FormItem label="用户端">
                    <Select v-model="list.type" multiple>
                        <Option v-for="( item, index ) in  typeList " :key="index" :value="item.value">
                            {{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="key：">
                    <Input v-model="list.key" placeholder="请输入KEY (默认前缀为' zy_ ')"
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
                    <Switch v-if="valueType == 'switch'" v-model="list.value" true-value="true" false-value="false">
                    </Switch>
                    <Input v-else v-model="list.value" placeholder="请输入内容"> </Input>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click=" setAddSaveFn()" :disabled="!list.type">保存</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
        <!-- 点击补充 -->
        <Modal v-model="repModal" title="补充" width="380">
            <Form :model="list" label-position="right" :label-width="100">
                <FormItem label="key：">
                    <strong>{{ list.key }}</strong>
                </FormItem>
                <FormItem label="内容类型：">
                    <RadioGroup v-model="list.type">
                        <Radio label="switch">
                            <span>开关</span>
                        </Radio>
                        <Radio label="text">
                            <span>文本</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="内容：">
                    <Switch v-if="list.type === 'switch'" v-model="list.value" true-value="true" false-value="false">
                    </Switch>
                    <Input v-else v-model="list.value" placeholder="请输入内容"> </Input>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="setAddSaveFn()" :disabled="!list.type">保存</Button>
                <Button @click="repModal = false; list = {}">取消</Button>
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
            modal: false,   // 添加
            typeList: [
                { title: '微信小程序', value: 'MpWxModule', codeList: {} },
                { title: 'APP全端 ( IOS , Android )', value: 'appModule', codeList: {} },
                { title: 'IOS版', value: 'appIOS', codeList: {} },
                { title: 'Android版', value: 'appAndroid', codeList: {} },
            ],   // 端 类型
            valueType: 'switch',   // 内容类型
            list: {},   // 增加
            oldTypeList: [],   // 旧址

            time1: null,   // 保存

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
                zy_fwlist: '服务/ 爱心服务',
                zy_shsh: '商户审核',
                zy_dtwz: '是用于控制中台文章显示',
                App_OtherVHide: '不使用“开关模板”的其他版本：输入要关闭的开关(key),多项以","隔开,例如:"zy_yybj,zy_ylfw"(不填,表示开关默认全开):',
                App_AuditV: '使用开关模板的版本号: 一般用作平台审核的版本控制(例如:"123" 或 "1.2.3")',
                App_AChannel: '使用开关模板的平台通道:输入通道名称(仅限Android专属包),多项以","隔开(参考值:"yyb,xiaomi,vivo,honor,baidu,huawei,oppo" )',
            },   // 缩写说明

            repModal: false, // 补充
            repIndex: 0,    // 补充索引
            ifShow: true,   // 展开
            data: [],   // 数据
            halfData: [],  // 主要类型
            allData: [],   // 总的类型

            arrType: ['MpWxModule', 'appModule', 'appIOS', 'appAndroid'],

            wxData: {},
            appAll: {},
            iosData: {},
            AndroidData: {},
        }
    },
    created() {
        this.getDataFn();
    },
    methods: {
        // 获取
        getDataFn() {
            this.data = [];
            this.halfData = [];
            this.allData = [];
            this.typeList.forEach((item, index) => {
                this.getOnlyData(item, index)
            });
        },
        // 获取某一个
        /**
         * type:四选一
         */
        getOnlyData(item, index) {
            getSysSettingReadApi({ type: item.value }).then(res => {

                for (const key in res) {
                    if (Object.hasOwnProperty.call(res, key)) {
                        const element = res[key];
                        if (element === 'false' || element === 'true') {
                            res[key] = element === 'false' ? false : true;
                        } else {
                            res[key] = element;
                        }
                    }
                }

                switch (item.value) {
                    case 'MpWxModule':
                        this.wxData = res;
                        break;
                    case 'appModule':
                        this.appAll = res;
                        break;
                    case 'appIOS':
                        this.iosData = res;
                        break;
                    case 'appAndroid':
                        this.AndroidData = res;
                        break;

                    default:
                        break;
                };
                this.typeList[index].codeList = []
                this.typeList[index].codeList = JSON.parse(JSON.stringify(res));

                this.oldTypeList = [];
                this.oldTypeList = JSON.parse(JSON.stringify(this.typeList));

                let allArr = JSON.parse(JSON.stringify({ ...this.wxData, ...this.appAll, ...this.iosData, ...this.AndroidData }));

                if (index === this.typeList.length - 1) {

                    for (const key in allArr) {
                        if (Object.hasOwnProperty.call(allArr, key)) {
                            const element = allArr[key];
                            if (!key.includes('zy_')) {
                                // 特殊类型   
                                this.halfData.push({
                                    key,
                                    value: element,
                                    type: element === 'true' || element === 'false' ? 'switch' : 'text',
                                });
                            } else {
                                // 总的数据类型
                                this.allData.push({
                                    key,
                                    value: element,
                                    type: typeof element === 'boolean' ? 'switch' : element === 'true' || element === 'false' ? 'switch' : 'text',
                                });
                            };
                        }
                    }

                    this.data = [];
                    this.data = JSON.parse(JSON.stringify(this.halfData))

                    if (!this.ifShow) {
                        this.showDataAllFn(false)
                    }

                };
            });
        },
        // 添加保存
        /**
         * type:四选一
         * key :标识
         * value:值
         */
        setAddSaveFn() {

            let { type, key, value } = this.list;

            if (!key.includes('zy_') && !key.includes('App_')) {
                key = 'zy_' + key;
            };

            if (value === undefined) {
                value = 'false';
            };

            if (typeof type === 'string') {
                type = [this.arrType[this.repIndex]];
            }

            type.forEach(item => {
                if (item) {
                    postSysSettingSaveApi({ type: item, key, value })
                        .then(res => {

                            this.modal = false;
                            this.repModal = false;
                            this.$Message.success('操作成功!');
                            this.getOnlyData(this.typeList[this.arrType.indexOf(item)], this.arrType.indexOf(item));
                        })
                }
            })

        },
        // 编辑保存
        setEditFn(value, key, index) {
            postSysSettingSaveApi({ type: this.arrType[index], key, value })
                .then(res => {
                    this.$Message.success('操作成功!');
                }).catch(err => {
                    this.$Message.error('操作失败!');
                    if (typeof value === 'boolean') {
                        this.getDataFn();
                    } else {
                        this.typeList[index].codeList[key] = this.oldTypeList[index].codeList[key];
                    };
                })

        },
        // 补充编辑
        repItemFn(item, indx) {
            console.log("🚀  repItemFn  item:", item);
            this.repIndex = indx;
            this.list = JSON.parse(JSON.stringify(item));
            this.repModal = true;

        },
        // 删除
        /**
         * type:四选一
         * key :标识
         */
        clearItemFn(item, type) {
            postSysSettingClearApi({ type, key: item.key }).then(res => {
                this.$Message.success('操作成功！');
                delete this.typeList[this.arrType.indexOf(type)].codeList[item.key];
                // this.getOnlyData(this.typeList[this.typeList.indexOf(type)], this.typeList.indexOf(type));
            }).catch(err => {
                this.$Message.error('操作失败！');

            })
        },
        // 展开
        showDataAllFn(flag) {
            // true 为收起  false 为展开
            this.ifShow = flag;

            if (!flag) {
                this.data.push(...this.allData);
            } else {
                this.data = JSON.parse(JSON.stringify(this.halfData));
            }

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
        // padding-top: 20px;
        // box-sizing: border-box;

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