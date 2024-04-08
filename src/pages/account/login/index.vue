<template>
    <div class="page-account">
        <div v-if="showI18n" class="page-account-header">
            <i-header-i18n outside />
        </div>
        <div class="page-account-container">
            <Card>
                <div class="page-account-top">
                    <div class="page-account-top-logo">
                        <img src="@/assets/images/login-logo.png" alt="logo">
                    </div>
                    <div class="page-account-top-desc">欢迎登录助友之家管理平台</div>
                </div>
                <Select v-model="appId" size="small" placeholder="请选择商户（不选则默认助友之家）" clearable>
                    <Option value="zhuyou">助友</Option>
                    <Option value="yongjun">佣军</Option>
                </Select>
                <!-- <a href="">{{ $t('page.login.forgot') }}</a> 忘记密码按钮 -->
                <Login @on-submit="handleSubmit" v-if="actType == 'usePwd'">
                    <UserName name="account" value="" />
                    <Password name="password" value="" enter-to-submit />
                    <div class="page-account-auto-login">
                        <!-- <Checkbox v-model="autoLogin" size="large">{{ $t('page.login.remember') }}</Checkbox> -->
                        <Checkbox v-model="autoLogin" size="large">自动登录</Checkbox>
                        <a href="javascript:;" @click="actType = 'userCode'">验证码登录</a>
                    </div>
                    <div>
                    </div>
                    <!-- <Submit>{{ $t('page.login.submit') }}</Submit> -->
                    <Submit>确认登录</Submit>
                </Login>
                <!-- 验证码登录 -->
                <Login @on-submit="handleSubmit1" v-else>
                    <Mobile name="account" />
                    <Captcha name="code" :count-down="30" :field="['account']" @on-get-captcha="handleGetCaptcha" />
                    <div class="page-account-auto-login">
                        <a href="javascript:;" style="margin-bottom: 24px;" @click="actType = 'usePwd'">账号密码登录</a>
                    </div>
                    <Submit />
                </Login>
                <!-- <div class="page-account-other">
                <span>{{ $t('page.login.other') }}</span>
                <img src="@/assets/svg/icon-social-wechat.svg" alt="wechat">
                <img src="@/assets/svg/icon-social-qq.svg" alt="qq">
                <img src="@/assets/svg/icon-social-weibo.svg" alt="weibo">
                <router-link class="page-account-register" :to="{ name: 'register' }">{{ $t('page.login.signup') }}</router-link>
            </div> -->
            </Card>
        </div>
        <i-copyright />
    </div>
</template>
<script>
import iCopyright from '@/components/copyright';
import { mapActions, mapMutations } from 'vuex';
import util from '@/libs/util';
import mixins from '../mixins';

import { postSsoCodeSendApi } from '@/api/account'

export default {
    name: 'page-account-login',
    mixins: [mixins],
    components: { iCopyright },
    data() {
        return {
            autoLogin: true,
            actType: 'usePwd',
            appId: '',
        }
    },
    methods: {
        ...mapActions('admin/account', [
            'login',
        ]),
        /**
         * @description 登录
         * 表单校验已有 View UI Plus 自动完成，如有需要修改，请阅读 View UI Plus 文档
         */
        handleSubmit(valid, values) {
            if (valid) {

                if (this.appId) {
                    util.cookies.set('appId', this.appId);
                } else {
                    util.cookies.remove('appId');
                };

                const { account, password } = values;
                this.login({
                    account,
                    password
                })
                    .then(() => {
                        // 重定向对象不存在则返回顶层路径
                        this.$router.replace(this.$route.query.redirect || '/', () => { });
                    });
            }
        },
        // 验证码登录
        handleSubmit1(valid, values) {
            if (valid) {
                const { account, code } = values;

                if (this.appId) {
                    util.cookies.set('appId', this.appId);
                } else {
                    util.cookies.remove('appId');
                };

                this.login({
                    account,
                    code
                })
                    .then(() => {
                        // 重定向对象不存在则返回顶层路径
                        this.$router.replace(this.$route.query.redirect || '/', () => { });
                    });
            }
        },
        // 获取验证
        handleGetCaptcha(value, values) {
            postSsoCodeSendApi({ type: 'mobile', account: values.account }).then(res => {

                if (res.success) {
                    this.$Message.success(res.message);
                }
            })
        }
    }
};
</script>
<style lang="less">
@import "../account";
</style>
