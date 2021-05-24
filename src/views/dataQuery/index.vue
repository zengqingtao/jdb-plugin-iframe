<template>
    <div class="dataQuery">
        <header-nav class="header-nav"/>
        <div class="content dataQuery-content">
            <left-nav />
            <router-view class="router-view"/>
        </div>
        <un-read-message v-if="isUnreadMsg" :token="token" @closeModal="isUnreadMsg = false"/>
    </div>
</template>
<script>
import headerNav from "./headerNav/index"
import leftNav from "./leftNav/index"
import {getQRCode} from "../../api/jdFunction"
import unReadMessage from "./pluginHomePage/unReadMessage"
import { getUnreadMessage } from "../../api/inviteFriend"
export default {
    data(){
        return{
            token:this.$route.query.token,
            isUnreadMsg:false
        }
    },
    components:{
        headerNav,
        leftNav,
        unReadMessage
    },
    created(){
        this.$store.commit("CHANGE_ACCOUNT", this.$route.query.account);
        this.$store.commit("CHANGE_TOKEN", this.$route.query.token);
        this.$store.commit("CHANGE_SKUID", this.$route.query.skuId);
        this.getQRCode()
        this.getUnreadMessage()
    },
    methods:{
 
        // 获取店长顾问微信二维码
        async getQRCode(){
            let {data:res} = await getQRCode({params:{},token:this.$route.query.token})
            if(res.code===200){
                let QRcodeUrl = res.data.list.filter(item => item.type === 12)[0].img
                this.$store.commit("CHANGE_QRCODEURL", QRcodeUrl);
            }else{
                this.$message.error(res.msg)
            }
        },

        async getUnreadMessage(){
            let params = {
                serveType:'1',//店长管家插件
                pageNo:1,
                pageSize:10
            }
            let { data:res } = await getUnreadMessage({params,token:this.token})
            if(res.data&&res.data.length!==0){
                this.isUnreadMsg = true
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .dataQuery{
        height:100%;
        position: relative;
        padding-bottom: 15px;
        overflow: hidden;
        
        .header-nav{
            position: fixed;
            z-index: 1000;
            background: #fff;
        }

        .content{
            display: flex;
            padding: 50px 0 15px;
            height: 100%;
            overflow-y: auto;

            .router-view{
                width: calc(100% - 54px);
            }

        }
    }
</style>
