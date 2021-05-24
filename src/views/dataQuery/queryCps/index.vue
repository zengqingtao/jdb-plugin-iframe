<template>
    <div class="queryCps">
        <div class="content">
            <div class="options">
                <span class="sku-label">SKU：</span>
                <el-input placeholder="请输入SKU查询" size="small" clearable v-model="skuId"></el-input>
                <el-button type="primary" class="search-btn" @click="queryCps" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
                <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
            </div>
            <div v-if="resultsVisible">
                <div class="goodsInfo">
                    <div class="goodsInfo-item">
                        <img :src="goodsInfo.imgUrl" alt="">
                        <div class="right">
                            <a class="goodsName" :href="goodsInfo.goodsUrl" target="_blank" :title="goodsInfo.goodsName">{{goodsInfo.goodsName}}</a>
                            <div class="shopName" :class="goodsInfo.shopName.length>=14?'':'inlineBlock'" :title="goodsInfo.shopName">{{goodsInfo.shopName}}</div>
                        </div>
                    </div>
                    <div class="goodsInfo-item">
                        <div>历史最低价</div>
                        <div>{{goodsInfo.floorPrice?('￥'+goodsInfo.floorPrice):'-'}}</div>
                    </div>
                    <div class="goodsInfo-item">
                        <div>历史最低价天数</div>
                        <div>
                            {{goodsInfo.historyPriceDay||'-'}}
                            <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false" v-if="goodsInfo.historyPriceDay">
                                <div slot="content">最低价和历史最低价天数，数据来源京东联盟，以京东联盟的判断为准。</div>
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="goodsInfo-item">
                        <div>店铺星级</div>
                        <div>{{goodsInfo.shopLevel||'-'}}</div>
                    </div>
                    <div class="goodsInfo-item">
                        <div>风向标排名率</div>
                        <div>{{goodsInfo.scoreRankRate?(goodsInfo.scoreRankRate+'%'):'-'}}</div>
                    </div>
                </div>
                <el-radio-group v-model="skuAndSpuRadio">
                    <el-radio-button :label="0">SKU</el-radio-button>
                    <el-radio-button :label="1">SPU</el-radio-button>
                </el-radio-group>
                <el-table :data="skuAndSpuRadio===0?info.sku.commissionList:info.spu.commissionList" >
                    <el-table-column prop="skuId" label="sku" align="center" width="155px">
                        <template slot-scope="scope">
                            <div class="sku-box">
                                <a :href="scope.row.goodsUrl" target="_blank">{{scope.row.skuId}}</a>
                                <img src="../../../assets/images/copyLogo.png" @click="copySku(scope.row.skuId)" alt="">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  label="京东价" align="center">
                        <template slot-scope="scope">￥{{scope.row.unitPrice}}</template>
                    </el-table-column>
                    <el-table-column  label="券面额" align="center">
                        <template slot-scope="scope">{{scope.row.bestCouponAmount==='0'?'-':('￥'+scope.row.bestCouponAmount)}}</template>
                    </el-table-column>
                    <el-table-column  label="券消费限额" align="center">
                        <template slot-scope="scope">{{scope.row.couponLimitAmount==='0'?'-':('￥'+scope.row.couponLimitAmount)}}</template>
                    </el-table-column>
                    <el-table-column  label="券后价" align="center">
                        <template slot-scope="scope">
                            <div>￥{{scope.row.afterCouponPrice}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column  label="佣金比例" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.commisionRatio}}%</div>
                        </template>
                    </el-table-column>
                    <el-table-column  label="佣金金额" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.commisionAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="inOrderCount30Days" label="spu近30天引单量" align="center">
                        <template slot="header">
                            <span>spu近30天引单量</span>
                            <el-tooltip popper-class="tooltip" placement="bottom">
                                <i class="el-icon-question"></i>
                                <div slot="content" class="tooltip-content">
                                    <div>由cps渠道订单和其他渠道的订单组成，包括了近</div>
                                    <div>30天提交未付款和提交已付款的订单。引单量越高，</div>
                                    <div>按引单量排序越靠前，可以优先曝光给流量主。</div>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column  label="spu近30天支出佣金" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.inOrderComm30Days}}
                        </template>
                    </el-table-column>
                </el-table>

                <el-table :data="skuAndSpuRadio===0?info.sku.couponList:info.spu.couponList">
                    <el-table-column prop="couponType" label="券种类">
                        <template slot-scope="scope">
                            {{scope.row.couponType===0?'全品类':(scope.row.couponType===1?'限品类（自营商品）':(scope.row.couponType===2?'限店铺':' 店铺限商品券'))}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="couponLink" label="优惠券链接">
                        <template slot-scope="scope">
                            <a :href="scope.row.couponLink" target="_blank" class="coupon-link" :title="scope.row.couponLink">{{scope.row.couponLink}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="券消费限额">
                        <template slot-scope="scope">￥{{scope.row.couponLimitAmount}}</template>
                    </el-table-column>
                    <el-table-column label="券面额">
                        <template slot-scope="scope">￥{{scope.row.couponAmount}}</template>
                    </el-table-column>
                    <el-table-column prop="couponTotal" label="券总数"></el-table-column>
                    <el-table-column prop="couponSurplusNum" label="券剩余数"></el-table-column>
                    <el-table-column prop="couponReceiveNum" label="券领取量"></el-table-column>
                    <el-table-column label="领取时间" width="160px">
                        <template slot-scope="scope">
                            <div class="time-box">
                                <div>{{scope.row.startTimeAndEndTime.split('~')[0]}}</div>
                                <div>~</div>
                                <div>{{scope.row.startTimeAndEndTime.split('~')[1]}}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="生效时间" width="160px">
                        <template slot-scope="scope">
                            <div class="time-box">
                                <div>{{scope.row.useTimeAndEndTime.split('~')[0]}}</div>
                                <div>~</div>
                                <div>{{scope.row.useTimeAndEndTime.split('~')[1]}}</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <scoring-modal v-if="scoringModalVisible" type='11' :token="token"  @closeModal="scoringModalVisible=false"/>
        </div>
    </div>
</template>

<script>
import {queryCps} from "../../../api/jdFunction"
import {skuReg,copyUrl} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"

export default {
    data(){
        return{
            token:'',
            skuId:'',
            searchBtnLoading:false,
            resultsVisible:false,
            skuAndSpuRadio:0,
            scoringModalVisible:false,
            info:{},
            goodsInfo:{}
        }
    },
    computed: {
        ...mapState(["_token","_skuId"])
    },
    components:{scoringModal},
    mounted(){
        this.token = this.$route.query.token || this._token
        this.skuId = this.$route.query.skuId || this._skuId
        this.queryCps()
    },
    methods:{
        async queryCps(){

            if(this.skuId===''){
                return this.$message.error('请输入SKU')
            }else if(!skuReg(this.skuId)){
                return this.$message.error('SKU输入有误')
            }
            
            this.$store.commit("CHANGE_SKUID", this.skuId);

            let params = {
                skuOrSkuUrl:this.skuId,
                type:2
            }
            this.resultsVisible = false
            this.searchBtnLoading = true
            let {data:res} = await queryCps({params,token:this.token})
            this.searchBtnLoading = false
            if(res.code===200){
                this.resultsVisible = true
                this.skuAndSpuRadio = 0
                this.info = res.data         
                this.goodsInfo = res.data.shopInfoDto
            }else{this.$message.error(res.msg)}
        },

        copySku(skuId){
            copyUrl(skuId)
            this.$message.success('复制成功')
        }
    }
}
</script>

<style lang="scss" scoped>
    .queryCps{
        height: 100%;

        .content{
            height: 100%;
            padding: 0 20px 0 10px;

            .options{
                height: 49px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-top: 21px;
                color: #333;
                font-size: 14px;
    
                /deep/ .el-input,/deep/ .el-input__inner{
                    width: 163px;
                    height: 28px;
                }

                /deep/ .el-input__suffix{
                    display: flex;
                    align-items: center;
                }
    
                .search-btn{
                    width: 86px;
                    height: 28px;
                    padding: 0;
                    margin-left: 10px;
                }
    
                .score-btn{
                    margin-left: 20px;
                }
            }

            .goodsInfo{
                height: 80px;
                display: flex;
                border-radius: 6px;
                border: 1px solid #EEEEEE;
                margin-top: 10px;

                &-item:first-child{
                    width: 28%;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    
                    img{
                        min-width: 59px;
                        height: 60px;
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
                    width: 18%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;

                    &::before{
                        content: '';
                        width: 1px;
                        height: 53px;
                        background: #eee;
                        position: absolute;
                        left: 0;
                    }

                    &>div{
                        display: flex;
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
                margin-top: 6px;
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;

                .cell{
                    text-align: center;
                }

                .coupon-link{
                    color: #333;
                    display: -webkit-box;
                    /* ! autoprefixer: off */
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on */
                    -webkit-line-clamp: 2;
                    overflow: hidden;

                    &:hover{
                        color: #4d75ff;
                    }
                }

                .el-icon-question{
                    color: rgb(153, 153, 153);
                }

                .time-box>div{
                    height: 14px;
                    line-height: 14px;
                }

                .sku-box{
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    a{
                        color: #333;

                        &:hover{
                            color: #4d75ff;
                        }
                    }

                    img{
                        margin-left: 5px;
                        cursor: pointer;
                    }
                }
            }
            /deep/ .el-table+.el-table{
                margin-top: 10px;
            }
            /deep/ .el-radio-group{
                margin: 10px 0 0 10px;
                .el-radio-button{
                    width: 70px;
                    height: 28px;
                    margin-right: 6px;
    
                    .el-radio-button__inner{
                        border-color: #d3d3d3 !important;
                        width: 70px;
                        height: 28px;
                        line-height: 28px;
                        border-radius: 4px ;
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

                    &:not(:first-child){

                        &.is-active .el-radio-button__inner {
                            border-left:0  !important;
                        }
                    }
                }
            }
        }
        
    }
</style>