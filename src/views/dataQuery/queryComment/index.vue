<template>
    <div class="queryComment">
        <div class="options">
            <span>SKU：</span>
            <el-input class="sku-input" v-model="skuId" size="small" clearable placeholder="请输入SKU查询" ></el-input>
            <span class="dimension-label">统计维度：</span>
            <el-radio-group v-model="dimension">
                <el-radio-button label="1">sku评价</el-radio-button>
                <el-radio-button label="0">spu评价</el-radio-button>
            </el-radio-group>
            <span class="comment-time">评价时间：</span>
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type="primary" class="search-btn" @click="queryComment" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
            <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
        </div>
        <div class="results" v-if="resultsVisible">
            <div class="chart-box" v-if="chartData.rows.length">
                <div class="line-box">
                    <div class="number-box">
                        <div>总数量：{{commentList.length+ignoreCommentList.length}}</div>
                        <div>留评数：{{commentList.length}}</div>
                        <div>忽略数：{{ignoreCommentList.length}}</div>
                        <div>留评率：{{commentRate}}</div>
                    </div>
                    <ve-line height="380px" :data="chartData" :settings="chartSettings" :colors="colors" :legend="legend"></ve-line>
                </div>
                <div class="ring-box">
                    <el-radio-group v-model="ringRadio" @change="drawCharts">
                        <el-radio-button label="0">客户端</el-radio-button>
                        <el-radio-button label="1">间隔天数</el-radio-button>
                        <el-radio-button label="2">用户等级</el-radio-button>
                        <el-radio-button label="3">评价星级</el-radio-button>
                    </el-radio-group>
                    <div class="my-chart" id="myChart" style="width:100%;height:325px;"></div>
                </div>
            </div>
            <div class="btn-group">
                <div class="btn-group-left">
                    <el-radio-group v-model="commentType" @change="changeCommentType">
                        <el-radio-button :label="0">留评数：{{commentList.length}}</el-radio-button>
                        <el-radio-button :label="1">忽略数：{{ignoreCommentList.length}}</el-radio-button>
                    </el-radio-group>
                </div>
                <el-button @click="downloadComment">下载评论</el-button>
            </div>
            <el-table :data="(commentType===0?commentList:ignoreCommentList).slice((pagination.page-1)*pagination.size,pagination.page*pagination.size)">
                <el-table-column label="SKU" prop="skuId" align="center" width="145px"></el-table-column>
                <el-table-column label="用户" width="150px">
                    <template slot-scope="scope">
                        <div class="comment-user">
                            <div class="comment-user-nickname" :title="scope.row.nickname">{{scope.row.nickname}}</div>
                            <div class="comment-user-level" :title="scope.row.userLevelName">{{scope.row.userLevelName}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="初评内容" prop="content">
                    <template slot-scope="scope">
                        <div class="comment-content" :title="scope.row.content">
                            {{scope.row.content}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="评分星级" prop="score" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-rate
                            v-model="scope.row.score"
                            disabled
                            >
                        </el-rate>
                    </template>
                </el-table-column>
                <el-table-column label="客户端" prop="userClientShow" align="center" width="150px"></el-table-column>
                <el-table-column label="时间" align="center" width="165px">
                    <template slot-scope="scope">
                        <div class="comment-time">
                            <div>下单时间：</div>
                            <div>{{scope.row.referenceTime}}</div>
                            <div>评价时间：</div>
                            <div>{{scope.row.commentTime}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="intervalDays" align="center" width="100px">
                    <template slot="header">
                        <span>间隔天数</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">间隔天数：评价时间与下单时间的间隔天数。</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box" v-if="pagination.total>pagination.size">
                <el-pagination
                    background
					:current-page="pagination.page"
					:page-size="pagination.size"
					:total="pagination.total"
					layout="prev, pager, next"
					prev-text="上一页"
					next-text="下一页"
					@current-change="changePage"
                >
                </el-pagination>
            </div>
        </div>
        <scoring-modal v-if="scoringModalVisible" type='4' :token="token"  @closeModal="scoringModalVisible=false"/>
        <download-comment v-if="downloadCommentVisible" :token="token" @closeModal="downloadCommentVisible = false" :sku="skuId"></download-comment>
    </div>
</template>

<script>
import {queryComment} from "../../../api/jdFunction"
import {skuReg} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import downloadComment from "../../dialog/downloadComment"
import {mapState} from "vuex"
export default {
    data(){
        this.legend = { bottom: "20px" };
        this.colors = ['#F1BC1C','#72A0FF'],
        this.chartSettings = {
            labelMap: {
                'date': "日期",
                'comment': "留评",
                'ignore': "忽略",
            }
        };
        return{
            token:'',
            dimension:'1',
            skuId:'',
            dateRange:[],//评价时间
            scoringModalVisible:false,
            searchBtnLoading:false,
            resultsVisible:false,
            chartData: {
                columns: ['date', 'comment', 'ignore'],
                rows: []
            },//折线图数据
            ringInfo:{},//环形图的数据，（客户端，间隔天数，用户等级，评分星级）
            ringRadio:'0',//0:客户端，1：间隔天数，2：用户等级，3：评分星级
            option:{
                color:['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical', 
                    y: '10px',    
                    right: '20px'
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        left:'-95px',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: '16',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
                    }
                ]
            },
            tabelData:[],
            commentType:0,//留评与忽略按钮 0：留评按钮，1：忽略按钮
            commentList:[],//评价
            ignoreCommentList:[],//忽略评价
            pagination:{
                page:1,
                size:5,
                total:null
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
            downloadCommentVisible:false
        }
    },
    computed: {
        ...mapState(["_token","_skuId"]),
        commentRate(){
            let totalCount = this.commentList.length+this.ignoreCommentList.length
            let rate = this.commentList.length / totalCount ? ((this.commentList.length / totalCount) * 100).toFixed(0) : 0
            return rate+'%'
        }
    },
    components:{scoringModal,downloadComment},

    mounted(){
        this.token = this.$route.query.token|| this._token
        this.skuId = this.$route.query.skuId|| this._skuId
    },
    methods:{
    
        async queryComment(){
            if(this.skuId===''){
                return this.$message.error('请输入SKU')
            }else if(!skuReg(this.skuId)){
                return this.$message.error('SKU输入有误')
            }else if(this.dateRange.length===0){
                return this.$message.error('请选择日期')
            }

            this.$store.commit("CHANGE_SKUID", this.skuId);
            this.pagination.page = 1

            let params = {
                skuId:this.skuId,
                startDate:this.dateRange[0],
                endDate:this.dateRange[1],
                skuComment:this.dimension
            }
            this.searchBtnLoading = true
            this.resultsVisible = false
            this.ringRadio = '0'
            let {data:res} = await queryComment({params:params,token:this.token})
            if(res.code===200){
                this.searchBtnLoading = false
                this.commentType = 0
                this.resultsVisible = true  
                this.commentList = res.data.comments
                this.ignoreCommentList = res.data.ignoreComments
                this.pagination.total = this.commentList.length
                this.chartData.rows = res.data.lineChartList||[]
                this.ringInfo = res.data.pieVO || {}
                this.drawCharts()
            }else{
                this.$message.error(res.msg)
            }
            

        },

        drawCharts() {
            if(this.ringInfo&&JSON.stringify(this.ringInfo) !=='{}'){
                switch(this.ringRadio){
                    case '0':
                        this.option.series[0].data = this.ringInfo.client
                        break;
                    case '1':
                        this.ringInfo.intervalDays.forEach(element => {
                            element.name.indexOf('天')===-1?(element.name = element.name + '天'):''
                        });
                        this.option.series[0].data = this.ringInfo.intervalDays
                        break;
                    case '2':
                        this.option.series[0].data = this.ringInfo.userLevel
                        break;
                    case '3':
                        this.ringInfo.ratingStar.forEach(element => {
                            element.name.indexOf('星')===-1?(element.name = element.name + '星'):''
                        });
                        this.option.series[0].data = this.ringInfo.ratingStar
                        break;
                }
                this.$nextTick(()=>{
                    let myChart = this.$echart.init(document.getElementById("myChart"));
                    let option = this.option;
                    myChart.setOption(option);
                })
            }
        },

        changeCommentType(){
            this.pagination.page = 1
            this.pagination.total = this.commentType==0? this.commentList.length:this.ignoreCommentList.length
        },

        changePage(currentPage){
            this.pagination.page = currentPage
        },

        downloadComment(){
            this.downloadCommentVisible = true
        }
    }
}
</script>

<style lang='scss' scoped>
    .queryComment{
        
        .options{
            height: 49px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 21px;
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

            .dimension-label{
                margin-left: 20px;
            }

            .comment-time{
                margin-left: 20px;
            }

            .search-btn{
                width: 70px;
                height: 28px;
                padding: 0;
                margin-left: 10px;
            }

            .score-btn{
                margin-left: 20px;
            }
        }
        
        .results{
            margin-top: 10px;
            padding: 0 20px 0 10px;

            .chart-box{
                display: flex;
                .line-box{
                    flex: 1;
                    height: 369px;
                    border: 1px solid #EEEEEE;
                    border-radius: 6px;
                    position: relative;
                    padding-left: 10px;

                    .number-box{
                        position: absolute;
                        display: flex;
                        padding: 20px 10px 0;
                        color: #333;
                        font-size: 14px;

                        &>div+div{
                            padding-left: 58px;
                        }
                    }
                }

                .ring-box{
                    width: 466px;
                    height: 369px;
                    margin-left: 16px;
                    border: 1px solid #EEEEEE;
                    border-radius: 6px;

                    .el-radio-group{
                        padding:16px 0 0 16px;

                        /deep/ .el-radio-button{
                            width: 70px;
                            height: 28px;

                            .el-radio-button__inner{
                                width: 70px;
                                height: 28px;
                                line-height:28px;
                                font-size: 12px;
                                border-radius: 4px;
                                padding: 0;
                            }
                        }

                        /deep/ .el-radio-button+.el-radio-button{
                            margin-left: 10px;
                        }
                    }
                }
            }

            .btn-group{
                display: flex;
                justify-content: space-between;
                margin: 16px 0 10px 0;

                &-left{
                    display: flex;
                    align-items: center;
                    font-size: 14px;

                    /deep/ .el-radio-group{

                        .el-radio-button{
                            width: 120px;
                            height: 28px;
                            margin-right: 10px;
            
                            .el-radio-button__inner{
                                width: 120px;
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

                    .totalCount{
                        padding: 0 18px 0 10px;
                    }
                }

                .el-button{
                    width: 70px;
                    height: 28px;
                    font-size: 12px;
                    padding: 0;
                    background: #fff;
                    color: var(--themeColor);
                    border-color: var(--themeColor);
                    &:hover{
                        color:#fff;
                        background: var(--themeColor);
                    }
                }
            }

            /deep/ .el-table{
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;
                thead tr th,tbody tr td{
                    padding: 6px 0;
                }

                .comment-user{
                    text-align: left;
                    &-nickname,&-level{
                        display: -webkit-box;
                        /* ! autoprefixer: off */
                        -webkit-box-orient: vertical;
                        /* autoprefixer: on */
                        -webkit-line-clamp: 1;
                        overflow: hidden;
                    }
                }

                .comment-content{
                    text-align: left;
                    display: -webkit-box;
                    /* ! autoprefixer: off */
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on */
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }

                .comment-time{
                    text-align: start;
                    line-height: 18px;
                }

                .el-rate__icon{
                    margin-right: 0px;
                }

                .el-icon-question{
                    color: #999;
                }
            }

            .pagination-box{
                text-align: center;
                padding-top: 10px;
            }
        }
    }
</style>