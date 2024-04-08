<template>
    <div class='spreadAwardRule'>
        <!-- <h5>推广奖励规则</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="推广奖励规则管理" content="推广奖励规则" hidden-breadcrumb />
        </div>
        <!-- 
        <div class="rule_main">
            <Row>
                <Col span="24">
                <Button type="primary">+新增规则</Button>
                <Button type="success" style="margin: 0 15px;">确认</Button>
                <Select style="width: 200px;">
                    <Option value="1">触发</Option>
                </Select>
                <div style="display: inline-block;margin: 0 15px;">
                    <strong>奖励:</strong>
                    <Input placeholder="整数" type="number" style="margin: 0 5px; width:60px;"></Input>
                    <strong>个</strong>
                </div>
                </Col>
            </Row>
            <Row>
                <Col span="24" style="margin: 20px 0;">
                <strong style="font-size: 18px;">获得善益卡金额规则:</strong>
                </Col>
            </Row>
            <Row style="margin-top: 15px;">
                <Col span="1">
                <Switch></Switch>
                </Col>
                <Col span="22">
                <strong>用户注册: 奖励：</strong>￥
                <Input placeholder="整数" size="small" type="number" style="margin: 0 5px; width:60px;">
                </Input>
                <strong>备注：成功注册APP奖励善益卡金额</strong>
                </Col>
            </Row>
            <RadioGroup v-model="phone" style="width: 100%;">
                <Row style="margin-top: 15px;">
                    <Col span="1">
                    <Switch></Switch>
                    </Col>
                    <Col span="1"><strong>推荐人奖励：</strong></Col>
                    <Col span="17">
                    <Radio label="apple">
                        <strong>推荐爱心用户奖励:</strong>￥
                        <Input placeholder="整数" size="small" type="number" style="margin: 0 5px; width:60px;"></Input>
                        <strong>个/人</strong>
                        <strong style="font-size: 14px; margin-left: 20px; color: #ccc;">备注：成功推荐爱心用户注册</strong>
                    </Radio>
                    </Col>
                </Row>
                <Row style="margin-top: 15px;">
                    <Col span="2">
                    </Col>
                    <Col span="16">
                    <Radio label="windows">
                        <strong>推荐残疾人用户奖励:</strong>￥
                        <Input placeholder="整数" size="small" type="number" style="margin: 0 5px; width:60px;"></Input>
                        <strong>个/人</strong>
                        <strong style="font-size: 14px; margin-left: 20px; color: #ccc;">备注：成功推荐残疾人用户注册</strong>
                    </Radio>
                    </Col>
                </Row>
                <Row style="margin-top: 15px;">
                    <Col span="2">
                    </Col>
                    <Col span="16">
                    <Radio label="android">
                        <strong>推荐残疾人家属用户注册奖励:</strong>￥
                        <Input placeholder="整数" size="small" type="number" style="margin: 0 5px; width:60px;"></Input>
                        <strong>个/人</strong>
                        <strong style="font-size: 14px; margin-left: 20px; color: #ccc;">备注：成功推荐残疾人家属用户注册</strong>
                    </Radio>
                    </Col>
                </Row>
            </RadioGroup>
        </div>
         -->

        <div class="rule_main">

            <!-- <Row>
    <Col span="24">
    <Button type="primary" @click="modal = true;"> 修改规则</Button>
    <Button type="success" style="margin: 0 15px;">确认</Button>
    <Select style="width: 200px;">
        <Option value="1">触发</Option>
    </Select>
    <div style="display: inline-block;margin: 0 15px;">
        <strong>奖励:</strong>
        <Input placeholder="整数" type="number" style="margin: 0 5px; width:60px;"></Input>
        <strong>个</strong>
    </div>
    </Col>
