<template>
    <span v-if="isDesktop" class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in i-layout-header-trigger-nohover">
        <!-- <input class="i-layout-header-search" type="text" :placeholder="$t('basicLayout.search.placeholder')"> -->
        <input class="i-layout-header-search" type="text" placeholder="请输入搜索">
    </span>
    <Dropdown v-else trigger="click" class="i-layout-header-search-drop" ref="dropdown">
        <span class="i-layout-header-trigger i-layout-header-trigger-min">
            <Icon type="ios-search" />
        </span>
        <template #list>
            <DropdownMenu>
                <Row align="middle">
                    <Col flex="auto" class="ivu-pl-4">
                        <!-- <Input size="large" prefix="ios-search" :placeholder="$t('basicLayout.search.placeholder')" /> -->
                        <Input size="large" prefix="ios-search" placeholder="请输入搜索" />
                    </Col>
                    <Col flex="80px" class="ivu-text-center">
                        <!-- <span @click="handleCloseSearch">{{ $t('basicLayout.search.cancel') }}</span> -->
                        <span @click="handleCloseSearch">确认查询</span>
                    </Col>
                </Row>
            </DropdownMenu>
        </template>
    </Dropdown>
</template>
<script>
    import { mapState } from 'vuex';

    export default {
        name: 'iHeaderSearch',
        computed: {
            ...mapState('admin/layout', [
                'isDesktop',
                'headerMenu'
            ])
        },
        methods: {
            handleCloseSearch () {
                this.$refs.dropdown.handleClick();
            }
        }
    }
</script>
