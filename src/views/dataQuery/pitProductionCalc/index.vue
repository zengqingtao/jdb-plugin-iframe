<template>
    <div class="pitProductionCalc">
        <div class="options">
            <span>SKU：</span>
            <el-input v-model="skuId" size="small" clearable placeholder="请输入SKU查询" ></el-input>
            <span class="keyword-label">关键词：</span>
            <el-input v-model="keyword" size="small" clearable placeholder="请输入关键词查询"></el-input>
            <span class="queryRange-label">
                查询范围：
                <div class="authority-tip" v-if="authorityNumber<3&&showAuthorityTip"> 
                    <span v-if="authorityNumber<2">500名、1000名需要解封权限才可使用。</span>
                    <span v-else>1000名需要解封权限才可使用。</span>
                    <el-button type="text" @click="$router.push('/dataQuery/inviteFriend')">解封</el-button>
                </div>
            </span>
            <el-radio-group v-model="searchRange">
                <el-radio :label="300">300名</el-radio>
                <el-radio :label="500" :disabled='authorityNumber<2'>500名</el-radio>
                <el-radio :label="1000" :disabled='authorityNumber<3'>1000名</el-radio>
            </el-radio-group>
            <el-button type="primary" class="search-btn" @click="pitProductionCalc" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
            <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                <div slot="content">
                    数据来源于京东官方接口，插件未加任何处理，直接将源数据呈现。
                </div>
                <i class="el-icon-question"></i>
            </el-tooltip>
            <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
        </div>
        <div class="results" :class="authorityNumber<3?'addPaddingTop':''" v-if='resultsVisible'>
            <div class="goodsInfo">
                <div class="goodsInfo-item">
                    <img class="goods-img" :src="goodsInfo.goodsImg" alt="">
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
                    <div>近15天SKU有效销售额</div>
                    <div class="number-box">
                        <div>{{goodsInfo.saleroom!==0&&!goodsInfo.saleroom?'暂无数据':('￥'+goodsInfo.saleroom)}}</div>
                        <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                            <div slot="content">
                                <p>1.坑产金额为订单完成后2-3天计入的有效销售额</p>
                                <p>2.坑产金额又叫有效销售额、出库金额。</p>
                                <p>3.坑产金额计算周期为近15天；</p>
                                <p>4.和店铺后台的成交金额不同，是近15天评价且被计入有效的<br/>订单金额，或过滤无效订单、异常订单、优惠金额。</p>
                                <p>5.坑产金额是权重因子中占比最大一类数据，把握好有效销售额的<br/>提升节奏和目标，就可以快速获取推荐流量、关联词同步排名提升等</p>
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </div>
                </div>
                <div class="goodsInfo-item">
                    <div>当前坑产排名</div>
                    <div class="number-box">
                        <div>{{goodsInfo.totalRank?('第'+goodsInfo.totalRank+'名'):'暂无数据'}}</div>
                    </div>
                </div>
            </div>
            <div class="position-and-export">
                <el-button v-if="isShowPositionBtn&&skuAndSpuRadio===0" @click="positionList">定位到列表</el-button>
                <el-button @click="exportData" :loading="exportDataLoading">导出数据</el-button>
            </div>
            <div class="sku-and-spu-btn">
                <el-radio-group v-model="skuAndSpuRadio">
                    <el-radio-button :label="0">近15天sku销售额</el-radio-button>
                    <el-radio-button :label="1">同SPU下SKU销售额</el-radio-button>
                </el-radio-group>
            </div>
            <el-table v-if="skuAndSpuRadio===0" :data="tabelDataOfSku.slice((this.paginationOfSku.page-1)*this.paginationOfSku.size,this.paginationOfSku.page*this.paginationOfSku.size)" :row-class-name="tableRowClassName">
                <el-table-column label="排名" prop="totalRank" width="150px" ></el-table-column>
                <el-table-column label="商品信息" width="500px">
                    <template slot-scope="scope">
                        <div class="goodsImg-and-goodsTitle">
                            <img :src="scope.row.goodsImg" alt="商品图片" />
                            <div class="right">
                                <a class="right-goodsName" :href="scope.row.goodsUrl" target="_blank" :title="scope.row.goodsName" >
                                    {{scope.row.goodsName}}
                                </a>
                                <div v-if="scope.row.shopName" class="right-shopName" :class="scope.row.shopName.length>=16?'':'inlineBlock'" :title="scope.row.shopName">{{scope.row.shopName}}</div>
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
                <el-table-column prop="saleroom" label="近15天sku销售额" >
                    <template slot-scope="scope">
                        {{scope.row.saleroom||'暂无数据'}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else :data="tabelDataOfSpu" :row-class-name="tableRowClassName" v-loading="tableOfSpuLoading">
                <el-table-column label="商品信息" key="0">
                    <template slot-scope="scope">
                        <div class="goodsImg-and-goodsTitle">
                            <img :src="scope.row.goodsImg" alt="商品图片" />
                            <div class="right">
                                <a class="right-goodsName" :href="scope.row.goodsUrl" target="_blank" :title="scope.row.goodsName" >
                                    {{scope.row.goodsName}}
                                </a>
                                <div class="right-shopName" :class="scope.row.shopName.length>=12?'':'inlineBlock'" :title="scope.row.shopName">{{scope.row.shopName}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="价格" key="1" align="center">
                    <template slot-scope="scope">
                        <div>￥{{scope.row.price}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="sku" key="2">
                    <template slot-scope="scope">
                        <div class="sku-and-copyBtn" @click="copyUrl(scope.row.skuId)">
                            <div>{{scope.row.skuId}}</div>
                            <img class="copy-img" src="../../../assets/images/copyLogo.png" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="saleroom" label="近15天sku销售额" key="3">
                    <template slot-scope="scope">
                        {{scope.row.saleroom||'暂无数据'}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination
                    v-if="skuAndSpuRadio===0"
                    background
					:current-page="paginationOfSku.page"
					:page-size="paginationOfSku.size"
					:total="paginationOfSku.total"
					layout="prev, pager, next"
					prev-text="上一页"
					next-text="下一页"
					@current-change="changePageOfSku"
                >
                </el-pagination>
                <el-pagination 
                    v-else
                    background
					:current-page="paginationOfSpu.page"
					:page-size="paginationOfSpu.size"
					:total="paginationOfSpu.total"
					layout="prev, pager, next"
					prev-text="上一页"
					next-text="下一页"
					@current-change="changePageOfSpu"
                >
                </el-pagination>
            </div>
        </div>
         <scoring-modal v-if="scoringModalVisible" type='8' :token="token"  @closeModal="scoringModalVisible=false"/>
    </div>
</template>

<script>
import { getAuthorityNumber } from "../../../api/user"
import {getpitProductOfSku,getpitProductOfSpu,getPitOfSkuDownloadCode,getPitOfSpuDownloadCode,downloadFileByCode} from "../../../api/jdFunction"
import {skuReg} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"
import {copyUrl} from "../../../utils/common"

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
            tabelDataOfSku:[],
            tabelDataOfSpu:[],
            paginationOfSku:{
                page:1,
                size:5,
                total:null
            }, 
            paginationOfSpu:{
                page:1,
                size:5,
                total:null
            }, 
            search_sku:'',
            search_keyword:'',
            search_sku_page:'',
            isShowPositionBtn:false,
            exportDataLoading:false,
            skuAndSpuRadio:0,
            tableOfSpuLoading:false,
            authorityNumber:0,
            showAuthorityTip:false
        }
    },
    computed: {
        ...mapState(["_token","_skuId"]),
    },
    components:{scoringModal},

    mounted(){
        this.token = this.$route.query.token|| this._token
        this.skuId = this.$route.query.skuId||this._skuId
        this.getAuthorityNumber()
    },
    methods:{
         // 获取用户权限数量
		async getAuthorityNumber(){
            this.showAuthorityTip = false
			let {data:res} = await getAuthorityNumber({token:this.token})
			if(res.code===200){
                this.showAuthorityTip = true
				this.authorityNumber = res.data
			}else{
				this.$message.error(res.msg)
			}
		},

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

        async pitProductionCalc(){
            let valid = this.validParams()
            if(valid!=='') return this.$message.error(valid)
            
            this.$store.commit("CHANGE_SKUID", this.skuId);
            this.search_sku = this.skuId
            this.search_keyword = this.keyword
            this.skuAndSpuRadio = 0
            this.paginationOfSku.page = 1
            this.paginationOfSpu.page = 1
            this.getpitProductOfSku()
            this.getpitProductOfSpu()

        },

        async getpitProductOfSku(){
            let params = {
                skuId:this.skuId,
                keyword: this.keyword, 
                rankingNumber: this.searchRange
            }

            this.searchBtnLoading = true
            this.resultsVisible = false
            let {data:res} = await getpitProductOfSku({params,token:this.token})
            this.searchBtnLoading = false
            if(res.code===200){
                this.resultsVisible = true
                this.goodsInfo = res.data.pitPMerchandiseVO
                this.tabelDataOfSku =  res.data.saleroomList
                this.paginationOfSku.total = this.tabelDataOfSku.length
                this.isShowPositionBtn = this.tabelDataOfSku.some((item, index)=> {
                    if (item.skuId == this.search_sku) {
                        this.search_sku_page = parseInt(index / this.paginationOfSku.size) + 1
                    }
                    return item.skuId == this.search_sku
                })
            }else{
                this.$message.error(res.msg)
            }
        },

        async getpitProductOfSpu(){
            let params = {
                skuId:this.search_sku,
                keyword:this.search_keyword, 
                pageNo:this.paginationOfSpu.page,
                pageSize:this.paginationOfSpu.size
            }
            this.tableOfSpuLoading = true
            let {data:res} = await getpitProductOfSpu({params,token:this.token})
            this.tableOfSpuLoading = false
            if(res.code===200){
                this.tabelDataOfSpu =  res.data.results
                this.paginationOfSpu.total = res.data.totalCount
            }else{
                this.$message.error(res.msg)
            }
        },

        copyUrl(url){
			copyUrl(url)
			this.$message.success("复制成功")
		},

        changePageOfSku(currentPage){
            this.paginationOfSku.page = currentPage
        },

        changePageOfSpu(currentPage){
            this.paginationOfSpu.page = currentPage
            this.getpitProductOfSpu()
        },

        positionList(){
            this.paginationOfSku.page = this.search_sku_page
        },

        tableRowClassName({row, rowIndex}) {
            if (row.skuId == this.search_sku) {
                return 'search-sku-row';
            }
            return '';
        },

        async exportData(){
            let valid = this.validParams()
            if(valid!=='') return this.$message.error(valid)

            let params = {
                skuId:this.skuId,
                keyword:this.keyword
            }
            this.exportDataLoading = true
            this.skuAndSpuRadio===0?params.rankingNumber=this.searchRange:''
            let request = this.skuAndSpuRadio===0?getPitOfSkuDownloadCode:getPitOfSpuDownloadCode
            let {data:res} = await request({params,token:this.token})
            this.exportDataLoading = false
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
    .pitProductionCalc{
        
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

            .queryRange-label{
                position: relative;

                .authority-tip{
                    position: absolute;
                    top: 22px;
                    width: 300px;
                    color: #333;
                    font-size: 14px;

                    .el-button{
                        padding: 0;
                        color: #4d75ff;
                    }
                }
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

            &.addPaddingTop{
                margin-top:26px ;
            }

            .goodsInfo{
                height: 100px;
                display: flex;
                border-radius: 6px;
                border: 1px solid #EEEEEE;

                &-item:first-child{
                    width: 33%;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    
                    .goods-img{
                        min-width: 77px;
                        height: 78px;
                    }

                    .right{
                        margin-left:8px;
                        padding-top:10px;
                        color: #333;
                        font-size: 14px;

                        .goodsName{
                            height: 15px;
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
                    width: 33%;
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
                        text-align: left;

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

                        &-goodsName:hover{
                            color: #4d75ff;
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
                    align-items: center;
                    justify-content: center;
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

            .sku-and-spu-btn{
                /deep/ .el-radio-group{
                    margin: 16px 0 0 10px;
                    .el-radio-button{
                        width: 140px;
                        height: 28px;
        
                        .el-radio-button__inner{
                            border-color: #d3d3d3 !important;
                            width: 140px;
                            height: 28px;
                            line-height: 28px;
                            border-radius: 4px 4px 0 0 ;
                            padding: 0;
                            font-size: 12px;
                            color: #333 !important;
                            background: #fff !important;
                        }

                        &.is-active .el-radio-button__inner {
                                color: var(--themeColor) !important;
                                border-color: var(--themeColor) !important;
                                background: #fff !important;
                            }
                    }
                    .el-radio-button:nth-child(2) .el-radio-button__inner{
                        border-left: 0 !important;
                    }
                }
            }
        }
    }
</style>