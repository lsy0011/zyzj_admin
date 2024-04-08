<template>
    <div class="peoplelist">
        <!-- <h5>人员列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="残疾人管理" content="人员列表" hidden-breadcrumb />
        </div>
        <div class="list-main">
            <div class="top-search">
                <Space size="large" wrap>
                    <DatePicker :model-value="value2" type="daterange" :start-date="new Date(2023, 3, 7)"
                        format="yyyy/MM/dd" placement="bottom-end" placeholder="请选择起始时间" style="width: 200px" />

                    <Select v-model="cjType" placeholder="请选择残疾类型" clearable style="width:200px; margin: 0 10px; ">
                        <Option v-for="item in cjTypeList" :value="item.id" :key="item.id">{{ item.type }}</Option>
                    </Select>
                    <Select v-model="cjRank" placeholder="请选择残疾等级" clearable style="width:200px; margin: 0 10px; ">
                        <Option v-for="item in cjRankList" :value="item.id" :key="item.id">{{ item.type }}</Option>
                    </Select>
                    <Select v-model="gender" placeholder="请选择性别" clearable style="width:200px; margin: 0 10px; ">
                        <Option value="000">男</Option>
                        <Option value="0001">女</Option>
                    </Select>
                    <Input v-model="phoneNumber" placeholder="请输入手机号" clearable style="width: 200px" />
                    <Button type="primary"> 查询</Button>
                    <Button> 重置</Button>
                </Space>
            </div>
            <Table border :columns="columns" :data="data"></Table>
            <Page show-total :total="48" size="small" show-elevator show-sizer />
        </div>
    </div>
</template>
<script>
import { resolveComponent } from 'vue';
export default {
    name: 'handicapped-peoplelist',
    data() {
        return {
            value2: ['', ''], // 起始时间
            city: '',  // 城市
            cjTypeList: [
                {
                    type: '视力',
                    id: 1,
                },
                {
                    type: '听力',
                    id: 2,
                }, {
                    type: '言语',
                    id: 3,
                }, {
                    type: '肢体',
                    id: 4,
                }, {
                    type: '智力',
                    id: 5,
                }, {
                    type: '精神',
                    id: 6,
                },
                {
                    type: '多重残疾',
                    id: 7,
                },
            ],
            cjType: '', // 残疾类型
            cjRankList: [
                {
                    type: '一级',
                    id: '001',
                },
                {
                    type: '二级',
                    id: '002',
                }, {
                    type: '三级',
                    id: '003',
                }, {
                    type: '四级',
                    id: '004',
                }
            ],
            cjRank: '', // 残疾等级
            gender: '',// 性别
            phoneNumber: "", // 手机号
            columns: [
                {
                    title: '注册时间',
                    key: 'name',
                    width: '180',
                    hight: 48,
                    align: "center"
                    // render: (h, params) => {
                    //     return h('div', [
                    //         h(resolveComponent('Icon'), {
                    //             type: 'ios-person'
                    //         }),
                    //         h('strong', params.row.name)
                    //     ]);
                    // }
                },
                {
                    title: '渠道来源',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '城市',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '区域',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '手机号',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '微信ID',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '残疾类型',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '残疾等级',
                    key: 'age',

                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '钱包余额',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '善益卡余额',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '订单数',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '最近登录',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '登录次数',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '购买次数',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '购买金额',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '善益卡补贴金额',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '领取善款',
                    key: 'address',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '领取物资',
                    key: 'age',
                    width: 180,
                    hight: 48,
                    align: "center"
                },
                {
                    title: '状态',
                    // key: 'address',
                    width: 100,
                    hight: 48,
                    align: "center",
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h(resolveComponent('Switch'), {
                                trueColor: '#13ce66',
                                falseColor: '#ff4949',
                                onClick: () => {
                                    console.log(params.index);
                                }
                            }),
                            // h('strong', params.row.name)
                        ]);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 180,
                    hight: 48,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h(resolveComponent('Button'), {
                                type: 'primary',
                                size: 'small',
                                style: {
                                    marginRight: '5px'
                                },
                                onClick: () => {
                                    this.show(params.index)
                                }
                            }, {
                                default() {
                                    return '编辑'
                                }
                            }),
                            h(resolveComponent('Button'), {
                                type: 'error',
                                size: 'small',
                                onClick: () => {
                                    this.remove(params.index)
                                }
                            }, {
                                default() {
                                    return '删除'
                                }
                            })
                        ]);
                    }
                }
            ], // 表头
            data: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: '上海'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: '上海'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: '上海'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: '上海'
                }
            ], // 数据列表

        }
    },
    methods: {
        show(index) {
            this.$Modal.info({
                title: 'User Info',
                content: `Name：${this.data[index].name}<br>Age：${this.data[index].age}<br>Address：${this.data[index].address}`
            })
        },
        remove(index) {
            this.data.splice(index, 1);
        }
    }
}
</script>
<style scoped lang="less">
.peoplelist {
    .list-main {
        margin-top: 24px;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #fff;

        .ivu-table-wrapper.ivu-table-wrapper-with-border {
            width: 100%;
            overflow: auto;
            margin: 10px 0 15px 0;

        }

        .top-search {
            width: 100%;
            padding: 10px 0 20px;
        }
    }
}
</style>