<template>
    <div class='rank'>
        <div v-height="240">
            <Row>
                <Col span="8"><strong>商品名</strong> </Col>
                <Col span="8" class="ivu-text-center"><strong>销售数量</strong> </Col>
                <Col span="8" class="ivu-text-right"><strong>销售金额</strong> </Col>
            </Row>
            <ul>
                <li v-for="item in 11" :key="item">
                    <Row type="flex" justify="center" align="middle">
                        <Col span="8">
                        <Avatar size="small" v-color="item < 4 ? '#1890ff' : '#8c8c8c'"
                            v-bg-color="item < 4 ? '#e6f7ff' : '#f5f5f5'" class="ivu-mr-8">{{ item }}</Avatar>
                        <span>长江 {{ item }} 号 玩偶</span>
                        </Col>
                        <Col span="8" class="ivu-text-center">
                        <Numeral value="456789" format="0,0" />
                        </Col>
                        <Col span="8" class="ivu-text-right">
                        ￥
                        <Numeral value="456789" format="0,0" />
                        </Col>
                    </Row>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'rank'
}
</script>
<style scoped lang='less'>
ul {
    li {
        list-style-type: none;
        margin-top: 12px;
    }
}
</style>