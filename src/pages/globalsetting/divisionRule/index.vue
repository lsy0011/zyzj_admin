<template>
    <div class='divisionRule'>
        <!-- <h5>分账规则</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="分账规则" hidden-breadcrumb />
        </div>
        <div class="div_rule">
            <Card class="only_rule" v-for="(item, index) in typeList" :key="item.code">
                <template #title>
                    <div style="text-align: center; font-size: 16px;">
                        <strong> {{ item.name }}分账规则 </strong>
                    </div>
                </template>
                <Form label-position="right" :label-width="150">
                    <FormItem label="分账时效：">
                        <Select v-model="saveList[index].division.offsetType" v-width="70" placeholder="类型">
                            <Option value="DAY_OF_YEAR">天</Option>
                            <Option value="HOUR">小时</Option>
                        </Select>
                        <strong> T + </strong>
                        <Input v-model="saveList[index].division.offset" type="number" max="100"
                            @on-blur="saveList[index].division.offset = $event.target.value < 0 ? 0 : $event.target.value"
                            v-width="'20%'"></Input>
                        <strong> 个 {{ saveList[index].division.offsetType == 'DAY_OF_YEAR' ? '工作日' : '小时' }} </strong>
                    </FormItem>
                    <FormItem label=" 分账对象 ">
                    </FormItem>
                    <FormItem label="供应商：">
                        <Input v-model="saveList[index].division.divPercent.supplier" type="number" v-width="'45%'"
                            @on-blur="saveList[index].division.divPercent.supplier = $event.target.value < 0 ? 0 : $event.target.value">
                        <template #append> <span> % </span></template>
                        </Input>
                        <strong style="display: inline-block;padding-left: 15px;color: #ababab;">备注: 按照供货价%</strong>
                    </FormItem>
                    <FormItem label="基金会：">
                        <Input v-model="saveList[index].division.divPercent.foundation" type="number" v-width="'45%'"
                            @on-blur="saveList[index].division.divPercent.foundation = $event.target.value < 0 ? 0 : $event.target.value">
                        <template #append> % </template>
                        </Input>
                        <strong style="display: inline-block;padding-left: 15px;color: #ababab;">备注: 按照供货价%</strong>
                    </FormItem>
                    <FormItem label="服务方：" v-show="false">
                        <!-- <Input v-model="saveList[index].division.divPercent.supplier" type="number" v-width="'45%'"
                            @on-blur="saveList[index].division.divPercent.supplier = $event.target.value < 0 ? 0 : $event.target.value">
                        <template #append> <span> % </span></template>
                        </Input> -->
                        <Input v-width="'45%'"></Input>
                        <strong style="display: inline-block;padding-left: 15px;color: #ababab;">备注: 按照供货价%</strong>
                    </FormItem>
                    <FormItem label="平台：">
                        <Input v-model="saveList[index].division.divPercent.platform" type="number" v-width="'45%'"
                            @on-blur="saveList[index].division.divPercent.platform = $event.target.value < 0 ? 0 : $event.target.value">
                        <template #append> % </template>
                        </Input>
                    </FormItem>
                </Form>
                <p v-if="item.code == 'auction'" style="text-align: center;color: #ff8400;padding-bottom: 20px;">
                    服务商 = 1 - 供应商% - 基金会% - 平台%
                </p>
                <div style="text-align: center;">
                    <Button type="primary" @click="savePaydivFn(index)">确定保存</Button>
                </div>
            </Card>
            <!-- <Card class="only_rule">
                <template #title>
                    <div style="text-align: center; font-size: 16px;">
                        <strong> 拍卖分账规则 </strong>
                    </div>
                </template>
                <Form label-position="right" :label-width="150">
                    <FormItem label="分账时效：">
                        <strong> T + </strong>
                        <Input type="number" v-width="' 20%'"></Input>
                <strong> 个工作日 </strong>
                </FormItem>
                <FormItem label=" 分账对象 ">
                </FormItem>
                <FormItem label="平台通道费：">
                    <Input type="number" v-width="'45%'">
                    <template #append> % </template>
                    </Input>
                </FormItem>
                <FormItem label="服务方：">
                    <Input v-width="'45%'"></Input>
                    <strong style="display: inline-block;padding-left: 15px;color: #ababab;">备注: 按照供货价%</strong>
                </FormItem>
                <FormItem label="基金会：">
                    <Input type="number" v-width="'45%'">
                    <template #append> % </template>
                    </Input>
                    <strong style="display: inline-block;padding-left: 15px;color: #ababab;">备注: 按照供货价%</strong>
                </FormItem>
                </Form>
            <div style="text-align: center;">
                <Button type="primary">确定保存</Button>
            </div>
        </Card> -->
        </div>
    </div>
