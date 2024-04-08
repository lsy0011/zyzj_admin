<template>
    <div class='sincerityCard'>
        <!-- <h5>诚益卡管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="权益卡管理" content="诚益卡管理" hidden-breadcrumb />
        </div>
        <div class="sincerity_main">
            <div class="search_top">
                <Space size="large">
                    <Space>
                        <strong>有效日期</strong>
                        <DatePicker type="date" size="small" placeholder="开始日期" style="width: 160px" />
                        <strong>至</strong>
                        <DatePicker type="date" size="small" placeholder="截至日期" style="width: 160px" />
                    </Space>
                    <Space>
                        <strong>状态</strong>
                        <Select v-model="search.stage" size="small" style="width: 160px">
                            <Option value="wait">待发放</Option>
                            <Option value="issued">已发行</Option>
                            <Option value="stop">停止发放</Option>
                        </Select>
                        <!-- <Select size="small" style="width: 160px">
                            <Option value="1">发放中</Option>
                            <Option value="2">未发放</Option>
                            <Option value="3">已过期</Option>
                            <Option value="4">已暂停</Option>
                            <Option value="5">固定发放</Option>
                            <Option value="6">立即发放</Option>
                        </Select> -->
                    </Space>
                    <!-- <Space>
                        <strong>发放类型</strong>
                        <Select size="small" style="width: 160px">
                            <Option value="1">自动发放</Option>
                            <Option value="2">手动发放</Option>
                        </Select>
                    </Space> -->
                    <Space>
                        <Button type="primary" size="small"
                            @click="pageNumber = 1; pageSize = 10; getCardList()">查询</Button>
                        <Button size="small"
                            @click="pageNumber = 1; pageSize = 10; search = {}; getCardList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="card_title">
                <Space size="large">
                    <strong style="font-size: 16px;line-height: 32px;">
                        <Icon type="md-list" />诚益卡列表
                    </strong>
                    <Button type="primary" size="small" @click="editCardFn(false, 'list')">新建</Button>
                </Space>
            </div>
            <div class="table_body">
                <Table border :columns="columns" :data="data" :loading="loading" ref="table">
                    <template #imgSlot="{ row }">
                        <div v-viewer v-if="row.file">
                            <img :src="row.file.main_pic" style="width: 120px;" alt="">
                        </div>
                        <div v-else> --- </div>
                    </template>

                    <template #switchSlot="{ }">
                        <Switch></Switch>
                    </template>

                    <template #action="{ row }">
                        <Button size="small" v-margin="5" type="primary" @click="editCardFn(row, 'list')">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeFn(row.id)">
                            <Button size="small" type="error" v-margin="5" v-if="row.stage.code != 'issued'">删除</Button>
                        </Poptip>
                        <Button v-if="row.stage.code == 'stop'" type="warning" size="small" v-margin="5"
                            @click="changeStatus(row)">继续发放</Button>
                        <Button v-if="row.stage.code == 'wait'" type="info" size="small" v-margin="5"
                            @click="changeStatus(row)">发放</Button>
                        <Button v-if="row.stage.code == 'issued'" type="error" size="small" v-margin="5"
                            @click="changeStatus(row)">暂停</Button>
                        <template v-if="row.stage.code == 'issued' && row.mode.code != 'auto'">
                            <Button size="small" v-margin="5" @click="fixedBtnFn(row, false, 'tagList')">固定发放</Button>
                            <Button size="small" v-margin="5" @click="fixedBtnFn(row, true, 'tagList')">立即发放</Button>
                        </template>
                    </template>
                </Table>
            </div>
            <div class="foot_page" style="margin: 20px 0 0;">
                <Page :total="total" size="small" v-model="pageNumber" :page-size="pageSize" show-elevator show-sizer
                    show-total @on-page-size-change="pageSizeChange" @on-change="changePage" />
            </div>
        </div>
        <!-- 增加的弹框 -->
        <Modal class-name="vertical-center-modal" v-model="modal" @on-visible-change="visibleChange" title="创建新卡">
            <Form ref="list" :model="list" :rules="addValidate" :label-width="120">
                <FormItem label="类型：" prop="mode">
                    <RadioGroup v-model="list.mode">
                        <Radio label="auto">
                            <span>自动发放</span>
                        </Radio>
                        <Radio label="manu">
                            <span>手动发放</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="名称：" prop="name">
                    <Input v-model="list.name" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="面额：" prop="faceValue">
                    <Input v-model="list.faceValue" placeholder="请输入" type="number"
                        @on-blur="list.faceValue = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                </FormItem>
                <!-- <FormItem label="限制：">
                    <Input v-model="list.name" placeholder="请输入"  >
                    <template #append>
                        <span> 次/人</span>
                    </template>
                    </Input>
                </FormItem> -->
                <FormItem label="发行数量：" prop="issueQuantity">
                    <Input v-model="list.issueQuantity" placeholder="请输入" type="number"
                        @on-blur="list.issueQuantity = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                </FormItem>
                <FormItem label="兑换积分：" prop="exchangeCredits">
                    <Input v-model="list.exchangeCredits" placeholder="请输入" type="number"
                        @on-blur="list.exchangeCredits = $event.target.value < 0 ? 0 : $event.target.value * 1"></Input>
                </FormItem>
                <!-- <FormItem label="库存：">
                    <Input v-model="list.name" placeholder="请输入"  ></Input>
                </FormItem> -->
                <FormItem label="发放时间：" prop="issueTime">
                    <DatePicker v-model="list.issueTime" type="date" placeholder="请选择" />
                </FormItem>
                <FormItem label="截止时间：" prop="gainExpiredTime">
                    <DatePicker v-model="list.gainExpiredTime" type="date" placeholder="请选择" />
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="list.remark" type="textarea" :rows="4" placeholder="请输入" />
                </FormItem>
                <FormItem label="卡封面">
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadImg">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                    </div>
                </FormItem>
            </Form>

            <template #footer>
                <Button type="primary" @click="confirmFn('list')">确认</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
        <Modal title="手动发放" v-model="modelTag" width="500">
            <Form ref="tagList" :model="tagList" :rules="tagValidate" :label-width="100">
                <!-- <FormItem label="发放形式：">
                    <RadioGroup>
                        <Radio label="android">
                            <span>立即发放</span>
                        </Radio>
                        <Radio label="windows">
                            <span>固定发放</span>
                        </Radio>
                    </RadioGroup>
                </FormItem> -->
                <FormItem label="选择时间：" prop="effectTime" v-if="!tagList.recharge">
                    <DatePicker v-model="tagList.effectTime" type="datetime" :options="options" placeholder="请选择发放时间" />
                </FormItem>
                <FormItem label="选择用户：" prop="userId">
                    <Select v-model="tagList.userId" filterable multiple placeholder="输入用户手机号查找"
                        :remote-method="remoteMethod1" :loading="loading1">
                        <Option v-for="(option, index) in userList" :value="option.id" :key="index">
                            {{ option.name || option.nickName || option.mobile }} ({{ option.memberType.name || '' }})
                        </Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label=" " v-margin="1">
                    <Tag type="border" closable v-for="(item, index) in userList" :key="index"
                        @on-close="closeTag(item, index)">
                        {{ item }}
                    </Tag>
                </FormItem> -->
            </Form>

            <template #footer>
                <Button @click="issueSaveFn('tagList')">确认保存</Button>
                <Button @click="modelTag = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import {
    getEquitycardPageApi,  // 卡分页
    postEquityCardSaveApi,  // 保存
    postEquityCardStageApi,  // 状态
    postEquityCardIssueApi,  // 卡发放

    getUserInfoListApi,  //  用户
} from '@/api/account'
export default {
    name: 'sincerityCard',
    data() {
        return {
            loading: false,
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            columns: [
                {
                    key: 'name',
                    align: 'center',
                    width: '60',
                    render: (h, params) => {
                        return h('div', [params.index + 1])
                    }
                },
                {
                    title: '卡编号',
                    key: 'code',
                    align: 'center',
                    width: '150'
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    minWidth: 150,
                },
                {
                    title: '图片',
                    slot: 'imgSlot',
                    align: 'center',
                    width: '150'
                },
                {
                    title: '创建日期',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.timeCreated).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '发放日期',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.timeIssued).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '到期日期',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [this.$Date(params.row.gainExpiredTime).format('YYYY-MM-DD HH:mm:ss')])
                    }
                },
                {
                    title: '卡片面额',
                    key: 'faceValue',
                    align: 'center',
                    width: '150'
                },
                {
                    title: '兑换爱心价',
                    key: 'exchangeCredits',
                    align: 'center',
                    width: '150'
                },
                // {
                //     title: '领取人数',
                //     align: 'center',
                //     width: '150',
                //     render: (h, params) => {
                //         return h('div', ['---'])
                //     }
                // },
                {
                    title: '发放库存',
                    key: 'issueQuantity',
                    align: 'center',
                    width: '150'
                },
                {
                    title: '类型',
                    align: 'center',
                    width: '120',
                    render: (h, params) => {
                        return h('div', [params.row.type && params.row.type.memberType ? params.row.type.memberType[0].name : '---'])
                    }
                },
                {
                    title: '发放模式',
                    align: 'center',
                    width: '150',
                    render: (h, params) => {
                        return h('div', [params.row.mode ? params.row.mode.name : '---'])
                    }
                },
                {
                    title: '已领取数量',
                    key: 'gainQuantity',
                    align: 'center',
                    width: '150'
                },
                {
                    title: '限制',
                    align: 'center',
                    width: '150',
                    render: (h, params) => {
                        return h('div', ['---'])
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    fixed: 'right',
                    width: '100',
                    render: (h, params) => {
                        return h('div', [params.row.stage ? params.row.stage.name : '---'])
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: '220'
                },
            ],
            data: [],
            modal: false,
            list: {
                name: '',
                pic: ''
            }, // 添加时的内容
            pic: '',  // 图片
            search: {},

            options: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            modelTag: false,
            tagList: {
                // userId: []
            },  // 选中用户
            loading1: false,
            userList: [],

            addValidate: {
                mode: [
                    { required: true, message: '请选择发放模式', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入卡名', trigger: 'blur' }
                ],
                faceValue: [
                    { required: true, type: "number", message: '请输入卡面额', trigger: 'blur' }
                ],
                exchangeCredits: [
                    { required: true, type: "number", message: '请输入兑换积分', trigger: 'blur' }
                ],
                issueQuantity: [
                    { required: true, type: "number", message: '请输入发行数量', trigger: 'blur' }
                ],
                issueTime: [
                    { required: true, type: 'date', message: '请选择发放时间', trigger: 'change' }
                ],
                gainExpiredTime: [
                    { required: true, type: 'date', message: '请选择截止时间', trigger: 'change' }
                ],
            },
            tagValidate: {
                userId: [
                    { required: true, type: 'array', min: 1, message: '请输入发行数量', trigger: 'change' }
                ],
                effectTime: [
                    { required: true, type: 'date', message: '请选择发放时间', trigger: 'change' }
                ],
            },
        }
    },
    created() {
        this.getCardList()
    },
    methods: {
        // 获取列表
        getCardList() {
            this.loading = true;
            getEquitycardPageApi({
                type: 'cy',
                pageSize: this.pageSize,
                pageNumber: this.pageNumber,
                ...this.search,
            }).then(res => {
                let data = res.data;
                this.total = res.totalElements;
                this.data = data;
                this.loading = false;
            }).catch(err => {
                console.log(err);
            })
        },
        // 模糊查询
        remoteMethod1(keywords) {
            if (keywords !== '') {
                this.loading1 = true;
                let time = setTimeout(() => {
                    this.loading1 = false;
                    getUserInfoListApi({
                        type: 'member',
                        memberType: 'Caring',
                        keywords,
                    }).then(res => {
                        this.loading1 = false;
                        clearTimeout(time);
                        this.userList = res;
                    })
                }, 200);
            } else {
                this.options1 = [];
            }
        },
        // 编辑
        editCardFn(row, name) {
            this.$refs[name].resetFields();
            this.modal = true;
            if (row) {
                let data = JSON.parse(JSON.stringify(row));
                this.list = {
                    id: data.id,
                    name: data.name,
                    faceValue: data.faceValue,
                    issueQuantity: data.issueQuantity ? data.issueQuantity : '',
                    exchangeCredits: data.exchangeCredits ? data.exchangeCredits : '',
                    issueTime: this.$Date(data.issueTime).format('YYYY-MM-DD HH:mm:ss'),
                    gainExpiredTime: this.$Date(data.gainExpiredTime).format('YYYY-MM-DD HH:mm:ss'),
                    pic: data.file ? data.file.main_pic : '',
                    mode: data.mode ? data.mode.code : '',
                    remark: data.remark ? data.remark : ''
                }
            } else {
                this.list = {};
            }
        },
        // 发放按钮
        fixedBtnFn(row, key, name) {
            this.tagList.cardId = row.id;
            this.tagList.recharge = key;
            this.modelTag = true;
            this.$refs[name].resetFields();
        },
        // 保存发放
        issueSaveFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    let saveList = JSON.parse(JSON.stringify(this.tagList));
                    if (this.tagList.effectTime) {
                        saveList.effectTime = new Date(this.tagList.effectTime).getTime();
                    }

                    let formData = new FormData();

                    for (const key in saveList) {
                        if (Object.hasOwnProperty.call(saveList, key)) {
                            const element = saveList[key];
                            if (key == 'userId') {
                                element.forEach(item => {
                                    formData.append(key, item);
                                })
                            } else {
                                formData.append(key, element)
                            };
                        };
                    };

                    postEquityCardIssueApi(formData, false).then(res => {
                        this.tagList = {};
                        this.$Message.success('保存成功！')
                        this.modelTag = false;
                    })

                } else {
                    this.$Message.error('请补充必填项 !');
                }
            })
        },
        // 移除
        removeFn() {
            this.$Message.error('等待接口');
        },
        // 新建
        confirmFn(name) {

            this.$refs[name].validate((valid) => {
                if (valid) {

                    this.list.type = 'cy'
                    let formData = new FormData();

                    // 转换时间格式
                    if (this.list.issueTime) {
                        let biginDate = new Date(this.list.issueTime)
                        let y = biginDate.getFullYear();
                        let m = biginDate.getMonth() + 1;
                        m = m < 10 ? ('0' + m) : m;
                        let d = biginDate.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        this.list.issueTime = y + '-' + m + '-' + d
                    }

                    if (this.list.gainExpiredTime) {
                        let endDate = new Date(this.list.gainExpiredTime)
                        let yy = endDate.getFullYear();
                        let mm = endDate.getMonth() + 1;
                        mm = mm < 10 ? ('0' + mm) : mm;
                        let dd = endDate.getDate();
                        dd = dd < 10 ? ('0' + dd) : dd;
                        this.list.gainExpiredTime = yy + '-' + mm + '-' + dd
                    }

                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (element && key != 'pic') {
                                formData.append(key, element)
                            }
                        }
                    }

                    if (this.pic !== null) {
                        formData.append('upload[main_pic]', this.pic);
                    }
                    postEquityCardSaveApi(formData, false).then(res => {
                        if (res.id) {
                            this.$Message.success('添加成功！');
                            this.getCardList();
                            this.list = {};
                            this.modal = false;
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    this.$Message.error('请先补充必填项 !');
                }
            })
        },
        // 修改状态
        changeStatus(row) {
            let value = ''
            if (row.stage.code == 'wait') {
                value = 'issued'
            } else if (row.stage.code == 'issued') {
                value = 'stop'
            } else {
                value = 'wait'
            }
            postEquityCardStageApi({ id: row.id, value }).then(res => {
                if (res) {
                    this.$Message.success('成功！');
                    this.getCardList();
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 上传图片
        handleBeforeLicenseUrlUploadImg(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
        // 弹框状态
        visibleChange(flag) {
            if (!flag) {
                this.list = {};
            }
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getCardList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getCardList();
        },
    }
}
</script>

<style scoped lang='less'>
.sincerity_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .card_title {
        width: 100%;
        margin: 25px 0 15px;
    }
}
</style>