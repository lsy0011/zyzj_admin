<template>
    <div class="elementaryitem">
        <!-- <h5>基本项管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="残疾人管理" content="数据基本项管理" hidden-breadcrumb />
        </div>
        <Row :gutter="24" class="ivu-mt">
            <Col :xl="12" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
            <!-- <Affix :offset-top="108"> -->
            <Card :bordered="false" dis-hover class="ivu-mb">
                <div class="mb-head-tit">残疾人类型</div>
                <div class="mb-main-tab">
                    <table border cellspacing="0">
                        <tr>
                            <th v-for="(item, index) in columns" :key="index">{{ item.title }}</th>
                        </tr>
                        <tr v-for="(item, index) in data" :key="item.id">
                            <td>{{ item.type }}</td>
                            <td>{{ item.id }}</td>
                            <td rowspan="7" v-if="index == 0">{{ item.numberArea }}</td>
                        </tr>
                    </table>
                </div>
                <div class="mb-foot-btn">
                    <Button type="primary">修改</Button>
                </div>
            </Card>
            <!-- </Affix> -->
            </Col>
            <Col :xl="12" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
            <Card :bordered="false" dis-hover class="ivu-mb">
                <div class="mb-head-tit">残疾人等级</div>
                <div class="mb-main-tab">
                    <table border cellspacing="0">
                        <tr>
                            <th v-for="(item, index) in columns2" :key="index">{{ item.title }}</th>
                        </tr>
                        <tr v-for="(item, index) in data2" :key="item.id">
                            <td>{{ item.type }}</td>
                            <td>{{ item.id }}</td>
                            <td rowspan="7" v-if="index == 0">{{ item.numberArea }}</td>
                        </tr>
                    </table>
                </div>
                <div class="mb-foot-btn">
                    <Button type="primary">修改</Button>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    name: 'handicapped-elementaryitem',
    data() {
        return {
            columns: [
                {
                    title: '残疾类型',
                    key: 'type',
                },
                {
                    title: '残疾类型编号',
                    key: 'id',
                },
                {
                    title: '数字位置',
                    key: 'numberArea',
                }
            ],
            data: [
                {
                    type: '视力',
                    id: 1,
                    numberArea: '残疾证号倒数第2位'
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
            columns2: [
                {
                    title: '残疾等级',
                    key: 'type',
                },
                {
                    title: '残疾等级编号',
                    key: 'id',
                },
                {
                    title: '数字位置',
                    key: 'numberArea',
                }
            ],
            data2: [{
                type: '一级',
                id: 1,
                numberArea: '残疾证号倒数第1位'
            },
            {
                type: '二级',
                id: 2,
            }, {
                type: '三级',
                id: 3,
            }, {
                type: '四级',
                id: 4,
            },]
        }
    },
    methods: {

    }
}
</script>
<style scoped lang="less">
.ivu-mt {
    padding: 0 15px;
    box-sizing: border-box;

    .mb-head-tit {
        // border: 1px solid #000;
        font-weight: 600;
        padding: 10px;
    }

    .ivu-mb {
        height: 460px;

        .mb-main-tab {
            padding: 20px 40px;
            // border: 1px solid #000;

            table {
                width: 80%;
                text-align: center;
                border-color: #fffefec6;

                tr {

                    th {
                        width: 180px;
                        height: 35px;
                        background-color: #f8f8f9;
                    }

                    td {
                        height: 35px;
                    }
                }
            }
        }

        .mb-foot-btn {
            padding: 0 40px;
        }
    }
}
</style>