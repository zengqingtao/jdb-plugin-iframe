<template>
    <div class="header-nav">
        <el-radio-group v-model="activedNav" style="margin-bottom: 30px;" @change="tabClick">
            <el-radio-button :label="item.path" v-for="(item,index) in navs" :key="index">{{item.name}}</el-radio-button>
        </el-radio-group>
        <div class="version-upGrade" v-if="!upGrageBtnVisible" @click="versionUpGrade">
            <img class="upGrade-img" src="../../../assets/images/upGrade.png" alt="">
            <div>新版本升级</div>
        </div>
    </div>
</template>
<script>
import {pluginUpGrade} from "../../../api/jdFunction"
import config from "../../../config"
export default {
    data(){
        return{
            activedNav:this.$route.query.path,
            navs:[
                {name:'插件主页',path:'/dataQuery/pluginHomePage'},
                {name:'查排名',path:'/dataQuery/queryRanking'},
                {name:'查销量',path:'/dataQuery/salesVolume'},
                {name:'查订单',path:'/dataQuery/queryOrder'},
                {name:'查流量',path:'/dataQuery/queryFlow'},
                {name:'查权重',path:'/dataQuery/queryWeight'},
                {name:'坑产计算',path:'/dataQuery/pitProductionCalc'},
                {name:'查画像',path:'/dataQuery/queryPortrait'},
                {name:'cps查询',path:'/dataQuery/queryCps'},
                {name:'查留评',path:'/dataQuery/queryComment'},
                {name:'查快车',path:'/dataQuery/queryExpress'},
                {name:'评价分析',path:'/dataQuery/commentAnalysis'},
                {name:'秒杀分析',path:'/dataQuery/secondKillAnalysis'},
                {name:'搜索分析',path:'/dataQuery/searchAnalysis'}
            ],
            upGrageBtnVisible:true,
        }
    },
    watch: {
        "$route.fullPath": {
            handler(value) {
                let path = value.split('?')[0]
                this.activedNav = path;
                if(document.getElementsByClassName('content')[0]){
                    document.getElementsByClassName('content')[0].scrollTop = 0
                }
            },
            immediate: true
        }
    },
    mounted(){
        this.pluginUpGrade()
    },
    methods:{

        tabClick(val){
            this.$router.push(this.activedNav)
        },

        async pluginUpGrade(){

            let params = {
                parentVersions: this.$route.query.version
            }
            let {data:res} = await pluginUpGrade({params,token:this.token})
            if(res.code===200){
                this.upGrageBtnVisible = res.data
            }else{
                this.$message.error(res.msg)
            }
        },

        versionUpGrade(){
            window.open(config.dzgjUrl+'pluginsDownload')
        }
    }
}
</script>
<style lang="scss" scoped>

    .header-nav{
        width: 100%;
        height: 50px;
        box-shadow: 0px 4px 32px 0px rgba(175, 175, 175, 0.22);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0 22px 0 65px;

        .version-upGrade{
            font-size: 12px;
            color: #ff4d4d;
            text-align: center;
            cursor: pointer;

            .upGrade-img{
                width: 66px;
                height: 32px;
            }

        }
        
        /deep/ .el-radio-group{
            padding: 0 10px;
            margin-bottom: 0 !important;
            border-bottom: 1px solid #eee;


            .el-radio-button{
                width: 68px;
                height: 27px;
                position: relative;
        
                .el-radio-button__inner{
                    border-color: #D9D9D9 !important;
                    border-left: 0 !important;
                    width: 68px;
                    height: 27px;
                    line-height: 27px;
                    border-radius: 4px 4px 0 0 ;
                    padding: 0;
                    font-size: 12px;
                    color: #333 !important;
                    background: #f8f8f8 !important;
                    &:hover{
                        color:#fff !important;
                        border-color: var(--themeColor) !important;
                        background: var(--themeColor) !important;
                    }
                }

            &.is-active .el-radio-button__inner {
                    color: #fff !important;
                    border-color: var(--themeColor) !important;
                    background: var(--themeColor) !important;
                }
            }
            .el-radio-button:first-child .el-radio-button__inner{
                border-left: 1px solid #D9D9D9 !important;
            }
        }
    }

</style>