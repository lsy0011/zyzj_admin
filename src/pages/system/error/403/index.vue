<template>
    <div>
        <!-- <Exception type="403" img-color :desc="$t('page.exception.e403')" :back-text="$t('page.exception.btn')" /> -->
        <Exception type="403" img-color desc="403，身份验证失败！" back-text="返回首页" />
    </div>
</template>
<script>
    export default {
        name: 'page-error-403'
    }
</script>
