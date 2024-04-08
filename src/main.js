// Vue
import { createApp, h, getCurrentInstance } from 'vue';
import App from '@/App';

// 配置
import Setting from '@/setting';

// 混合
import mixinApp from '@/mixins/app';

// 插件
import plugins from '@/plugins';

// store
import store from '@/store/index';

// ViewUIPlus
import ViewUIPlus from 'view-ui-plus';

// 菜单和路由
import router from '@/router';
import menuHeader from '@/menu/header';
import { frameInRoutes } from '@/router/routes';

// 多语言
// import i18n from '@/i18n';
// import { loadRemoteLocaleMessages } from '@/i18n/locale';

// 内置组件
import iLink from '@/components/link';
import iFrame from '@/components/frame';

// 使用样式，修改主题可以在 styles 目录下创建新的主题包并修改 View UI Plus 默认的 less 变量
// 参考 https://www.iviewui.com/docs/guide/theme
import './styles/index.less';

// 图片预览插件

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

let options = {
    defaultOptions: {
        zIndex: 99999,
        title: false,
        toolbar: false,
    },
}
// 第一次进入时，取菜单数据用于更新
let isFirstRouteChange = true;

const app = createApp({
    mixins: [mixinApp],
    render: () => h(App),
    created() {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('admin/page/init', frameInRoutes);
        // 设置顶栏菜单
        if (!Setting.dynamicMenu) this.$store.commit('admin/menu/setHeader', menuHeader);
        // 加载用户登录的数据
        this.$store.dispatch('admin/account/load');
        // 初始化全屏监听
        this.$store.dispatch('admin/layout/listenFullscreen');
        // 将根实例存全局，可在特殊场景下调用
        if (window) {
            window.$app = getCurrentInstance();
            // window.$app.$t = i18n.global.t;
        }
        // 加载远程 i18n
        // if (Setting.i18n.remote) loadRemoteLocaleMessages(i18n);
    },
    watch: {
        // 监听路由 控制侧边栏显示 标记当前顶栏菜单（如需要）
        '$route'(to, from) {
            this.$store.dispatch('admin/menu/setMenuList', to);

            if (Setting.dynamicMenu) {
                if (isFirstRouteChange) {
                    isFirstRouteChange = false;
                    // 每次进入 app 时，获取一次菜单
                    this.$store.dispatch('admin/menu/getMenuList', to);
                }
            }

            this.appRouteChange(to, from);
        }
    }
});

app.use(router);
app.use(store);
// app.use(i18n);
app.use(ViewUIPlus, {
    // i18n
});
app.use(plugins);
// 使用插件
app.use(Viewer, {

    defaultOptions: {

        zIndex: 9999,
        inline: false, // 启用内联模式
        button: true, // 在查看器右上角显示按钮
        navbar: true, // 指定导航栏的可见性
        title: false, // 指定标题的可见性和内容
        toolbar: false, // 指定工具栏及其按钮的可见性和布局
        tooltip: true, // 放大或缩小时显示带有图像比率（百分比）的工具提示
        movable: true, // 启用以移动图像
        zoomable: true, // 启用以缩放图像
        rotatable: false, // 启用以旋转图像
        scalable: true, // 启用以缩放图像。
        transition: true, // 为某些特殊元素启用CSS3转换
        fullscreen: false, // 启用以在播放时请求全屏
        keyboard: true, // 启用键盘支持。

    }

})

app.component('i-link', iLink);
app.component('i-frame', iFrame);

app.mount('#app');
