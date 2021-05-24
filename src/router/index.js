import Vue from 'vue'
import Router from 'vue-router'
import { isRunBuild } from '../utils/checkEnv'

Vue.use(Router)
const router = new Router({
    routes: [
        //主页
        {
            path: '/home',
            component: () =>
                import ('@/layout/home/index'),
            children: [{
                    path: '/home',
                    component: () =>
                        import ('@/views/home/index')
                },
                { //插件主页(旧版本使用)
                    path: '/inviteFriend',
                    component: () =>
                        import ('@/views/dataQuery/inviteFriend/index')
                },
                { //数据查询
                    path: '/dataQuery',
                    component: () =>
                        import ('@/views/dataQuery/index'),
                    children: [{ //插件主页
                            path: '/dataQuery/pluginHomePage',
                            component: () =>
                                import ('@/views/dataQuery/pluginHomePage/index')
                        },
                        { //邀请好友
                            path: '/dataQuery/inviteFriend',
                            component: () =>
                                import ('@/views/dataQuery/inviteFriend/index')
                        },
                        { //查排名
                            path: '/dataQuery/queryRanking',
                            component: () =>
                                import ('@/views/dataQuery/queryRanking/index')
                        },
                        { //查流量
                            path: '/dataQuery/queryFlow',
                            component: () =>
                                import ('@/views/dataQuery/queryFlow/index')
                        },
                        { //查画像
                            path: '/dataQuery/queryPortrait',
                            component: () =>
                                import ('@/views/dataQuery/queryPortrait/index')
                        },
                        { //坑产计算
                            path: '/dataQuery/pitProductionCalc',
                            component: () =>
                                import ('@/views/dataQuery/pitProductionCalc/index')
                        },
                        { //评价分析
                            path: '/dataQuery/commentAnalysis',
                            component: () =>
                                import ('@/views/dataQuery/commentAnalysis/index')
                        },
                        { //查销量
                            path: '/dataQuery/salesVolume',
                            component: () =>
                                import ('@/views/dataQuery/salesVolume/index')
                        },
                        { //查权重
                            path: '/dataQuery/queryWeight',
                            component: () =>
                                import ('@/views/dataQuery/queryWeight/index')
                        },
                        { //查订单
                            path: '/dataQuery/queryOrder',
                            component: () =>
                                import ('@/views/dataQuery/queryOrder/index')
                        },
                        { //版本记录
                            path: '/dataQuery/versionRecord',
                            component: () =>
                                import ('@/views/dataQuery/versionRecord/index')
                        },
                        { //cps查询
                            path: '/dataQuery/queryCps',
                            component: () =>
                                import ('@/views/dataQuery/queryCps/index')
                        },
                        { //查留评
                            path: '/dataQuery/queryComment',
                            component: () =>
                                import ('@/views/dataQuery/queryComment/index')
                        },
                        { //查快车
                            path: '/dataQuery/queryExpress',
                            component: () =>
                                import ('@/views/dataQuery/queryExpress/index')
                        },
                        { //秒杀分析
                            path: '/dataQuery/secondKillAnalysis',
                            component: () =>
                                import ('@/views/dataQuery/secondKillAnalysis/index')
                        },
                        { //搜索分析
                            path: '/dataQuery/searchAnalysis',
                            component: () =>
                                import ('@/views/dataQuery/searchAnalysis/index')
                        },
                        { //下载留评
                            path: '/dataQuery/downloadComment',
                            component: () =>
                                import ('@/views/dataQuery/downloadComment/index')
                        }
                    ]
                },
                { //店长顾问
                    path: '/dzAdviser',
                    component: () =>
                        import ('@/views/dzAdviser/index')
                },
                { //会员升级
                    path: '/memberUpGrade',
                    component: () =>
                        import ('@/views/memberUpGrade/index')
                },
                { //复制skuId
                    path: '/copySkuId',
                    component: () =>
                        import ('@/views/copySkuId/index')
                }
            ]
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
})
router.beforeEach((to, from, next) => {
    //百度统计-用于发送某个指定URL的PV统计请求，详细路径：https://tongji.baidu.com/open/api/more?p=ref_trackPageview
    // if (isRunBuild()) {
    //     _hmt.push(['_trackPageview', `/#${to.path}`]);
    // }
    next()
})
export default router