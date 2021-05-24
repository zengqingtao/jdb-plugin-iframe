import axios from 'axios';
import { getCookie } from "./cookie";
const CryptoJS = require('crypto-js');
import { Encrypt } from "./secret";
import config from "../config/index"

const SecurityKey = CryptoJS.MD5(Math.round(new Date() / 1000).toString().slice(1)).toString();
axios.defaults.timeout = 1 * 60 * 60 * 1000; //设置请求超时为1小时
export const ajaxGet = (url = "", params = {}, token = '') => {
    // let token = getCookie('jdb_token') ? getCookie('jdb_token') : '';
    return axios({
        method: "GET",
        url,
        params: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "token": token,
            "os-type": 1,
            SecurityKey,
            SecurityCode: Encrypt(SecurityKey),
            source: 'dz_plugin',
            version: config.plugin_version
        },
    });
};

export const ajaxPost = (url, params, formData = '', token = '') => {
    // let token = getCookie('jdb_token') ? getCookie('jdb_token') : '';
    return axios({
        method: "POST",
        url,
        data: params,
        headers: {
            'Content-Type': formData === '' ? 'application/json;charset=UTF-8' : formData,
            "token": token,
            "os-type": 1,
            SecurityKey,
            SecurityCode: Encrypt(SecurityKey),
            source: 'dz_plugin',
            version: config.plugin_version
        },
    });
};