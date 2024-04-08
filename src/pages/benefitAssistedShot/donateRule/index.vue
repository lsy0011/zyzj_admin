<template>
    <div class='donateRule'>
        <!-- <h5>捐赠规则管理</h5> -->

        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="捐赠规则管理" hidden-breadcrumb />
        </div>
        <div class="donate_main">
            <!-- <h1>规则</h1>
            <div class="main_box">
                <div class="main_only">
                    <strong>捐赠规则：</strong>
                    <Input type="textarea" :rows="8"></Input>
                </div>
                <div class="main_rule">
                    <strong>捐赠比例：</strong>
                    <div class="rule_box">
                        <div class="only_rule" v-for="(item) in data" :key="item">
                            <div style="margin-bottom: 10px;">
                                <span>成交金额：</span>
                                <InputNumber :max="10" :min="1" /> 元
                                <span> — </span>
                                <InputNumber :max="10" :min="1" /> 元
                            </div>
                            <div>
                                <span>捐赠比例：</span>
                                <InputNumber :max="10" :min="1" /> %
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer_remark">
                    <Space size="large">
                        <Button type="error" ghost icon="md-remove" @click="delRule()"></Button>
                        <Button type="primary" ghost icon="md-add" @click="addRule()"></Button>
                    </Space>
                    <div>
                        （ 备注：根据拍卖成交金额来设置捐赠比例 ）
                    </div>
                </div>
            </div> -->
            <Card style="width:100%">
                <template #title>
                    <Icon type="ios-film-outline"></Icon>
                    捐助列表
                </template>
                <template #extra>
                    <a href="#" @click.prevent="modal = true;">
                        <Icon type="ios-loop-strong"></Icon>
                        补充
                    </a>
                </template>

                <Table border :columns="columns" :data="data" :loading="loading">
                    <template #actionSlot="{ row }">
                        <Button size="small" type="primary" v-margin="5" @click="editDonateFn(row)">编辑</Button>
                        <Poptip confirm transfer title="确认删除吗?" @on-ok="removeDonateFn(row)">
                            <Button size="small" type="error" v-margin="5">删除</Button>
                        </Poptip>
                    </template>
                </Table>

            </Card>
        </div>
        <Modal v-model="modal" title="补充规则" width="380">

            <Form :model="list" label-position="right" :label-width="100">
                <FormItem label="起始金额">
                    <InputNumber v-model="list.priceMin" :min="1" /> 元
                </FormItem>
                <FormItem label="结束金额">
                    <InputNumber v-model="list.priceMax" :min="list.priceMin" /> 元
                </FormItem>
                <FormItem label="捐赠比例">
                    <InputNumber v-model="list.donateRate" :min="1" /> %
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="saveDonateFn()">添加</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getGoodsDonateCfgListApi,  // 列表
    getGoodsDonateCfgDetailApi,  // 详情
    postGoodsDonateCfgSaveApi,   // 保存
    postGoodsDonateCfgRemoveApi,   // 删除
} from '@/api/account'
export default {
    name: 'donateRule',
    data() {
        return {
            columns: [
                {
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '编号',
                    align: 'center',
                    minWidth: 180,
                    render: (h, params) => {
                        return h('div', params.row.id)
                    }
                },
                {
                    title: '起始金额',
                    align: 'center',
                    minWidth: 180,
                    render: (h, params) => {
                        return h('div', params.row.priceMin)
                    }
                },
                {
                    title: '结束金额',
                    align: 'center',
                    minWidth: 180,
                    render: (h, params) => {
                        return h('div', params.row.priceMax)
                    }
                },
                {
                    title: '捐赠比例',
                    align: 'center',
                    minWidth: 180,
                    render: (h, params) => {
                        return h('div', params.row.donateRate)
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 160,
                    slot: 'actionSlot',
                },
            ],
            data: [],
            loading: false,
            modal: false,
            goodsId: '',   // 商品id
            list: {},  // 添加
            // data: [1, 3, 4, 5],
        }
    },
    created() {

        this.goodsId = this.$route.query.id;

        this.getDonateList();
    },
    methods: {
        // 获取列表
        getDonateList() {
            getGoodsDonateCfgListApi({ goodsId: this.goodsId }).then(res => {
                this.data = JSON.parse(JSON.stringify(res));
            })
        },
        // 保存规则
        saveDonateFn() {
            this.list.goodsId = this.goodsId;
            let data = JSON.parse(JSON.stringify(this.list));
            data.donateRate = this.list.donateRate / 100;

            postGoodsDonateCfgSaveApi(data).then(res => {
                this.$Message.success('补充成功！');
                this.modal = false;
                this.getDonateList();
            })
        },
        // 编辑
        editDonateFn(row) {
            getGoodsDonateCfgDetailApi(row.id).then(res => {
                this.list = {
                    id: res.id,
                    priceMin: res.priceMin,
                    priceMax: res.priceMax,
                    donateRate: res.donateRate * 100,
                };
                this.modal = true;
            })
        },
        // 删除
        removeDonateFn(row) {
            postGoodsDonateCfgRemoveApi({ id: row.id }).then(res => {
                this.$Message.success('删除成功！');
                this.getDonateList();
            })
        },
        addRule() {
            this.data.push(this.data.length)
        },
        delRule() {
            this.data.splice(this.data.length - 1, 1)
        }
    }
}
</script>
<style scoped lang='less'>
.donate_main {
    margin-top: 24px;
    // padding: 20px 30px;
    background: #fff;
    // text-align: center;

    .main_box {
        width: 50%;
        margin: 10px auto;

        .main_only {
            width: 100%;
            margin-bottom: 15px;
            display: flex;
            flex-wrap: nowrap;

            strong {
                display: inline-block;
                width: 10%;
                text-align: right;
                padding-right: 15px;
                box-sizing: border-box;
                font-size: 16px;
            }

            .ivu-input-wrapper {
                width: 89%;
            }
        }

        .main_rule {
            width: 100%;
            margin-bottom: 10px;
            display: flex;
            flex-wrap: wrap;

            strong {
                display: block;
                width: 10%;
                text-align: right;
                padding-right: 15px;
                box-sizing: border-box;
                font-size: 16px;
            }

            .rule_box {
                width: 89%;
                display: flex;
                flex-wrap: wrap;

                .only_rule {
                    text-align: left;
                    margin: 0 13px 10px 0;
                    padding: 10px;
                    box-sizing: border-box;
                    border-radius: 5px;
                    border: 1px solid #dcdee2;
                }
            }
        }

        .footer_remark {
            width: 100%;

            .ivu-space {
                margin-bottom: 10px;
            }
        }
    }
}
</style>