<template>
    <div class='reviewManage'>
        <!-- <h5>评价管理</h5> -->
        <div class="i-layout-page-header">
            <PageHeader title="医疗服务管理" content="评价管理" hidden-breadcrumb />
        </div>
        <reviewPage></reviewPage>
    </div>
</template>
<script>
import reviewPage from '@/components/reviewPage'
export default {
    name: 'reviewManage',
    components: {
        reviewPage,
    }
}
</script>
<style scoped lang='less'></style>