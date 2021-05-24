<template>
    <div class="salesVolume">
        <div class="options">
            <span>SKU：</span>
            <el-input v-model="skuId" size="small" clearable placeholder="请输入SKU查询" ></el-input>
            <span class="dimension-label">统计维度：</span>
            <el-radio-group v-model="dimension">
                <el-radio-button label="0">SKU</el-radio-button>
                <el-radio-button label="1">SPU</el-radio-button>
            </el-radio-group>
            <el-button type="primary" class="search-btn" @click="salesVolume" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
            <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                <div slot="content">
                    查询结果源于京东官方接口DPM数据（部分商品与实际数据存在一定误差）；<br/>
                    通过查销量得出的数据，结合运营知识具有较强分析价值。
                </div>
                <i class="el-icon-question"></i>
            </el-tooltip>
            <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
        </div>
        <div class="results" v-if="resultsVisible">
            <div class="sku-results" v-if="isSearchSku">
                <div class="goodsInfo" v-if="goodsInfoVisible">
                    <div class="goodsInfo-item">
                        <img class="goodsInfo-img" :src="goodsInfo.imgUrl" alt="">
                        <div class="right">
                            <a class="goods-title" :href="goodsInfo.goodsUrl" target="_blank" :title="goodsInfo.goodsName">{{goodsInfo.goodsName}}</a>
                            <div class="goods-sku">
                                <a :href="goodsInfo.goodsUrl" target="_blank">sku:{{goodsInfo.skuId}}</a>
                                <img class="copyBtn-img" @click="copySku(goodsInfo.skuId)" src="../../../assets/images/copyLogo.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="goodsInfo-item">
                        <div class="title">品牌</div>
                        <div>{{goodsInfo.brand}}</div>
                    </div>
                    <div class="goodsInfo-item">
                        <div class="title">三级类目</div>
                        <div>{{goodsInfo.thirdCategory}}</div>
                    </div>
                    <div class="goodsInfo-item">
                        <div class="title">昨日成交商品件数</div>
                        <div>{{order.day1Sale}}</div>
                    </div>
                    <div class="goodsInfo-item">
                        <div class="title">首单时间</div>
                        <div>{{goodsInfo.firstTime||'暂无数据'}}</div>
                    </div>
                    <div class="goodsInfo-item">
                        <div class="title">上架时间</div>
                        <div>{{goodsInfo.putaway||'暂无数据'}}</div>
                    </div>
                </div>
                <div class="dmp" v-if="dmpVisible">
                    <div class="dmp-title">DMP查询</div>
                    <div class="dmp-body">
                        <div class="dmp-body-item">
                            <div>
                                <div class="key">近3天访客数</div>
                                <div class="value">{{dmp.day3Visitor}}</div>
                            </div>
                            <div>
                                <div class="key">近3天销量</div>
                                <div class="value">{{dmp.day3Sale}}</div>
                            </div>
                        </div>
                        <div class="dmp-body-item">
                            <div>
                                <div class="key">近7天访客数</div>
                                <div class="value">{{dmp.day7Visitor}}</div>
                            </div>
                            <div>
                                <div class="key">近7天销量</div>
                                <div class="value">{{dmp.day7Sale}}</div>
                            </div>
                        </div>
                        <div class="dmp-body-item">
                            <div>
                                <div class="key">近15天访客数</div>
                                <div class="value">{{dmp.day15Visitor}}</div>
                            </div>
                            <div>
                                <div class="key">近15天销量</div>
                                <div class="value">{{dmp.day15Sale}}</div>
                            </div>
                        </div>
                        <div class="dmp-body-item">
                            <div>
                                <div class="key">近30天访客数</div>
                                <div class="value">{{dmp.day30Visitor}}</div>
                            </div>
                            <div>
                                <div class="key">近30天销量</div>
                                <div class="value">{{dmp.day30Sale}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="order" v-if="orderVisible">
                    <div class="order-title">成交商品件数</div>
                    <div class="order-body">
                        <div class="order-body-item">
                            <div>昨日</div>
                            <div>{{order.day1Sale}}</div>
                        </div>
                        <div class="order-body-item">
                            <div>近7天</div>
                            <div>{{order.day7Sale}}</div>
                        </div>
                        <div class="order-body-item">
                            <div>近15天</div>
                            <div>{{order.day15Sale}}</div>
                        </div>
                        <div class="order-body-item">
                            <div>近30天</div>
                            <div>{{order.day30Sale}}</div>
                        </div>
                    </div>
                    <div class="daily-order-btn" @click="dailyOrderBtn">每日成交商品件数</div>
                </div>
            </div>
            <el-table :data="tabelDataOfSpu" v-if="!isSearchSku">
                <el-table-column label="序号" prop="" width="60px" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.$index+1}}</div>
                        <div v-if="scope.row.isMainSku===0" class="associate-sku">关联SKU</div>
                    </template>
                </el-table-column>
                <el-table-column label="商品链接" prop="" width="236px">
                    <template slot-scope="scope">
                        <div class="goods-link">
                            <img class="goods-img" :src="scope.row.img" alt="" />
                            <a class="goods-skuName" :href="scope.row.url" target="_blank" :title="scope.row.skuName">{{scope.row.skuName}}</a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="三级类别" prop="thirdCat" align="center"></el-table-column>
                <el-table-column label="品牌" prop="brand" align="center"></el-table-column>
                <el-table-column label="3天销量" prop="last3DaysSales" align="center"></el-table-column>
                <el-table-column label="7天销量" prop="last7DaysSales" align="center"></el-table-column>
                <el-table-column label="15天销量" prop="last15DaysSales" align="center"></el-table-column>
                <el-table-column label="30天销量" prop="last30DaysSales" align="center"></el-table-column>
            </el-table>
        </div>
         <scoring-modal v-if="scoringModalVisible" type='1' :token="token"  @closeModal="scoringModalVisible=false"/>
    </div>
