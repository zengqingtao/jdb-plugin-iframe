<template>
    <div class="dowloadComment">
        <div class="options">
            <span>SKU：</span>
            <el-input class="sku-input" size="small" clearable v-model="form.skuId" placeholder="请输入SKU查询" ></el-input>
            <span class="dimension-label">统计维度：</span>
            <el-radio-group v-model="form.dimension">
                <el-radio-button label="1">sku评价</el-radio-button>
                <el-radio-button label="0">spu评价</el-radio-button>
            </el-radio-group>
            <span class="comment-time">评价时间：</span>
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
            <span class="commentContent-label">评价内容：</span>
            <el-radio-group v-model="form.commentType">
                <el-radio :label="0">留评评论</el-radio>
                <el-radio :label="1">忽略评论</el-radio>
            </el-radio-group>
        </div>
        <div class="btn-box">
            <el-button type="primary" @click="downloadComment" :loading="loading" onfocus="this.blur()">下载评论</el-button>
        </div>
    </div>
</template>

<script>
import {downloadStayComment,downloadIgnoreComment,downloadFileByCode} from "../../../api/jdFunction"
import {skuReg} from "../../../utils/common"
import {mapState} from "vuex"
export default {
    data(){
        return{
            token:'',
            form:{
                skuId:'',
                dimension:'1',
                commentType:0,
                dateRange:[],
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
    computed: {
        ...mapState(["_token","_skuId"]),
    },

    mounted(){
        this.token = this.$route.query.token|| this._token
        this.form.skuId = this.$route.query.skuId|| this._skuId
    },
    methods:{
        
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

            let params ={
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

<style lang='scss' scoped>
    .dowloadComment{
        
        .options{
            height: 78px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top:50px;
            color: #333;
            font-size: 14px;

            /deep/ .el-radio-button{
                width: 70px;
                height: 28px;

                .el-radio-button__inner{
                    width: 70px;
                    height: 28px;
                    line-height:28px;
                    border-radius: 4px;
                    padding: 0;
                }
            }

            /deep/ .el-radio-button+.el-radio-button{
                margin-left: 6px;
            }

            /deep/ .sku-input.el-input,/deep/ .sku-input .el-input__inner{
                width: 150px;
                height: 28px;
            }

            /deep/ .el-input__suffix{
                display: flex;
                align-items: center;
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

            .dimension-label,.comment-time,.commentContent-label{
                margin-left: 20px;
            }

            /deep/ .el-radio{
                margin-right: 10px;
            } 

        }
        .btn-box{
            text-align: center;
            margin-top: 30px;
            /deep/ .el-button{
                width: 90px;
                height: 28px;
                padding: 0;
            }
        }
    }
</style>