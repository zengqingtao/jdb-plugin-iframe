<template>
    <div class="scoring-modal">
        <div class="content">
            <i class="el-icon-close" @click="closeModal"></i>
            <div class="item scoring-box" >
                <span class="label">评分：</span>
                <el-rate v-model="score"></el-rate>
                <!-- <i :class="score>=n?'el-icon-star-on':'el-icon-star-off'" v-for="n in 5" :key="n" @click="changeScore(n)"></i> -->
            </div>
            <div class="item feedback-box">
                <span class="label">意见反馈：</span>
                <el-input v-model="feedback" type="textarea" :rows="8" placeholder="请输入建议或意见（非必填）"/>
            </div>
            <div class="btn-box">
                <el-button type="primary" @click="submit" onfocus="this.blur()">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { functionScoring } from "../../api/jdFunction"

export default {
    data(){
        return{
            score:5,
            feedback:''
        }
    },
    props:{
        type:{
            type:String,
            default:''
        },
        token:{
            type:String,
            default:''
        }
    },
    methods:{

        closeModal(){
            this.$emit('closeModal')
        },

        async submit(){

            let params = {
                type:this.type,
                score:this.score,
                content:this.feedback
            }
           let {data:res} = await functionScoring({params,token:this.token})
           if(res.code===200){
               this.closeModal()
               this.$message.success('提交成功，感谢您的反馈！')
           }else{
               this.$message.error(res.data.msg)
           }
        }
    }
}
</script>

<style lang="scss" scoped>
    .scoring-modal{
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
            width: 488px;
            height: 320px;
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding-top: 34px;

            /deep/ .el-icon-close{
                color: #333 !important;
                font-size: 18px;
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
            }
            
            .item{
                display: flex;
                .label{
                    display: inline-block;
                    min-width: 80px;
                    font-size: 14px;
                    text-align: right;
                    padding-left: 20px;
                }

                &.scoring-box{
                    align-items: center;
                    
                    .label::before{
                        content: "*";
                        color:#f00;
                    }
                }

                &.feedback-box{
                    padding-top: 10px;

                    /deep/ .el-textarea__inner{
                        width: 363px;
                        padding: 6px;

                        &:focus{
                            border-color: #C0C4CC;
                        }
                    }
                }
            }

            .btn-box{
                text-align: center;
                padding-top: 20px;
            }
            /deep/ .el-button{
                width: 90px;
                height: 30px;
                padding: 0;
            }
        }
    }
</style>