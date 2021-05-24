<template>
    <div class="dzAdviser-modal">
        <div class="content">
            <i class="el-icon-close" @click="closeModal"></i>
            <img :src="_QRcodeUrl" alt="店长顾问微信二维码">
            <div class="img-desc">添加店长顾问的微信，领取店铺诊断报告</div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex"

export default {
    computed:{
        ...mapState(['_QRcodeUrl'])
    },

    methods:{

        closeModal(){
            this.$emit('closeModal')
        }
    }
}
</script>

<style lang="scss" scoped>
    .dzAdviser-modal{
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
            width: 320px;
            height: 250px;
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding-top: 35px;
            text-align: center;

            /deep/ .el-icon-close{
                color: #333 !important;
                font-size: 18px;
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
            }

            img{
                width: 160px;
                height: 160px;
            }

            .img-desc{
                font-size: 12px;
                color: #666;
                margin-top: 12px;
            }
            
        }
    }
</style>