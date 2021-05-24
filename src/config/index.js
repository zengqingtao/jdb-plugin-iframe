import { isRunBuild, isRunTestBuild, isRunDev } from "../utils/checkEnv";

let config = {};
//npm run build
if (isRunBuild()) {
    config = {
        serverUrl: 'https://api.jingdianbao.cn/',
        dzgjUrl: 'https://www.dianzhangguanjia.com/#/',
        pluginIframeUrl: 'https://plugin.dianzhangguanjia.com/#/',
    }
}
//npm run test
else if (isRunTestBuild()) {
    config = {
        serverUrl: 'https://jdbapi.yushutec.com:18443/',
        dzgjUrl: 'https://jdcm.yushutec.com:18443/#/',
        pluginIframeUrl: 'https://plugin.yushutec.com:18443/#/'
    }
}
//本地开发环境
else if (isRunDev()) {
    config = {
        serverUrl: 'https://jdbapi.yushutec.com:18443/',
        dzgjUrl: 'https://jdcm.yushutec.com:18443/#/',
        pluginIframeUrl: 'http://localhost:8080/#/',
    }
}
config.plugin_version = '3.12.2'

export default config;