<template>
    <div>
        <!-- <h5>运费模板设置</h5> -->
        <div class="commonality">
            <p class="com-title">全局设置</p>
            <p class="com-min">运费模板设置</p>
        </div>
        <main class="faresset">
            <Row>
                <Col span="24">
                <div class="head-btn">
                    <Button type="info"
                        style="height: 36px; width: 113px; text-align: center; line-height: 36px;">新建运费模板</Button>
                </div>
                <div class="cell">
                    <Table border :columns="columns" :data="data">
                        <template #action="{}">
                            <Space split>
                                <Link>复制</Link>
                                <Link>编辑</Link>
                                <Link style="color:red;">删除</Link>
                                <Link>使用情况</Link>
                            </Space>
                        </template>
                    </Table>
                </div>
                <div class="all-num">
                    共有 {{ allNum }} 条
                </div>
                </Col>
            </Row>
            <div class="four-modul">
                <div class="modul-item">
                    <h5 class="item-head">模块基础信息</h5>
                    <div class="item-main">
                        <div class="main-left">
                            <div style="height: 32px; line-height: 40px;">
                                <Icon type="md-medical" color="red" size="4px" />模板名称
                            </div>
                            <div style="margin-top: 23px;">
                                <Icon type="md-medical" color="red" size="4px" />发货地
                            </div>
                        </div>
                        <div class="main-rig">
                            <div>
                                <Input v-model="demoName" placeholder="请输入内容" style="width: 90%" />0/50
                            </div>
                            <div style="margin-top: 18px;">
                                <p style="line-height: 36px;">发货地与您的实际发货地不符，可能会导致物流投诉</p>
                            </div>
                            <!-- 选择框 -->
                            <div>
                                <Select v-model="model" filterable :remote-method="remoteMethod3" default-label="北京"
                                    :loading="loading3">
                                    <Option v-for="(option, index) in placeArea" :value="option.value" :key="index">
                                        {{ option.label }}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div class="modul-foot">
                        <span>模板类型</span>
                        <span>自定义模板</span>
                    </div>
                </div>
                <div class="modul-item">
                    <h5 class="item-head">包邮配送区域</h5>
                    <div class="item-btn">
                        <Button type="info">全选</Button>
                        <h5>已选择{{ areaNum }}个区域</h5>
                    </div>
                    <div class="area-check">
                        <div>

                        </div>
                    </div>
                </div>
                <div class="modul-item">
                    <h5 class="item-head">买家付邮费区域</h5>
                    <div class="item-three">
                        <div class="billing-method">
                            <span class="billing" style="display: inline-block;">计费方式</span>
                            <Space direction="vertical" size="large">
                                <RadioGroup v-model="animal">
                                    <Radio label="按件数计费"></Radio>
                                    <Radio label="按重量计费"></Radio>
                                    <Icon type="ios-help-circle-outline" />
                                </RadioGroup>
                            </Space>
                            <p class="billing-title">如订单中存在多种运费模板，系统会选取其中最优的模板计算运费，并按商品件数均分到各子单。</p>
                        </div>
                        <Alert type="warning" show-icon>您已选择配送港澳台地区 ，受海关、物流、当地政策的限制，部分商品是无法出关或在大陆地区以外无法进行购买，请关注禁运
                            清单及相关法律法规，避免错误设置运费模板，造成损失。</Alert>
                        <div class="set-foot">
                            <div class="del-yf"><Button type="error" ghost>删除</Button> </div>
                            <div class="set-yf">
                                <div class="set-area">台湾</div>
                                <div class="set-table">
                                    <input type="number" min="0">件内<input type="number"
                                        min="0">元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    每增加<input type="number" min="0">件,运费增加<input type="number" min="0">元
                                    <div style="margin:10px 5px;">
                                        <Checkbox v-model="single">指定条件包邮</Checkbox>
                                        满<input type="number" min="0">
                                        <select>
                                            <option value="">件</option>
                                        </select>包邮 <icon type="ios-help-circle-outline"></icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button type="info" style="margin: 15px 0;">+设置指定区域运费</Button>
                    </div>
                </div>
                <div class="modul-item">
                    <h5 class="item-head">不配送区域<icon type="ios-help-circle-outline"></icon>
                    </h5>
                    <div class="four-area">
                        <div class="four-area-first">
                            <h6>香港</h6>
                            <Button type="error">删除</Button>
                        </div>
                        <div class="four-area-second">
                            <RadioGroup v-model="whys">
                                <Radio label="因距离远导致的运费上升"></Radio>
                                <Radio label="因商品重量大导致的运费上升"></Radio>
                                <Radio label="合作快递不配送该区域"></Radio>
                                <Radio label="合作快递该区域服务差"></Radio>
                                <Radio label="其他"></Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="four-area">
                        <div class="four-area-first">
                            <h6>澳门</h6>
                            <Button type="error">删除</Button>
                        </div>
                        <div class="four-area-second">
                            <RadioGroup v-model="whys">
                                <Radio label="因距离远导致的运费上升"></Radio>
                                <Radio label="因商品重量大导致的运费上升"></Radio>
                                <Radio label="合作快递不配送该区域"></Radio>
                                <Radio label="合作快递该区域服务差"></Radio>
                                <Radio label="其他"></Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="sub-btn">
                        <Button type="info">提交</Button>
                        <Button>取消</Button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import {
    getFreightTemplateListApi,  // 运费模板列表
} from '@/api/account';
export default {
    name: 'globalsetting-faresset',
    data() {
        return {
            columns: [
                {
                    title: '模板名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '计费方式',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', params.row.feeMode.name)
                    }
                },
                {
                    title: '最后编辑时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.$Date(params.row.timeModified).format('YYYY-D-M  HH:mm:ss'))
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center'
                }
            ], // 表头
            data: [], // 运费列表
            allNum: 0,
            demoName: '',  // 模板名称
            placeArea: [], // 发货地
            model: 'beijing',
            loading3: false,
            // 已选择区域数
            areaNum: 31,
            animal: '按件数计费', // 第三模块的单选
            list2: [
                {
                    value: 'beijing',
                    label: '北京'
                },
                {
                    value: 'shanghai',
                    label: '上海'
                },
                {
                    value: 'shenzhen',
                    label: '深圳'
                },
                {
                    value: 'hangzhou',
                    label: '杭州'
                },
                {
                    value: 'guangzhou',
                    label: '广州'
                }
            ], // 北京
            single: false, // 指定条件包邮
            // 第四模块第一个单选按钮
            whys: "因距离远导致的运费上升"
        }
    },
    created() {
        this.getFaresList()
    },
    methods: {
        remoteMethod3(query) {
            if (query !== '') {
                this.loading3 = true;
                setTimeout(() => {
                    this.loading3 = false;
                    this.options3 = this.list2.filter(item => item.label.indexOf(query) > -1);
                }, 200);
            } else {
                this.options3 = [];
            }
        },
        getFaresList() {
            getFreightTemplateListApi().then(res => {
                // console.log(res);
                this.allNum = res.length + 1
                this.data = res
            })
        },
    }
}
</script>
<style scoped lang="less">
.faresset {
    padding: 25px 25px 0px;
    box-sizing: border-box;

    .ivu-col.ivu-col-span-24 {
        width: 100%;
        height: 340px;
        background: #fff;
        // border: 1px solid #000;

        .head-btn {
            width: 100%;
            padding: 24px;
            box-sizing: border-box;
        }

        .cell {
            width: 71%;
            padding-left: 24px;

            table {
                border-collapse: collapse;
                width: 100%;

                tr {
                    .textColor {
                        color: #2d8cf0;
                    }
                }

                th {
                    height: 40px;
                    width: 300px;
                    background-color: #eee;
                }

                td {
                    height: 40px;
                    text-align: center;
                }
            }
        }

        .all-num {
            width: 71%;
            padding: 15px 0 0;
            text-align: right;
            font-weight: 600;
        }

    }

    .four-modul {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .modul-item {
            width: 49.5%;
            background-color: #fff;

            .item-head {
                font-size: 18px;
                padding: 24px;
                box-sizing: border-box;
            }

            // 第一板块
            &:nth-child(1) {
                height: 300px;
                margin: 20px 0;

                .item-main {
                    width: 100%;
                    height: 160px;
                    // border: #7da3f4 1px solid;
                    display: flex;
                    flex-wrap: wrap;
                    // align-items: center;
                    justify-content: center;

                    .main-left {
                        width: 20%;
                        height: 100px;
                        padding: 0 5px;
                        font-weight: 600;
                        font-size: 15px;
                        box-sizing: border-box;
                        text-align: right;
                    }

                    .main-rig {
                        width: 79%;
                        padding: 0 15px;
                    }

                    .ivu-icon.ivu-icon-md-medical {
                        display: inline-block;
                        transform: scale(0.5);
                    }
                }

                .modul-foot {
                    width: 100%;
                    font-weight: 600;
                    font-size: 15px;
                    padding: 10px 20px;
                    box-sizing: border-box;

                    span {
                        display: inline-block;
                        margin: 0 20px;
                    }
                }
            }

            // 第二板块
            &:nth-child(2) {
                height: 300px;
                margin: 0 0 0 15px;

                .item-btn {
                    width: 90%;
                    display: flex;
                    justify-content: space-between;

                    button {
                        margin-left: 40px;
                    }
                }
            }

            // 第三块
            &:nth-child(3) {
                .item-three {
                    width: 90%;
                    margin: 0 auto;

                    .billing-method {
                        width: 100%;

                        .billing {
                            font-weight: 600;
                            margin-right: 10px;
                        }
                    }

                    .billing-title {
                        width: 100%;
                        text-align: left;
                        font-size: 13px;
                        color: #bbb;
                    }

                    .ivu-alert.ivu-alert-warning.ivu-alert-with-icon {
                        margin: 10px 0;
                    }

                    .set-foot {
                        height: 135px;
                        border: #eee solid 1px;

                        .del-yf {
                            width: 90%;
                            margin: 10px auto 0;
                            text-align: right;
                        }

                        .set-yf {
                            width: 100%;
                            display: flex;
                            align-items: center;

                            .set-area {
                                width: 60px;
                                height: 65px;
                                line-height: 65px;
                                background-color: #b6e6fb;
                                font-size: 17px;
                                text-align: center;

                            }

                            .set-table {
                                width: 80%;
                                height: 65px;
                                margin-left: 10px;

                                select,
                                input {
                                    width: 60px;
                                    text-align: center;
                                    border: #bbb solid 1px;
                                    border-radius: 3px;
                                    margin: 0 5px;
                                    outline-style: none;
                                }
                            }
                        }
                    }
                }
            }

            &:nth-child(4) {
                height: 383.7px;
                margin: 0 0 0 15px;
                box-sizing: border-box;

                .four-area {
                    margin: 0 25px 20px 25px;
                    padding: 0 20px;
                    border: #bbb solid 1px;

                    .four-area-first {
                        width: 100%;
                        height: 55px;
                        border-bottom: #bbb solid 1px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        h6 {
                            font-size: 16px;
                        }
                    }

                    .four-area-second {
                        height: 55px;
                        line-height: 55px;

                        .ivu-radio-wrapper {
                            font-size: 10px;
                            margin-right: 5px;
                        }
                    }
                }

                .sub-btn {
                    width: 100%;
                    text-align: center;

                    button {
                        margin: 0 10px;
                    }
                }
            }
        }
    }

}
</style>