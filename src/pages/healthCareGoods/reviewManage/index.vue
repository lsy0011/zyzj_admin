<template>
    <div class='reviewManage'>
        <div class="i-layout-page-header">
            <PageHeader title="医药保健商品管理" content="评价管理" hidden-breadcrumb />
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