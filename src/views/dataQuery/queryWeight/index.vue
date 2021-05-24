<template>
    <div class="queryWeight">
        <div class="options">
            <span>SKU：</span>
            <el-input v-model="skuId" size="small" clearable placeholder="请输入SKU查询" ></el-input>
            <span class="keyword-label">关键词：</span>
            <el-input v-model="keyword" size="small" clearable placeholder="请输入关键词查询"></el-input>
            <span class="queryRange-label">查询范围：</span>
            <el-radio-group v-model="searchRange">
                <el-radio :label="300">300名</el-radio>
                <el-radio :label="500">500名</el-radio>
                <el-radio :label="1000">1000名</el-radio>
            </el-radio-group>
            <el-button type="primary" class="search-btn" @click="queryWeight" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
            <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                <div slot="content">
                    数据来源于京东官方接口，插件未加任何处理直接源数据呈现,
                    商家可<br/>结合自身运营知识加以理解，对于店铺运营有较强的参考价值。
                </div>
                <i class="el-icon-question"></i>
            </el-tooltip>
            <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
        </div>
        <div class="results" v-if='resultsVisible'>
            <div class="goodsInfo" v-if="JSON.stringify(goodsInfo)!=='{}'">
                <div class="goodsInfo-item">
                    <img class="goods-img" :src="goodsInfo.imgUrl" alt="">
                    <div class="right">
                        <a class="goodsName" :href="goodsInfo.goodsUrl" target="_blank" :title="goodsInfo.goodsName">{{goodsInfo.goodsName}}</a>
                        <div class="price-and-sku">
                            <span>￥{{goodsInfo.price}}</span>
                            <span>
                                <a :href="goodsInfo.goodsUrl" target="_blank">{{goodsInfo.skuId}}</a>
                                <img src="../../../assets/images/copyLogo.png" @click="copyUrl(goodsInfo.skuId)" alt="">
                            </span>
                        </div>
                        <div class="shopName" :class="goodsInfo.shopName.length>=14?'':'inlineBlock'" :title="goodsInfo.shopName">{{goodsInfo.shopName}}</div>
                    </div>
                </div>
                <div class="goodsInfo-item">
                    <div>排名：{{goodsInfo.pctotalRank||'暂无数据'}}</div>
                    <div class="number-box">
                        <div>访客数：{{goodsInfo.visitorFlowDto.visitorNumber||'暂无数据'}}</div>
                        <el-tooltip placement="top" popper-class="tooltip" :enterable="false">
                            <div slot="content">
                                近15天，该关键词为该sku带来的访客数。数据来源于京东DMP。
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </div>
                    <div>隐形降权状态：{{goodsInfo.downRight}}</div>
                </div>
                <div class="goodsInfo-item">
                    <div>权重分：{{goodsInfo.pcweightiness||'暂无数据'}}</div>
                    <div class="number-box">
                        <div>加购人数：{{goodsInfo.visitorFlowDto.addToCarNumber||'暂无数据'}}</div>
                        <el-tooltip placement="top" popper-class="tooltip" :enterable="false">
                            <div slot="content">
                            近15天，该关键词为该sku带来的加购人数。数据来源于京东DMP。
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </div>
                </div>
                <div class="goodsInfo-item">
                    <div>标题权重分：{{goodsInfo.pctitleWeightiness||'暂无数据'}}</div>
                    <div class="number-box">
                        <div>成交客户数：{{goodsInfo.visitorFlowDto.tradingNumber||'暂无数据'}}</div>
                        <el-tooltip placement="top" popper-class="tooltip" :enterable="false">
                            <div slot="content">
                                近15天，该关键词为该sku带来的成交客户数。数据来源于京东DMP。
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div class="goodsInfo" v-else>
                <div class="goodsInfo-noData">暂无数据</div>
            </div>
            <div class="position-and-export">
                <el-button v-if="isShowPositionBtn" @click="positionList">定位到列表</el-button>
                <el-button @click="getweightDownloadCode" :loading="exportDataLoading">导出数据</el-button>
            </div>
            <el-table :data="tabelData.slice((this.pagination.page-1)*this.pagination.size,this.pagination.page*this.pagination.size)" :row-class-name="tableRowClassName">
                <el-table-column label="排名" prop="totalRank" width="70px" ></el-table-column>
                <el-table-column label="商品信息" width="250px">
                    <template slot-scope="scope">
                        <div class="goodsImg-and-goodsTitle">
                            <img :src="scope.row.imgUrl" alt="商品图片" />
                            <div class="right">
                                <a class="right-goodsName" :href="scope.row.goodsUrl" target="_blank" :title="scope.row.goodsName" :class="scope.row.selfShop?'self':'pop'">
                                    {{scope.row.goodsName}}
                                </a>
                                <div class="right-shopName" :class="scope.row.shopName.length>=12?'':'inlineBlock'" :title="scope.row.shopName">{{scope.row.shopName}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="价格">
                    <template slot-scope="scope">
                        <div>￥{{scope.row.price}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="sku" width="150px">
                    <template slot-scope="scope">
                        <div class="sku-and-copyBtn" @click="copyUrl(scope.row.skuId)">
                            <div>{{scope.row.skuId}}</div>
                            <img class="copy-img" src="../../../assets/images/copyLogo.png" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="权重分">
                    <template slot-scope="scope">
                        {{scope.row.weightiness||'暂无数据'}}
                    </template>
                </el-table-column>
                <el-table-column label="标题权重分">
                    <template slot-scope="scope">
                        {{scope.row.titleWeightiness||'暂无数据'}}
                    </template>
                </el-table-column>
                <el-table-column label="评论数">
                    <template slot-scope="scope">
                        {{scope.row.commentNumber||'暂无数据'}}
                    </template>
                </el-table-column>
                <el-table-column label="推荐策略" >
                    <template slot-scope="scope">
                        <el-button class="gapCalc-btn" v-if="gapCalcVisible && search_sku!==scope.row.skuId" @click="openGapCalc(scope.row)">差距计算</el-button>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
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
         <scoring-modal v-if="scoringModalVisible" type='2' :token="token"  @closeModal="scoringModalVisible=false"/>
         <gap-calc v-if="gapCalcModalVisible" :searchSkuInfo="search_sku_info" :curentRowInfo="currentRowInfo"  @closeModal="gapCalcModalVisible = false"/>
    </div>
</template>

<script>
import {getWeight,getweightDownloadCode,downloadFileByCode} from "../../../api/jdFunction"
import {skuReg,copyUrl} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"
import gapCalc from "../../dialog/gapCalc"

export default {
    data(){
        return{
            token:'',
            skuId:'',
            keyword:this.$route.query.keyword||'',
            searchRange:300,
            scoringModalVisible:false,
            searchBtnLoading:false,
            resultsVisible:false,
            goodsInfo:{},
            tabelData:[],
            pagination:{
                page:1,
                size:5,
                total:null
            }, 
            search_sku:'',
            search_sku_page:'',
            search_sku_info:{},
            currentRowInfo:{},
            isShowPositionBtn:false,
            gapCalcVisible:false,
            gapCalcModalVisible:false,
            exportDataLoading:false
        }
    },
    computed: {
        ...mapState(["_token","_skuId"])
    },
    components:{scoringModal,gapCalc},

    mounted(){
        this.token = this.$route.query.token|| this._token
        this.skuId = this.$route.query.skuId||this._skuId
    },
    methods:{

        validParams(){
            if(this.skuId===''){
                return '请输入SKU'
            }else if(!skuReg(this.skuId)){
                return 'SKU输入有误' 
            }else if(this.keyword===''){
                return '请输入关键词' 
            }else{
                return ''
            }
        },

        async queryWeight(){
            let valid = this.validParams()
            if(valid!=='') return this.$message.error(valid)
            
            this.$store.commit("CHANGE_SKUID", this.skuId);

            let params = {
                skuId:this.skuId,
                keyword: this.keyword, 
                rankingNumber: this.searchRange
            }
            this.pagination.page = 1
            this.search_sku = this.skuId
            this.searchBtnLoading = true
            this.resultsVisible = false
            let {data:res} = await getWeight({params,token:this.token})
            this.searchBtnLoading = false
            if(res.code===200){
                this.resultsVisible = true
                this.goodsInfo = res.data.merchandiseWeight||{}
                this.tabelData =  res.data.pcMerchandiseList||[]
                this.pagination.total = this.tabelData.length
                this.gapCalcVisible = this.goodsInfo ? this.goodsInfo.pctotalRank : false

                this.isShowPositionBtn = this.tabelData.some((item, index)=> {
                    if (item.skuId == this.search_sku) {
                        this.search_sku_page = parseInt(index / this.pagination.size) + 1
                        this.search_sku_info = item
                    }
                    return item.skuId == this.search_sku
                })
            }else{
                this.$message.error(res.msg)
            }
        },

        async getweightDownloadCode(){
            let valid = this.validParams()
            if(valid!=='') return this.$message.error(valid)
            
            let params = {
                skuId: this.skuId,
                keyword: this.keyword,
                rankingNumber: this.searchRange
            }
            this.exportDataLoading = true
            let {data:res} = await getweightDownloadCode({params,token:this.token})
            this.exportDataLoading = false
            if(res.code===200){
                let url = downloadFileByCode + '?code=' + res.data;
                window.open(url, "_self");
            }else{
                this.$message.error(res.msg)
            }
        }, 

        copyUrl(url){
			copyUrl(url)
			this.$message.success("复制成功")
		},

        changePage(currentPage){
            this.pagination.page = currentPage
        },

        positionList(){
            this.pagination.page = this.search_sku_page
        },

        tableRowClassName({row, rowIndex}) {
            if (row.skuId === this.search_sku) {
                return 'search-sku-row';
            }
            return '';
        },

        openGapCalc(row){
            this.gapCalcModalVisible = true
            this.currentRowInfo = row
        }
    }
}
</script>

<style lang='scss' scoped>
    .queryWeight{
        
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

            /deep/ .el-input,/deep/ .el-input__inner{
                width: 163px;
                height: 28px;
            }

            /deep/ .el-input__suffix{
                display: flex;
                align-items: center;
            }
            
            .keyword-label,.queryRange-label{
                padding-left: 29px;
            }

            /deep/ .el-radio-group label{
                margin-right: 13px;
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
            padding:0 20px 0 10px;

            .goodsInfo{
                height: 100px;
                display: flex;
                border-radius: 6px;
                border: 1px solid #EEEEEE;

                &-item:first-child{
                    width: 28%;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    
                    .goods-img{
                        width: 77px;
                        height: 78px;
                    }

                    .right{
                        margin-left:8px;
                        padding-top:10px;
                        color: #333;
                        font-size: 14px;

                        .goodsName{
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
                                color: #4d75ff;
                            }

                        }

                        .price-and-sku{
                            margin-top: 8px;
                            display: flex;

                            span:last-child{
                                margin-left: 10px;
                                display: flex;

                                a{
                                    color: #333;

                                    &:hover{
                                        color: #4d75ff;
                                    }
                                }

                                img{
                                    width: 12px;
                                    height: 14px;
                                    cursor: pointer;
                                    margin-left: 5px;
                                }
                            }
                        }

                        .shopName{
                            height: 20px;    
                            line-height: 20px;
                            padding: 0 5px;
                            background: #EEEEEE;
                            border-radius: 2px;
                            font-size: 12px;
                            margin-top: 8px;
                            display: -webkit-box;
                            /* ! autoprefixer: off */
                            -webkit-box-orient: vertical;
                            /* autoprefixer: on */
                            -webkit-line-clamp: 1;
                            overflow: hidden;

                            &.inlineBlock{
                                display: inline-block !important;
                            }
                        }
                    }
                }
                &-item:not(:first-child){
                    width: 24%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    padding-top: 19px;

                    &::before{
                        content: '';
                        width: 1px;
                        height: 63px;
                        background: #eee;
                        position: absolute;
                        left: 0;
                    }

                    .number-box{
                        display: flex;
                    }

                    &>div{
                        height: 12px;
                        font-size: 14px;
                        color: #333;

                        .el-icon-question{
                            color: #999;
                            margin-left: 5px;
                        }
                    }

                    &>div+div{
                        margin-top: 12px;
                    }

                }

                &-noData{
                    width: 100%;
                    color:#999;
                    font-size: 14px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            /deep/ .el-table{
                border:1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;

                thead tr th .cell{
                    text-align: center;
                }

                tbody tr td:not(:nth-child(2)) .cell{
                    text-align: center;
                }

                .goodsImg-and-goodsTitle{
                    display: flex;
                    align-items: center;

                    img{
                        width: 58px;
                        height: 58px;
                    }

                    .right{
                        flex: 1;
                        height: 58px;
                        padding:6px 0 0 8px;

                        &-goodsName,&-shopName{
                            display: -webkit-box;
                            /* ! autoprefixer: off */
                            -webkit-box-orient: vertical;
                            /* autoprefixer: on */
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                            color: #333;
                            font-size: 12px;
                        }

                        &-goodsName{

                            &:hover{
                                color: #4d75ff;
                            }

                            &.self::before{
                                content: '自营';
                                background: #4d75ff;
                            }

                            &.pop::before{
                                content: 'POP';
                                background: var(--themeColor);
                            }

                            &.self::before,&.pop::before{
                                height: 14px;
                                line-height: 14px;
                                color: #fff;
                                padding: 0 3px;
                                font-size: 6px;
                            }
                        }

                        &-shopName{
                            padding: 0 5px;
                            height: 20px;
                            background: #eee;
                            border-radius: 2px;
                            margin-top: 3px;

                            &.inlineBlock{
                                display: inline-block !important;
                            }
                        }
                    }

                }

                .sku-and-copyBtn{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;

                    .copy-img{
                        width: 12px;
                        margin-left: 3px;
                    }
                }
                
                .search-sku-row{
                    background:#ecf5ff
                }

                .gapCalc-btn{
                    width: 70px;
                    height: 28px;
                    padding: 0;
                    font-size: 12px;
                    color: var(--themeColor);
                    border-color: var(--themeColor);
                    background:#fff;
                    &:hover{
                        background: var(--themeColor);
                        color: #fff;
                    }
                }
            }

            .pagination-box{
                text-align: center;
                padding-top: 10px;
            }

            .position-and-export{
                float: right;
                padding: 10px 0 6px 0 ;

                .el-button{
                    width: 86px;
                    height: 28px;
                    padding: 0;
                    font-size: 12px;
                    color: var(--themeColor);
                    background: #fff;
                    border-color: var(--themeColor);

                    &:hover{
                        background: var(--themeColor);
                        color: #fff;
                    }
                }

                .el-button+.el-button{
                    margin-left: 2px;
                }
            }
        }
    }
</style>