</template>

<script>
import {getSkuInfoAndPutaway,searchDmpVisitorAndSale,searchSkuAccurateSale,searchSpuSale} from "../../../api/jdFunction"
import {skuReg,copyUrl} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"
export default {
    data(){
        return{
            token:'',
            dimension:'0',
            skuId:'',
            scoringModalVisible:false,
            goodsInfo:{},
            dmp:{},
            order:{},
            searchBtnLoading:false,
            resultsVisible:false,
            goodsInfoVisible:false,
            dmpVisible:false,
            orderVisible:false,
            tabelDataOfSpu:[],
            isSearchSku:true
        }
    },
    computed: {
        ...mapState(["_token","_skuId"])
    },
    components:{scoringModal},

    mounted(){
        this.token = this.$route.query.token|| this._token
        this.skuId = this.$route.query.skuId|| this._skuId
    },
    methods:{
        async salesVolume(){
            if(this.skuId===''){
                return this.$message.error('请输入SKU')
            }else if(!skuReg(this.skuId)){
                return this.$message.error('SKU输入有误')
            }

            this.$store.commit("CHANGE_SKUID", this.skuId);

            let params = {
                skuId:this.skuId
            }
            this.searchBtnLoading = true
            this.resultsVisible = false
            if(this.dimension==='0'){
                this.searchGoodsInfo(params)
                this.searchDmp(params)
                this.searchOrder(params)
                this.isSearchSku = true
            }else{
                this.searchSpuSale(params)
                this.isSearchSku = false
            }

        },
        async searchGoodsInfo(params){
            this.goodsInfoVisible = false
            let {data:res} = await getSkuInfoAndPutaway({params,token:this.token})
            this.goodsInfoVisible = true
            this.resultsVisible = true
            if(res.code===200){
                this.goodsInfo = res.data
            }else{
                this.$message.error(res.msg)
            }
        },
        async searchDmp(params){
            this.dmpVisible = false
            let {data:res} = await searchDmpVisitorAndSale({params,token:this.token})
            this.dmpVisible = true
            this.resultsVisible = true
            this.searchBtnLoading = false
            if(res.code===200){
                this.dmp = res.data
            }else{
                this.$message.error(res.msg)
            }
        },
        async searchOrder(params){
            this.orderVisible = false
            let {data:res} = await searchSkuAccurateSale({params,token:this.token})
            this.orderVisible = true
            this.resultsVisible = true
            if(res.code===200){
                this.order = res.data
            }else{
                this.$message.error(res.msg)
            }
        },
        async searchSpuSale(params){
            let {data:res} = await searchSpuSale({params,token:this.token})
            this.searchBtnLoading = false
            this.resultsVisible = true
            if(res.code===200){
                this.tabelDataOfSpu = res.data
            }else{
                this.$message.error(res.msg)
            }
        },
        dailyOrderBtn(){
            this.$router.push('/dataQuery/queryOrder')
        },

        copySku(skuId){
            copyUrl(skuId)
            this.$message.success('复制成功')
        }
    }
}
</script>

