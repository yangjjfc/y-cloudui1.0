/**
 * axios basic configuration
 */
import axios from 'axios';
import Interceptor from './interceptor';
const TimeOut = 15000;
// 初始化拦截器
new Interceptor(TimeOut); // eslint-disable-line no-new
/**
 * 基础配置
 * 更多配置请参考 https://github.com/axios/axios
 * @param {*} url  请求地址
 * @param {*} data  参数
 * @param {*} type  请求类型,默认post
 */
let Http = async (url, data = {}, type = 'post') => {
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        // 'apiName': url
        // test
        // apiUrl: '172.30.22.132:40300'
    };
    // 添加header token
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    let token = userInfo ? userInfo.token : ''; // vuex组件模块化,暂时无法直接获取state的方法
    let query,version = '';
    if(data.version) {
        version = data.version;
        delete data.version;
    }
    if(url.split('.').length === 1 || ~url.indexOf('.json')) {
        query = url;
    } else {
        query = 'call?apiCode='+ url + '&jtoken=' + token + '&apiVersion=' + version;
    }
    // 忽略防止重复请求
    if (data.ignoreRepeat) {
        headers.ignoreRepeat = true;
        delete data.ignoreRepeat;
    }
    // 登录验证码
    if (data.verifycode) {
        headers.verifyCode = data.verifycode;
        delete data.verifycode;
    }
    // console.log(query);
    let config = {
        url: query,
        method: type,
        data: data,
        timeout: TimeOut, // 超时时间
        headers: headers,
        responseType: 'json',
        validateStatus: function (status) {
            return status >= 200 && status < 300; // 默认的
        },
        maxRedirects: 5
    };
    let response = null;
    try {
        response = await axios(config);
    } catch (error) {
        response = Promise.reject(error);
    }
    return response;
};

export default Http;