</template>
<script>
import {
    getSettingPaydivTypesApi,  // 分账类型
    postSettingPaydivSaveApi,  // 分账保存
    getSettingPaydivDetailApi,  // 分账详情
} from '@/api/account'
export default {
    name: 'divisionRule',
    data() {
        return {
            social: [],   // 分账
            typeList: [],  // 分账类型
            saveList: [{ division: { divPercent: {} } }, { division: { divPercent: {} } }, { division: { divPercent: {} } }, { division: { divPercent: {} } }],  // 保存提交数据
        }
    },
    created() {
        this.getTypeFn();
    },
    methods: {
        // 获取规则列表
        getTypeFn() {
            getSettingPaydivTypesApi().then(res => {
                // console.log(res);
                this.typeList = JSON.parse(JSON.stringify(res));
                // this.saveList = [];
                this.saveList = [{ division: { divPercent: {} } }, { division: { divPercent: {} } }, { division: { divPercent: {} } }, { division: { divPercent: {} } }];
                this.typeList.forEach((item, ind) => {
                    getSettingPaydivDetailApi({ type: item.code }).then(rs => {
                        this.saveList[ind] = JSON.parse(JSON.stringify(rs));
                        for (const key in this.saveList[ind].division.divPercent) {
                            if (Object.hasOwnProperty.call(this.saveList[ind].division.divPercent, key)) {
                                const element = this.saveList[ind].division.divPercent[key];
                                this.saveList[ind].division.divPercent[key] = (element * 100).toFixed(5) * 1;
                            }
                        }
                    })
                })
            })
        },
        // 保存
        savePaydivFn(i) {

            let list = JSON.parse(JSON.stringify(this.saveList[i]));

            list.type = this.saveList[i].type.code;

            for (const key in list.division.divPercent) {
                if (Object.hasOwnProperty.call(list.division.divPercent, key)) {
                    const element = list.division.divPercent[key];
                    list.division.divPercent[key] = (element / 100).toFixed(5) * 1;
                };
            };
            let { supplier, foundation, platform } = list.division.divPercent;

            let allAccount = + supplier * 1 + foundation * 1 + platform * 1;
            if (allAccount <= 1) {
                if (list.type == 'auction') list.division.divPercent.servicer = 1 - allAccount;
                // else list.division.divPercent.servicer = 0;

                postSettingPaydivSaveApi(list, true).then(res => {
                    if (res.type) {
                        this.$Message.success(`${res.type.name}分账规则修改成功！`);
                    }
                })
            } else {
                this.$Message.warning('总和不能超过100 %，请合理设置！');
            }
        },
    },
}
</script>
<style scoped lang='less'>
.div_rule {
    margin-top: 24px;
    min-width: 881px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .only_rule {
        width: 24%;
        // min-width: 430px;
        margin-bottom: 20px;
    }
}

:deep(.ivu-form-item-content) {
    display: flex;
}

@media (min-width: 1660px) and (max-width: 1921px) {

    .only_rule {
        width: 32% !important;
        margin-bottom: 20px;
    }
}

@media (min-width: 880px) and (max-width: 1660px) {

    .only_rule {
        width: 49% !important;
        margin-bottom: 20px;
    }
}

// @media (min-width: 580px) and (max-width: 880px) {

//     .only_rule {
//         width: 99% !important;
//         margin-bottom: 20px;
//     }
// }</style>