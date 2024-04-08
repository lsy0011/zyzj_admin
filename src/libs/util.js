import cookies from './util.cookies';
import log from './util.log';
import db from './util.db';

import Setting from '@/setting';

const util = {
    cookies,
    log,
    db
};

/**
 * 递归调用
 */
export const jsonToArray = (nodes, key) => {
    let arr = nodes
    arr.forEach(v => {
        v.rankType = false
        if (key) {
            v.expand = true
        }
        v.value = v.id
        if (v.topic) {
            v.title = v.topic
        } else {
            v.title = v.name
        }
        if (v.subset && v.subset.length > 0) {
            jsonToArray(v.subset)
        } else {
            v.subset = []
        }
        if (v.subset && v.subset.length > 0) {
            v.children = v.subset
            jsonToArray(v.children)
        } else {
            v.children = []
        }
    });
    return arr;
}

/**
 * 递归调用
 */
export const jsonToArray1 = (nodes, key) => {
    let arr = nodes
    arr.forEach(v => {
        v.rankType = false
        if (key) {
            v.expand = true
        }
        v.value = v.code
        v.title = v.name
        if (v.children && v.children.length > 0) {
            jsonToArray1(v.children)
        } else {
            v.children = []
        }
    });
    return arr;
}

/**
 * 递归调用
 */
export const jsonToArray2 = (nodes, type = 'name', key = 'id') => {
    let arr = nodes
    arr.forEach(v => {
        v.value = v[key]
        v.title = v[type]
        if (v.subset && v.subset.length > 0) {
            v.children = v.subset
            jsonToArray2(v.children)
        } else {
            v.children = []
        }
    });
    return arr;
}
/**
 * 递归调用  ---> 地域树
 */
export const jsonToArea = (nodes, type = 'id', key) => {
    let arr = nodes
    arr.forEach(v => {
        v.rankType = false
        if (key) {
            v.expand = true
        }
        v.value = v[type]
        v.title = v.name
        if (v.children && v.children.length > 0) {
            jsonToArea(v.children, type, key)
        } else {
            v.children = []
        }
    });
    return arr;
}


/**
 *  金额格式化处理  （数额，符号，保留小数位）
 */
export const formatNumber = (money, symbol = "", decimals = 2) => {
    let moneyStr = money.toString();
    // 改造前
    // let arr = moneyStr.toFixed(decimals).toString().split(".");
    // 改造后
    let num = '';    // 小数点前
    let num1 = '';   // 小数点后
    let arr = [];    // 从小数点分开
    let str = '';     // 返回的最终结果
    if (moneyStr.includes('.')) {
        arr = moneyStr.split(".");
        num = arr[0];
        num1 = arr[1].slice(0, 2);
    } else {
        num = moneyStr.toString();
    };
    let first = "";
    while (num.length > 3) {
        first = "," + num.slice(-3) + first;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        first = num + first;
    }

    if (arr.length > 0) {
        str = symbol + first + " . " + num1;
    } else {
        str = symbol + first;
    }

    return str;
}

/**
 *  下载图片（地址url，名称）
 */
export const downloadIamge = function(imgsrc, name) {
    const fileName= `${name}.jpg`;
    const myBlob = new Blob([imgsrc], { type: "image/jpeg" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(myBlob);
    link.download = fileName;
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
}


function tTitle(title = '') {
    const $t = window ? window.$app.$t : null;
    if ($t) {
        if (title.indexOf('$t:') === 0) {
            return $t(title.split('$t:')[1]);
        } else {
            return title;
        }
    } else {
        return title;
    }
}

/**
 * @description 更改标题
 * @param {Object} title 标题
 * @param {Object} count 未读消息数提示（可视情况选择使用或不使用）
 */
util.title = function ({ title, count }) {
    title = tTitle(title);
    let fullTitle;

    if (Setting.titleSuffix === false || Setting.titleSuffix === '') {
        fullTitle = title ? `${title}` : '';
    } else {
        fullTitle = title ? `${title} - ${Setting.titleSuffix}` : Setting.titleSuffix;
    }

    if (count) fullTitle = `(${count}条消息)${fullTitle}`;
    window.document.title = fullTitle;
};

function requestAnimation(task) {
    if ('requestAnimationFrame' in window) {
        return window.requestAnimationFrame(task);
    }

    setTimeout(task, 16);
}

export { requestAnimation };

export default util;
