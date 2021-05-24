<template>
    <div class="downloadComment-modal">
        <div class="content">
            <i class="el-icon-close" @click="closeModal"></i>
            <div class="item">
                <span class="label">sku：</span>
                <el-input v-model="form.skuId" size="small" clearable></el-input>
            </div>
            <div class="item">
                <span class="label">统计维度：</span>
                <el-radio-group v-model="form.dimension">
                    <el-radio-button :label="1">sku评论</el-radio-button>
                    <el-radio-button :label="0">spu评论</el-radio-button>
                </el-radio-group>
            </div>
            <div class="item">
                <span class="label">评价时间：</span>
                <el-date-picker
                    v-model="form.dateRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </div>
            <div class="item">
                <span class="label">评价内容：</span>
                <el-radio-group v-model="form.commentType">
                    <el-radio :label="0">留评评论</el-radio>
                    <el-radio :label="1">忽略评论</el-radio>
                </el-radio-group>
            </div>
            <div class="btn-box">
                <el-button @click="downloadComment" :loading="loading">下载评论</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { downloadStayComment,downloadIgnoreComment,downloadFileByCode } from "../../api/jdFunction"
import {skuReg} from "../../utils/common"
export default {
    data(){
        return{
            form:{
                skuId:'',
                dimension:1,
                dateRange:[],
                commentType:0
            },
            choiceDate0:'',
            pickerOptions: {
                shortcuts: [{
                    text: '近3天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近7天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近15天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近30天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                    picker.$emit('pick', [start, end]);
                    }
                }
                ],
                // 设置不能选择的日期
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate0 = minDate.getTime();
                    if (maxDate) {
                        this.choiceDate0 = '';
                    }
                },
                disabledDate:(time) => {
                    let choiceDateTime = new Date(this.choiceDate0).getTime();
                    const minTime = new Date(choiceDateTime).setMonth(new Date(choiceDateTime).getMonth() - 2);
                    const maxTime = new Date(choiceDateTime).setMonth(new Date(choiceDateTime).getMonth() + 2);
                    const min = minTime;
                    const newDate = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
                    const max = newDate < maxTime ? newDate : maxTime;
                    //如果已经选中一个日期 则 返回 该日期前后一个月时间可选
                    if (this.choiceDate0) {
                        return time.getTime() < min || time.getTime() > max;
                    }
                    //若一个日期也没选中 则 返回 当前日期以前日期可选
                    return time.getTime() > newDate;
                }
            },
            loading:false
        }
    },
    props:{
        sku:{
            type:String,
            default:''
        },
        token:{
            type:String,
            default:''
        }
    },
    mounted(){
        this.form.skuId = this.sku
    },
    methods:{

        closeModal(){
            this.$emit('closeModal')
        },

        validParams(){
            if(this.form.skuId===''){
                return '请输入SKU'
            }else if(!skuReg(this.form.skuId)){
                return 'SKU输入有误'
            }else if(this.form.dateRange.length===0){
                return '请选择日期'
            }
        },
        async downloadComment(){
            let valid = this.validParams()
            if(valid) return this.$message.error(valid)

            let params = {
                skuId: this.form.skuId,
                startDate: this.form.dateRange[0],
                endDate: this.form.dateRange[1],
                skuComment: this.form.dimension
            }

            this.$store.commit("CHANGE_SKUID", this.form.skuId);

            let request = this.form.commentType===0?downloadStayComment:downloadIgnoreComment
            this.loading = true
            let {data:res} = await request({params,token:this.token})
            this.loading = false
            if(res.code===200){
                let url = downloadFileByCode + '?code='+res.data;
                window.open(url, "_self");
            }else{
                this.$message.error(res.msg)
            }
        }   
    }
}
</script>

<style lang="scss" scoped>
    .downloadComment-modal{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.1);

        .content{
            width: 488px;
            height: 280px;
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding: 30px;

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
                align-items: center;
                font-size: 14px;
                .label{
                    width: 80px;
                    text-align: end;
                }

                /deep/ .el-input,/deep/ .el-input__inner{
                    width: 150px;
                    height: 28px;
                }

                /deep/ .el-input__suffix{
                    display: flex;
                    align-items: center;
                }

                /deep/ .el-radio-group{

                    .el-radio-button{
                        width: 90px;
                        height: 28px;
                        margin-right: 10px;
        
                        .el-radio-button__inner{
                            width: 90px;
                            height: 28px;
                            line-height: 28px;
                            border-radius: 4px ;
                            padding: 0;
                            font-size: 12px;
                            color: var(--themeColor) !important;
                            background: #fff !important;
                        }

                        &.is-active .el-radio-button__inner {
                            color: #fff !important;
                            border-color: var(--themeColor) !important;
                            background: var(--themeColor) !important;
                        }
                    }
                }

                /deep/ .el-date-editor{
                    width: 255px;
                    height: 28px;
                    line-height: 28px;
                    padding:3px 6px;

                    i,.el-range-separator{
                        line-height: 20px;
                    }

                    &.is-active{
                        border-color: #C0C4CC;
                    }
                }
            }

            .item+.item{
                margin-top: 15px;
            }

            .btn-box{
                text-align: center;
                padding-top: 20px;

                /deep/ .el-button{
                    width: 90px;
                    height: 28px;
                    padding: 0;
                    color: #fff;
                    border-color: var(--themeColor);
                    background: var(--themeColor);
                }

            }
        }
    }
</style>