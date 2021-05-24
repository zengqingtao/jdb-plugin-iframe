<template>
    <div class="left-nav">
        <div class="nav-box">
            <img src="../../../assets/images/dzgj_logo.png" alt="">
            <div class="dzgj-nav">
                <div class="dzgj-nav-item" v-for="(item,index) in navs" :key="index" @click="clickNav(item.url,item.name)">{{item.name}}</div>
            </div>
        </div>
        <img class="advertising-img" @click="dzAdviserVisible = true"  src="../../../assets/images/shopDiagnosis.png" alt="店铺诊断广告"/>
        <dz-adviser v-if="dzAdviserVisible" @closeModal="dzAdviserVisible = false"/>
    </div>
</template>

<script>
import {getDzgjMenuList,getShopInfo} from "../../../api/jdFunction"
import dzAdviser from "../../dialog/dzAdviser"
import config from "../../../config"
import {mapState} from "vuex"
export default {
    data(){
        return{
            navs:[],
            shopInfo:{},
            account:'',
            dzgj_token:'',
            dzAdviserVisible:false
        }
    },
    computed:{
        ...mapState(['_token'])
    },
    components:{dzAdviser},
    mounted(){
        this.getDzgjMenuList()
        this.getShopInfo()
    },
    methods:{

        async getDzgjMenuList(){
            let params = {
                parentId:'2'
            }
            let {data:res} = await getDzgjMenuList({params,token:this._token})
            if(res.code===200){
                this.navs = res.data
            }else{
                this.$message.error(res.msg)
            }
        },

        async getShopInfo(){
            let {data:res} = await getShopInfo({params:{},token:this._token})
            if(res.code===200){
                this.account = res.data.account
                this.dzgj_token = res.data.token
                this.shopInfo =res.data.shopData?res.data.shopData:{}
            }else{
                this.$message.error(res.msg)
            }
        },

        async clickNav(path,name){
            let url = config.dzgjUrl+'authorization?account='+this.account+'&token='+this.dzgj_token+'&path='
            if(JSON.stringify(this.shopInfo)!=='{}'){
                url=url+path+'&shopId='+this.shopInfo.bindShopId+'&shopName='+this.shopInfo.shopName
            }else{
                url+='storeManage'
            }
            window.open(url)
            this.getShopInfo()
        }
    }
}
</script>

<style lang="scss" scoped>
    .left-nav{
        padding:58px 0 0 10px;

        .nav-box{
            width: 44px;
            text-align: center;
            background: #fff;
            padding: 9px 0 18px;
            border-radius: 6px;
            box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.52);
            
            img{
                width: 35px;
                height: 31px;
            }

            .dzgj-nav{
                width: 44px;
                padding:0 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                
                &-item{
                    margin-top: 20px;
                    color: #333;
                    font-size: 12px;
                    cursor: pointer;

                    &:hover{
                        color: #4d75ff;
                    }
                }
            }
        }
        
        .advertising-img{
            width: 44px;
            height: 248px;
            cursor: pointer;
            margin-top: 12px;
        }
    }
</style>