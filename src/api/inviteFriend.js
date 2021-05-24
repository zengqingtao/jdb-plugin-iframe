import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'


/**
 * @description 邀请好友-获取推广奖励文案
 *@param id 文案编号 1：插件使用时间到期提示文案 2：推广奖励文案
 */
export const geRewardCopyById = (params = {}, token = '') => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/fissionDocument/getPluginFissionDocumentById', params, token);
};

/**
 * @description 邀请好友-获取有效邀请人数
 */
export const getValidInviteNumber = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/fission/getInvitationNumber', params.params, params.token);
};

/**
 * @description 邀请好友-获取邀请记录列表
 * @param pageNo 页码
 * @param pageSize 每页显示条数
 */
export const getInviteRecordList = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/fission/getFriendInvitationRegisterList', params.params, params.token);
};
/**
 * @description 邀请好友-获取个人专属邀请码
 */
export const getInvitationCode = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/invitationCode/getInvitationCode', params.params, params.token);
};
/**
 * @description 插件主页-获取最新消息通知列表
 */
export const getNewMessageNotification = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/mssageNotification/listNotification', params.params, params.token);
};
/**
 * @description 插件主页-通过id获取消息通知
 * @param id  消息编号
 */
export const getNotificationById = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/mssageNotification/getNotificationById', params.params, params.token);
};
/**
 * @description 插件主页-获取未读消息
 */
export const getUnreadMessage = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/mssageNotification/listUnreadStateByServeType', params.params, params.token);
};
/**
 * @description 插件主页-设置消息已读
 * @param id 消息通知
 */
export const setHaveReadStateById = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/mssageNotification/setHaveReadStateById', params.params, params.token);
};
/**
 * @description 插件主页-获取插件主页广告
 * @param location 广告位置编号
 */
export const getPluginAdvertisingImgUrl = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/adsManage/getImgsUrl', params.params, params.token);
};
/**
 * @description 插件主页-获取特权激活码列表
 * @param pageNo 页码
 * @param pageSize 每页条数
 */
export const getPrivilegeActivedCodeList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/privilegeActivationCode/listPrivilegeActivationCodeByOperation', params.params, params.token);
};