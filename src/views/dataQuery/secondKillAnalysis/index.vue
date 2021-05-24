<!--秒杀分析-->
<template>
    <div class="second-kill-analysis">
        <div class="options">
            <div class="options-time">
                <span class="label">开始秒杀时间：</span>
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
            </div>
            <div class="options-category">
                <span class="label">选择类目：</span>
                <el-cascader
                    v-model="selectedCategory"
                    :options="categoryOptions"
                    :props="{ expandTrigger: 'hover' }">
                </el-cascader>
            </div>
            <div class="options-sku">
                <span class="label">sku（选填）：</span>
                <el-input v-model="skuId" type="number" size="small" clearable placeholder="请输入SKU（可不填写）" ></el-input>
                <el-button type="primary" class="search-btn" @click="secondKillAnalysis1" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
                <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
            </div>
        </div>
        <div class="results" v-if="resultsVisible">
            <div class="authority-tip" v-if="authorityNumber<1">
                <span>账号权限不足，无法查看秒杀销量数据。</span>
                <el-button type="text" @click="$router.push('/dataQuery/inviteFriend')">解封权限</el-button>
            </div>
            <div class="btn-group">
                <div class="btn-group-left">
                    <el-radio-group v-model="secKillType" @change="changeSecKillType">
                        <el-radio-button label="京东秒杀">京东秒杀 ({{result['京东秒杀'].totalCount}})</el-radio-button>
                        <el-radio-button label="品牌秒杀">品牌秒杀 ({{result['品牌秒杀'].totalCount}})</el-radio-button>
                        <el-radio-button label="品类秒杀">品类秒杀 ({{result['品类秒杀'].totalCount}})</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <el-table :data="tabelData" v-loading="tableLoading">
                <el-table-column label="秒杀时间" align="center" width="160px">
                    <template slot-scope="scope">
                        <div class="time-column-box">
                            <div>{{scope.row.beginTime}}</div>
                            <div>~</div>
                            <div>{{scope.row.endTime}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品" min-width="300px">
                    <template slot-scope="scope">
                        <div class="goods-column-box">
                            <img :src="scope.row.imgUrl" alt="">
                            <div class="right">
                                <a :href="scope.row.goodsUrl" target="_blank" class="goodsName" :title="scope.row.goodsName">{{scope.row.goodsName}}</a>
                                <div class="discounts">{{scope.row.specifLabel}}</div>
                                <a :href="scope.row.goodsUrl" target="_blank" class="skuId">{{scope.row.skuId}}</a>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="秒杀价格" align="center">
                    <template slot-scope="scope">
                        <div class="price">￥{{scope.row.miaoshaPrice}}</div>
                        <s class="original-price">￥{{scope.row.price}}</s>
                    </template>
                </el-table-column>
                <el-table-column label="历史最低价天数" prop="dayOfLowestPrice" align="center" min-width="130px"></el-table-column>
                <el-table-column prop="quoteStock" align="center">
                    <template slot="header">
                        <span>活动库存</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">报名参与秒杀活动的商品库存数量。</div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        {{scope.row.quoteStock===0?scope.row.quoteStock:(scope.row.quoteStock||'-')}}
                    </template>
                </el-table-column>
                <el-table-column prop="alreadySell" align="center">
                    <template slot="header">
                        <span>已售出</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">秒杀活动中，已售出商品数量。与实际数据有一点偏差，误差比较小。</div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        {{scope.row.alreadySell===0?scope.row.alreadySell:(scope.row.alreadySell||'-')}}
                    </template>
                </el-table-column>
                <el-table-column prop="stockState" align="center">
                    <template slot="header">
                        <span>剩余库存</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">参与活动未售出的商品数量。</div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">{{scope.row.stockState===0?scope.row.stockState:(scope.row.stockState||'-')}}</template>
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
        <scoring-modal v-if="scoringModalVisible" type='14' :token="token"  @closeModal="scoringModalVisible=false"/>
    </div>
</template>

<script>
import {getCategoryList,getSecondKillAnalysis} from "../../../api/jdFunction"
import {getAuthorityNumber} from "../../../api/user"
import {skuReg} from "../../../utils/common"
import scoringModal from "../../dialog/scoring"

import {mapState} from "vuex"
export default {
    data(){
        return{
            token:'',
            skuId:'',
            dateRange:null,//秒杀时间范围
            selectedCategory:[],//选择的类目
            categoryOptions:[],//类目选项内容
            secKillType:'京东秒杀',//秒杀类型：京东秒杀、品牌秒杀、品类秒杀
            scoringModalVisible:false,
            searchBtnLoading:false,
            resultsVisible:false,
            tabelData:[],
            result:{
                '京东秒杀':{
                    list:[],
                    totalCount:null
                },
                '品牌秒杀':{
                    list:[],
                    totalCount:null
                },
                '品类秒杀':{
                    list:[],
                    totalCount:null
                }
            },

            pagination:{
                page:1,
                size:10,
                total:null
            },
            pickerOptions: {
                disabledDate:(time) => {
                    const minTime = new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000*30 - 1
                    return time.getTime() < minTime || time.getTime() > new Date().getTime();
                }
            },
            authorityNumber:0,//用户拥有的权限数量
            searchParams:{},
            tableLoading:false
        }
    },
    computed: {
        ...mapState(["_token","_skuId"])
    },
    components:{scoringModal},

    mounted(){
        this.token = this.$route.query.token|| this._token
        this.getCategoryList()
        this.getAuthorityNumber()
    },

    methods:{

        async getCategoryList(){
            let { data:res } = await getCategoryList({token:this.token})
            if(res.code===200){
                this.categoryOptions = res.data
            }else{  
                this.$message.error(res.msg)
            }
        },

        async getAuthorityNumber(){
            let {data:res} = await getAuthorityNumber({token:this.token})
            if(res.code===200){
                this.authorityNumber = res.data
            }else{
                this.$message.error(res.msg)
            }
        },  

        validParams(){
            let valid = ''

            if(!this.dateRange){
                valid = '请选择秒杀时间'
            }else if(this.selectedCategory.length===0){
                valid = '请选择类目'
            }else if(this.skuId!==''&&!skuReg(this.skuId)){
                valid = 'sku输入有误'
            }

            return valid
        },

        async secondKillAnalysis1(){//获取京店秒杀数据
            let valid = this.validParams()
            if(valid) return this.$message.error(valid)

            if(this.skuId!=='')this.$store.commit("CHANGE_SKUID", this.skuId);

            this.pagination.page = 1

            this.secKillType = '京东秒杀'

            this.getResult('京东秒杀')
            this.getResult('品牌秒杀')
            this.getResult('品类秒杀')

        },

        async getResult(type){

            let params = {
                type,
                skuId:this.skuId,
                beginDate:this.dateRange[0],
                endDate:this.dateRange[1],
                classId1:this.selectedCategory[0],
                classId2:this.selectedCategory[1],
                classId3:this.selectedCategory[2],
                pageNo:this.pagination.page,
                pageSize:this.pagination.size
            }
            this.searchParams = params
            this.searchBtnLoading = true
            this.resultsVisible = false
            let {data:res} = await getSecondKillAnalysis({params:params,token:this.token})
            this.searchBtnLoading = false
            if(res.code===200){
                this.resultsVisible = true  
                this.result[type] = res.data
                this.changeSecKillType()
            }else{
                this.$message.error(res.msg)
            }
        },

        async secondKillAnalysis2(){
            this.tableLoading = true
            this.searchParams.type  = this.secKillType 
            this.searchParams.pageNo  = this.pagination.page
            let {data:res} = await getSecondKillAnalysis({params:this.searchParams,token:this.token})
            this.tableLoading = false
            if(res.code===200){
                this.tabelData = res.data.results
                this.pagination.total = res.data.totalCount
            }else{
                this.$message.error(res.msg)
            }
        },

        async changeSecKillType(){
            this.pagination.page = 1
            this.tabelData = this.result[this.secKillType].results
            this.pagination.total = this.result[this.secKillType].totalCount
        },

        changePage(currentPage){
            this.pagination.page = currentPage
            this.secondKillAnalysis2()
        }
    }
}
</script>

<style lang='scss' scoped>
    .second-kill-analysis{
        
        .options{
            padding:16px 0 20px 20px;
            color: #333;
            font-size: 14px;

            .label{
                display: inline-block;
                width: 100px;
                text-align: end;
                font-size: 14px;
                color: #333;
            }

            &-time{

                /deep/ .el-date-editor{
                    width: 305px;
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

            &-category{
                padding-top: 10px;

                /deep/ .el-cascader{
                    width: 305px;
                    height: 28px;
                    line-height: 28px;

                    .el-input,.el-input__inner{
                        width: 305px;
                        height: 28px;
                    }

                    .el-input__icon.el-icon-arrow-down{
                        height: 28px;
                        line-height: 28px;
                    }

                }
            }

            &-sku{
                padding-top: 10px;

                /deep/ .el-input,/deep/ .el-input__inner{
                    width: 305px;
                    height: 28px;
                    font-size: 12px;
                }

                /deep/ .el-input__suffix{
                    display: flex;
                    align-items: center;
                }

                .search-btn{
                    width: 70px;
                    height: 28px;
                    padding: 0;
                    margin-left: 10px;
                    font-size: 12px;
                }

                .score-btn{
                    padding: 0;
                    margin-left: 20px;
                }
            }
        }
        
        .results{
            padding: 0 20px 0 10px;

            .authority-tip{
                color: #333;
                font-size: 12px;
                padding:0 0 10px 10px;

                .el-button{
                    padding:0;
                    color: #4D75FF;
                }
            }

            .btn-group{
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;

                &-left{
                    display: flex;
                    align-items: center;
                    font-size: 14px;

                    /deep/ .el-radio-group{

                        .el-radio-button{
                            width: 130px;
                            height: 28px;
                            margin-right: 6px;
            
                            .el-radio-button__inner{
                                width: 130px;
                                height: 28px;
                                line-height: 28px;
                                border-radius: 4px;
                                padding: 0;
                                font-size: 12px;
                                color: #333 !important;
                                border-color: #D3D3D3 !important;
                                background: #fff !important;
                            }

                            &.is-active .el-radio-button__inner {
                                color: var(--themeColor) !important;
                                border-color: var(--themeColor) !important;
                            }
                        }

                        .el-radio-button:not(:first-child).is-active .el-radio-button__inner{
                            border-left: 0 !important;
                        }
                    }
                }
            }

            /deep/ .el-table{
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;

                thead tr th{
                    padding: 6px 0;
                    font-size: 14px;
                }

                thead tr th:nth-child(2){
                    padding-left: 69px;
                }

                tbody tr td{
                    padding: 6px 0;
                    font-size: 12px;
                }

                .time-column-box>div{
                    height: 14px;
                    line-height: 14px;
                }

                .goods-column-box{
                    display: flex;

                    img{
                        width: 59px;
                        height: 60px;
                    }

                    .right{
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        padding: 5px 0 0 10px;

                        .goodsName{
                            height: 14px;
                            line-height: 14px;
                            display: -webkit-box;
                            /* ! autoprefixer: off */
                            -webkit-box-orient: vertical;
                            /* autoprefixer: on */
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                            color: #333;

                            &:hover{
                                color: #4D75FF;
                            }
                        }

                        .discounts,.skuId{
                            height: 14px;
                            line-height: 14px;
                            margin-top: 5px;
                        }

                        .skuId{
                            color: #333;
                            
                            &:hover{
                                color: #4D75FF;
                            }
                        }

                    }

                }

                .price{
                    height: 14px;
                }

                .original-price{
                    color: #999;
                    font-size: 12px;
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