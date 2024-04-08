<template>
    <div class='enteringDetails'>
        <div class="i-layout-page-header">
            <PageHeader title="益助拍管理" content="拍品录入详情" hidden-breadcrumb />
        </div>
        <div class="details_main">
            <h1>拍品</h1>
            <div class="main_box">
                <div class="box_only">
                    <strong>拍卖公司</strong>
                    <Select v-model="list.merchantId" filterable>
                        <Option v-for="(option, index) in merchantList" :value="option.id" :key="index">
                            {{ option.name }}
                        </Option>
                    </Select>
                </div>
                <div class="box_only">
                    <strong>委托方</strong>
                    <Select v-model="list.entrustOrgId" filterable :remote-method="remoteMethod1" :loading="loading1">
                        <Option v-for="(option, index) in clientList" :value="option.id" :key="index">
                            {{ option.name + ` ( ${option.type && option.type.name ? option.type.name :
                                option.extra && option.extra.type == 'enterprise' ? '公司' : '个人'} )` }}
                        </Option>
                    </Select>
                </div>
                <div class="box_only">
                    <strong>商品分类</strong>
                    <TreeSelect v-model="list.categoryId" :data="classifyTree" placeholder="请选择分类" />
                </div>
                <div class="box_only">
                    <strong>拍品编号</strong>
                    <Input v-model="list.barcode" placeholder="请输入编号"></Input>
                </div>
                <div class="box_only">
                    <strong>拍品名称</strong>
                    <Input v-model="list.name" placeholder="请输入名称"></Input>
                </div>
                <div class="box_only">
                    <strong>规格</strong>
                    <Input v-model="list.spec" placeholder="请输入规格"></Input>
                </div>
                <div class="box_only">
                    <strong>数量单位</strong>
                    <Input v-model="list.quantityUnit" placeholder="请输入单位"></Input>
                </div>
                <div class="box_only">
                    <strong>起拍价</strong>
                    <Input v-model="list.priceStart" placeholder="请输入起拍价" type="number"></Input>
                </div>
                <div class="box_only">
                    <strong>评估价</strong>
                    <Input v-model="list.priceAssess" placeholder="请输入评估价" type="number"></Input>
                </div>
                <div class="box_only">
                    <strong>起拍时间</strong>
                    <DatePicker v-model="beginTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择日期和时间"
                        style="width: 84%;" />
                </div>
                <div class="box_only">
                    <strong>交付方式</strong>
                    <Select v-model="list.deliveryType" placeholder="请选择方式">
                        <Option value="offline">线下交付</Option>
                        <Option value="express">快递交付</Option>
                    </Select>
                </div>
                <div class="box_only">
                    <strong>所在区域</strong>
                    <TreeSelect v-model="list.deliveryRegionId" :data="areaTrea" placeholder="请选择区域" />
                </div>
                <div class="box_only">
                    <strong>所在地址</strong>
                    <Input v-model="list.deliveryAddr" placeholder="请输入详细地址"></Input>
                </div>

                <div class="box_only">
                    <strong>保证金</strong>
                    <Input v-model="list.priceDeposit" placeholder="请输入保证金额" type="number"></Input>
                </div>
                <div class="box_only">
                    <strong>拍卖周期</strong>
                    <Input v-model="timeList.hour" placeholder="请输入" type="number" v-width="'33%'"
                        @on-blur="timeList.hour = $event.target.value < 0 ? 0 : $event.target.value">
                    <template #append> 小时 </template>
                    </Input>
                    <Input v-model="timeList.minute" placeholder="请输入" type="number" v-width="'33%'"
                        @on-blur="timeList.minute = $event.target.value < 0 ? 0 : $event.target.value">
                    <template #append> 分钟 </template>
                    </Input>
                </div>
                <div class="box_only">
                    <strong>加价档</strong>
                    <Select v-model="list.priceAddLevelId">
                        <Option v-for="item in dictList" :key="item.id" :value="item.id">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="box_only">
                    <strong>佣金</strong>
                    <Input v-model="list.auServiceCharge" placeholder="请输入" type="number"
                        @on-blur="list.auServiceCharge = $event.target.value < 0 ? 0 : $event.target.value">
                    <template #append> % </template></Input>
                </div>
                <div class="box_line">
                    <strong>拍品照片</strong>
                    <div>
                        <div v-if="imgPic.length">
                            <Tooltip content="可点击鼠标右键删除" placement="top" v-for="(item, index) in imgPic" :key="index">
                                <img v-if="item.type == 'image'" class="good_img" :src="item.pic" :data-source="imgPic"
                                    @contextmenu.prevent.stop="removeMediaFn(item, index)" />
                                <video v-else class="good_img" :src="item.pic" controls
                                    @contextmenu.prevent.stop="removeMediaFn(item, index)"></video>
                            </Tooltip>
                        </div>
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadImg">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </div>
                </div>
                <div class="edit_box">
                    <strong>图文详情</strong>
                    <div class="edit_bar">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
                            mode="default" />
                        <Editor style="height: 372px; overflow-y: hidden" v-model="list.details"
                            :defaultConfig="editorConfig" mode="default" @onCreated="onCreated" />
                    </div>
                </div>
                <div class="box_only">
                    <strong>重要提示</strong>
                    <Input v-model="fourInfo.notice" type="textarea" :rows="6" placeholder="请输入"></Input>
                </div>
                <div class="box_only">
                    <strong>竞买协议</strong>
                    <Input v-model="fourInfo.agreement" type="textarea" :rows="6" placeholder="请输入"></Input>
                </div>
                <div class="box_only">
                    <strong>特别规定</strong>
                    <Input v-model="fourInfo.stipulation" type="textarea" :rows="6" placeholder="请输入"></Input>
                </div>
                <div class="box_only">
                    <strong>竞买公告</strong>
                    <Input v-model="fourInfo.affiche" type="textarea" :rows="6" placeholder="请输入"></Input>
                </div>
                <div class="box_only">
                    <strong>捐献规则</strong>
                    <Input v-model="fourInfo.donate" type="textarea" :rows="6" placeholder="请输入"></Input>
                </div>
            </div>
            <div class="footer_btn">
                <Space size="large">
                    <Button type="primary" @click="saveShopFn()">确认</Button>
                    <Button>取消</Button>
                </Space>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getAreaTreeApi,    // 地址树
    postGoodsInfoSaveApi,    // 拍品保存
    getGoodsInfoDetailApi,     // 拍品详情
    getGoodsCategoryTreeApi,    // 拍品分类树
    getAuctionConsignerPageApi,   // 委托方
    getMerchantBasePageApi,   // 拍卖公司
    getSysDictItemTreeApi,    // 字典

    getGoodsMediaListApi,    // 媒体列表
    postGoodsMediaBatchSaveApi,    // 媒体保存
    postGoodsMediaRemoveApi,     // 媒体删除
} from '@/api/account';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
    name: 'enteringDetails',
    components: { Editor, Toolbar },
    data() {
        return {
            editor: null,
            toolbarConfig: {},
            editorConfig: {
                MENU_CONF: {
                    uploadImage: {
                        base64LimitSize: 5000000 * 1024, // 5kb
                    },
                },
            },
            classifyTree: [],   // 分类树
            areaTrea: [],   // 地区树

            clientList: [],     // 委托方
            time1: null,
            loading1: false,   // 模糊查询

            goodsId: '',   // 拍品ID
            list: {
            },   // 保存数据
            imgPic: [],   // 图片链接
            imgFile: [],  // 图片路径
            imgIndx: 0,   // 图片位置

            dictList: [],    // 字典 - 加价档
            beginTime: '',   // 开始时间
            endTime: '',   // 截止时间
            fourInfo: {},   // 四个文本域

            timeList: {},   // 拍卖时间
            merchantList: [],   // 拍卖方
        }
    },
    created() {
        this.goodsId = this.$route.query.id;
        // 分类树
        getGoodsCategoryTreeApi({ biz: 'auction' }).then(res => {
            this.classifyTree = this.handleDataFn(res, false);
        });
        // 地区树
        getAreaTreeApi().then(res => {
            this.areaTrea = this.handleDataFn(res, false);
        });
        // 拍卖公司
        getMerchantBasePageApi({ pageSize: 99999, type: 'FACO', biz: 'auction' }).then(res => {
            console.log("🚀 ~ file: index.vue:221 ~ getMerchantBasePageApi ~ res:", res)
            this.merchantList = res.data;
        })
        // 加价档
        getSysDictItemTreeApi({ dict: 'auct_price_add_level' }, 'tree').then(res => {
            this.dictList = JSON.parse(JSON.stringify(res));
        });
        // this.detailsGoodsFn();
    },
    methods: {
        // 获取商品详情
        detailsGoodsFn() {

            getGoodsInfoDetailApi(this.goodsId).then(res => {

                if (res.entrustOrg) {
                    this.clientList = [res.entrustOrg];
                }

                this.list = {
                    id: res.id,
                    entrustOrgId: res.entrustOrg ? res.entrustOrg.id : '',
                    categoryId: res.category ? res.category.id : '',
                    barcode: res.barcode || '',
                    name: res.name || '',
                    spec: res.spec || '',
                    quantityUnit: res.quantityUnit || '',
                    deliveryType: res.deliveryType ? res.deliveryType.code : '',
                    deliveryRegionId: res.deliveryRegion ? res.deliveryRegion.id : '',
                    deliveryAddr: res.deliveryAddr || '',
                    priceStart: res.priceStart || '',  // 起拍价
                    priceAssess: res.priceAssess || '',  // 预估价
                    priceDeposit: res.priceDeposit || '',   // 保证金
                    details: res.details || '',
                    auPlatformCharge: res.auPlatformCharge || '',
                    auServiceCharge: res.auServiceCharge * 100 || '',
                    priceAddLevelId: res.priceAddLevel ? res.priceAddLevel.id : '',
                    saleTimeLength: res.saleTimeLength || '',
                }

                if (res.saleStartTime) {
                    this.beginTime = this.$Date(res.saleStartTime).format('YYYY-MM-DD HH:mm')
                }

                if (res.section) {
                    for (const key in res.section) {
                        if (Object.hasOwnProperty.call(res.section, key)) {
                            const element = res.section[key];
                            let itemKey = key.split('_')[1];
                            this.fourInfo[itemKey] = element;
                        }
                    }
                }

                this.getMediaFn(res.id);

            })
        },
        // 保存
        saveShopFn() {
            let formData = new FormData();
            formData.append('biz', 'auction');
            for (const key in this.list) {
                if (Object.hasOwnProperty.call(this.list, key)) {
                    const element = this.list[key];
                    if (key == 'auServiceCharge') {
                        formData.append('auServiceCharge', element * 1 / 100)
                    } else {
                        formData.append(key, element);
                    }
                }
            }

            formData.append('regionId', this.list.deliveryRegionId || '');
            formData.append('auPlatformCharge', 0);     // 平台服务费，前期不收为 0
            formData.append('costPrice', 0);


            let saleTimeLength = 0;   // 拍卖时长

            let { hour, minute } = this.timeList;

            if (hour) {
                saleTimeLength += hour * 60;
            }
            if (minute) {
                saleTimeLength += minute * 1;
            }

            formData.append('saleTimeLength', saleTimeLength);

            if (this.beginTime) {
                let startTime = Date.parse(new Date(this.beginTime).toString());
                let endTime = startTime * 1 + saleTimeLength * 60 * 1000;
                formData.append('saleStartTime', startTime);
                formData.append('saleEndTime', endTime);
            }
            for (const key in this.fourInfo) {
                if (Object.hasOwnProperty.call(this.fourInfo, key)) {
                    const element = this.fourInfo[key];
                    formData.append('section[au_' + key + ']', element);
                }
            }

            postGoodsInfoSaveApi(formData, false).then(res => {

                if (res.id) {
                    if (this.imgFile.length) {
                        this.saveMediaFn(res.id);   // 媒体图片保存
                    }

                    this.$router.back();
                    this.$Message.success('拍品添加成功！');
                }

            })
        },
        // 媒体列表
        getMediaFn(id) {
            let data = {
                goodsId: id,
                tag: 'mainpic',
            }
            getGoodsMediaListApi(data).then(res => {
                if (res.length) {
                    res.forEach(item => {
                        this.imgPic.push({ ids: item.id, pic: item.filePath, type: item.type.code });
                    })
                }
            })
        },
        // 媒体保存
        saveMediaFn(id) {
            let formData = new FormData();
            formData.append('goodsId', id);
            formData.append('tag', 'mainpic');
            formData.append('name', '商品主图');

            this.imgFile.forEach(item => {
                if (item) {
                    formData.append('file', item);
                }
            })

            postGoodsMediaBatchSaveApi(formData, false).then(res => {
                if (res.length) {
                    this.$Message.success('图片保存成功');
                }
            })
        },
        // 媒体删除
        removeMediaFn(row, index) {
            let ids = row.ids.toString();
            if (ids.length < 10) {
                this.imgFile.splice(ids, 1);
                this.imgPic.splice(index, 1);
            } else {
                postGoodsMediaRemoveApi({ id: ids }).then(res => {
                    this.imgPic.splice(index, 1);
                    this.$Message.success('删除成功！')
                })
            }
        },
        // 上传图片
        handleBeforeLicenseUrlUploadImg(file) {
            let type = file.type.split('/')[0];
            if (type == 'image' || type == 'video') {
                if (this.imgPic.length == 10) {
                    this.$Message.warning('最多只能上传十个图片/文件！')
                } else {
                    this.imgPic.push({ ids: this.imgIndx, pic: window.URL.createObjectURL(file), type })
                    this.imgIndx++;
                    this.imgFile.push(file);
                    // this.list.pic.push(window.URL.createObjectURL(file));
                    // this.pic.push(file);
                }
            } else {
                this.$Message.error('请上传图片！')
            }
            return false;
        },
        // 委托方 模糊查询
        remoteMethod1(query) {
            if (query.length != 24) {
                if (query !== '') {
                    this.loading1 = true;
                    if (this.time1) {
                        clearTimeout(this.time1);
                        this.time1 = null;
                    }
                    this.time1 = setTimeout(() => {
                        getAuctionConsignerPageApi({ keywords: query, pageSize: 99 }).then(res => {
                            this.clientList = res.data;
                            this.loading1 = false;
                        })
                    }, 200);
                } else {
                    this.clientList = [];
                }
            }
        },
        // 处理数据函数
        handleDataFn(arr = [], key) {
            let newArr = arr;
            arr.forEach(v => {
                v.rankType = false
                if (key) {
                    v.expand = true
                }
                v.value = v.id
                v.title = v.name
                if (v.subset && v.subset.length > 0) {
                    v.children = v.subset;
                    this.handleDataFn(v.children)
                } else if (v.children && v.children.length) {
                    this.handleDataFn(v.children)
                }
            });
            return newArr;
        },
        onCreated(editor) {
            this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        },
    },
    beforeUnmount() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
}
</script>
<style scoped lang='less'>
.details_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    h1 {
        text-align: center;
    }

    .main_box {
        width: 70%;
        margin: 20px auto;
        display: flex;
        flex-wrap: wrap;

        .box_only {
            width: 50%;
            margin-bottom: 15px;
            display: flex;

            strong {
                display: inline-block;
                width: 15%;
                text-align: right;
                padding-right: 10px;
                line-height: 32px;
                box-sizing: border-box;
            }

            .ivu-upload,
            .ivu-select,
            .ivu-input-wrapper {
                width: 84%;
                margin: 0;
            }
        }

        .box_line {
            width: 100%;
            margin-bottom: 15px;
            display: flex;

            strong {
                display: inline-block;
                width: 7.6%;
                text-align: right;
                padding-right: 10px;
                line-height: 32px;
                box-sizing: border-box;
            }

            .good_img {
                width: 130px;
                max-height: 130px;
                margin-right: 10px;
            }
        }

        .edit_box {
            width: 100%;
            height: 415px;
            margin-bottom: 15px;
            display: flex;

            strong {
                display: inline-block;
                width: 7.3%;
                text-align: right;
                padding-right: 15px;
                box-sizing: border-box;
            }

            .edit_bar {
                width: 92.6%;
                height: 415px;
                border-radius: 5px;
                border: 1px solid #ccc;
            }
        }
    }

    .footer_btn {
        border-top: 1px solid #ccc;
        padding-top: 15px;
        text-align: center;
    }
}
</style>