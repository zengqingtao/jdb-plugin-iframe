<!--差距计算弹窗-->
<template>
    <div class="gapCalc-modal">
        <div class="content">
            <i class="el-icon-close" @click="closeModal"></i>
            <div class="title">排名{{curentRowInfo.totalRank-searchSkuInfo.totalRank>0?'超过':'落后于'}}第{{curentRowInfo.totalRank}}名</div> 
            <div class="rank">排名：{{curentRowInfo.totalRank - searchSkuInfo.totalRank}}名</div>
            <div class="weight-score">权重分：{{searchSkuInfo.weightiness - curentRowInfo.weightiness}}分</div>
            <div class="titleWeight-score">标题权重分：{{searchSkuInfo.titleWeightiness - curentRowInfo.titleWeightiness}}分</div>
            <div class="tip">想达到此位置，要完成坑位所需有效金额</div>
            <div class="btn-box">
                <el-button type="primary" @click="openPitProductCalc" onfocus="this.blur()">前往坑产计算器计算</el-button>
            </div>
        </div>
    </div>
</template>
<script>


export default {
    data(){
        return{

        }
    },
    props:{
        searchSkuInfo:{
            type:Object,
            default:{}
        },
        curentRowInfo:{
            type:Object,
            default:{}
        }
    },
    methods:{

        closeModal(){
            this.$emit('closeModal')
        },

        openPitProductCalc(){
            this.closeModal()
            this.$router.push('/dataQuery/pitProductionCalc')
        }
    }
}
</script>

<style lang="scss" scoped>
    .gapCalc-modal{
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
            width: 490px;
            height: 258px;
            text-align: center;
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding-top: 50px;
            color: #333;

            title{
                font-size: 16px;
            }
            
            .rank,.weight-score,.titleWeight-score{
                font-size: 14px;
            }

            .rank{
                height: 33px;
                padding-top: 20px;
            }

            .weight-score,.titleWeight-score{
                height: 23px;
                padding-top: 10px;
            }

            .tip{
                height: 51px;
                padding-top: 38px;
                color: rgb(102, 102, 102);
                font-size: 14px;
            }

            /deep/ .el-icon-close{
                color: #333 !important;
                font-size: 18px;
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
            }

            .btn-box{
                text-align: center;
                padding-top: 13px;
            }
            /deep/ .el-button{
                width: 150px;
                height: 32px;
                padding: 0;
            }
        }
    }
</style>