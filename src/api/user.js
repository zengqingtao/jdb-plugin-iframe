import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'


/**
 *@description 检查登录状态
 *@param 
 */
export const checkLogin = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-server/checkLogin', params.params, params.token);
};

/**
 * @description 获取账号信息
 */
export const getAccountInfo = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/mssageNotification/getDzUserVip', params.params, params.token);
};

/**
 * @description 获取用户权限个数
 */
export const getAuthorityNumber = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/fission/checkUnsealed', params.params, params.token);
};