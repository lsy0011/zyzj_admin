<template>
    <div class="dashboard-console-user-gender">
        <Row type="flex" justify="center" align="middle">
            <Col span="6" class="ivu-text-center" v-color="'#3399ff'">
            <Avatar icon="ios-man" size="large" v-color="'#3399ff'" v-bg-color="'#d6f0ff'" />
            <div class="ivu-mt-8">一级 50%</div>
            </Col>
            <Col span="6" class="ivu-text-center" v-color="'#be6be0'">
            <Avatar icon="ios-woman" size="large" v-color="'#be6be0'" v-bg-color="'#fdf0ff'" />
            <div class="ivu-mt-8">二级 25%</div>
            </Col>
            <Col span="6" class="ivu-text-center" v-color="'#b8741a'">
            <Avatar icon="md-man" size="large" v-color="'#b8741a'" v-bg-color="'#ddbd92'" />
            <div class="ivu-mt-8">三级 15%</div>
            </Col>
            <Col span="6" class="ivu-text-center" v-color="'#babdc3'">
            <Avatar icon="md-man" size="large" v-color="'#babdc3'" v-bg-color="'#e6edf5'" />
            <div class="ivu-mt-8">四级 10%</div>
            </Col>
        </Row>
        <div class="dashboard-console-user-gender-grid ivu-mt-8">
            <Grid center square :col="25" padding="2px" :border="false">
                <GridItem v-for="item in 100" :key="item">
                    <span v-bg-color="'#3399ff'" v-if="item <= 50"></span>
                    <span v-bg-color="'#be6be0'" v-else-if="item <= 75"></span>
                    <span v-bg-color="'#b8741a'" v-else-if="item <= 90"></span>
                    <span v-bg-color="'#babdc3'" v-else></span>
                </GridItem>
            </Grid>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    }
}
</script>
<style lang="less">
.dashboard-console-user-gender {
    &-grid {
        .ivu-grid-item-main {
            height: 100%;
        }

        span {
            display: block;
            height: 100%;
            border-radius: 2px;
            opacity: 0.75;
        }
    }
}
</style>
