<template>
    <GlobalFooter class="i-copyright" :links="links" :copyright="copyright" />
    <!-- <GlobalFooter class="i-copyright" :copyright="copyright" /> -->
</template>
<script>
export default {
    name: 'i-copyright',
    data() {
        return {
            links: [
                // {
                //     title: 'Admin Plus',
                //     key: '专业版',
                //     href: 'https://www.iviewui.com/admin-plus',
                //     blankTarget: true
                // },
                {
                    title: '备案号：桂ICP备2023013079号-1',
                    key: '官网',
                    href: 'https://beian.miit.gov.cn',
                    blankTarget: true
                },
                // {
                //     title: '工业和信息化部备案管理系统网站',
                //     key: '社区',
                //     href: 'https://beian.miit.gov.cn',
                //     blankTarget: true
                // },
            ],
            copyright: `Copyright © 2024 善益诚助友之家（广西）信息技术有限公司`
        }
    },
    created() {
        this.copyright = `Copyright © ${this.$Date(new Date()).format('YYYY')} 善益诚助友之家（广西）信息技术有限公司`
    }
}
</script>
<style lang="less">
.i-copyright {
    flex: 0 0 auto;

    &-hidden {
        display: none;
    }
}

.ivu-global-footer {
    background-color: rgba(255, 255, 255, 0.549);
}

.ivu-global-footer-links {
    a {

        &:nth-child(1) {
            &:hover {
                border-bottom: 1px solid #50596d;
            }
        }
    }
}
</style>
