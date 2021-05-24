import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'


/**
 * @description 查流量
 *@param skuId skuId
 *@param type 统计维度 0代表行业,1代表店铺,2代表单品
 */
export const searchProductDmpFlow = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/flow/searchProductDmpFlow', params.params, params.token);
};

/**
 * @description 意见反馈
 * @param content 反馈内容
 * @param score 分数
 * @param type （1.查销量、2.查权重、3.查流量、4.查留评、
 * 5.cps-佣金、6.cps-优惠券、7.评价分析、8.坑产计算、
 * 9查订单、10查画像、11查cps(佣金+优惠券)）、12查排名、13查快车、14秒杀分析、15搜索分析
 */
export const functionScoring = (params) => {
    return ajaxPost(config.serverUrl + 'yushu-dzgj-plugin/plugin/evaluate/insertEvaluate', params.params, '', params.token);
};
/**
 * @description 查画像
 * @param skuId 
 * @param tagType 统计维度
 * @param tagTwoType 画像标志（0:年龄,1:性别,2:操作系统,3:下单端口,4:地域排名 5:购买力 6:Plus或高价值用户 7:京享值）
 */
export const searchPortrait = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/portrayal/searchPortrayal', params.params, params.token);
};
/**
 * @description 评价分析
 * @param skuId 
 */
export const commentAnalysis = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/commentAnalyse/getCommentAnalyse', params.params, params.token);
};
/**
 * @description 查销量-查询SPU信息
 * @param skuId 
 */
export const searchSpuSale = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/sale/searchSpuSale', params.params, params.token);
};
/**
 * @description 查销量-查询sku详情信息
 * @param skuId 
 */
export const getSkuInfoAndPutaway = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/sale/getSkuInfoAndPutaway', params.params, params.token);
};
/**
 * @description 查销量-查询DMP访客销量
 * @param skuId 
 */
export const searchDmpVisitorAndSale = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/sale/searchDmpVisitorAndSale', params.params, params.token);
};
/**
 * @description 查销量-查询精准成交量
 * @param skuId 
 */
export const searchSkuAccurateSale = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/sale/searchSkuAccurateSale', params.params, params.token);
};
/**
 * @description 查权重
 * @param skuId 
 */
export const getWeight = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/weight/getWeight', params.params, params.token);
};
/**
 * @description 查权重-获取导出数据的下载码
 * @param skuId 
 * @param keyword 关键词
 * @param rankingNumber 查询范围 300 500 1000
 */
export const getweightDownloadCode = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/weight/downloadPCWeight', params.params, params.token);
};

/**
 * @description 根据下载码下载文件
 */
export const downloadFileByCode = config.serverUrl + 'yushu-dzgj-plugin/plugin/download/downloadFileByCode';

/**
 * @description 获取店长管家导航菜单
 * @param parentId 父级菜单编号 2店长管家
 */
export const getDzgjMenuList = (params) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/functionMenus/getSonMenusList', params.params, params.token);
};

/**
 * @description 判断插件是否需升级
 */
export const pluginUpGrade = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/pluginVersions/whetherUpgrades', params.params, params.token)
};

/**
 * @description 查订单
 * @param skuId  
 */
export const queryOrder = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/sale/searchSkuMultiDayAccurateSale', params.params, params.token)
};
/**
 * @description 查订单-获取导出数据码
 * @param  skuId String
 */
export const exportOrderCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/sale/downloadSkuMultiDayAccurateSale', params.params, params.token)
};
/**
 * @description 坑产计算-sku近15天销售额
 * @param skuId 商品sku
 * @param keyword 关键词
 */
export const getpitProductOfSku = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/pritPC/getPritProduct', params.params, params.token)
};
/**
 * @description 坑产计算-spu近15天销售额
 * @param skuId 商品sku
 * @param keyword 关键词
 */
export const getpitProductOfSpu = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/pritPC/getSkuSaleroomList', params.params, params.token)
};
/**
 * @description 坑产计算-sku获取下载码
 * @param skuId 商品sku
 * @param keyword 关键词
 */
export const getPitOfSkuDownloadCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/pritPC/get15SkuSaleroom', params.params, params.token)
};
/**
 * @description 坑产计算-spu获取下载码
 * @param skuId 商品sku
 * @param keyword 关键词
 */
export const getPitOfSpuDownloadCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/pritPC/getSkuSaleroomCode', params.params, params.token)
};
/**
 * @description 获取版本记录列表
 */
export const getVersionList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/pluginVersions/getPluginVersionsAll', {}, params.token)
};
/**
 * @description cps查询
 * @param skuOrSkuUrl sku
 * @param type 1:sku  2:spu
 */
export const queryCps = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/cps/cpsSearchBySkuOrSpu', params.params, params.token)
};
/**
 * @description 获取店铺信息
 */
export const getShopInfo = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/functionMenus/getShopAndPhone', params.params, params.token)
};
/**
 * @description 查留评
 * @param skuId
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param skuComment 统计维度 0:spu评价 1:sku评价
 */
export const queryComment = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/comment/searchStayAndIgnoreComment', params.params, params.token)
};
/**
 * @description 下载评论
 * @param skuId
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param skuComment 统计维度 0:spu评价 1:sku评价
 */
export const downloadStayComment = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/comment/downloadStayComment', params.params, params.token)
};
/**
 * @description 下载评论
 * @param skuId
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param skuComment 统计维度 0:spu评价 1:sku评价
 */
export const downloadIgnoreComment = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/comment/downloadIgnoreComment', params.params, params.token)
};

/**
 * @description 获取店长顾问二维码
 */
export const getQRCode = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-operation/qrCode/getQRCode', params.params, params.token)
};
/**
 * @description 使用激活码，激活账号
 * @param activationCode 激活码
 */
export const activeAccount = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/privilegeActivationCode/useActivationCode', params.params, params.token)
};
/**
 * @description 查排名-根据sku查询商品信息
 * @param skuId
 */
export const getRankingGoodsInfo = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/rank/getSkuInfo', params.params, params.token)
};
/**
 * @description 查排名-获取排名信息
 * @param skuId
 * @param keyword 关键词
 */
export const getRankingInfo = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/rank/getRank', params.params, params.token)
};
/**
 * @description 查快车
 * @param skuId
 * @param keyword 关键词
 */
export const getExpressInfo = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/fastRide/listFastRide', params.params, params.token)
};
/**
 * @description 获取秒杀分析类目
 */
export const getCategoryList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/seckillAnalyse/listCategory', params.params, params.token)
};
/**
 * @description 秒杀分析-分页获取秒杀数据
 * @param type 秒杀类型：京东秒杀、品牌秒杀、品类秒杀
 * @param beginDate 开始时间 yyyy-MM-dd
 * @param endDate 结束时间 yyyy-MM-dd
 * @param classId1 类目一级 
 * @param classId2 类目二级 
 * @param classId2 类目三级 
 * @param pageNo 页码
 * @param pageSize 每页条数
 */
export const getSecondKillAnalysis = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/seckillAnalyse/listSeckillByDateAndCategoryAndSku', params.params, params.token)
};

/**
 * @description 通过sku获取一个或多个skuId
 * @param sku 
 */
export const getMoreSkuId = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/privilegeActivationCode/getSku', params.params, params.token)
};

/**
 * @description 搜索分析
 * @param keyword  关键词分析
 */
export const searchAnalysis = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-dzgj-plugin/plugin/searchAnalysis/listSearchAnalysis', params.params, params.token)
};