<template>
    <div class='shopManage'>
        <!-- <h5>门店管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="关爱服务管理" content="门店管理" hidden-breadcrumb />
        </div>
        <div class="shopManage_main">
            <div class="search_top">
                <Space size="large" wrap>
                    <!-- <Space>
                    <strong>起始时间</strong>
                    <DatePicker @on-change="changeTime" type="date" format="yyyy-MM-dd" placement="bottom-end"
                        placeholder="请选择开始时间" size="small" style="width: 160px;" />
                    <strong>至</strong>
                    <DatePicker @on-change="changeTime" type="date" format="yyyy-MM-dd" placement="bottom-end"
                        placeholder="请选择结束时间" size="small" style="width: 160px;margin-right: 10px;" />
                </Space> -->
                    <!-- <Space>
                    <strong>城市</strong>
                    <div class="search-city" style="margin-right: 10px;">
                        <City placeholder="请选择城市" :style="{ 'color': (city == '' ? '#d0c8ce' : '#515a6e') }"
                            v-model="city" />
                    </div>
                </Space> -->
                    <Space>
                        <strong>机构</strong>
                        <Select v-model="search.merchantId" placeholder="请选择所属机构" clearable size="small"
                            style="width:160px; ">
                            <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </Space>
                    <Space>
                        <strong>分类</strong>
                        <TreeSelect v-model="search.categoryId" :data="categoryList" placeholder="请选择机构分类" size="small"
                            style="width: 160px;" />
                    </Space>
                    <Space>
                        <Input v-model="search.keywords" placeholder="请输入手机号/姓名等关键字" clearable size="small"
                            style="width: 200px;" />
                        <Button type="primary" size="small" @click="pageNumber = 1; getStoreList()"> 查询</Button>
                        <Button size="small" @click="pageNumber = 1; search = {}; getStoreList()">重置</Button>
                    </Space>
                </Space>
            </div>
            <Space size="large" style="margin-bottom: 15px;">
                <Space>
                    <strong style="font-size: 16px; line-height: 32px;">
                        <Icon type="md-reorder" />门店列表
                    </strong>
                </Space>
                <Button type="primary" size="small" @click="editShopFn()">添加</Button>
            </Space>
            <Table border :columns="columns" :data="data" :loading="loading" @on-selection-change="tableSlectionChange">
                <template #kong="{ }">
                    <p>--</p>
                </template>

                <template #feature="{ row }">
                    <p v-for="item in row.tags" :key="item">{{ item }},</p>
                </template>

                <template #image="{ row }">
                    <div v-viewer>
                        <img v-if="row.file" :src="row.file.pic_0" width="120" height="120" title="点击放大">
                        <p v-else>--</p>
                    </div>
                </template>

                <template #statusSlot="{ row }">
                    <Switch v-model="row.status.code" true-value="enabled" false-value="disabled"
                        @on-change="(i) => changeStatusFn(i, row)"></Switch>
                </template>

                <template #disposeTime="{ row }">
                    <div>{{ disposeTime(row.workWeekDay) }}：</div>
                    <div>{{ tiemStartEnd(row.openTime, row.closeTime) }}</div>
                </template>

                <template #action="{ row }">
                    <Button type="warning" size="small" v-margin="5" @click="disabliedShopFn(row)">禁用</Button>
                    <Button type="primary" size="small" v-margin="5" @click="editShopFn(row)">编辑</Button>
                    <Poptip confirm transfer title="您确认删除吗?" @on-ok="removeShopFn(row)">
                        <Button type="error" size="small" v-margin="5" v-show="row.status.code != 'enabled'">删除</Button>
                    </Poptip>
                    <Button type="success" size="small" v-margin="5"
                        @click="tableSlectionChange([row]); setPayInfo.cardPayDisPt = row.cardPayDisPt * 100; modal = true;">设置优惠付</Button>
                    <Button size="small" @click="setQrcodeFn(row)">生成二维码</Button>
                </template>
            </Table>
            <div class="footer_btn" style="margin-top: 15px;">
                <Button :disabled="selectShopId.length == 0" size="small" @click="modal = true;">批量设置优惠付</Button>
            </div>
            <Page :total="total" show-total size="small" show-elevator show-sizer @on-change="changePage"
                :page-size-opts="[5, 10, 20, 30, 50]" @on-page-size-change="pageSizeChange" />
        </div>
        <Modal v-model="modal" title="设置优惠付" width="360" @on-visible-change="visibleChangeQrCode">
            <Form :model="setPayInfo" label-position="right" :label-width="110">
                <!-- <FormItem label="所属机构：">
                    <strong>{{ doorInfo.merchant ? doorInfo.merchant.name : '---' }}</strong>
                </FormItem> -->
                <FormItem label="门店名称：">
                    <p v-for="(item, index) in doorInfo" :key="index">
                        {{ item.name || '---' }} （ {{ item.id ? item.id.slice(-5) : '---' }} ）
                    </p>
                </FormItem>
                <FormItem label="最大补贴比例：">
                    <Input v-model="setPayInfo.cardPayDisPt" type="number" step="0.1"
                        @on-blur="setPayInfo.cardPayDisPt = $event.target.value < 0 ? 0 : $event.target.value * 1 > 100 ? 100 : $event.target.value * 1">
                    <template #append>
                        <span> % </span>
                    </template>
                    </Input>
                </FormItem>
                <!-- <FormItem label="是否开启">
                    <Switch></Switch>
                </FormItem> -->
            </Form>

            <template #footer>
                <Button type="primary" @click="setPayFn()">确认</Button>
                <Button @click="modal = false;">取消</Button>
            </template>
        </Modal>
        <!-- 二维码 -->
        <Modal v-model="qrModal" title="设置门店二维码" @on-visible-change="visibleChangeQrCode">
            <Form :label-width="120">
                <FormItem label="所属机构：">
                    <strong>{{ doorInfo.merchant ? doorInfo.merchant.name : '---' }}</strong>
                </FormItem>
                <FormItem label="门店名称：">
                    <strong>{{ doorInfo.name ? doorInfo.name : '---' }}</strong>
                    <strong> （ {{ doorInfo.id ? doorInfo.id.slice(-5) : '---' }} ） </strong>
                </FormItem>
                <FormItem label="尺寸：">
                    <Input type="number" v-model="qrSize"
                        @on-blur="qrSize = $event.target.value < 300 ? 300 : $event.target.value > 1200 ? 1200 : $event.target.value">

                    <template #suffix>
                        <Tooltip placement="top" content="点击生成二维码">
                            <Icon type="md-color-wand" @click="saveQrcodeFn()" title="生成二维码" />
                        </Tooltip>
                    </template>
                    </Input>
                    <p v-if="qrSize < 300 || qrSize > 1200" style="color: #ffa000;">尺寸大小：最大是1200，最小是300，请合理设置</p>
                </FormItem>
                <FormItem label="下载图片名称：">
                    <Input v-model="downIamgeName" placeholder="请输入图片保存时的名称"></Input>
                </FormItem>
                <FormItem label="生成二维码：" v-if="qrCodeImg">
                    <div v-viewer>
                        <img :src="qrCodeImg" alt="" title="右键保存" width="300" height="300">
                    </div>
                </FormItem>
            </Form>

            <template #footer>
                <Tooltip placement="top" content="请先生成二维码图片" :disabled="!!qrCodeImg">
                    <Button type="primary" @click="downloadQrcodeFn()" :disabled="!qrCodeImg"
                        style="margin-right: 12px;">下载图片</Button>
                </Tooltip>
                <Button type="primary" @click="qrModal = false;">关闭</Button>
                <Button @click="qrModal = false;">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
