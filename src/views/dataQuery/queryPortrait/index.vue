<template>
    <div class="queryPortrait">
        <div class="queryPortrait-content">
            <div class="options">
                <div class="dimension-box">
                    <span class="label">统计维度：</span>
                    <el-radio-group v-model="dimension">
                        <el-radio-button label="2">单品</el-radio-button>
                        <el-radio-button label="1">店铺</el-radio-button>
                        <el-radio-button label="0">行业</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="portraitMark-box">
                    <span class="label">画像标签：</span>
                    <el-radio-group v-model="portraitMark">
                        <el-radio-button label="0">年龄</el-radio-button>
                        <el-radio-button label="5">购买力</el-radio-button>
                        <el-radio-button label="1">性别</el-radio-button>
                        <el-radio-button label="6" class="plus">Plus或高价值用户</el-radio-button>
                        <el-radio-button label="7">京享值</el-radio-button>
                        <el-radio-button label="4">地域排名</el-radio-button>
                        <el-radio-button label="3">下单端口</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="sku-box">
                    <span class="label">SKU：</span>
                    <el-input v-model="skuId" size="small" clearable placeholder="请输入SKU查询" @keyup.enter.native="queryPortrait"/>
                    <el-button type="primary" class="search-btn" :loading="searchLoading" onfocus="this.blur()" @click="queryPortrait">查询</el-button>
                    <el-button type="text" @click="scoringModalVisible = true">评分</el-button>
                </div>
            </div>
            <div class="result-box" v-if="showResult">
                <div v-if="resultOfMark!=='4'" class="other-box">
                    <div class="chart-box">
                        <div>
                            <ve-pie :data="chart_visitors7"  :legend-visible="false" :settings="chartSettings" :extend="chartExtend" :colors="colors" :data-empty="dataEmpty" width="100%" height="100%" ></ve-pie>
                            <div class="chart-label">近7天访客数</div>
                        </div>
                        <div>
                            <ve-pie :data="chart_order7"  :legend-visible="false" :settings="chartSettings" :extend="chartExtend" :colors="colors" :data-empty="dataEmpty" width="100%" height="100%" ></ve-pie>
                            <div class="chart-label">近7天下单量</div>
                        </div>
                        <div>
                            <ve-pie :data="chart_visitors15"  :legend-visible="false" :settings="chartSettings" :extend="chartExtend" :colors="colors" :data-empty="dataEmpty" width="100%" height="100%" ></ve-pie>
                            <div class="chart-label">近15天访客数</div>
                        </div>
                        <div>
                            <ve-pie :data="chart_order15"  :legend-visible="false" :settings="chartSettings" :extend="chartExtend" :colors="colors" :data-empty="dataEmpty" width="100%" height="100%" ></ve-pie>
                            <div class="chart-label">近15天下单量</div>
                        </div>
                        <div>
                            <ve-pie :data="chart_visitors30"  :legend-visible="false" :settings="chartSettings" :extend="chartExtend" :colors="colors" :data-empty="dataEmpty" width="100%" height="100%" ></ve-pie>
                            <div class="chart-label">近30天访客数</div>
                        </div>
                        <div>
                            <ve-pie :data="chart_order30"  :legend-visible="false" :settings="chartSettings" :extend="chartExtend" :colors="colors" :data-empty="dataEmpty" width="100%" height="100%" ></ve-pie>
                            <div class="chart-label">近30天下单量</div>
                        </div>
                        <div class="title-and-tip">
                            <div class="description" :title="description">{{description}}</div>
                            <div class="tip-box" v-for="(item,index) in chartTips" :key="index">
                                <span class="color" :style="'background:'+colors[index]"></span>
                                <span>{{item}}</span>
                            </div>
                        </div>
                    </div>
                    <el-table :data="tableData"  :span-method="objectSpanMethod">
                        <el-table-column :prop="'column'+index" :label="item" v-for="(item,index) in table_header" :key="index"></el-table-column>
                    </el-table>
                </div>
                <div v-if="resultOfMark==='4'" class="area-box">
                    <div class="description area"  :title="description">{{description}}</div>
                    <el-radio-group v-model="area_radio" @change="changeAreaRadio">
                        <el-radio-button label="7">近7天</el-radio-button>
                        <el-radio-button label="15">近15天</el-radio-button>
                        <el-radio-button label="30">近30天</el-radio-button>
                    </el-radio-group>
                    <el-table :data="area_tableData">
                        <el-table-column :prop="'column'+(index+1)" :label="item" v-for="(item,index) in table_header" :key="index"></el-table-column>
                    </el-table>
                </div>
            </div>
            <scoring-modal v-if="scoringModalVisible" type='10' :token="token" @closeModal="scoringModalVisible=false" />
        </div>
    </div>
