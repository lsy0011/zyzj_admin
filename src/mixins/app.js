/**
 * 通用混合
 * */


// 路由数据  所有的路由
import routes from '../router';

import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState('admin/user', ['info']),
    },
    methods: {
        // 当 $route 更新时触发
        appRouteChange(to, from) {

            let goRouterName = to.meta ? to.meta.title : '';  // 去往的路由name
            let goRouterPathArr = to.path.split('/');
            let arrLength = goRouterPathArr.length;
            let goRouterPath = to.path.split('/')[arrLength - 1];
            let allRoutes = routes.options.routes;   // 所有的用户路由
            let userInfo = this.info;


            let userRouter = this.info.siderMenuList || [];   // 用户权限

            let userChildren = [];  // 拥有的子类 路由
            userRouter.forEach((item) => {
                if (item.subset && item.subset.length > 0) {
                    userChildren.push(...item.subset);
                }
            })
            // 名称
            let userRuoteName = userChildren.map((item) => {
                return item.name;
            })
            // key值
            let userRuoteKey = userChildren.map((item) => {
                return item.key;
            })
            // 判断 用户是否拥有
            let result1 = userRuoteName.some(ele => ele === goRouterName);
            // console.log("🚀 ~ file: app.js:45 ~ appRouteChange ~ goRouterName:", goRouterName)
            // console.log("🚀 ~ file: app.js:45 ~ appRouteChange ~ result1:", result1)
            let result2 = userRuoteKey.some(ele => ele === goRouterPath);
            // console.log("🚀 ~ file: app.js:47 ~ appRouteChange ~ goRouterPath:", goRouterPath)
            // console.log("🚀 ~ file: app.js:46 ~ appRouteChange ~ result2:", result2)

            // 这些页面不做判断
            if (to.path == '/403' || to.path == '/404' || to.path == '/500' || to.path == '/register/result' || to.path === '/register' || to.path === '/login' || to.path === '/' || goRouterPath == 'console') {

            } else {
                if (!result1 || !result2) {
                    this.$router.push({ path: '/403' });
                }
            }
        }
    }
}
