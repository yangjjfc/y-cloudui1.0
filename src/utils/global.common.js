'use strict';
/**
 * 金额格式化
 * @param {*str} n
 */
export const parseMoney = (n) => {
    let _str = '';
    if (isNaN(n)) {
        return;
    }
    let re = /^[0-9]*[1-9][0-9]*$/; // 判断是不是整数
    if (re.test(n) || n == 0) { //eslint-disable-line
        if (n == 0) { //eslint-disable-line
            _str = n + '.00';
        } else {
            _str = parseNum(n) + '.00';
        }
    } else {
        let k = '.' + n.toString().split('.')[1]; // 截取小数
        if (k.length <= 2) {
            k += '0';
        }
        k = k.substr(0, 3);
        let h = JSON.parse(n.toString().split('.')[0]);
        _str = parseNum(h) + k;
    }
    return _str;
};
/**
 * 每3位加个','
 * @param {*} num
 */
export const parseNum = (num) => {
    let list = new String(num).split('').reverse(); // eslint-disable-line no-new-wrappers
    for (var i = 0; i < list.length; i++) {
        if (i % 4 === 3) {
            list.splice(i, 0, ',');
        }
    }
    return list.reverse().join('');
};

/**
 * 获取当前时间，格式 yyyy-mm-dd
 */
export const getNowFormatDate = () => {
    let date = new Date();
    let seperator1 = '-';
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

/**
 * 时间格式化
 * @param {*Date} time  new Date()
 * @param {*} fmt  //yyyy-MM-dd
 */
export const format = (time, fmt) => {
    let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        'S': time.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
};

/**
 *
 * @param {*文件上传支持的类型} item
 */
export const getFileType = (item) => {
    if (!item) {
        return null;
    }
    // 判断是否是图片
    let strFilter = ['jpeg', 'jpg', 'png', 'pic', 'bmp', 'gif'];
    let strPostfix;
    if (item.indexOf('.') > -1) {
        strPostfix = (item.split('.').pop() || '').toLowerCase();
        if (strFilter.includes(strPostfix)) {
            return 'image';
        } else if (['pdf'].includes(strPostfix)) {
            return 'pdf';
        } else if (['rar', 'zip'].includes(strPostfix)) {
            return 'package';
        } else {
            return false; // 不支持的文件类型
        }
    }
    return null;
};

// 格式化图片
import pdf from './img/pdf.png'; // daf
import compressPackage from './img/package.png';
import noimg from './img/noimage.png'; // 没有图片
export let mode = process.env.NODE_ENV === 'production' ? {
    IMAGE_DOWNLOAD: 'http://dfs.test.cloudyigou.com/dfs/',
    IMAGE_UPLOAD: '/gateway/upload',
    IMG_SIZE_MAX: '5242880'
} : {
    IMAGE_DOWNLOAD: 'http://dfs.dev.cloudyigou.com/dfs/',
    IMAGE_UPLOAD: '/gateway/upload',
    IMG_SIZE_MAX: '5242880'
};
//修改
export const changeMode = (obj={IMAGE_DOWNLOAD: 'http://dfs.test.cloudyigou.com/dfs/'}) => {
    mode={...mode,...obj};
};
export const formatFile = (item, size) => {
    let thumbnail = '';
    switch (getFileType(item)) {
    case 'image':
        thumbnail = mode.IMAGE_DOWNLOAD + changeImgSize(item, size);
        break;
    case 'pdf':
        thumbnail = pdf;
        break;
    case 'package':
        thumbnail = compressPackage;
        break;
    default:
        thumbnail = noimg;
        break;
    }
    return thumbnail;
};

/**
 *
 * @param {*改变图片大小} src
 * @param {*} size
 */
export const changeImgSize = (src, size = '100x100') => {
    let i = src.lastIndexOf('.');
    return (src = src.substring(0, i) + '_' + size + src.substring(i));
};

/**
 * 密码加密处理
 */
import CryptoJS from '@/assets/plugins/aes/aes-min.min.js';
import SHA256 from '@/assets/plugins/sha256/sha256.min.js';

export const encryption = (password, clientid, token) => {
    let _encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(SHA256(password)), CryptoJS.enc.Utf8.parse(clientid), {
        iv: CryptoJS.enc.Utf8.parse(token),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126
    });
    return CryptoJS.enc.Base64.stringify(_encrypted.ciphertext);
};

/**
 * 监听事件
 * @param {*对象名} obj
 * @param {*绑定类型} evtype
 * @param {*函数} fn
 * @param {*} useCapture
 */
export const addEvent = (obj, evtype, fn, useCapture) => {
    if (obj.addEventListener) {
        obj.addEventListener(evtype, fn, useCapture);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + evtype, fn); // IE不支持事件捕获 
    } else {
        obj['on' + evtype] = fn; // 事实上这种情况不会存在 
    }
};
/**
 * 解绑监听事件
 * @param {*对象名} obj
 * @param {*解绑类型} evtype
 * @param {*函数} fn
 * @param {*} useCapture
 */
