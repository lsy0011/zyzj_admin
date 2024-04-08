<template>
    <div class='cancelCause'>
        <!-- <h5>取消订单原因设置</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="善意商城订单管理" content="取消订单原因设置" hidden-breadcrumb />
        </div>
        <div class="cancel_main">
            <div class="table_list">
                <div class="table_top">
                    <strong>
                        <Icon type="md-list" />数据列表
                    </strong>
                    <Button icon="ios-trash" style="margin: 0 5px;">删除</Button>
                    <Button type="primary" style="float: right;margin: 0 15px;" @click="modal = true;">+新增</Button>
                </div>
                <Table :columns="columns" :data="data" ref="table" :loading="loading"
                    @on-selection-change="selectionChange">

                    <template #statuSlot="">
                        <Switch></Switch>
                    </template>
                    <template #action="{ row }">
                        <Button type="primary" size="small" @click="handle(row)" style="margin-right: 15px;">编辑</Button>
                        <Button type="error" size="small" @click="handle(row)">删除</Button>
                    </template>
                </Table>
            </div>
        </div>
        <Modal v-model="modal" title="添加原因">

            <Form :model="list" label-position="right" :rules="ruleValidate" :label-width="100">
                <FormItem label="取消原因">
                    <Input v-model="list.input1"></Input>
                </FormItem>
                <FormItem label="备注信息">
                    <Input v-model="list.input2"></Input>
                </FormItem>
                <FormItem label="排序值">
                    <Input v-model="list.input3"></Input>
                </FormItem>
            </Form>

        </Modal>
    </div>
</template>
<script>
export default {
    name: 'cancelCause',
    data() {
        return {
            loading: false,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '序号',
                    align: "center",
                    width: 120,
                    key: 'name'
                },
                {
                    title: '取消订单原因',
                    align: "center"
                },
                {
                    title: '备注信息',
                    align: "center"
                },
                {
                    title: '排序',
                    align: "center",
                    width: 120,
                },
                {
                    title: '当前状态',
                    align: "center",
                    width: 120,
                    slot: 'statuSlot'
                },
                {
                    title: '操作',
                    align: "center",
                    slot: 'action',
                    width: 220,
                }
            ],
            data: [
                {
                    name: '8898989'
                }
            ],
            selectionAll: [],
            modal: false,
            list: {},

            ruleValidate: {
                name: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                ],
                mail: [
                    { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
                    { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                ],
                city: [
                    { required: true, message: 'Please select the city', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        handle(row) {
            console.log(row);
        },
        selectionChange(selection) {
            // console.log(selection);
            this.selectionAll = selection
        },

    }
}
</script>
<style scoped lang='less'>
.cancel_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .table_list {
        width: 100%;

        .table_top {
            margin-bottom: 15px;

            strong {
                font-size: 17px;
            }
        }
    }
}
</style>