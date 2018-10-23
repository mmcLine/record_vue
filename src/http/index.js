import Vue from 'vue';
import axios from 'axios';
// 引入qs
import qs from 'qs';
import {
  LOGINERR,
  LOGOUT
} from './httpConst';
import router from '../router';

export let httpHost = '';
if (process.env.NODE_ENV === 'production') {
  // 正式版本
  httpHost = 'http://47.98.146.93:22000';
} else if (process.env.NODE_ENV === 'test-dev' || process.env.NODE_ENV === 'development') {
  httpHost = 'http://47.98.146.93:22000';
  // httpHost = 'http://127.0.0.1:22000';
}
// console.log('http env: ', process.env.NODE_ENV)

axios.defaults.baseURL = httpHost; // 默认的请求url
/**
 * post http请求
 * @param  {String} url           [请求url]
 * @param  {Object} params        [请求参数]
 * @param  {[type]} showErrToast  [是否显示错误提示]
 * @return {[type]}               [description]
 */
export async function postHttp({
  url = '',
  params = {},
  config = {},
  showErrToast = true,
  host = ''
} = {
  url: '',
  params: {},
  config: {},
  showErrToast: true,
  host: ''
}) {
  if (host && axios.defaults.baseURL != host) {
    // httpHost = host;
    axios.defaults.baseURL = host; // 默认的请求url
  } else if (!host && axios.defaults.baseURL != httpHost) {
    axios.defaults.baseURL = httpHost; // 默认的请求url
  }
  try {
    const response = await axios.post(url, qs.stringify(params), {
      ...config,
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      timeout: 30000,
    });

    return handleRes(response, showErrToast);
  } catch (e) {
    console.error('err: ', e);
    Vue.prototype.$message.error('请求失败, 请重试');
    return '';
  }
}

/**
 * post http请求
 * @param  {String} url           [请求url]
 * @param  {Object} params        [请求参数]
 * @param  {[type]} showErrToast  [是否显示错误提示]
 * @return {[type]}               [description]
 */
export async function postHttpFormData({
  url = '',
  params = {},
  showErrToast = true,
  host = ''
} = {
  url: '',
  params: {},
  showErrToast: true,
  host: ''
}) {
  if (host && axios.defaults.baseURL != host) {
    // httpHost = host;
    axios.defaults.baseURL = host; // 默认的请求url
  } else if (!host && axios.defaults.baseURL != httpHost) {
    axios.defaults.baseURL = httpHost; // 默认的请求url
  }
  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data;charset=UTF-8'
      },
      timeout: 30000,
    });

    return handleRes(response, showErrToast);
  } catch (e) {
    console.error('err: ', e);
    Vue.prototype.$message.error('请求失败, 请重试');
    return '';
  }
}

/**
 * post http请求
 * @param  {String} url           [请求url]
 * @param  {Object} params        [请求参数]
 * @param  {[type]} showErrToast  [是否显示错误提示]
 * @return {[type]}               [description]
 */
export async function postHttpNoQs({
  url = '',
  params = {},
  config = {},
  showErrToast = true,
  host = ''
} = {
  url: '',
  params: {},
  config: {},
  showErrToast: true,
  host: ''
}) {
  if (host && axios.defaults.baseURL != host) {
    // httpHost = host;
    axios.defaults.baseURL = host; // 默认的请求url
  } else if (!host && axios.defaults.baseURL != httpHost) {
    axios.defaults.baseURL = httpHost; // 默认的请求url
  }
  try {
    const response = await axios.post(url, params, {
      ...config,
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      timeout: 30000,
    });

    return handleRes(response, showErrToast);
  } catch (e) {
    console.error('err: ', e);
    Vue.prototype.$message.error('请求失败, 请重试');
    return '';
  }
}

/**
 * get http请求
 * @param  {String} url           [请求url]
 * @param  {Object} params        [请求参数]
 * @param  {[type]} showErrToast  [是否显示错误提示]
 * @return {[type]}               [description]
 */
export async function getHttp({
  url = '',
  params = {},
  showErrToast = true,
  host = ''
} = {
  url: '',
  params: {},
  showErrToast: true,
  host: ''
}) {
  if (host && axios.defaults.baseURL != host) {
    // httpHost = host;
    axios.defaults.baseURL = host; // 默认的请求url
  } else if (!host && axios.defaults.baseURL != httpHost) {
    axios.defaults.baseURL = httpHost; // 默认的请求url
  }
  try {
    const response = await axios.get(url, {
      params
    }, {
      // headers: {
      //   'Content-Type': 'application/json',
      //   USER_ID: localStorage.getItem('userId') || '',
      //   ACCESS_TOKEN: localStorage.getItem('accessToken') || ''
      // },
      // headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      timeout: 30000,
    });

    return handleRes(response, showErrToast);
  } catch (e) {
    console.error('err: ', e);
    Vue.prototype.$message.error('请求失败, 请重试');
    return '';
  }
}


function handleRes(response, showErrToast) {
  if (parseInt(response.data.code, 10) === LOGOUT) {
    Vue.prototype.$message({
      message: response.data.msg || '退出登录成功',
      type: 'success',
    });
    router.push('/login');
    return '';
  }

  if (parseInt(response.data.code, 10) === LOGINERR) {
    // localStorage.clear();
    // console.log('clear local');
    Vue.prototype.$message.error(response.data.msg || '登录超时, 请重新登录');
    router.push('/login');
    return '';
  }

  if (showErrToast && !response.data.success) {
    Vue.prototype.$message.error(response.data.msg || '请求失败, 请重试');
    return '';
  }
  console.debug('response: ', response.data.data);
  return response.data.data || '1';
}