</Row> -->
            <Row>
                <Col span="24" style="margin: 0 0 20px 0;">
                <Space size="large">
                    <strong style="font-size: 18px;">获得善益卡金额规则:</strong>
                    <Button size="small" type="primary" ghost @click="modal = true;"> 修改规则</Button>
                </Space>
                </Col>
            </Row>
            <Row v-for="(item, index) in ruleList" :key="index" style="margin-top: 15px;">
                <Col span="1">
                <div v-if="item.status">
                    <Switch v-model="item.status.code" true-value="enabled" false-value="disabled"
                        @on-change="(i) => changeStatus(i, item)"></Switch>
                </div>
                <div v-else>
                    <Switch true-value="enabled" false-value="disabled" @on-change="(i) => changeStatus(i, item)"></Switch>
                </div>
                </Col>
                <Col span="22">
                <strong>{{ item.action.name }}</strong>
                <strong> ￥ </strong>
                <strong class="rule_award"> {{ item.amount }} </strong>
                <span> 个/人 </span>
                <template v-if="item.limitTimes">
                    <strong class="rule_award"> {{ item.limitTimes }} </strong>
                </template>
                <i class="rule_remark" v-if="item.remark">备注：{{ item.remark }}</i>
                </Col>
            </Row>

        </div>
        <!-- 新增规则 -->
        <Modal v-model="modal" width="450">
            <template #header>
                <p style="color:#000;text-align:center">
                    <span>新增规则</span>
                </p>
            </template>
            <Form :model="list" label-position="right" :label-width="100">
                <FormItem label="行为：">
                    <Select v-model="list.action" placeholder="请选择触发的行为">
                        <Option v-for="item in ruleDeed" :key="item.code" :value="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="类型：">
                    <RadioGroup v-model="list.amountType">
                        <Radio label="fixed">
                            <span>固定</span>
                        </Radio>
                        <Radio label="formula">
                            <span>公式</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="权益卡金额：">
                    <Input v-model="list.amount" type="number" placeholder="请输入奖励权益金"></Input>
                </FormItem>
                <FormItem label="限制：">
                    <Input v-model="list.limitTimes" type="number" placeholder="请输入限制量"></Input>
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="list.remark" type="textarea" :rows="4"></Input>
                </FormItem>
                <FormItem label="状态：">
                    <Switch v-model="list.status" true-value="enabled" false-value="disabled"></Switch>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="saveRuleFn">确认</Button>
                <Button @click="modal = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getSettingCardfundFlowListApi,   // 规则列表
    postSettingCardfundFlowSaveApi,   // 规则保存
    getSettingCardfundFlowActionsApi,   // 积分方向
} from "@/api/account.js";
export default {
    name: 'spreadAwardRule',
    data() {
        return {
            phone: 'apple',
            ruleList: [],   // 规则列表
            ruleDeed: [],   // 规则行为
            modal: false,   // 新增规则
            list: {},   // 新 规则
        }
    },
    created() {
        this.getSetList();
        this.directionIntegralFn();   // 积分方向
    },
    methods: {
        // 规则列表
        getSetList() {
            getSettingCardfundFlowListApi().then(res => {
                // console.log(res);
                let data = JSON.parse(JSON.stringify(res));
                this.ruleList = [];
                data.forEach(item => {
                    if (item.action.name == '用户注册奖励' || item.action.name == '推荐爱心用户注册奖励' || item.action.name == '推荐残疾用户注册奖励' || item.action.name == '推荐残疾家属注册奖励') {
                        this.ruleList.unshift(item);
                    }
                });
            })
        },
        // 规则保存
        saveRuleFn() {
            postSettingCardfundFlowSaveApi(this.list).then(res => {
                // console.log(res);
                if (res) {
                    this.$Message.success('成功')
                    this.modal = false;
                    this.getSetList();
                    this.list = {};
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 积分方向
        directionIntegralFn() {
            getSettingCardfundFlowActionsApi({ direct: 1 }).then(res => {
                let data = JSON.parse(JSON.stringify(res));
                // this.ruleDeed = data.map(item => {
                //     return item.action;
                // });
                this.ruleDeed = [];
                data.forEach(item => {
                    if (item.name == '用户注册奖励' || item.name == '推荐爱心用户注册奖励' || item.name == '推荐残疾用户注册奖励' || item.name == '推荐残疾家属注册奖励') {
                        this.ruleDeed.push(item);
                    }
                });
            })
        },
        // 切换状态
        changeStatus(status, row) {
            let data = {
                action: row.action.code,
                amountType: row.amountType ? row.amountType.code : 'fixed',
                amount: row.amount,
                limitTimes: row.limitTimes ? row.limitTimes : '',
                status,
                remark: row.remark ? row.remark : ''
            }
            this.list = data;
            this.saveRuleFn();
        }
    },
}
</script>
<style scoped lang='less'>
.rule_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .ivu-row {
        font-size: 14px;
    }
}

.rule_award {
    border: #c1c1c1 1px solid;
    padding: 0 10px;
    margin: 0 10px 0 0;
    box-sizing: border-box;
    border-radius: 3px;
}

.rule_remark {
    display: inline-block;
    margin-left: 20px;
    color: #c1c1c1;
}
</style>