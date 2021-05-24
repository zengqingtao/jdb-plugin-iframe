<!--激活插件弹窗-->
<template>
    <div class="actived-plugin-modal">
        <div class="content">
            <i class="el-icon-close" @click="closeModal"></i>
            <div class="active-input-box">
                <span>激活码：</span>
                <el-input v-model="activeCode" placeholder="请输入激活码"></el-input>
            </div>
            <div class="err-tip">{{errTip}}</div>
            <div class="QRcode-box">
                <img class="QRcode-img" :src="_QRcodeUrl" alt="店长顾问微信二维码">
                <div class="img-desc">添加店长顾问的微信，领取激活码</div>
            </div>
            <div class="btn-box">
                <el-button @click="activeAccount" :loading="activeLoading">激活</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {activeAccount} from "../../api/jdFunction"
import {mapState} from "vuex"
export default {
    data(){
        return{
            token:this.$route.query.token,
            activeCode:'', 
            activeLoading:false,
            errTip:''
        }
    },
    props:{
        token:{
            type:String,
            default:''
        }
    },
    computed:{
        ...mapState(['_QRcodeUrl'])
    },
    methods:{
        closeModal(){
            this.$emit('closeModal')
        },

        async activeAccount(){
            if(this.activeCode==='') return this.errTip='激活码不能为空'
            let params={
                activationCode:this.activeCode
            }
            this.activeLoading=true
            let {data:res} = await activeAccount({params:params,token:this.token})
            this.activeLoading=false
            if(res.code===200){
                this.$emit('success')
            }else{
                this.errTip = res.msg
            }
        }
    }
}
</script>
<style lang="scss" scoped>

    .actived-plugin-modal{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2100;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.3);

        .content{
            width: 440px;
            background: #fff;
            border-radius: 6px;
            position: relative;

            .el-icon-close{
                color: #fff;
                font-size: 18px;
                position: absolute;
                right: -40px;
                top: 0;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
            }
    
            .active-input-box{
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                padding-top: 41px;
    
                /deep/ .el-input,/deep/ .el-input__inner{
                    width: 229px;
                    height: 28px;
                    font-size: 12px;
                }
            }

            .err-tip{
                height: 11px;
                color: var(--themeColor);
                font-size: 12px;
                text-align: center;
                margin-top: 5px;
            }

            .QRcode-box{
                text-align: center;
                padding-top: 10px;

                .QRcode-img{
                    width: 120px;
                    height: 120px;
                }

                .img-desc{
                    font-size: 14px;
                    padding-top: 5px;
                }
            }


            .btn-box{
                text-align: center;
                padding-bottom: 30px;

                /deep/ .el-button{
                    width: 70px;
                    height: 28px;
                    padding: 0;
                    color: #fff;
                    font-size: 12px;
                    border-color: var(--themeColor);
                    background: var(--themeColor);
                    margin-top:14px
                }
            }
        }
    }
</style>