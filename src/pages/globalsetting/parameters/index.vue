<template>
    <!-- 系统参数设置 -->
    <div class="paremeters">
        <!-- <h5>系统参数设置/社群设置/客服企业微信设置</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="全局设置" content="系统设置" hidden-breadcrumb />
        </div>
        <main class="pare-main">
            <Grid square border>
                <!-- 第一块系统参数设置 -->
                <GridItem style="width: 30.2%; height: 450px; margin: 0 2.15%;">
                    <h4 class="item_head_title">系统参数设置</h4>
                    <Form :model="list" label-position="right" :label-width="160" style="width: 80%;">
                        <FormItem label="残疾人提现手续费：">
                            <Input v-model="list.widthdrawCharge">
                            <template #append>
                                <span>%</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="普通用户提现手续费：">
                            <Input v-model="list.widthdrawCharge">
                            <template #append>
                                <span>%</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="勤工助学提现手续费：">
                            <Input v-model="list.widthdrawCharge">
                            <template #append>
                                <span>%</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="本地商户提现手续费：">
                            <Input v-model="list.widthdrawCharge">
                            <template #append>
                                <span>%</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="合作企业提现手续费：">
                            <Input v-model="list.widthdrawCharge">
                            <template #append>
                                <span>%</span>
                            </template>
                            </Input>
                        </FormItem>
                    </Form>
                    <div class="item_foot_btn">
                        <Space wrap><Button type="primary" @click="submitFn()">确认保存</Button></Space>
                    </div>
                </GridItem>
                <!-- 第二块企业客服 -->
                <GridItem style="width: 30.2%; height: 450px;">
                    <h4 class="item_head_title">企业微信客服设置</h4>
                    <div class="item_main">
                        <Form :model="list" label-position="right" :label-width="160" style="width: 83%;">
                            <FormItem label="客服链接：" v-margin="5">
                                <Input v-model.trim="wxList.weChatCsLink" placeholder="请输入企业微信客服接待链接" />
                            </FormItem>
                            <FormItem label="客服电话：" style="margin: 10px 0;">
                                <Input v-model.trim="wxList.wxCsTel" placeholder="请输入客服电话" />
                            </FormItem>
                            <FormItem label="客服微信：" style="margin: 10px 0;">
                                <Input v-model.trim="wxList.wxCsNumber" placeholder="请输入客服微信" />
                            </FormItem>
                            <FormItem label="企业ID：" style="margin: 10px 0;">
                                <Input v-model.trim="wxList.corpid" placeholder="请输入企业ID" />
                            </FormItem>
                            <FormItem label="商务合作ID：" style="margin: 10px 0;">
                                <Input v-model.trim="wxList.commerceWorkId" placeholder="请输入商务合作ID" />
                            </FormItem>
                            <FormItem label="客服二维码链接：" v-margin="5" style="text-align: left;">
                                <strong>{{ wxList.communityQrPic }}</strong>
                                <!-- <Input v-model.trim="wxList.corpid" placeholder="请输入企业ID" /> -->
                            </FormItem>
                        </Form>
                    </div>
                    <div class="item_foot_btn">
                        <Space wrap><Button type="primary" @click="setWXCustomerFn()">确认保存</Button></Space>
                    </div>
                </GridItem>
                <!-- 第三块，上传图片 -->
                <GridItem style="width: 30.2%; height: 450px; margin: 0 2.15%;">
                    <h4 class="item_head_title">微信客服二维码设置</h4>
                    <div class="item_main">
                        <div>
                            <img :src="list.communityQrPic" alt="" :data-source="list.pic" style="width:240px" />
                        </div>
                        <Upload ref="upload" action="" :before-upload="handleBeforeLicenseUrlUpload">
                            <Button icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </div>
                    <div class="item_foot_btn">
                        <Space wrap><Button type="primary" @click="submitFn()">确认保存</Button></Space>
                    </div>
                </GridItem>
            </Grid>
        </main>
        <!-- 第二行 -->
        <main class="pare-main">
            <Grid square border>
                <GridItem style="width: 30.2%; height: 323px; margin: 0 2.15%;">
                    <h4 class="item_head_title">医药保健运费设置</h4>
                    <Form :model="list" label-position="right" :label-width="160" style="width: 80%;">
                        <FormItem label="单个商品运费：">
                            <Input style="width: calc(100% - 15px);" type="number">
                            <template #append>
                                <span>元</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="满：">
                            <Input style="width: calc(100% - 15px);" type="number">
                            <template #append>
                                <span>元 包邮</span>
                            </template>
                            </Input>
                        </FormItem>
                    </Form>
                    <div class="item_foot_btn">
                        <Button type="primary">确认保存</Button>
                    </div>
                </GridItem>
                <GridItem style="width: 30.2%; height: 323px;">
                    <h4 class="item_head_title">善益商城运费设置</h4>
                    <Form :model="list" label-position="right" :label-width="160" style="width: 80%;">
                        <FormItem label="单个商品运费：">
                            <Input style="width: calc(100% - 15px);" type="number">
                            <template #append>
                                <span>元</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="满：">
                            <Input style="width: calc(100% - 15px);" type="number">
                            <template #append>
                                <span>元 包邮</span>
                            </template>
                            </Input>
                        </FormItem>
                    </Form>
                    <div class="item_foot_btn">
                        <Button type="primary">确认保存</Button>
                    </div>
                </GridItem>
                <GridItem style="width: 30.2%; margin: 0 2.15%; height: auto;">
                    <h4 class="item_head_title">订单自动确认时长</h4>
                    <!-- 正式版 -->
                    <Form :model="list" v-if="envType" label-position="right" :label-width="160" style="width: 80%;">
                        <FormItem label="普通实物订单：">
                            <Input v-model="orderLength.common" type="number"
                                @on-blur="orderLength.common = $event.target.value < 0 ? 0 : $event.target.value">
                            <template #append>
                                <span>天</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="医药实物订单：">
                            <Input v-model="orderLength.medical" type="number"
                                @on-blur="orderLength.medical = $event.target.value < 0 ? 0 : $event.target.value">
                            <template #append>
                                <span>天</span>
                            </template>
                            </Input>
                        </FormItem>
                        <FormItem label="拍卖实物订单：">
                            <Input v-model="orderLength.auction" type="number"
                                @on-blur="orderLength.auction = $event.target.value < 0 ? 0 : $event.target.value">
                            <template #append>
                                <span>天</span>
                            </template>
                            </Input>
                        </FormItem>
                    </Form>
                    <!-- 测试版 -->
                    <Form :model="list" v-else label-position="right" :label-width="160" style="width: 80%;">
                        <FormItem label="普通实物订单：">
                            <div style="display: flex;">
                                <Input v-model="orderLength.common.hour" type="number"
                                    @on-blur="orderLength.common.hour = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>小时</span>
                                </template>
                                </Input>
                                <Input v-model="orderLength.common.minute" type="number"
                                    @on-blur="orderLength.common.minute = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>分钟</span>
                                </template>
                                </Input>
                            </div>
                        </FormItem>
                        <FormItem label="医药实物订单：">
                            <div style="display: flex;">
                                <Input v-model="orderLength.medical.hour" type="number"
                                    @on-blur="orderLength.medical.hour = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>小时</span>
                                </template>
                                </Input>
                                <Input v-model="orderLength.medical.minute" type="number"
                                    @on-blur="orderLength.medical.minute = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>分钟</span>
                                </template>
                                </Input>
                            </div>
                        </FormItem>
                        <FormItem label="拍卖实物订单：">
                            <div style="display: flex;">
                                <Input v-model="orderLength.auction.hour" type="number"
                                    @on-blur="orderLength.auction.hour = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>小时</span>
                                </template>
                                </Input>
                                <Input v-model="orderLength.auction.minute" type="number"
                                    @on-blur="orderLength.auction.minute = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>分钟</span>
                                </template>
                                </Input>
                            </div>
                        </FormItem>
                    </Form>
                    <div class="item_foot_btn">
                        <Button type="primary" @click="saveOrderLength()">确认保存</Button>
                    </div>
                </GridItem>
            </Grid>
        </main>
        <!-- 第三行 -->
        <main class="pare-main">
            <Grid square border>
                <GridItem style="width: 30.2%; margin: 0 2.15%;height: auto;">
                    <h4 class="item_head_title">益助拍设置</h4>
                    <Form :model="list" label-position="right" :label-width="120" style="width: 80%;">
                        <FormItem label="延时周期：" style="margin: 0;">
                            <div style="display: flex;">
                                <Input v-model="patList.countdownMinute" style="width: calc(100% - 15px);" type="number"
                                    placeholder="竞拍结束前n" v-width="'50%'">
                                <template #append>
                                    <span>分钟内</span>
                                </template>
                                </Input>
                                <Input v-model="patList.delayMinute" style="width: calc(100% - 15px);" type="number"
                                    placeholder="延长m" v-width="'50%'">
                                <template #append>
                                    <span>分钟/次</span>
                                </template>
                                </Input>
                            </div>
                        </FormItem>
                        <div v-color="'#cbcbcb'" style="line-height: 21px; margin: 5px 10px 10px;">
                            &nbsp; &nbsp; 说明： 竞拍结束前 n 分钟内，若有其他人出价，则竟拍时间将延长 m 分钟，直至最后 n 分钟内无人出价，竞拍结束。
                        </div>
                        <FormItem label="付款时间限制：">
                            <div style="display: flex;">
                                <Input v-model="paySetTime.hour" type="number"
                                    @on-blur="paySetTime.hour = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>小时</span>
                                </template>
                                </Input>
                                <Input v-model="paySetTime.minute" type="number"
                                    @on-blur="paySetTime.minute = $event.target.value < 0 ? 0 : $event.target.value">
                                <template #append>
                                    <span>分钟内</span>
                                </template>
                                </Input>
                            </div>
                        </FormItem>
                    </Form>
                    <div class="item_foot_btn">
                        <Button type="primary" @click="patSetTime()">确认保存</Button>
                    </div>
                </GridItem>
            </Grid>
        </main>
    </div>
