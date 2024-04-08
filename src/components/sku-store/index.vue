<template>
    <div class='sku-store'>
        <!-- 尺寸块 -->
        <Row style="border: #d7d7d7 1px solid;padding: 10px 0;">
            <Col span="2" style="line-height: 52px;">
            <strong>商品规格</strong></Col>
            <Col span="20">
            <Row style="padding: 10px 0;">
                <Col span="6">
                <Select clearable v-model="specList.propertyId" placeholder="规格属性" @on-change="(i) => sizeIndex = i">
                    <Option v-for="(item, index) in propertyList" :key="index" :value="index">
                        {{ item.name }}
                    </Option>
                </Select>
                </Col>
                <Col span="8">
                <Button style="margin: 0 10px;" @click="newsSize(); specList.propertyId = ''"
                    :disabled="specList.propertyId == undefined">新增规格</Button>
                <Button size="small" @click="attrFlag = true;">补充规格</Button>
                <i style="color: #ffa000; font-size: 12px;transform: scale(.6);">（请先选择商品分类，此处统一管理该商品的所有规格）</i>
                </Col>
            </Row>
            </Col>
            <Col span="2">
            </Col>
            <Col span="2">
            </Col>
            <!-- 规格块 -->
            <Col span="20" class="prop_box_all">
            <div class="top_prop" v-for="(item, index) in haveSizeList" :key="index" :value="item.property.id">
                <Icon type="md-close" @click="delSizeOne(item, index)" color="#f00" />
                <div class="prop_btn">
                    <Button style="width: 45%;">{{ item.property.name }}</Button>
                </div>
                <div class="size_box">
                    <div class="size_box_in">
                        <div class="size_item" v-for="(itm) in item.value" :key="itm.id">
                            <div class="size_item_left">
                                <Icon type="md-close" @click="delSizeFn(itm)" color="#f00" />
                                <div class="item_left_title">
                                    <p> {{ itm.value }} </p>
                                </div>
                                <Switch v-model="itm.pic" title="是否显示规格图" type="small"
                                    @on-change="(i) => uploadImgSwitch(i, itm)">
                                </Switch>
                            </div>
                            <div class="size_item_right" title="上传图片">
                                <Upload ref="upload" action=""
                                    :before-upload="(file) => handleBeforeLicenseUrlUploadStock(file, itm)">
                                    <Button icon="ios-cloud-upload-outline"
                                        style="margin:0;width:120px;box-sizing:border-box;">上传图片</Button>
                                </Upload>
                                <div v-viewer>
                                    <img :src="itm.img" alt="" :data-source="itm.img" style="width:120px;height: 120px;" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="size_footer_btn">
                    <Input placeholder="输入属性值名称" v-model="attrName[index]" style="width: 57%;" :key="index"></Input>
                    <Button icon="md-add" type="primary" @click="addNewSize(index)" style="width: 38%;">新增属性值</Button>
                </div>
            </div>
            </Col>
        </Row>
        <Row style="border: #d7d7d7 1px solid; margin-top: 25px;padding: 10px 0;">
            <Col span="1">
            </Col>
            <Col span="23">
            <strong>上架规格及库存 <span style="color:#ffa000;">（必填项，当上方 “ 商品规格 ”
                    完善后，请选择上架商品的规格与库存）</span></strong></Col>
            <Col span="2">
            </Col>
            <Col span="20">
            <div class="add_store" style="margin: 10px 0;">
                <Select v-for="(item, index) in haveSizeList" :key="index" :placeholder="item.property.name"
                    style="width: 80px; margin-right: 15px;" v-model="stockList[index]">
                    <Option v-for="itm in item.value" :key="itm.id" :value="itm.id">{{ itm.value }}</Option>
                </Select>
                <Input v-model="stocks" placeholder="库存" style="width: 80px; margin-right: 15px;"></Input>
                <Button type="primary" :disabled="!stocks" @click="addNewStocks()">增加</Button>
            </div>
            <div style="width:80%">
                <Table :loading="loading" :columns="columns" :data="skuList" border size="small">
                    <template #stocks="{ index }">
                        <!-- <Input v-model="skuList[index].stocks" type="number" style="width: 100px" size="small" /> -->
                        <div>{{ skuList[index].stocks }}</div>
                    </template>
                    <template #action="{ row }">
                        <Poptip confirm transfer title="您确认删除吗?" @on-ok="delStockFn(row)">
                            <Button type="error" size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </div>
            </Col>
        </Row>
        <!-- 增加规格弹框 -->
        <Modal class-name="vertical-center-modal" v-model="attrFlag" title="补充属性">
            <Form ref="addAttr" :model="addAttr" :label-width="120">
                <FormItem label="属性名称：">
                    <Input v-model="addAttr.attrName" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="商品分类：">
                    <TreeSelect v-model="addAttr.categoryId" multiple :data="classifyList" transfer />
                </FormItem>
                <FormItem label="排序：">
                    <Input v-model="addAttr.rank" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="图片：">
                    <p>建议尺寸120*120</p>
                    <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUploadAttr">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                    <div>
                        <img :src="addAttr.pic" alt="" :data-source="addAttr.pic" style="width:120px" />
                    </div>
                </FormItem>
            </Form>
            <template #footer>
                <Button type="primary" @click="pushConfirm()">确认</Button>
                <Button @click="attrFlag = false; addAttr = {};">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import {
    getGoodsPropertyValueListApi,    // 规格属性列表
    postGoodsPropertyValueSaveApi,  // 规格值保存
    postGoodsPropertyValueRemoveApi,   // 规格删除
    getGoodsPropertyPageApi, // 属性列表
    postGoodsSkuSaveApi,  //  规格保存--->  库存
    getGoodsSkuListApi, // 库存列表
    postGoodsSkuRemoveApi,  // 库存删除

    postGoodsPropertySaveApi,   // 规格保存
} from '@/api/account'
export default {
    name: 'sku-store',
    props: {
        bizType: {    // 业务类型
            type: String,
            default: '',
        },

        goodsId: {    // 商品id
            type: String,
            default: '',
        },
        classId: {    // 分类id
            type: String,
            default: '',
        },
        classifyList: {   // 商品分类
            type: Array,
            default: []
        },
        haveSizeList: {    // 拥有的规格列表
            type: Array,
            default: []
        }
    },
    data() {
        return {
            loading: false,
            loadingSke: false,  // 骨架屏
            columns: [
                {
                    title: '库存',
                    minWidth: 200,
                    slot: 'stocks',
                },
                {
                    title: '编码',
                    width: 110,
                    key: 'code'
                },
                // {
                //     title: '排序值',
                //     width: 200,
                //     align: 'center',
                //     fixed: 'right',
                //     slot: 'rank'
                // },
                {
                    title: '操作',
                    width: 150,
                    fixed: 'right',
                    slot: 'action'
                },
            ],
            columns1: [
                {
                    title: '库存',
                    minWidth: 200,
                    slot: 'stocks',
                },
                {
                    title: '编码',
                    width: 110,
                    key: 'code'
                },
                {
                    title: '操作',
                    width: 150,
                    fixed: 'right',
                    align: 'center',
                    slot: 'action'
                }
            ],

            // haveSizeList: [],
            attrName: [], // 属性名
            stockList: [], // 添加库存
            stocks: 0, // 库存量
            skuList: [], // 库存列表
            goodsPic: [], // 商品图

            specList: {},   // 新增规格
            sizeIndex: 0,   // 新增索引
            propertyList: [],    // 所有规格列表

            tabsId: '',   // 暂搬 无用

            addAttr: {
                attrName: '',
                categoryInfo: '',
                categoryId: '',
                rank: '',
                pic: ''
            },
            attrPic: null,
            attrFlag: false, // 弹窗的状态
        }
    },
    watch: {
        classId(newV, oldV) {
            if (newV && newV != oldV) {
                this.getCid(newV);
            }
        },
        // 'specList.propertyId': {
        //     handler(item1, item2) {
        //         console.log("🚀 ~ file: index.vue:246 ~ handler ~ item1, item2:", '新：', item1, '旧：', item2)
        //         // item1为新值，item2为旧值
        //     }
        // }
    },
    //  保存商品  ，  获取商品属性列表
    inject: ["fatherGoodsSave", 'getGoodsPropertyValueList'],
    methods: {
        // 上传图片开关
        uploadImgSwitch(flag, row) {
            this.handleBeforeLicenseUrlUploadStock(false, row, flag)
        },
        // 上传规格图片
        handleBeforeLicenseUrlUploadStock(file, row, flag = true) {
            let formData = new FormData()
            formData.append('id', row.id);
            formData.append('goodsId', row.goodsId);
            formData.append('propertyId', row.propertyId);
            formData.append('value', row.value);
            formData.append('pic', flag);
            if (file) {
                formData.append('upload[pic]', file);
            };
            postGoodsPropertyValueSaveApi(formData, false).then(res => {
                if (res.id) {
                    this.$Message.success('操作成功！');
                    this.getGoodsPropertyValueList();
                }
            }).catch(err => {
                console.log(err);
            })
            return false;
        },
        // 规格删除
        delSizeFn(row) {
            postGoodsPropertyValueRemoveApi({ id: row.id }).then(res => {
                if (res.success) {
                    this.$Message.success('操作成功');
                    this.getGoodsPropertyValueList();
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 删除尺寸块
        delSizeOne(item, index) {
            if (item.value.length == 0) {
                this.haveSizeList.splice(index, 1);
            } else {
                this.$Message.warning('内有属性，不能删除')
            }
        },


        // 新增  属性值
        addNewSize(ix) {
            let property = this.haveSizeList[ix].property;
            if (!this.goodsId) {
                // 提交保存接口   （是否返回，规则1，规则2）
                this.fatherGoodsSave(false, 'formData1', 'formData2').then(res => {
                    this.saveAttrFn(property, ix)
                })
            } else {
                this.saveAttrFn(property, ix);
            }
        },
        // 保存属性
        saveAttrFn(prop, i) {
            let formData = new FormData();
            this.loading = true;
            formData.append('id', this.goodsId ? this.goodsId : '');
            formData.append('goodsId', this.goodsId ? this.goodsId : this.goodsId ? this.goodsId : '');
            formData.append('propertyId', prop.id ? prop.id : '');
            formData.append('value', this.attrName[i] ? this.attrName[i] : '');
            formData.append('biz', this.bizType);
            postGoodsPropertyValueSaveApi(formData, false).then((res) => {
                this.$Message.success('添加成功');
                this.getGoodsPropertyValueList();
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            });
        },
        // 获取库存列表
        getgoodsSkuList() {

            if (this.goodsId) {
                getGoodsSkuListApi({ goodsId: this.goodsId }).then(res => {
                    let arr = res;
                    arr.forEach(v => {
                        v.rankType = false;
                        v.propertyValueId = [];
                        v.propertyValue.forEach(a => {
                            if (a.value[0]) {
                                v[a.property.id] = a.value[0].value;
                                v.propertyValueId.push(a.value[0].id);
                            }
                        });
                    });
                    // console.log(arr);
                    this.skuList = arr;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
                // 
                getGoodsPropertyValueListApi({ goodsId: this.goodsId }).then(res => {
                    let arr = res;
                    let com = JSON.parse(JSON.stringify(this.columns1));
                    for (let i = arr.length - 1; i >= 0; i--) {
                        // console.log(arr[i]);
                        com.unshift({
                            title: arr[i].property.name,
                            minWidth: 200,
                            key: arr[i].property.id,
                        })
                    }
                    this.columns = com;
                    this.propertyValueList = arr;    // 没用到

                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
            }
        },
        // 添加新的库存
        addNewStocks() {
            let formData = new FormData();
            formData.append('id', this.goodsId ? this.goodsId : '');
            formData.append('stocks', this.stocks ? this.stocks : 0);
            formData.append('goodsId', this.goodsId);
            this.stockList.forEach(v => {
                formData.append('propertyValueId', v);
            });
            postGoodsSkuSaveApi(formData, false).then((res) => {
                this.$Message.success('添加成功');
                this.getgoodsSkuList()
                this.loading = false
            }).catch((err) => {
                this.loading = false
            });
        },
        // 删除库存
        delStockFn(row) {
            postGoodsSkuRemoveApi({ id: row.id }).then(res => {
                if (res.success) {
                    this.getgoodsSkuList();
                    this.$Message.success('操作成功');
                }
            }).catch(err => {
                console.log(err);
            })
        },


        // 新增规格
        newsSize() {
            let i = this.specList.propertyId;
            if (this.haveSizeList.length >= 3) {
                this.$Message.error('不好意思，最多只能加三个！！！')
            } else {
                if (i !== '') {
                    let newData = {
                        property: {
                            name: this.propertyList[i].name,
                            id: this.propertyList[i].id
                        },
                        value: []
                    };
                    let ifAdd = false;
                    this.haveSizeList.map(item => {
                        if (item.property.name === newData.property.name) {
                            this.$Message.warning('规格值不能重复，属性值可添加多个 ！');
                            ifAdd = true;
                        }
                    });
                    if (!ifAdd) {
                        this.haveSizeList.push(newData);
                    }
                } else {
                    this.$Message.info('请先选择')
                }
            }
        },
        // 根据分类来获取属性列表
        getCid(cid) {
            // 这是根据分类id来获取的属性列表，判断属性id的改变来改变
            getGoodsPropertyPageApi({ categoryId: cid, biz: this.bizType })
                .then((res) => {
                    let arr = res.data
                    arr.forEach((v) => {
                        v.rankType = false;
                        v.categoryId = v.categoryInfo ? v.categoryInfo.map(v => { return v.id }) : []
                        v.categoryName = v.categoryInfo ? v.categoryInfo.map(v => { return v.name }).join(",") : ''
                    });
                    this.propertyList = arr;
                    this.loading = false
                }).catch((err) => {
                });
        },

        // 弹框的确认
        pushConfirm() {
            let formData = new FormData();
            if (this.addAttr.attrName !== '') {
                formData.append('name', this.addAttr.attrName ? this.addAttr.attrName : '');
            }
            if (this.addAttr.categoryId && this.addAttr.categoryId.length > 0) {
                this.addAttr.categoryId.forEach(v => {
                    formData.append('categoryId', v);
                });
            }
            formData.append('rank', this.addAttr.rank ? this.addAttr.rank : '');
            if (this.attrPic !== null) {
                formData.append('upload[pic]', this.attrPic);
            }
            formData.append('biz', this.bizType);
            if (this.addAttr.attrName && this.addAttr.categoryId.length > 0) {
                postGoodsPropertySaveApi(formData, false).then((res) => {
                    if (res) {
                        this.attrFlag = false;
                        this.$Message.success('添加成功！');
                        this.getCid(this.classId);
                        this.addAttr = {};
                    };
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                this.$Message.error('属性名称和所属分类未填写')
            }
        },
        // 属性图
        handleBeforeLicenseUrlUploadAttr(file) {
            this.attrPic = file;
            this.addAttr.pic = window.URL.createObjectURL(file);
            return false;
        },

    }
}
</script>
<style scoped lang='less'>
.prop_box_all {
    // width: 100%;
    display: flex;

    .top_prop {
        // height: 210px;
        margin-right: 20px;
        padding: 5px;
        box-sizing: border-box;
        border: 1px solid #c7c9cd;
        width: 26%;

        .prop_btn {
            width: 100%;
            height: 33px;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .size_box {
            width: 100%;
            margin: 15px 0;
            overflow-x: auto;
            white-space: nowrap;

            &::-webkit-scrollbar {
                width: 2px;
                height: 8px;
                border-radius: 8px;
            }

            /* 滚动槽 */
            &::-webkit-scrollbar-track {
                /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
                background-color: #ffffff;
            }

            /* 滚动条滑块 */
            &::-webkit-scrollbar-thumb {
                border-radius: 8px;
                height: 8px;
                background: #dfdfdf;
                /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
            }


            .size_box_in {
                // width: 100%;
                height: 100%;
                display: flex;
                flex-wrap: nowrap;
                justify-content: flex-start;

                .size_item {
                    // min-width: 200px;
                    display: inline-block;
                    padding: 1px;
                    margin-right: 20px;
                    box-sizing: border-box;
                    position: relative;

                    .size_item_left {
                        width: 60px;
                        height: 165px;
                        text-align: center;
                        position: absolute;
                        left: 0;
                        top: 0;

                        .item_left_title {
                            width: 60px;
                            height: 80%;
                            padding: 10px 15px;
                            box-sizing: border-box;
                            margin-bottom: 5px;
                            border: 1px solid #c7c9cd;
                            border-radius: 9px;

                            p {
                                text-align: center;
                                width: 29px;
                                overflow: hidden;
                                white-space: normal;
                                word-break: break-all;
                            }

                        }

                        i {
                            position: absolute;
                            right: -10%;
                            top: -1%;
                        }
                    }

                    .size_item_right {
                        width: 186px;
                        text-align: center;
                        padding-left: 66px;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }
}

.ivu-col-span-2 {
    line-height: 32px;
    padding-right: 15px;
    text-align: right;
}
</style>