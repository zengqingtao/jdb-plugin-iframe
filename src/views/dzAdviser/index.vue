<template>
    <div class="dzAdviser">
        <div class="title">只需激活一次，即可永久免费使用</div>
        <div class="active-input-box">
            <span>激活码：</span>
            <el-input v-model="activeCode" placeholder="请输入激活码"></el-input>
        </div>
        <div>
            <el-button @click="activeAccount" :loading="activeLoading">激活</el-button>
        </div>
        <img :src="QRcodeUrl" alt="">
        <div class="tip">添加店长顾问微信，免费领取激活码</div>
    </div>
</template>
<script>
import {getQRCode,activeAccount} from "../../api/jdFunction"
export default {
    data(){
        return{
            token:this.$route.query.token,
            activeCode:'', 
            QRcodeUrl:'', 
            activeLoading:false
        }
    },
    mounted(){
        this.getQRCode()
    },
    methods:{
        async getQRCode(){
            let {data:res} = await getQRCode({params:{},token:this.token})
            if(res.code===200){
                this.QRcodeUrl = res.data.list.filter(item => item.type === 12)[0].img
            }else{
                this.$message.error(res.msg)
            }
        },
        async activeAccount(){
            if(this.activeCode==='') return this.$message.error('请输入激活码')
            let params={
                activationCode:this.activeCode
            }
            this.activeLoading=true
            let {data:res} = await activeAccount({params:params,token:this.token})
            this.activeLoading=false
            if(res.code===200){
                this.$message.success('激活账号成功！')
                setTimeout(()=>{
                    top.postMessage({name:'关闭店长顾问弹窗'},'*')
                },500)
            }else{
                this.$message.error(res.msg)
            }
        }
    }
}
</script>
<style lang="scss" scoped>

    .dzAdviser{
        text-align: center;

        .title{
            color: var(--themeColor);
            font-size: 14px;
            padding-top: 15px;
        }

        .active-input-box{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            padding-top: 10px;

            /deep/ .el-input,/deep/ .el-input__inner{
                width: 229px;
                height: 28px;
            }
        }

        /deep/ .el-button{
            width: 70px;
            height: 28px;
            padding: 0;
            color: #fff;
            border-color: var(--themeColor);
            background: var(--themeColor);
            margin-top:10px
        }

        img{
            width: 160px;
            height: 160px;
            margin-top: 6px;
        }

        .tip{
            color: #666;
            font-size: 12px;
            padding-top: 6px;
        }
    }
</style>