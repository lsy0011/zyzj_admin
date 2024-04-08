<template>
    <div>
        <!-- <h5>运费模板设置</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="运费模板设置" hidden-breadcrumb />
        </div>
        <div class="fares_set">
            <Card style="width:100%">
                <template #title>
                    模版列表
                </template>
                <template #extra>
                    <Button type="primary" size="small" @click="details(null)">新建运费模板</Button>
                </template>
                <Table :loading="loading" :columns="columns" :data="data" border>
                    <template #action="{ row }">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="details(row.id)">编辑</Button>
                    </template>
                </Table>
            </Card>
        </div>
        <Modal @on-visible-change="visibleChange" v-model="modal" width="1000" title="添加/编辑">
            <Form ref="list" :model="list" :rules="ruleValidate" :label-width="80">
                <div class="from_title">
                    模板基础信息
                </div>
                <div class="card_l">
                    <FormItem label="模板名称">
                        <Input v-model="list.name" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem label="发货地址">
                        <TreeSelect v-model="list.sendOutRegionCode" transfer :data="regionTree" clearable v-width="300" />
                    </FormItem>
                    <FormItem label="模板类型">
                        自定义模板
                    </FormItem>
                </div>
                <div class="from_title">
                    包邮配送区域
                </div>
                <div class="card_l pdl20">
                    <Row style="margin-bottom: 20px">
                        <Col span="12">
                        <Checkbox :indeterminate="indeterminate" v-model="checkAll" @click.prevent="handleCheckAll">全选
                        </Checkbox>
                        </Col>
                        <Col span="12" class="ivu-text-right">
                        已选<span style="color: #2d8cf0;margin: 0 4px">{{ list.freeRegionCode.length }}</span>个区域
                        </Col>
                    </Row>
                    <CheckboxGroup v-model="list.freeRegionCode" @on-change="checkAllGroupChange">
                        <Checkbox v-for="(item, index) in regionList" :key="index" :label="item.code"
                            style="width:144px;margin-bottom: 4px">{{ item.name }}</Checkbox>
                    </CheckboxGroup>
                </div>
                <div class="from_title">
                    买家付邮费区域
                </div>
                <div class="card_l">
                    <FormItem label="计费方式">
                        <RadioGroup v-model="list.feeMode">
                            <Radio label="piece">按件</Radio>
                            <Radio label="weight">按重量</Radio>
                        </RadioGroup>
                    </FormItem>
                    <div style="margin-left: 14px">
                        <!-- <div v-for="(item, index) in list.feePolicy" :key="index"> -->
                        <div v-for="(item, index) in list.feePolicy" :key="index" class="feePolicy">
                            <div class="feePolicy_title">
                                {{ item.regionName }}
                            </div>
                            <div class="pd10">
                                <Row>
                                    <Col span="12">
                                    <Input v-model="list.feePolicy[index].initialAmount" placeholder="请输入"
                                        style="width: 100px"></Input>
                                    {{ list.feeMode == 'piece' ? '件' : "公斤" }}内
                                    <Input v-model="list.feePolicy[index].initialFee" placeholder="请输入"
                                        style="width: 100px"></Input>
                                    元
                                    </Col>
                                    <Col span="12">
                                    每增加
                                    <Input v-model="list.feePolicy[index].increaseAmount" placeholder="请输入"
                                        style="width: 100px"></Input>
                                    {{ list.feeMode == 'piece' ? '件' : "公斤" }}，增加运费
                                    <Input v-model="list.feePolicy[index].increaseFee" placeholder="请输入"
                                        style="width: 100px"></Input>
                                    元
                                    </Col>
                                </Row>
                                <Row style="margin-top: 10px">
                                    <Col span="24">
                                    <Checkbox v-model="list.feePolicy[index].freeAllowed">指定条件包邮</Checkbox>
                                    满
                                    <Input v-model="list.feePolicy[index].freeAmount" placeholder="请输入"
                                        style="width: 100px"></Input>
                                    包邮
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <Poptip title="" content="content" placement="right" v-model="visible">
                        <Button type="primary" icon="md-add" style="margin-left: 14px;margin-top: 20px">设置指定区域运费</Button>
                        <template #content>
                            <div class="setPoptip">
                                <List border size="small">
                                    <ListItem v-for="(item, index) in regionList" :key="index">
                                        <div @click="addFeePolicy(item)" style="width: 100%">{{ item.name }}</div>
                                    </ListItem>
                                </List>
                            </div>
                        </template>
                    </Poptip>
                </div>
                <div class="from_title">
                    不配送区域
                </div>
                <div class="card_l">
                    <div style="margin-left: 14px">
                        <!-- <div v-for="(item, index) in list.feePolicy" :key="index"> -->
                        <div v-for="(item, index) in list.forbidden" :key="index" class="feePolicy">
                            <div class="feePolicy_title">
                                <div> {{ item.regionName }}</div>
                                <Poptip confirm title="确认删除该不配送区域?" @on-ok="deleteArr(index)">
                                    <div style=" margin-right: 15px;font-size: 14px;color: #ff0000;">删除</div>
                                </Poptip>
                            </div>
                            <div class="pd10">
                                <RadioGroup v-model="list.forbidden[index].type">
                                    <Radio label="distance">因距离远导致运费上升</Radio>
                                    <Radio label="weight">因商品重量大导致运费上升</Radio>
                                    <Radio label="corp_deny">合作快递不配送该区域</Radio>
                                    <Radio label="corp_service_poor">合作快递该区域服务差</Radio>
                                    <Radio label="other">其他</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <Poptip title="" content="content" placement="right" v-model="visible1">
                        <Button type="primary" icon="md-add" style="margin-left: 14px;margin-top: 20px">设置不配区域</Button>
                        <template #content>
                            <div class="setPoptip">
                                <List border size="small">
                                    <ListItem v-for="(item, index) in regionList" :key="index">
                                        <div @click="addForbidden(item)" style="width: 100%">{{ item.name }}</div>
                                    </ListItem>
                                </List>
                            </div>
                        </template>
                    </Poptip>
                </div>
            </Form>
            <template #footer>
                <Button type="primary" @click="confirm" :loading="loading">确定</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getAreaTreeApi,  // 地域树
    getGasicRegionListApi,  // 配送区域
    getFreightTemplateListApi,  // 模板列表
    postFreightTemplateSaveApi,  //  模板保存
    getFreightTemplateDetailApi, // 运费模板详情
} from '@api/account';
import { jsonToArray1 } from "@/libs/util.js";
export default {
    name: 'home',
    data() {
        return {
            visible: false,
            visible1: false,
            modal: false,
            loading: false,
            total: 0,
            pageSize: 10,
            pageNumber: 1,
            search: {},
            columns: [
                {
                    title: '名称',
                    key: 'name',
                    minWidth: 200,
                },
                {
                    title: '计费方式',
                    key: 'categoryName',
                    minWidth: 200,
                    render: (h, params) => {
                        return h('div', [
                            params.row.feeMode ? params.row.feeMode.name : ''
                        ]);
                    }
                },
                {
                    title: '最后编辑时间',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            params.row.timeModified ? this.$Date(params.row.timeModified).format('YYYY-MM-DD HH:mm:ss') : ''
                        ]);
                    }
                },
                {
                    title: '操作',
                    width: 150,
                    align: 'center',
                    slot: 'action'
                }
            ],
            data: [],
            indeterminate: false,
            checkAll: false,
            regionTree: [],
            regionList: [],
            regionCheckAll: [],
            pic: null,
            list: {
                freeRegionCode: [],
                feePolicy: [],
                forbidden: [],
                id: '',
                name: '',
                feeMode: '',
                sendOutRegionCode: ''
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
        }
    },
    mounted() {
        this.getList()
        this.getBasicRegionList()
    },
    watch: {
        "list.freeRegionCode"(newVal) {
            // console.log(newVal);
            if (newVal.length === this.regionCheckAll.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (newVal.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        }
    },
    methods: {
        getBasicRegionList() {
            let data = {
                parentId: "100000",
                deep: 3
            }
            getGasicRegionListApi(data).then((res) => {
                let arr = res
                this.regionCheckAll = arr.map(v => { return v.code })
                this.regionList = arr;
            }).catch((err) => {
            });
            getAreaTreeApi().then((res) => {
                let arr = jsonToArray1(res, false)
                this.regionTree = arr;
            }).catch((err) => {
            });
        },
        getList() {
            this.loading = true
            getFreightTemplateListApi().then((res) => {
                let arr = res
                this.total = res.length;
                this.data = arr;
                this.loading = false
            }).catch((err) => {
            });
        },
        changePage(page) {
            this.pageNumber = page;
            this.getList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getList();
        },
        details(id) {
            if (id) {
                getFreightTemplateDetailApi(id).then(res => {
                    let arr = res
                    if (arr.forbidden && arr.forbidden.length > 0) {
                        arr.forbidden.forEach(v => {
                            v.type = v.type ? v.type.code : ''
                        });
                    }
                    this.list = {
                        freeRegionCode: arr.freeProvinceCode ? arr.freeProvinceCode : [],
                        feePolicy: arr.feePolicy ? arr.feePolicy : [],
                        forbidden: arr.forbidden ? arr.forbidden : [],
                        id: arr.id,
                        name: arr.name,
                        feeMode: arr.feeMode ? arr.feeMode.code : '',
                        sendOutRegionCode: arr.sendOutRegionCode && arr.sendOutRegionCode.length > 0 ? arr.sendOutRegionCode[arr.sendOutRegionCode.length - 1] : ''
                    }
                    // console.log(this.list);
                    this.modal = true
                }).catch(err => {
                })
            } else {
                this.list = {
                    freeRegionCode: [],
                    feePolicy: [],
                    forbidden: [],
                    id: '',
                    name: '',
                    feeMode: '',
                    sendOutRegionCode: ''
                }
                this.modal = true
            }
        },
        confirm() {
            this.loading = true
            let data = this.list
            postFreightTemplateSaveApi(data, true).then((res) => {
                this.modal = false
                this.$Message.success('添加成功');
                this.getList()
                this.loading = false
            }).catch((err) => {
                this.loading = false
            });
        },
        // 选择包邮
        checkAllGroupChange(data) {
            if (data.length === this.regionCheckAll.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        // 全选
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                this.list.freeRegionCode = this.regionCheckAll;
            } else {
                this.list.freeRegionCode = [];
            }
        },
        // 添加邮费区域
        addFeePolicy(item) {
            let data = this.list.feePolicy.map(v => { return v.regionCode })
            if (data.indexOf(item.code) === -1) {
                this.list.feePolicy.push({
                    regionCode: item.code,
                    regionName: item.name,
                    initialAmount: '',
                    initialFee: '',
                    increaseAmount: '',
                    increaseFee: '',
                    freeAllowed: false,
                    freeAmount: '',
                })
            } else {
                this.$Message.warning('已存在');
            }
            this.visible = false;
        },
        // 添加邮费区域
        addForbidden(item) {
            let data = this.list.forbidden.map(v => { return v.regionCode })
            if (data.indexOf(item.code) === -1) {
                this.list.forbidden.push({
                    regionCode: item.code,
                    regionName: item.name,
                    type: 'distance',
                })
            } else {
                this.$Message.warning('已存在');
            }
            this.visible1 = false;
        },
        deleteArr(i) {
            this.list.forbidden.splice(i, 1)
        },
        visibleChange(key) {
            if (!key) {
            }
            this.pic = null
        },
        handleBeforeLicenseUrlUpload(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
    }
}
</script>
<style scoped lang="less">
.fares_set {
    margin-top: 24px;
    padding: 20px 30px;

    .ivu-col-span-4 {
        margin-bottom: 20px;
    }
}

.from_title {
    position: relative;
    padding-left: 20px;
    font-size: 16px;
    font-weight: 600;
}

.from_title::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    /* margin-left: -6px; */
    width: 4px;
    height: 24px;
    border-radius: 2px;
    background: #2d8cf0;
}

.card_l {
    margin: 10px 0;
    padding: 20px 10px 20px 0;
    background: #f9f9f9;
}

.feePolicy {
    padding: 0;
    box-sizing: border-box;
    background: #ffffff;
    border: 1px solid #D0D2D1;
}

.feePolicy_title {
    padding: 4px 14px;
    color: #2d8cf0;
    font-size: 16px;
    background: #C6E2FF;
    display: flex;
    justify-content: space-between;
}

.setPoptip {
    height: 200px;
    overflow-y: auto
}

.setPoptip::-webkit-scrollbar {
    display: none;
}

.pd10 {
    padding: 10px;
}

.pdl20 {
    padding-left: 20px;
}
</style>