/**
 * @description 鉴权指令
 * 当传入的权限当前用户没有时，会移除该组件
 * 用例：<Tag v-auth="['admin']">text</Tag>
 * */
import store from '@/store';
import { includeArray } from '@/libs/system';

export default {
    mounted (el, binding, vnode) {
        const { value } = binding;
        const access = store.state.admin.user.info.access;

        let isPermission = false;

        if (value && value instanceof Array && value.length && access && access.length) {
            isPermission = includeArray(value, access);
        }

        if (!isPermission) {
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
}