</template>
<script>
import {
    getSysSettingReadApi,   // 读取
    postSysSettingSaveApi,  //  写入 益助拍：auctionDelay  订单：ordAckLength  微信客服设置：

    getGlobalSetDetailApi,  // 详情
    postGlobalSetSaveApi, // 保存
} from '@api/account'
export default {
    name: 'globalsetting-paremeters',
    data() {
        return {
            list: {
                communityQrPic: ''
            }, // 数据
            pic: '',
            auctionList: [],
            patArr: [{ 1: 1 }],   // 拍卖设置

            paySetTime: {},  // 付款时间
            patList: {},   // 益助拍设置
            patOldList: {},   // 益助拍设置
            wxList: {},   // 企业微信客服设置
            wxOldList: {},

            orderLength: { common: {}, medical: {}, auction: {} },    // 
            orderLengthOld: {},   // 订单自动确认

            envType: false,   // 环境  false：测试 ； true：正式
        }
    },
    created() {
        this.envType = process.env.VUE_APP_ID == 'demo:aid-2023' ? false : true;

        this.getDetail();

        this.getPatSetTime();

        this.getOrderLength();    // 自动时间

        this.getWXCustomerFn();

    },
    methods: {
        // 详情
        getDetail() {
            getGlobalSetDetailApi().then(res => {
                this.list = JSON.parse(JSON.stringify(res));
                this.wxList.communityQrPic = res.communityQrPic;
            })
        },
        // 确认保存
        submitFn() {
            let formData = new FormData()
            let { weChatCsLink, widthdrawCharge, corpid } = this.list;
            if (this.pic) {
                formData.append('communityQr', this.pic);
            }
            formData.append('weChatCsLink', weChatCsLink);
            formData.append('widthdrawCharge', widthdrawCharge);
            formData.append('localLivingService', true);
            formData.append('pdChangeRefund', true);
            formData.append('corpid', corpid || '');
            formData.append('position', 'pop');
            postGlobalSetSaveApi(formData, false).then(res => {
                // 与客服二维码链接保持一致
                if (this.pic) {
                    postSysSettingSaveApi({ type: 'wxCustomer', key: 'communityQrPic', value: res.communityQrPic }).then(rs => {
                        // this.$Message.success('修改成功！');
                        this.wxList.communityQrPic = res.communityQrPic;
                    });
                }
                this.$Message.success('保存成功！')
            })
        },
        // 获取益助拍时间
        getPatSetTime() {

            getSysSettingReadApi({ type: 'auctionDelay' }).then(res => {
                let payMinute = JSON.parse(JSON.stringify(res.payMinute || ''));
                let hour = Math.floor(payMinute / 60);
                let minute = payMinute - hour * 60;
                this.paySetTime = { hour, minute };
                this.patList = JSON.parse(JSON.stringify(res));
                this.patOldList = JSON.parse(JSON.stringify(res));
            })
        },
        // 获取微信客服信息
        getWXCustomerFn() {
            getSysSettingReadApi({ type: 'wxCustomer' }).then(res => {
                this.wxList = res;
                this.wxOldList = JSON.parse(JSON.stringify(res));
            });
        },
        // 微信客服设置
        setWXCustomerFn() {

            for (const key in this.wxList) {
                if (Object.hasOwnProperty.call(this.wxList, key)) {
                    const value = this.wxList[key];
                    const oldVal = this.wxOldList[key]
                    if (value !== oldVal) {
                        postSysSettingSaveApi({ type: 'wxCustomer', key, value }).then(res => {
                            this.$Message.success('修改成功！')
                            this.wxOldList[key] = value;
                        });
                    };
                };
            };

        },
        // 益助拍设置
        patSetTime() {
            let payMinute = 0;
            let { hour = 0, minute = 0 } = this.paySetTime;
            payMinute = hour * 60 + minute * 1;
            this.patList.payMinute = payMinute;
            for (const key in this.patList) {
                if (Object.hasOwnProperty.call(this.patList, key)) {
                    const element = this.patList[key];
                    const element2 = this.patOldList[key];

                    if (element != element2) {
                        postSysSettingSaveApi({ type: 'auctionDelay', key, value: element }).then(res => {
                            this.$Message.success('保存成功！');
                            this.getPatSetTime();
                        })
                    }

                }
            }
        },
        // 获取订单时间
        getOrderLength() {

            getSysSettingReadApi({ type: 'ordAckLength' }).then(res => {
                let obj = {};
                for (const key in res) {
                    if (Object.hasOwnProperty.call(res, key)) {
                        const element = res[key];
                        obj[key] = this.envType ? element / 60 / 24 : this.handlerTimeFn(element, 'hour');
                    }
                };
                this.orderLength = JSON.parse(JSON.stringify(obj));
                this.orderLengthOld = JSON.parse(JSON.stringify(res));
            });
        },
        // 订单时长
        saveOrderLength() {
            for (const key in this.orderLength) {
                if (Object.hasOwnProperty.call(this.orderLength, key)) {
                    const element1 = this.orderLength[key];
                    const element2 = this.orderLengthOld[key];
                    let value = this.envType ? element1 * 24 * 60 : (element1.hour * 60) * 1 + element1.minute * 1;
                    if (value != element2) {
                        postSysSettingSaveApi({ type: 'ordAckLength', key, value }).then(res => {
                            this.$Message.success('保存成功！');
                            this.getOrderLength();
                        })
                    }
                }
            }
        },
        // 订单时间处理 显示到页面
        handlerTimeFn(time = 0, type) {
            if (type == 'day') {
                let allHour = Math.floor(time / 60);   // 总小时数
                let date = Math.floor(allHour / 24);   // 天数
                let hour = allHour - date * 24;   // 换算后剩余
                hour += (time - allHour * 60) != 0 ? ((time - allHour * 60) / 60).toFixed(2) : 0;
                return { date, hour };
            } else if (type == 'hour') {
                let hour = Math.floor(time / 60);   // 总小时数
                let minute = time - hour * 60;   // 剩余分钟
                return { hour, minute };
            }
        },
        // 上传图片
        handleBeforeLicenseUrlUpload(file) {
            this.pic = file;
            this.list.communityQrPic = window.URL.createObjectURL(file);
            return false;
        },
    },

}
</script>
<style scoped lang="less">
.pare-main {
    margin-top: 30px;

    .ivu-grid-item {
        background-color: #fff;

        .item_head_title {
            font-size: 18px;
            text-align: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .item_main {
            text-align: center;
            height: 290px;
        }

        .item_foot_btn {
            text-align: center;
        }

        :deep(.ivu-form.ivu-form-label-right) {
            width: 60%;
            margin: auto;
        }
    }

    .auction_set {
        width: 80%;
        padding-top: 15px;
        margin: 0 auto;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 12px;

        .set_line {
            margin-bottom: 15px;
            display: flex;
            align-items: center;

            strong {
                width: 76px;
                text-align: right;
                padding-right: 10px;
                box-sizing: border-box;
            }

            p {
                font-weight: 600;
                padding: 0 5px;
            }
        }
    }
}

@media (min-width: 500px) and (max-width: 1660px) {

    .ivu-grid-item {
        width: 47% !important;
        margin-bottom: 20px;
    }
}
</style>