<style lang='scss' scoped>
    .salesVolume{
        
        .options{
            height: 49px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 21px;
            color: #333;
            font-size: 14px;

            /deep/ .el-input__suffix{
                display: flex;
                align-items: center;
            }

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

            /deep/ .el-input,/deep/ .el-input__inner{
                width: 163px;
                height: 28px;
            }

            .dimension-label{
                margin-left: 20px;
            }

            .search-btn{
                width: 70px;
                height: 28px;
                padding: 0;
                margin-left: 10px;
            }

            .el-tooltip.el-icon-question{
                font-size: 16px;
                color: rgb(153, 153, 153);
                margin-left: 10px;
            }

            .score-btn{
                margin-left: 20px;
            }
        }

        .results{
            margin-top: 10px;
            padding: 0 20px 0 10px;
            
            .sku-results{
                .goodsInfo{
                    height: 80px;
                    display: flex;
                    border: 1px solid #EEEEEE;
                    border-radius: 6px;
    
                    &-item{
                        display: flex;
                        align-items: center;
                        position: relative;
                    }
    
                    &-item:first-child{
                        flex: 1;
    
                        .goodsInfo-img{
                            width: 60px;
                            height: 60px;
                            margin-left: 10px;
                        }
    
                        .right{
                            flex: 1;
                            padding:0 6px;
                            font-size: 14px;
    
                            .goods-title{
                                height: 14px;
                                line-height: 15px;
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
    
                            .goods-sku{
                                height: 11px;
                                margin-top: 10px;
                                display: flex;

                                a{
                                    color: #666;

                                    &:hover{
                                        color: #4D75FF;
                                    }
                                }

                                .copyBtn-img{
                                    width: 12px;
                                    height: 14px;
                                    margin-left: 5px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
    
                    &-item:not(:first-child){
                        width: 16%;
                        flex-direction: column;
                        justify-content: center;
    
                        .title{
                            color: #333;
                            font-size: 14px;
                        }
    
                        &>div:nth-child(2){
                            color: #333;
                            font-size: 16px;
                            font-weight: bold;
                            padding-top: 8px;
                        }
    
                        &::before{
                            content: '';
                            width: 1px;
                            height: 46px;
                            background: #eee;
                            position: absolute;
                            left: 0;
                        }
                    }
                }
    
                .dmp{
                    height: 100px;
                    margin-top: 10px;
                    border: 1px solid #EEEEEE;
                    border-radius: 6px;
    
                    &-title{
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        color:#333;
                        font-size: 14px;
                        background: #F8F8F8;
                        border-radius: 6px 6px 0px 0px;
                    }
    
                    &-body{
                        height: calc(100% - 30px);
                        display: flex;
    
                        &-item{
    
                            width: 25%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;
    
                            &>div{
                                text-align: center;
    
                                .key{
                                    font-size: 14px;
                                    color: #333;
                                }
    
                                .value{
                                    font-size: 16px;
                                    font-weight: bold;
                                    color: #333;
                                    padding-top: 8px;
                                }
                            }
    
                            &>div:nth-child(2){
                                padding-left: 30px;
                            }
                        }
    
                        &-item:not(:first-child){
    
                            &::before{
                                content: '';
                                width: 1px;
                                height: 46px;
                                background: #eee;
                                position: absolute;
                                left: 0;
                            }
                        }
                    }
                }
    
                .order{
                    height: 120px;
                    border: 1px solid #EEEEEE;
                    border-radius: 6px;
                    margin-top:10px;
    
                    &-title{
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        background: #F8F8F8;
                        border-radius: 6px 6px 0px 0px;
                        font-size: 14px;
                        color: #333;
                    }
    
                    &-body{
                        display: flex;
                        height:68px;
    
                        &-item{
                            width: 25%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            position: relative;
    
                            &>div:nth-child(1){
                                color: #333;
                                font-size: 14px;
                            }
    
                            &>div:nth-child(2){
                                color: #333;
                                font-size: 16px;
                                font-weight: bold;
                                margin-top: 16px;
                            }
                        }
    
                        &-item:not(:first-child)::before{
                            content: '';
                            width: 1px;
                            height: 46px;
                            background: #eee;
                            position: absolute;
                            left: 0;
                        }
                    }
    
                    .daily-order-btn{
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        color: #4D75FF;
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
            }

            /deep/ .el-table{
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;

                thead tr th:nth-child(2) .cell{
                    padding-left: 76px;
                }

                .associate-sku{
                    width: 65px;
                    height: 20px;
                    justify-content: center;
                    align-items: center;
                    color: #999;
                    font-size: 14px;
                    background: rgba(229, 241, 255, 1);
                    border-radius: 2px;
                }

                .goods-link{
                    display: flex;
                    align-items: center;

                    .goods-img{
                        width: 60px;
                        height: 60px;
                    }

                    .goods-skuName{
                        height: 54px;
                        line-height: 18px;
                        margin-left: 6px;
                        display: -webkit-box;
                        /* ! autoprefixer: off */
                        -webkit-box-orient: vertical;
                        /* autoprefixer: on */
                        -webkit-line-clamp: 3;
                        overflow: hidden;
                        color: #333;

                        &:hover{
                            color: #4D75FF;
                        }
                    }
                }
                
                
            }
        }
    }
</style>