import axios from 'axios';
import { merge } from 'lodash';
import store from '@/store';
import util from '@/libs/util';
import Setting from '@/setting';
import qs from 'qs'

import { Message, Notice } from 'view-ui-plus';

// 创建一个错误
function errorCreate(msg) {
    const err = new Error(msg);
    errorLog(err);
    throw err;
}

// 记录和显示错误
function errorLog(err) {
    // 添加到日志
    store.dispatch('admin/log/push', {
        message: '数据请求异常',
        type: 'error',
        meta: {
            error: err
        }
    });
    // 打印到控制台
    if (process.env.NODE_ENV === 'development') {
        util.log.error('>>>>>> Error >>>>>>');
        console.log(err);
    }
    // 显示提示，可配置使用 View UI Plus 的 $Message 还是 $Notice 组件来显示
    if (Setting.request.errorModalType === 'Message') {
        Message.error({
            content: err.message,
            duration: Setting.request.modalDuration
        });
    } else if (Setting.request.errorModalType === 'Notice') {
        Notice.error({
            title: '提示',
            desc: err.message,
            duration: Setting.request.modalDuration
        });
    }
}

// 创建一个 axios 实例
const service = axios.create({
    baseURL: Setting.request.apiBaseURL,
    timeout: Setting.request.timeout
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        if (config.key !== false && config.key !== true) {
            config.data = qs.stringify(config.data)
        } else if (config.key === true) {
            config.headers['Content-Type'] = 'application/json';
        } else {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        config.paramsSerializer = function (params) {
            return qs.stringify(params, {
                arrayFormat: 'brackets'
            })
        };
        let appId = util.cookies.get('appId');
        // 在请求发送之前做一些处理
        config.headers['X-TENANT-ID'] = !appId ? process.env.VUE_APP_ID : appId == 'zhuyou' ? 'release:aid-2023' : 'yj:yj20231210';
        // config.headers['X-TENANT-ID'] = 'demo:aid-2023'
        const token = util.cookies.get('token');
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['Authorization'] = 'Bearer ' + token;
        // console.log(config, '====================');
        return config
    },
    error => {
        // 发送失败
        console.log(error);
        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data;
        // return dataAxios.data;
        // 这个状态码是和后端约定的
        const { success, data } = dataAxios;
        // 根据 success 进行判断
        if (success === undefined) {
            // 如果没有 success 代表这不是项目后端开发的接口
            return dataAxios;
        } else {
            // 有 success 代表这是一个后端接口 可以进行进一步的判断
            switch (success) {
                case 0 || true:
                    // [ 示例 ] success === 0 代表没有错误
                    // return dataAxios.data;
                    if (data != undefined) { return data }
                    else { return dataAxios }
                case 'successful' || 200 || 0:
                    // success === successful 代表没有错误
                    return dataAxios.data;
                case 'xxx':
                    // [ 示例 ] 其它和后台约定的 success
                    errorCreate(`[ success: xxx ] ${dataAxios.msg}: ${response.config.url}`);
                    break;

                default:
                    // 不是正确的 success
                    errorCreate(`${dataAxios.msg}: ${response.config.url}`);
                    break;
            }
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400: error.message = `请求错误 </br> ${error.response.data.message}`; break;
                case 401: error.message = '未授权，请登录'; break;
                case 403: error.message = '拒绝访问'; break;
                case 404: error.message = `请求地址出错: ${error.response.config.url}`; break;
                case 408: error.message = '请求超时'; break;
                case 500: error.message = '服务器内部错误'; break;
                case 501: error.message = '服务未实现'; break;
                case 502: error.message = '系统升级中，请稍后'; break;
                case 503: error.message = '服务不可用'; break;
                case 504: error.message = '网关超时'; break;
                case 505: error.message = 'HTTP版本不受支持'; break;
                default: break;
            }
        }
        errorLog(error);
        return Promise.reject(error);
    }
);

export default service;
