<template>
    <div class='newsShop'>
        <!-- <h5>新建门店管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医疗服务管理" :content="titleName" hidden-breadcrumb />
        </div>
        <div class="newsShop_main">
            <div class="top_title">{{ titleName }}</div>
            <Skeleton :loading="loadingSke" animated :paragraph="{ rows: 5, width: [ '45%', '50%', '55%', '60%', '65%'] }">
            </Skeleton>
            <div class="new_body" v-show="!loadingSke">
                <Form :model="list" label-position="right" :label-width="150" :rules="ruleValidate">
                    <FormItem label="所属机构：" prop="merchantId">
                        <!-- 就是机构 -->
                        <Select v-model="list.merchantId" filterable placeholder="请输入机构名称或手机号查询"
                            :remote-method="remoteMethodOrgan" :loading="organLoading">
                            <Option v-for="(option, index) in organList" :value="option.id" :key="index">
                                {{ option.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="机构分类：" prop="categoryId">
                        <Select v-model="list.categoryId">
                            <Option v-for="item in caregoryList" :value="item.id" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="机构名称：" prop="name">
                        <Input v-model="list.name" placeholder="请输入名称"></Input>
                        <!-- 地图  精确到坐标 -->
                    </FormItem>
                    <FormItem label="统一信用代码：" prop="creditCode">
                        <Input v-model="list.creditCode" placeholder="请输入统一信用代码"></Input>
                    </FormItem>
                    <FormItem label="所在区域：" prop="regionId">
                        <TreeSelect v-model="list.regionId" :data="areaTree" style="width: 100%;" />
                    </FormItem>
                    <FormItem label="所在地址：" prop="address">
                        <Input v-model="list.address" placeholder="请输入详细地址"></Input>
                    </FormItem>
                    <FormItem label="定位地址：" prop="address">
                        <Select v-model="searchMap" filterable :remote-method="getMapDetails" :loading="mapLoading"
                            placeholder="请输入精确地址来获取定位坐标，比如 XX省 XX市 XX区/ XX乡/镇 XX街道/号">
                            <Option v-for="(option, index) in mapList" :value="option.location" :key="index">
                                {{ option.cityname || '' }}{{ option.address || '' }}{{ option.name || '' }}
                            </Option>
                        </Select>
                        <Input disabled :placeholder="'经度' + mapLocation[0] + '，' + '纬度' + mapLocation[1]"></Input>
                    </FormItem>
                    <FormItem>
                        <!-- 这里展示的其实是地图S -->
                        <div id="container">
                            <!-- <MapContainerVue></MapContainerVue> -->
                        </div>
                    </FormItem>
                    <FormItem label="联系人：">
                        <Input v-model="list.principal" placeholder="请输入联系人"></Input>
                    </FormItem>
                    <FormItem label="门店电话：">
                        <Input v-model="list.tel" placeholder="请输入联系方式"></Input>
                    </FormItem>
                    <FormItem label="特色设置：">
                        <Select v-model="list.tags" multiple>
                            <Option value="充电宝">充电宝</Option>
                            <Option value="宽敞">宽敞</Option>
                            <Option value="环境好">环境好</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="每周时间：" prop="workWeekDay">
                        <CheckboxGroup v-model="workWeekDay" style="display: flex; justify-content: space-around;">
                            <Checkbox label="1">周一</Checkbox>
                            <Checkbox label="2">周二</Checkbox>
                            <Checkbox label="3">周三</Checkbox>
                            <Checkbox label="4">周四</Checkbox>
                            <Checkbox label="5">周五</Checkbox>
                            <Checkbox label="6">周六</Checkbox>
                            <Checkbox label="7">周日</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="营业时间：" prop="openTime">
                        <Space size="large">
                            <TimePicker :model-value="openTime" format="HH:mm" placeholder="开始时间" style="width: 104%"
                                @on-change="i => openTime = i" />
                            <strong style="line-height: 32px;">至</strong>
                            <TimePicker :model-value="closeTime" format="HH:mm" placeholder="结束时间" style="width: 104%"
                                @on-change="i => closeTime = i" />
                        </Space>
                    </FormItem>
                    <FormItem label="机构类型：" prop="opType">
                        <RadioGroup v-model="list.opType">
                            <Radio label="publicly">
                                <span>公立</span>
                            </Radio>
                            <Radio label="privately">
                                <span>民营</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="医保定点：">
                        <RadioGroup v-model="list.medicalInsurance">
                            <Radio label="true">
                                <span>是</span>
                            </Radio>
                            <Radio label="false">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="资质：">
                        <div class="aq_imgs_box">
                            <div class="aq_imgs_item" v-viewer v-for="item in aptitudeImgs" :key="item">
                                <Icon class="aq_imgs_item_close" size="25" type="md-close" />
                                <img class="aq_imgs_item_img" :src="item.img" :data-source="item.img" alt="">
                            </div>
                        </div>
                        <div class="upload" style="margin-top: 5px;">
                            <Upload :multiple="true" action="message" ref="upload"
                                :before-upload="handleBeforeLicenseUrlUpload1">
                                <Button icon="md-cloud-upload">上传文件</Button>
                                <!-- 最少1张、最多10张 -->
                            </Upload>
                        </div>
                    </FormItem>
                    <FormItem label="门店照片：">
                        <div class="uploadImg" v-for="(item, index) in list.pic" :key="index">
                            <div v-viewer>
                                <img :src="item.img" alt="" :data-source="item.img" style="width: 120px" />
                            </div>
                            <Icon type="md-close" class="uploadImg_icon" size="25" @click="imgDel(item, index)"
                                v-show="item" />
                        </div>
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </FormItem>
                </Form>
            </div>
            <div class="foot_btn">
                <Button type="primary" style="margin-right: 13px;" @click="saveShop()" :loading="saveLoading">提交</Button>
                <Button style="margin-right: 13px;" @click="goBack()">返回</Button>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getAreaTreeApi, // 地区
    getMerchantBasePageApi, // 商户 就是机构
    getSupplierCategoryTreeApi, // 分类  就是机构分类  
    getStoreInfoSaveApi, // 门店保存
    getStoreInfoDetailApi, // 门店详情
    postServiceInfoFileRemoveApi,  // 图片删除
} from '@/api/account.js'
import { jsonToArea } from "@/libs/util.js"
import AMapLoader from '@amap/amap-jsapi-loader';  // 地图
// import MapContainerVue from '../../../components/MapContainer/index.vue';
export default {
    name: 'newsShop',
    // components: { MapContainerVue },
    data() {
        return {
            loadingSke: false,  // 骨架屏
            organList: [], // 机构模糊列表
            organFlag: false, // 模糊开关
            organId: '', // 机构id
            caregoryList: [], // 分类
            medical: '', // 医保定点
            areaTree: [], // 地域列表
            list: {
                pic: [],
                tags: []
            },
            pic: [], // 图片信息
            aptitudeFile: [],  // 资质文件
            aptitudeImgs: [],  // 资质图片
            aptitudeKey: 0,   // 资质ID
            openTime: '',  // 开门时间
            closeTime: '', // 关门时间
            workWeekDay: [], // 每周营业时间
            uploadImgKey: 0,  // 上传图片数

            doorId: null,    // 门店id
            timer: null,   //  机构模糊查询
            saveLoading: false,  // 保存
            titleName: '新建门店',

            searchMap: '',   // 地图搜索
            mapList: [],   /// 地址列表
            mapLocation: [116.397755, 39.903179],   // 默认位置坐标
            map: null,
            initTime: null,  // 初始定时器
            mapLoading: false,
            mapTime: null,

            ruleValidate: {
                merchantId: [{ required: true, message: '请选择机构', trigger: 'change' }],
                categoryId: [{ required: true, message: '请选择门店分类', trigger: 'change' }],
                creditCode: [{ required: true, message: '请输入统一信用代码', trigger: 'blur' }],
                name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
                regionId: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
                address: [{ required: true, message: '请输入所在地址', trigger: 'blur' }],
                opType: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
                workWeekDay: [{ required: true, message: '请输入门店名称', trigger: 'change', type: 'array' }],
                openTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
                closeTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
            },
        }
    },
    created() {
        this.getAreaTree();
        this.getCateoryList() // 获取 分类 列表
        if (!this.$route.query.id) {
            this.doorId = null;
            this.titleName = '新建门店';
        } else {
            this.doorId = this.$route.query.id;
            this.titleName = '编辑门店';
            this.getDetails();
        }
    },
    mounted() {
        //DOM初始化完成进行地图初始化
        this.initTime = setTimeout(() => {
            this.initMap();
        }, 500);
    },
    watch: {
        searchMap(newVal, oldVal) {
            if (newVal) {
                this.mapLocation = newVal.split(',');
            }
        }
    },
    methods: {
        // 获取 门店详细信息
        getDetails() {
            this.loadingSke = true;
            getStoreInfoDetailApi(this.doorId)
                .then(res => {

                    if (res.merchant.id) {
                        this.organList = [res.merchant];
                    }

                    if (res.workWeekDay) {
                        this.workWeekDay = JSON.parse(JSON.stringify(res.workWeekDay));
                        if (this.workWeekDay.length > 0) {
                            this.workWeekDay = this.workWeekDay.map(item => {
                                return item.toString();
                            })
                        }
                    }

                    if (res.openTime && res.closeTime) {
                        let open = JSON.parse(JSON.stringify(res.openTime));
                        open = open.map((item) => {
                            if (item < 10) {
                                return '0' + item.toString();
                            } else {
                                return item.toString();
                            }
                        })
                        let close = JSON.parse(JSON.stringify(res.closeTime));
                        close = close.map((item) => {
                            if (item < 10) {
                                return '0' + item;
                            } else {
                                return item;
                            }
                        })
                        this.openTime = open.join(':');
                        this.closeTime = close.join(':');
                    }

                    let arr = res;
                    let url = [];
                    if (arr.file) {
                        let key = Object.keys(arr.file);
                        let values = Object.values(arr.file);
                        for (let i = 0; i < key.length; i++) {
                            // console.log(key[i], values[i]);
                            url.push({ id: key[i], img: values[i] });
                        }
                    }
                    if (res.file) {
                        this.pic = [];
                    };

                    this.mapLocation = res.coordinates ? res.coordinates : [];

                    this.list = {
                        regionId: res.region ? res.region.code : '',
                        merchantId: res.merchant ? res.merchant.id : '',
                        categoryId: res.category ? res.category.id : '',
                        name: res.name,
                        creditCode: res.creditCode || '',
                        address: res.address ? res.address : '',
                        principal: res.principal ? res.principal : '',
                        tel: res.tel ? res.tel : '',
                        tags: res.tags ? res.tags : [],
                        opType: res.opType ? res.opType.code : '',
                        medicalInsurance: res.medicalInsurance ? res.medicalInsurance.toString() : 'false',
                        pic: url,
                    };
                    this.loadingSke = false;
                })
        },
        // 保存新建、编辑
        saveShop() {
            let formData = new FormData();
            if (this.doorId) {
                formData.append('id', this.doorId);
            }

            formData.append('biz', 'medical');
            for (const key in this.list) {
                if (Object.hasOwnProperty.call(this.list, key)) {
                    const element = this.list[key];
                    if (key != 'pic') {
                        formData.append(key, element);
                    };
                }
            }

            formData.append('workWeekDay', this.workWeekDay ? this.workWeekDay : '');
            formData.append('coordinates', this.mapLocation.join());

            if (this.pic.length > 0 && this.pic) {
                this.pic.forEach(item => {
                    formData.append('pic', item);
                })
            };


            if (this.openTime != '' && this.closeTime != '') {
                formData.append('openTime', this.openTime ? this.openTime.split(':') : '');
                formData.append('closeTime', this.closeTime ? this.closeTime.split(':') : '');
                this.saveLoading = true;
                getStoreInfoSaveApi(formData, false).then(res => {
                    if (res.id) {
                        this.$Message.success('修改/添加成功')
                        this.$router.back();
                    };
                }).catch(err => {
                    this.saveLoading = false;
                })

            } else {
                this.$Message.warning('营业时间不能为空！')
            }
        },
        // 机构的模糊查询
        remoteMethodOrgan(keywords) {
            if (keywords) {

                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout(() => {
                    getMerchantBasePageApi({
                        keywords,
                        biz: 'medical',
                        type: 'service',
                        pageSize: 999,
                    }).then(res => {
                        this.organList = res.data;
                    })
                }, 300);
            } else {
                this.organList = [];
            }
        },
        // 获取 分类 列表
        getCateoryList() {
            getSupplierCategoryTreeApi({ biz: 'medical' })
                .then(res => {
                    res.forEach(element => {
                        element.label = element.name
                    });
                    this.caregoryList = res;
                    // console.log(res);
                })
        },
        // 资质图片上传
        handleBeforeLicenseUrlUpload1(file) {
            file.ids = this.aptitudeKey;
            if (this.aptitudeImgs.length > 3) {
                this.$Message.error('请注意最多上传4张')
            } else {
                this.aptitudeImgs.push({
                    ids: this.aptitudeKey,
                    img: window.URL.createObjectURL(file),
                });
                this.aptitudeFile.push(file);
                this.aptitudeKey++;
                return false;
            }
        },
        // 上传门店图片
        handleBeforeLicenseUrlUpload(file) {
            file.ids = this.uploadImgKey;
            this.list.pic.push({
                ids: this.uploadImgKey,
                img: window.URL.createObjectURL(file),
            });
            this.pic.push(file);
            this.uploadImgKey++;
            return false;
        },
        // 门店 图片删除
        imgDel(item, index) {
            if (item.id) {
                let data = {
                    id: this.doorId,
                    key: item.id,
                };
                postServiceInfoFileRemoveApi(data).then((res) => {
                    this.$Message.success("删除成功");
                    // this.list.img = ''
                    this.list.pic.splice(index, 1);
                });
            } else {
                this.list.pic.splice(index, 1);
                for (let i = 0; i < this.pic.length; i++) {
                    if (this.pic[i].ids === item.ids) {
                        this.pic.splice(i, 1);
                        break;
                    }
                }
            }
        },
        // 返回按钮
        goBack() {
            this.$router.back()
        },
        // 地图
        initMap() {
            AMapLoader.load({
                key: "e90d04bbf1c2d8f7bf238bf6e4ad5f69",             // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                // plugins: [''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap) => {
                this.map = new AMap.Map("container", {
                    viewMode: "3D",
                    zoom: 12,
                    zooms: [2, 22],
                    center: this.mapLocation,
                });
                let positionArr = [
                    this.mapLocation,
                    // [114.555528, 37.727903],
                    // [112.106257, 36.962733],
                    // [109.830097, 31.859027],
                    // [116.449181, 39.98614],
                ];
                for (let item of positionArr) {
                    let marker = new AMap.Marker({
                        position: [item[0], item[1]],
                    });
                    this.map.add(marker);
                }
            }).catch(e => {
                console.log(e);
            })
        },
        // 搜索详细地址
        getMapDetails(keywords) {
            // 	https://restapi.amap.com/v3/geocode/geo?address=北京市朝阳区阜通东大街6号&output=XML&key=<用户的key>
            let webKey = '27c780056acd28eb577f8298beaaffe4';

            let mapKey = keywords.trim();
            if (mapKey) {

                if (this.mapTime) {
                    clearTimeout(this.mapTime);
                    this.mapTime = null;
                }
                this.mapLoading = true;
                this.mapTime = setTimeout(() => {
                    fetch(`https://restapi.amap.com/v3/place/text?key=${webKey}&keywords=${mapKey}&offset=20&page=1`)
                        .then(response => {
                            return response.json()
                        })
                        .then(res => {
                            let pois = JSON.parse(JSON.stringify(res.pois));
                            this.mapLoading = false;
                            if (pois.length > 0) {
                                this.mapList = pois;
                                this.initMap();
                            }
                        });
                }, 200);
            } else {
                this.$Message.warning('请输入要查询的地址')
            }
        },
        // 地区
        getAreaTree() {
            getAreaTreeApi().then(res => {
                this.areaTree = jsonToArea(res, 'code', false)
            }).catch(err => {
                console.log(err);
            })
        }
    },
    unmounted() {
        this.map = null;
        this.timer = null;
        this.initTime = null;
        this.openTime = [];
        this.closeTime = [];
    }
}
</script>
<style scoped lang='less'>
.newsShop_main {
    margin-top: 24px;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #fff;

    .new_body {
        width: 65%;
        margin: 0 auto;
    }

    .top_title {
        font-weight: 600;
        text-align: center;
        font-size: 18px;
        margin-bottom: 15px;
    }

    .aq_imgs_box {
        width: 100%;
        border: 1px dashed #ddd;
        border-radius: 5px;
        display: flex;
        justify-content: space-around;

        .aq_imgs_item {
            width: 23%;
            height: 100%;
            padding: 10px 0;
            box-sizing: border-box;
            position: relative;
        }

        .aq_imgs_item_close {
            color: #f00;
            position: absolute;
            top: 0px;
            right: -10px;
        }

        .aq_imgs_item_img {
            width: 100%
        }
    }


    .image1 {
        width: 100%;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-around;
        border: 1px dashed #ddd;
    }

    .uploadImg {
        position: relative;
        display: inline-block;
        margin-right: 16px;

        .uploadImg_icon {
            position: absolute;
            right: -10px;
            top: -10px;
            cursor: pointer;
        }
    }

}

.foot_btn {
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #ddd;
}

#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 400px;
}
</style>