</template>
<script>
import { skuReg } from '../../../utils/common'
import scoringModal from '../../dialog/scoring'
import {searchPortrait} from '../../../api/jdFunction'
import {mapState} from "vuex"
export default {
    data(){
        this.chartSettings = {
            radius: 50,
            offsetY:100,
            label:{
                color:"#333"
            }
        },
        this.chartExtend = {
            tooltip: {
                trigger: "item",
                formatter: "{b} :<br /> {c} ({d}%)"
            }
        },
        this.colors = [
            "#F1A02D","#FF7C00","#808240","#238FA8","#7190EB"
        ]
       return{
            token:'',
            skuId:'',
            dimension:'2',
            portraitMark:'0',
            resultOfMark:'0',
            description:'',
            tableData:[],
            area_radio:'7',
            table_header:[],
            chartTips:[],
            chart_order7: {
                columns: ['key','value'],
                rows: []
            },
            chart_visitors7: {
                columns: ['key','value'],
                rows: []
            },
            chart_order15: {
                columns: ['key','value'],
                rows: []
            },
            chart_visitors15: {
                columns: ['key','value'],
                rows: []
            },
            chart_order30: {
                columns: ['key','value'],
                rows: []
            },
            chart_visitors30: {
                columns: ['key','value'],
                rows: []
            },
            searchLoading:false,
            scoringModalVisible:false,
            dataEmpty:false,
            showResult:false,
            provinces7:[],
            provinces15:[],
            provinces30:[],
       } 
    },
    computed:{
        ...mapState(['_token','_skuId']),
        area_tableData(){
            let index= this.area_radio==='7'?0:this.area_radio==='15'?3:6
            return this.tableData.slice(index,index+3)
        }
    },
    components:{scoringModal},
    mounted(){
        this.token = this.$route.query.token|| this._token
        this.skuId = this.$route.query.skuId|| this._skuId
    },
    methods:{
        async queryPortrait(){
            if(this.skuId===''){
                return this.$message.error('请输入SKU查询')
            }else if(!skuReg(this.skuId)){
                return this.$message.error('SKU输入有误')
            }

            this.$store.commit("CHANGE_SKUID", this.skuId);
            
            let params = {
                skuId:this.skuId,
                tagType:this.dimension,
                tagTwoType:this.portraitMark
            }
            this.showResult = false
            this.searchLoading = true
            this.resultOfMark = this.portraitMark
            let {data:res} = await searchPortrait({params,token:this.token})
            this.searchLoading = false
            
            if(res.code===200){
                this.showResult = true

                this.description = res.data.graph.description

                this.dealTableData(res)
                this.resultOfMark!=='4'?this.dealChartData(res):''

                switch(this.resultOfMark){
                    case '0':
                        this.chartTips = ['18-25岁','26-35岁','36-45岁','46-55岁','56岁以上']
                        this.table_header = ['时间','指标','总量','18~25岁','26~35岁','36~45岁','46~55岁','56岁以上']
                        break;
                    case '1':
                        this.chartTips = ['男','女']
                        this.table_header = ['时间','指标','总量','男','女']
                        break;
                    case '3':
                        this.chartTips = ['PC','无线']
                        this.table_header = ['时间','指标','总量','PC','无线']
                        break;
                    case '4':
                        this.provinces7 = res.data.list.last7Result.key||[]
                        this.provinces15 = res.data.list.last15Result.key||[]
                        this.provinces30 = res.data.list.last30Result.key||[]
                        this.table_header = ['指标','总量'].concat(this.provinces7)
                        break;
                    case '5':
                        this.chartTips = ['土豪','高级白领','小白领','蓝领','收入很少']
                        this.table_header = ['时间','指标','总量','土豪','高级白领','小白领','蓝领','收入很少']
                        break;
                    case '6':
                        this.chartTips = ['Plus或高价值用户','非Plus或高价值用户']
                        this.table_header = ['时间','指标','总量','Plus或高价值用户','非Plus或高价值用户']
                        break;
                    case '7':
                        this.chartTips = ['201-3000','3001-5000','5001-6000','6001+']
                        this.table_header = ['时间','指标','总量','201-3000','3001-5000','5001-6000','6001+']
                        break;
                }
                

            }else{
                this.$message.error(res.msg)
            }
        },

        dealChartData(res){
            let res7 = res.data.graph.last7Result
            if(!res7||JSON.stringify(res7)==='{}'){
                return this.dataEmpty = true
            }else{ this.dataEmpty = false}
            
            let res15 = res.data.graph.last15Result
            let res30 = res.data.graph.last30Result

            this.chart_visitors7.rows = res7.visitor
            this.chart_order7.rows = res7.order
            this.chart_visitors15.rows = res15.visitor
            this.chart_order15.rows = res15.order
            this.chart_visitors30.rows = res30.visitor
            this.chart_order30.rows = res30.order
        },

        addUnit(element,unit){
            for(let key  in element){
                if(key!=='column0'&&key!=='column1'){
                    element[key] += unit
                }
            }
        },

        dealTableData(res){
            let res7_list = res.data.list.last7Result.list
            if(!res7_list||JSON.stringify(res7_list)==='[]') return this.tableData = []
            let res15_list = res.data.list.last15Result.list
            let res30_list = res.data.list.last30Result.list
            
            this.tableData = res7_list.concat(res15_list,res30_list)
            this.tableData.forEach(element => {
                switch(element.column1){
                    case '访客数':
                        this.addUnit(element,'人')
                        break;
                    case '下单量':
                        this.addUnit(element,'单')
                        break;
                    case '转化率':
                        this.addUnit(element,'%')
                        break;
                }
            });
        },

        changeAreaRadio(){
            let provinces = this.area_radio==='7'?this.provinces7:this.area_radio==='15'?this.provinces15:this.provinces30
            this.table_header = ['指标','总量'].concat(provinces)
        },

        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 3 === 0) {
                    return {
                    rowspan: 3,
                    colspan: 1
                    };
                } else {
                    return {
                    rowspan: 0,
                    colspan: 0
                    };
                }
            }
        }
    }
}
</script>
<style>
/* 折线图没有数据时用到 */
@import "v-charts/lib/style.css";
</style>
<style lang="scss" scoped>

    .queryPortrait{
        width: 100%;
        height: 100%;
        padding-bottom: 15px;

        &-content{
            height: 100%;
            padding: 0 20px;

            .options{
                padding-top: 20px;
                /deep/ .el-radio-button{
                    width: 70px;
                    height: 28px;
    
                    .el-radio-button__inner{
                        width: 70px;
                        height: 28px;
                        line-height: 28px;
                        border-radius: 4px;
                        padding: 0;
                        font-size: 12px;
                    }
    
                    &.plus{
                        width: 130px;
    
                        .el-radio-button__inner{
                            width: 130px;
                        }
                    }
                }
                /deep/ .el-radio-button+.el-radio-button{
                    margin-left: 10px;
                }
                .dimension-box,.portraitMark-box,.sku-box{
                    
                    .label{
                        display: inline-block;
                        width: 80px;
                        font-size: 14px;
                        text-align: right;
                    }

                }

                .portraitMark-box{
                    padding-top: 10px;
                }

                .sku-box{
                    padding-top: 10px;

                    /deep/ .el-input,/deep/ .el-input__inner{
                        width: 230px;
                        height: 28px;
                    }

                    /deep/ .el-input__suffix{
                        display: flex;
                        align-items: center;
                    }

                    /deep/ .el-button--text{
                        height: 28px;
                    }

                    .search-btn{
                        width: 70px;
                        height: 28px;
                        padding: 0;
                        margin-left: 6px;
                    }
                }
            }
            
            .result-box{
    
                .other-box,.area-box{

                    /deep/ .el-table{
                        margin-top: 10px;
                        border:1px solid #eee;
                        border-bottom: 0;
                        border-radius: 6px;

                        .cell{
                            text-align: center;
                        }
                    }

                    .description{
                        width: 275px;
                        height: 14px;
                        line-height: 15px;
                        color: #333;
                        font-size: 14px;
                        display: -webkit-box;
                        /* ! autoprefixer: off */
                        -webkit-box-orient: vertical;
                        /* autoprefixer: on */
                        -webkit-line-clamp: 1;
                        overflow: hidden;

                        &.area{
                            margin-top:37px;
                        }
                    }
                }

                .other-box{

                    .chart-box{
                        height: 705px;
                        padding: 70px 0 30px 0;
                        margin-top: 15px;
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        border: 1px solid #eee;
                        border-radius: 6px;
                        position: relative;
                        &>div:not(.title-and-tip){
                            width: 40%;
                            height: 30%;
                            .chart-label{
                                color: #666;
                                font-size: 12px;
                                text-align: center;
                            }
                        }

                        .title-and-tip{
                            width: 0;
                            position: absolute;
                            top:20px;
                            left: 20px;

                            .description{
                                margin-bottom: 16px;
                            }

                            .tip-box{
                                width: 165px;
                                height: 16px;
                                font-size: 14px;
                                color: #333;
                                display: flex;
                                align-items: center;

                                .color{
                                    display: inline-block;
                                    width: 28px;
                                    height: 16px;
                                    border-radius: 2px;
                                    margin-right: 5px;
                                }

                            }

                            .tip-box+.tip-box{
                                margin-top: 10px;
                            }
                        }
                    }

                    /deep/ .el-table__row:nth-child(1) td:first-child,/deep/ .el-table__row:nth-child(4) td:first-child,/deep/ .el-table__row:nth-child(7) td:first-child{
                        border-right: 1px solid #eee;
                    }

                }

                .area-box{

                    /deep/ .el-radio-button{
                        width: 70px;
                        height: 28px;
                        margin-top: 10px;
        
                        .el-radio-button__inner{
                            width: 70px;
                            height: 28px;
                            line-height: 28px;
                            border-radius: 4px;
                            padding: 0;
                            color: #333 !important;
                            background: #fff !important;
                            border-color: #D3D3D3 !important;                            
                        }

                        &.is-active .el-radio-button__inner{
                            color: var(--themeColor) !important;
                            border-color: var(--themeColor) !important;
                        }
                    }
                    /deep/ .el-radio-button+.el-radio-button{
                        margin-left: 10px;
                    }

                    thead tr th{
                        padding: 3px 0;
                    }

                    tbody tr td{
                        padding:8px 0;
                    }
                }
            }            
        }
    }

</style>