import {
    getStoreInfoPageApi, // 门店列表
    getSupplierCategoryTreeApi,  // 分类
    getMerchantBasePageApi, // 机构列表
    postStoreInfoRemove, // 门店删除
    postStoreInfoStatusApi,  // 门店状态修改
    postStoreInfoBatchCardPayDisApi,   // 批量设置优惠付

    postStoreInfoPayQrApi,   // 设置二维码
    getImage,   // 下载图片
} from '@/api/account.js'
import { jsonToArray2, downloadIamge } from '@/libs/util.js'
export default {
    name: 'shopManage',
    data() {
        return {
            loading: false,
            total: 0, // 总条数
            pageSize: 5,  // 条数
            pageNumber: 1,  // 页数
            search: {}, // 搜索关键字
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '所属机构',
                    // key: 'name',
                    slot: 'kong',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.merchant.name);
                    },
                },
                {
                    title: '门店名称',
                    // key: 'name',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h('div', [
                            h('div', params.row.name),
                            h('p', `（${params.row.id.slice(-5)}）`)
                        ])
                    }
                },
                {
                    title: '建立时间',
                    width: '180',
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            this.$Date(params.row.timeCreated).format("YYYY-M-D HH:mm"),
                        ]);
                    },
                },
                {
                    title: '区域城市',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.region ? params.row.region.name : '---');
                    },
                },
                {
                    title: '机构分类',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.category ? params.row.category.name : '---');
                    },
                },
                {
                    title: '机构类型',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.opType ? params.row.opType.name : '---');
                    },
                },
                {
                    title: '门店联系人',
                    key: 'principal',
                    width: 180,
                    align: "center"
                },
                {
                    title: '门店电话',
                    key: 'tel',
                    width: 180,
                    align: "center"
                },
                {
                    title: '门店图片',
                    slot: 'image',
                    width: '180',
                    align: "center",
                },
                {
                    title: '优惠付比例',
                    width: '120',
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.cardPayDisPt ? params.row.cardPayDisPt * 100 + '%' : '---');
                    },
                },
                {
                    title: '经营政策',
                    // key: 'address',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '特色设置',
                    slot: 'feature',
                    width: 180,
                    align: "center"
                },
                {
                    title: '店员数',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '统一信用代码',
                    slot: 'kong',
                    width: 180,
                    align: "center",
                    render: (h, params) => {
                        return h("div", params.row.creditCode ? params.row.creditCode : '---');
                    },
                },
                {
                    title: '套餐',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '营业额',
                    slot: 'kong',
                    width: 180,
                    align: "center"
                },
                {
                    title: '营业时间',
                    slot: 'disposeTime',
                    width: 200,
                    align: "center",
                    // render: (h, params) => {
                    //     return h('div', [
                    //         // h('p', params.row.name)
                    //     ]);
                    // }
                },
                {
                    title: '添加管理员',
                    slot: 'kong',
                    width: 180,
                    align: "center",
                },
                {
                    title: '状态',
                    slot: 'statusSlot',
                    width: 100,
                    align: "center",
                    fixed: 'right',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 220,
                    align: 'center',
                    fixed: 'right',
                }
            ], // 表头
            data: [], // 数据列表
            categoryList: [],  // 分类列表
            baseList: [],  // 机构列表
            modal: false,   // 设置优惠付
            setPayInfo: {},   // 设置信息
            selectShopId: [],    // 批量门店选中id

            qrModal: false,   // 设置二维码
            qrSize: 300,   // 二维码尺寸
            doorInfo: [],   // 操作的门店信息
            qrCodeImg: '',  // 二维码图片
            downIamgeName: '',   // 下载图名
        }
    },
    created() {
        this.getCategoryTree();
        this.getBaseList();

        let id = this.$route.query.organId || '';
        this.search.merchantId = id;

        this.getStoreList();
    },
    methods: {
        // 门店列表
        getStoreList() {
            this.loading = true
            let data = {
                biz: 'common',
                type: 'service'
            };
            for (const key in this.search) {
                if (Object.hasOwnProperty.call(this.search, key)) {
                    const element = this.search[key];
                    data[key] = element;
                }
            }
            getStoreInfoPageApi(data)
                .then(res => {
                    this.total = res.totalElements;
                    this.data = [];
                    this.data = res.data;
                    this.loading = false;
                })
        },
        // 分类列表
        getCategoryTree() {
            getSupplierCategoryTreeApi({ biz: 'common', }).then(res => {
                this.categoryList = jsonToArray2(res);
            })
        },
        // 机构列表
        getBaseList() {
            getMerchantBasePageApi({ biz: 'common', type: 'service' }).then(res => {
                let data = res.data
                data.forEach(item => {
                    item.label = item.name
                    item.value = item.id
                })
                this.baseList = [];
                this.baseList = data;
            })
        },
        // 处理营业时间
        disposeTime(times = []) {
            let start = ''
            let newArr = []
            let codeArr = ['一', '二', '三', '四', '五', '六', '日']
            if (times.length == 7) {
                return '每天'
            } else {
                times = times.sort()
                times.forEach((item, index) => {
                    if (item + 1 == times[index + 1] && item - 1 != times[index - 1]) {
                        start = codeArr[item - 1]
                    } else if (item - 1 == times[index - 1] && item + 1 != times[index + 1]) {
                        newArr.push(start + "至" + codeArr[item - 1])
                    } else if (item - 1 != times[index - 1] && item + 1 != times[index + 1]) {
                        newArr.push(codeArr[item - 1])
                    }
                })
                let str = newArr.join('、')
                return `每周${str}`
            }
        },
        tiemStartEnd(startArr = [], endArr = []) {
            let start = ''
            startArr = startArr.map((item) => {
                if (item < 10) {
                    return '0' + item
                } else {
                    return item
                }
            })
            start = startArr.join(':')
            let end = ''
            endArr = endArr.map((item) => {
                if (item < 10) {
                    return '0' + item
                } else {
                    return item
                }
            })
            end = endArr.join(':')
            return `${start} - ${end}`
        },
        // 修改状态
        changeStatusFn(value, row) {
            postStoreInfoStatusApi({
                id: row.id,
                value
            }).then(res => {
                this.getStoreList();
                this.$Message.success('状态修改成功');
            }).catch(err => {
                this.getStoreList();
            })
        },
        // 编辑跳转
        editShopFn(row) {
            let id = '';
            if (row) id = row.id;
            this.$router.push({
                path: 'newsShop',
                query: {
                    id
                }
            })
        },
        // 删除
        removeShopFn(row) {
            this.loading = true;
            postStoreInfoRemove({ id: row.id })
                .then(res => {
                    this.loading = false
                    this.$Message.success('成功删除')
                })
        },
        // 禁用按钮
        disabliedShopFn(row) {
            this.loading = true
            if (row.status.code == "enabled") {
                var status = ''
                status = 'disabled'
                postStoreInfoStatusApi({
                    id: row.id,
                    value: status
                }).then(res => {
                    // res;
                    this.loading = false
                    this.getStoreList()
                    this.$Message.success('成功禁用')
                    // console.log(res, status);
                })
            } else {
                this.$Message.success('已禁用')
                this.loading = false
            }
        },
        // 设置优惠付
        setPayFn() {
            let formData = new FormData();
            this.selectShopId.forEach(item => {
                formData.append('id', item);
            })
            formData.append('cardPayDisPt', this.setPayInfo.cardPayDisPt * 0.01)
            postStoreInfoBatchCardPayDisApi(formData, true).then(res => {
                // console.log(res);
                if (res) {
                    this.$Message.success('设置成功');
                    this.modal = false;
                    this.getStoreList();
                }
            }).catch(err => {
                this.$Message.error('设置失败')
                this.getStoreList();
            })
        },
        // 设置二维码
        setQrcodeFn(row) {
            this.qrModal = true;
            this.doorInfo = row;
        },
        // 生成二维码设置
        saveQrcodeFn() {
            postStoreInfoPayQrApi({ id: this.doorInfo.id, size: this.qrSize }).then(res => {
                this.qrCodeImg = res;
            })
        },
        // 下载并关闭弹框
        downloadQrcodeFn() {
            let url = this.qrCodeImg.split('.cn')[1];
            getImage(url).then(res => {
                downloadIamge(res.data, this.downIamgeName ? this.downIamgeName : '未定义')
            })
        },
        // 二维码弹框控制
        visibleChangeQrCode(flag) {
            if (!flag) {
                this.qrCodeImg = '';
                this.qrSize = 300;
                this.downIamgeName = '';
                this.doorInfo = [];
                this.selectShopId = [];
            }
        },
        // 表格选中
        tableSlectionChange(item) {
            this.selectShopId = [];
            this.doorInfo = item;
            item.forEach(itm => {
                this.selectShopId.push(itm.id);
            })
        },
        // 分页
        changePage(page) {
            this.pageNumber = page;
            this.getStoreList();
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getStoreList();
        },
    }
}
</script>

<style scoped lang='less'>
.shopManage_main {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;

    .search_top {
        width: 100%;
        padding: 10px 0 20px;
    }

    :deep(.ivu-page.mini) {
        margin-top: 20px;
    }
}
</style>