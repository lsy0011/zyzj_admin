<template>
    <div class='advertisingList'>
        <!-- <h5>广告列表</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="广告管理" content="广告列表" hidden-breadcrumb />
        </div>
        <div class="adv_main">
            <div class="adv_search">
                <Space size="large">
                    <Space>
                        <!-- <strong>广告位置：</strong> -->
                        <Select v-model="search.position" placeholder="请选择广告位置" clearable>
                            <Option v-for="(item, index) in positionList" :value="item.value" :key="index">
                                {{ item.title }}：{{ item.value }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <Input v-model="search.keywords" placeholder="请输入标题关键字"></Input>
                        <Button type="primary" @click="getAdvPage()">查询</Button>
                        <Button @click="search = {}; getAdvPage()">重置</Button>
                    </Space>
                </Space>
            </div>
            <div class="card_title">
                <Space size="large">
                    <strong style="font-size: 16px;line-height: 32px;">
                        <Icon type="md-list" />广告列表
                    </strong>
                    <Button type="primary" @click="eidtAdvFn(false)">新建</Button>
                </Space>
            </div>
            <div class="table_body">
                <Table border :columns="columns" :data="data" :loading="loading" ref="table">
                    <template #advPosition="{ row }">
                        <span v-for="(item, index) in row.position" :key="index">
                            {{ item }}
                            <span v-if="row.position.length != index + 1"
                                style="color: #dadada; margin: 0 5px;">/</span>
                        </span>
                    </template>
                    <template #plateSlot="{ row }">
                        <div>{{ row.bizType }}</div>
                    </template>
                    <template #rankSlot="{ row, index }">
                        <div v-if="!rankFlag || index != rankObj.show">
                            {{ row.rank }}
                            <Icon type="md-build" title="点击修改" @click="editRankFn(row, index)" />
                        </div>
                        <div v-if="rankFlag && index == rankObj.show" class="table_rank_ipt">
                            <InputNumber v-model="rankObj.value" :min="1" v-width="70" />
                            <div class="table_action">
                                <Icon type="md-checkmark" color="#2ea043" @click="rankSaveFn()" />
                                <Icon type="md-close" color="#dc362e" @click="rankFlag = false; rankObj.show = null;" />
                            </div>
                        </div>
                    </template>
                    <template #statuSlot="{ row }">
                        <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                            @on-change="v => changeStatuFn(v, row.id)"></Switch>
                    </template>
                    <template #picSlot="{ row }">
                        <div v-viewer>
                            <img :src="row.pic" alt="" width="120">
                        </div>
                    </template>
                    <template #actionSlot="{ row }">
                        <Button type="primary" size="small" v-margin="5" @click="eidtAdvFn(row)">编辑</Button>
                        <Poptip confirm transfer title="您确认删除吗?" v-margin="5" @on-ok="removeFn(row)">
                            <Button type="error" size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </div>
            <div class="foot_page" style="margin: 20px 0 0;">
                <Page :total="total" size="small" show-elevator show-sizer show-total
                    @on-page-size-change="pageSizeChange" @on-change="changePage" />
            </div>
        </div>
        <!-- 增加的弹框 -->
        <Modal @on-visible-change="visibleChange" v-model="modal" width="580" title="新增广告">
            <Form ref="listForm" :model="list" :label-width="130" :rules="ruleValidate">
                <!-- <FormItem label="终端：" prop="client">
                    <Select v-model="list.client" clearable  >
                        <Option value="pc">pc端</Option>
                        <Option value="app">移动端</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="广告标题：" prop="title">
                    <Input v-model="list.title" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="副标题：" prop="subtitle">
                    <Input v-model="list.subtitle" placeholder="请输入副标题"></Input>
                </FormItem>
                <FormItem label="跳转类型：" prop="bizName">
                    <Select v-model="list.bizName">
                        <Option value="page">页面</Option>
                        <Option value="plate">板块</Option>
                        <Option value="classify">分类</Option>
                        <Option value="detail">详情</Option>
                        <Option value="noJump">不跳转</Option>
                    </Select>
                </FormItem>
                <FormItem label="广告类型：" prop="bizType">
                    <Select v-model="list.bizType">
                        <Option v-for="(item, index) in advTypeList" :key="index" :value="item.value">
                            {{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="业务类型：" prop="apiType" v-show="list.bizType == 'goods' || list.bizType == 'service'">
                    <Select v-model="apiType">
                        <Option value="common">普通类</Option>
                        <Option value="medical">医疗类</Option>
                    </Select>
                </FormItem>
                <FormItem label="跳转板块：" prop="bizId"
                    v-if="list.bizName != 'noJump' && list.bizName != 'plate' && list.bizName != 'page'">
                    <Select v-model="list.bizId" filterable :remote-method="remoteMethod1" :loading="loading1"
                        :placeholder="placeholder" :disabled="!apiType">
                        <Option v-for="( item, index ) in  bizList " :value="item.id" :key="index">
                            {{ item.name || item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="业务对象名称：" prop="apiType">
                    <Input v-model="list.bizName" placeholder="请输入业务对象名称"></Input>
                </FormItem> -->
                <!-- 当业务类型为outWeb 使用 暂时不要 -->
                <!-- <FormItem label="外部链接：" v-else>
                    <Input v-model="list.url" placeholder="请输入"></Input>
                </FormItem> -->
                <FormItem label="广告位：" prop="position">
                    <Select v-model="list.position" multiple>
                        <Option v-for="(item, index) in positionList" :value="item.value" :key="index">
                            {{ item.title }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="广告图：" prop="pic">
                    <!-- <p>建议尺寸120*120</p> -->
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div v-viewer>
                        <img :src="list.pic" alt="" :data-source="list.pic" style="width:120px" />
                    </div>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" :loading="submitLoading" @click="confirmFn('listForm')">确认</Button>
                <Button @click="modal = false; list = {}">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getBasicRecommendPageApi,   // 广告分页
    postBasicRecommendSaveApi,   // 广告保存
    getBasicRecommendDetailApi,   // 广告详情
    postBasicRecommendRankApi,   // 广告排序
    postBasicRecommendRemoveApi,   // 广告删除
    postBasicRecommendStatusApi,    // 状态

    getServiceInfoPagetApi,   // 专栏分页
    getGoodsInfoPageApi, // 商品分页
    getCmsContentPolicyPageApi,  // 文章列表
    getCmsCategoryPolicyListApi,  //  资讯列表
} from '@api/account'
export default {
    name: 'advertisingList',
    data() {
        return {
            loading: false,
            columns: [
                {
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('div', params.index + 1)
                    }
                },
                {
                    title: '标题',
                    key: 'title',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '广告位',
                    slot: 'advPosition',
                    align: 'center',
                    minWidth: 150,
                },
                {
                    title: '终端',
                    key: 'client',
                    align: 'center',
                    width: 120
                },
                // {
                //     title: '广告备注',
                //     key: 'age',
                //     align: 'center',
                //     minWidth: 150
                // },
                {
                    title: '广告图',
                    slot: 'picSlot',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title: '跳转模块',
                    align: 'center',
                    minWidth: 150,
                    slot: 'plateSlot',
                },
                {
                    title: '业务ID',
                    align: 'center',
                    minWidth: 150,
                    key: 'bizId'
                },
                {
                    title: '排序值',
                    align: 'center',
                    slot: 'rankSlot',
                    width: 130,
                },
                {
                    title: '状态',
                    align: 'center',
                    slot: 'statuSlot',
                    width: 130,
                },
                {
                    title: '操作',
                    slot: 'actionSlot',
                    align: 'center',
                    width: 160
                },
            ],
            data: [],
            total: 0, // 总条数
            pageSize: 10,
            pageNumber: 1,
            modal: false,
            list: {
                name: '',
                bizType: '',
                pic: ''
            }, // 添加时的内容
            pic: '',
            search: {},
            rankFlag: false,  // 排序
            rankObj: {},   // 值

            // 模糊查询业务ID
            loading1: false,
            apiType: '',    // 普通 /医疗
            bizList: [],  // 数据列表
            timeBiz: null,

            jumpTarget: '',   // 跳转目标
            allTypeList: {
                page: [
                    { value: "qyk", title: "权益卡", },
                    { value: "zygc", title: "助友广场", },
                    { value: 'axrw', title: '爱心任务' },
                    { value: "cyjy", title: "创业就业", },
                    { value: "gdfw", title: "更多服务", },
                ],
                plate: [
                    { value: "yybj", title: "医药保健", },
                    { value: "ylfw", title: "医疗服务", },
                    { value: "yzp", title: "益助拍", },
                    { value: "sysc", title: "善意商城", },
                    { value: "gafw", title: "关爱服务", },
                ],
                detail: [
                    { value: "goods", title: "商品", },
                    { value: "service", title: "服务", },
                    { value: "auction", title: "拍品", },
                    { value: "information", title: "政策", },
                ],
                classify: [
                    { value: "information", title: "政策", },
                ],
                noJump: [
                    { value: "noJump", title: "不跳转", },
                ]
            },  // 广告所有类型
            advTypeList: [],  // 广告类型
            positionList: [
                { value: "banner_home_caring", title: '爱心端首页' },
                { value: "banner_home_disabled", title: '残疾端首页' },
                { value: "banner_home_top", title: '合作单位' },
                { value: "banner_home_serve", title: '服务大厅' },
                { value: "banner_home_packs", title: '超惠礼包', },

                { value: "banner_square", title: '助友广场' },
                { value: "banner_serve_top", title: '爱心服务--顶部' },
                { value: "banner_serve_list", title: '爱心服务--列表' },
                { value: "banner_welfare", title: '助友福利' },
                { value: "banner_job", title: '求职招聘' },
                { value: "banner_publish", title: '相关发布' },
                { value: "banner_donation", title: '爱心捐赠' },
                { value: "banner_enterprise", title: '企业助残' },
                { value: "banner_general", title: '通用广告' },
            ],   // 广告位置

            submitLoading: false,   // 是否跳转

            placeholder: '请先选择类型',   // 板块关键字

            ruleValidate: {
                title: [
                    { required: true, message: '请输入广告标题', trigger: 'blur' }
                ],
                subtitle: [
                    { required: false, message: '请输入副标题', trigger: 'blur' }
                ],
                // mail: [subtitle
                //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
                //     { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                // ],
                bizName: [
                    { required: true, message: '请选择跳转的类型', trigger: 'change' }
                ],
                bizType: [
                    { required: true, message: '请选择广告类型', trigger: 'change' }
                ],
                bizId: [
                    { required: true, message: '请选择跳转的板块', trigger: 'change' }
                ],
                position: [
                    { required: true, type: 'array', min: 1, message: '请选择广告显示位置', trigger: 'change' },
                    { type: 'array', max: 3, message: '最多只能选择3个', trigger: 'change' }
                ],
                pic: [
                    { required: true, message: '请选择广告图片', trigger: 'change' }
                ],
            }
        }
    },
    created() {
        this.getAdvPage();  // 广告分页
    },
    watch: {
        'list.bizType': function (newVal, oldVal) {
            if (newVal != oldVal) {
                this.bizList = [];
                this.list.bizId = '';
            }
            if (newVal == 'goods') {
                this.placeholder = '请输入商品名称关键字';
            } else if (newVal == 'service') {
                this.placeholder = '请输入服务名称关键字';
            } else {
                this.apiType = 'auction';
                this.placeholder = '请输入拍品名称关键字';
            }
        },
        'list.bizName': function (newVal, oldVal) {
            this.advTypeList = newVal ? this.allTypeList[newVal] : [];
            if (oldVal) {
                this.list.bizType = '';
            };
        }
    },
    methods: {
        // 广告分页
        getAdvPage() {
            let data = {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize
            };
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    if (element) data[key] = element;
                }
            }
            getBasicRecommendPageApi(data).then(res => {
                this.total = res.totalElements;
                this.data = res.data;
            })
        },
        // 模糊查询业务ID
        remoteMethod1(keywords) {
            // this.list.bizName = keywords;
            if (keywords !== '') {
                this.loading1 = true;
                const that = this;
                this.timeBiz = setTimeout(() => {
                    that.loading1 = false;
                    let data = {
                        pagesize: 99,
                        keywords
                    };
                    if (that.list.bizName != 'classify') {
                        if (that.list.bizType != 'information') {

                            data.biz = that.apiType;
                            if (that.apiType == 'auction') data.auState = 'wait';   // 未开始拍品

                            if (that.list.bizType != 'service') {
                                getGoodsInfoPageApi({
                                    recycled: false,
                                    ...data
                                }).then(res => {
                                    that.bizList = res.data;
                                })
                            } else {
                                getServiceInfoPagetApi(data).then(res => {
                                    this.bizList = res.data;
                                })
                            }
                        } else {
                            getCmsContentPolicyPageApi(data).then(res => {
                                this.bizList = res.data;
                            })
                        }
                    } else {
                        getCmsCategoryPolicyListApi().then(res => {
                            this.bizList = res;

                        })
                    }
                }, 200);
            } else {
                this.bizList = [];
            }
        },
        // 编辑
        async eidtAdvFn(row) {
            if (row) {
                await getBasicRecommendDetailApi(row.id).then(res => {
                    this.modal = true;
                    // this.list = {
                    //     id: res.id,
                    //     client: res.client,
                    //     title: res.title,
                    //     bizType: res.bizType,
                    // }
                    if (res.bizType == 'goodsColumn') {
                        getServiceInfoPagetApi({ biz: 'medical' }).then(res => {
                            this.bizList = res.data;
                        })
                    }
                    this.list = {
                        id: res.id,
                        title: res.title,
                        subtitle: res.subtitle,
                        bizName: res.bizName,
                        bizId: res.bizId,
                        bizType: res.bizType,
                        client: 'app',
                        pic: res.pic,
                        position: res.position,

                    };
                })
            } else {
                this.list = {
                    client: 'app',
                };
                this.modal = true;
            }
        },
        // 新建 保存
        confirmFn(name1) {

            this.$refs[name1].validate((valid) => {
                if (valid) {

                    let formData = new FormData();
                    this.submitLoading = true;
                    if (this.list.bizName == 'noJump') {
                        formData.append('bizId', 'noJump');
                        formData.append('redirect', false);
                    } else {
                        formData.append('redirect', true);
                    }
                    if (this.list.bizName == 'page' || this.list.bizName == 'plate') {
                        formData.append('bizId', '000');
                    };
                    // formData.append('client', 'app');
                    for (const key in this.list) {
                        if (Object.hasOwnProperty.call(this.list, key)) {
                            const element = this.list[key];
                            if (key == 'position' && !element.length) {
                                element.forEach(item => {
                                    formData.append('position', item)
                                })
                            } else if (element && key != 'pic') {
                                formData.append(key, element);
                            }
                            if (this.pic && key == 'pic') {
                                formData.append('uploadPic', this.pic)
                            }
                        }
                    }
                    postBasicRecommendSaveApi(formData, false).then(res => {
                        if (res.id) {
                            this.$Message.success('添加成功！');
                            this.getAdvPage();
                            this.modal = false;
                            this.submitLoading = false;
                        }
                    }).catch(err => {
                        this.submitLoading = false;
                    })
                } else {
                    this.$Message.warning('请补充必填项！')
                }
            })
        },
        // 编辑排序
        editRankFn(row, index) {
            this.rankObj = {
                id: row.id,
                value: row.rank,
                show: index,    // 编辑位置 
            };
            this.rankFlag = true;
        },
        // 保存排序
        rankSaveFn() {
            postBasicRecommendRankApi(this.rankObj).then(res => {
                // console.log(res);
                this.$Message.success('排序值保存成功！');
                this.rankFlag = false;
                this.rankObj.show = undefined;
                this.getAdvPage();
            })
        },
        // 修改状态
        changeStatuFn(value, id) {
            postBasicRecommendStatusApi({ id, value }).then(res => {
                this.$Message.success('操作成功！');
                this.getAdvPage();
            }).then(res => {
                this.getAdvPage();
            })
        },
        // 删除
        removeFn(row) {
            postBasicRecommendRemoveApi({ id: row.id }).then(res => {
                res;
                this.$Message.success('操作成功！');
                this.getAdvPage();

            })
        },
        // 上传图片
        handleBeforeLicenseUrlUpload(file) {
            this.pic = file;
            this.list.pic = window.URL.createObjectURL(file);
            return false;
        },
        visibleChange(key) {
            if (!key) {
                this.list = {};
            };
            this.$refs['listForm'].resetFields();
            this.icon = null
            this.pic = null
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getAdvPage();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getAdvPage();
        },
    }
}
</script>
<style scoped lang='less'>
.adv_main {
    margin-top: 24px;
    padding: 20px 30px;
    background-color: #fff;

    .adv_search {
        text-align: center;
    }

    .card_title {
        width: 100%;
        margin: 10px 0 15px;
    }
}

.table_rank_ipt {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .table_action {
        width: 15px;
    }
}
</style>