export const delEvent = (obj, evtype, fn, useCapture) => {
    if (obj.removeEventListener) {
        obj.removeEventListener(evtype, fn, useCapture);
    } else if (obj.detachEvent) {
        obj.detachEvent('on' + evtype, fn);
    } else {
        obj['on' + evtype] = null;
    }
};

/**
 * 对象数组的深度拷贝.
 * source是原数据，extendObj是新增的键值对
 */
export const objArrDeepCopy = (source, extendObj) => {
    var sourceCopy = source instanceof Array ? [] : {};
    for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objArrDeepCopy(source[item], extendObj) : source[item];
        if (typeof extendObj === 'object' && !(sourceCopy instanceof Array)) {
            for (let param in extendObj) {
                sourceCopy[param] = extendObj[param];
            }
        }
    }
    return sourceCopy;
};

/**
 * 文件下载
 * @param {*下载链接} data
 * @param {*下载文件名} strFileName
 */
export const downloadFile = (data, strFileName) => {
    // 判断是否支持download
    var isSupportDownload = 'download' in document.createElement('a');
    if (isSupportDownload) {
        let aLink = document.createElement('a');
        let evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, false); // initEvent 不加后两个参数在FF下会报错
        aLink.href = data + '?action=download';
        aLink.download = strFileName;
        aLink.dispatchEvent(evt);
    } else {
        window.open(data + '?action=download', '_blank');
    }
};

// 去掉多余空的children
export const reverseData = (list, map) => {
    list.forEach(item => {
        if (map) {
            item.id = item[map.id];
            item.label = item[map.label];
        } else {
            item.id = item.id || item.no;
            item.label = item.label || item.name;
        }
        if (item.children && item.children.length) {
            reverseData(item.children, map);
        } else {
            delete item.children;
        }
    });
    return list;
};

// 同步树插件的半选中状态(保存树时添加半选中，编辑时去掉半选中)
export const handleUpdateCheckds = (tree, checkeds, isAdd = true, checkKey = 'no') => {
    let findHalfCheckds = (item, checkeds, result = new Set()) => {
        if (item.children) {
            let node = [...item.children];
            while (node.length) {
                let data = node.shift();
                if (!item.isRoot) {
                    if (isAdd && checkeds.includes(data[checkKey] || data) && !checkeds.includes(item[checkKey] || item)) {
                        result.add(item[checkKey] || item);
                    } else if (!isAdd && !checkeds.includes(data[checkKey] || data) && checkeds.includes(item[checkKey] || item)) {
                        result.add(item[checkKey] || item);
                    }
                }
                if (data.children && data.children.length > 0) {
                    node = node.concat(data.children);
                }
                findHalfCheckds(data, checkeds, result);
            }
        }
        return result;
    };
    let result,
        halfCheckds = [...findHalfCheckds({
            isRoot: true,
            children: tree
        }, checkeds)];
    if (isAdd) { //
        result = [...new Set(checkeds.concat(halfCheckds))];
    } else {
        result = checkeds.filter(item => !halfCheckds.includes(item));
    }
    // console.log(halfCheckds);
    return result;
};

export const getSelectValue = (id, source = []) => {
    let result = '';
    source.forEach(item => {
        let value = item.id || item.value || item.val;
        if (id === value) {
            result = item.text || item.label || item.name;
        }
    });
    return result;
};

export const clearAttr = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            this.clearAttr(obj[key]);
        } else if (typeof obj[key] === 'string' && String.trim(obj[key]) === '') {
            delete obj[key];
        }
    }
};


// 节流
export const _throttle = (func, wait, options) => {
    /* options的默认值
     *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
     *  options.leading = true;
     * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
     *  options.trailing = true;
     * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
     */
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) {options = {};}
    let later = function () {
        previous = options.leading === false ? 0 : now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {context = args = null;}
    };
    return function () {
        let nowData = now();
        if (!previous && options.leading === false) {previous = nowData;}
        // 计算剩余时间
        let remaining = wait - (nowData - previous);
        context = this;
        args = arguments;
        // 当到达wait指定的时间间隔，则调用func函数
        // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
        if (remaining <= 0 || remaining > wait) {
            // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = nowData;
            result = func.apply(context, args);
            if (!timeout) {context = args = null;}
        } else if (!timeout && options.trailing !== false) {
            // options.trailing=true时，延时执行func函数
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

// 正则
export const regexp = {
    phone: /^1\d{10}$/,
    email: /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{5,50}$/,
    ip: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
    idcard: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, // 身份证
    digit: /^[0-9]*$/,
    bankcard: /^\d{6,50}$/,
    tel: /^((1\d{10})|(0\d{2,3}-\d{7,8})|(0\d{2,3}\d{7,8}))$/
};

// 工具函数
// export let Tools = {
//     encryption,
//     reverseData,
//     formatFile,
//     getSelectValue,
//     clearAttr,
//     regexp
// };
// export default Tools;