<template>
    <Row :gutter="24" class="dashboard-console-grid">
        <Col v-bind="grid" class="ivu-mb">
        <Card :bordered="false">
            <a href="/user/userlist" title="点击查看">
                <Icon type="md-people" color="#69c0ff" />
                <p>用户总数</p>
                <p><strong>{{ userNumber }}</strong> </p>
            </a>
        </Card>
        </Col>
        <Col v-bind="grid" class="ivu-mb">
        <Card :bordered="false">
            <a href="javascript:void(0)">
                <Icon type="md-cart" color="#ff9c6e" />
                <p>商品总数</p>
                <p><strong>{{ shopNumber }}</strong> </p>
            </a>
            <template #extra>
                <Dropdown>
                    <Icon type="md-more" size="24" />
                    <template #list>
                        <DropdownMenu>
                            <DropdownItem>
                                <a style="padding: 5px;" href="/goodwillGoods/goodsList"> 善意商城商品列表</a>
                            </DropdownItem>
                            <DropdownItem>
                                <a style="padding: 5px;" href="/healthCareGoods/remedyList">医药保健商品列表</a>
                            </DropdownItem>
                        </DropdownMenu>
                    </template>
                </Dropdown>
            </template>
        </Card>
        </Col>
        <Col v-bind="grid" class="ivu-mb">
        <Card :bordered="false">
            <template #extra>
                <Dropdown>
                    <Icon type="md-more" size="24" />
                    <template #list>
                        <DropdownMenu>
                            <DropdownItem>
                                <a style="padding: 5px;" href="/goodwillOrder/orderList"> 善益商城订单</a>
                            </DropdownItem>
                            <DropdownItem>
                                <a style="padding: 5px;" href="/healthCareOrder/orderList"> 医药保健订单</a>
                            </DropdownItem>
                            <DropdownItem>
                                <a style="padding: 5px;" href="/medicalService/orderManage"> 医疗服务订单</a>
                            </DropdownItem>
                            <DropdownItem>
                                <a style="padding: 5px;" href="/CareService/orderManage"> 关爱服务订单</a>
                            </DropdownItem>
                        </DropdownMenu>
                    </template>
                </Dropdown>
            </template>
            <a href="javascript:void(0)">
                <Icon type="md-clipboard" color="#b37feb" />
                <p>订单总数</p>
                <p><strong>28,506</strong> </p>
            </a>
        </Card>
        </Col>
        <Col v-bind="grid" class="ivu-mb">
        <Card :bordered="false">
            <a href="javascript:void(0)">
                <Icon type="md-card" color="#ffd666" />
                <p>补贴总数</p>
                <p><strong>28,506</strong> </p>
            </a>
        </Card>
        </Col>
        <Col v-bind="grid" class="ivu-mb">
        <Card :bordered="false">
            <a href="javascript:void(0)">
                <Icon type="md-ribbon" color="#5cdbd3" />
                <p>门店总数</p>
                <p><strong>28,506</strong> </p>
            </a>
        </Card>
        </Col>
        <Col v-bind="grid" class="ivu-mb">
        <Card :bordered="false">
            <a href="javascript:void(0)">
                <Icon type="md-rose" color="#ff85c0" />
                <p>服务产品总数</p>
                <p><strong>28,506</strong> </p>
            </a>
        </Card>
        </Col>
        <!-- <Col v-bind="grid" class="ivu-mb">
            <Card :bordered="false">
                <a href="javascript:void(0)">
                    <Icon type="md-switch" color="#ffc069" />
                    <p>配置</p>
                </a>
            </Card>
        </Col> -->
    </Row>
</template>
<script>
import {
    getUserInfoPageApi,  // 用户数量
    getGoodsInfoPageApi,   // 商品数量
} from '@/api/account'
import { formatNumber } from '@/libs/util'
export default {
    data() {
        return {
            grid: {
                xl: 4,
                lg: 8,
                md: 8,
                sm: 8,
                xs: 8
            },
            userNumber: 0,   // 用户数量
            shopNumber: 0,   // 商品数量
        }
    },
    created() {
        // 用户
        // getUserInfoPageApi({ type: 'member' }).then(res => {
        //     this.userNumber = res.totalElements;
        // });
        // // 商品
        // getGoodsInfoPageApi({
        //     biz: 'common',
        //     recycled: false
        // }).then(res => {

        //     getGoodsInfoPageApi({
        //         biz: 'medical',
        //         recycled: false
        //     }).then(rs => {
        //         this.shopNumber = formatNumber(res.totalElements + rs.totalElements, '', 0);
        //     })
        // });
        // 订单

    }
}
</script>
<style lang="less">
.dashboard-console-grid {
    text-align: center;

    .ivu-card-body {
        padding: 0;
    }

    i {
        font-size: 50px;
    }

    a {
        display: block;
        color: inherit;
        padding: 16px;
    }

    p {
        margin-top: 8px;
        font-size: 16px;

        strong {
            font-size: 24px;
        }
    }
}
</style>
