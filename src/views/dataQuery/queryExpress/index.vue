<!--查快车-->
<template>
    <div class="queryExpress">
        <div class="options">
            <span>关键词：</span>
            <el-input v-model="keyword" size="small" clearable placeholder="请输入关键词" ></el-input>
            <span class="port-label">端口：</span>
            <el-radio-group v-model="port">
                <el-radio-button label="2">无线</el-radio-button>
                <el-radio-button label="1">PC</el-radio-button>
            </el-radio-group>
            <span class="address-label">地区：</span>
            <el-cascader
                clearable
                placeholder="请选择地区"
                :options="addressOptions"
                v-model="activedAddress"
                @change="handleAddressChange"
            ></el-cascader>
            <el-button type="primary" class="search-btn" @click="queryExpress" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>

            <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                <div slot="content">
                    <div>由于官方接口变动，暂时无法查询快车浏览量和访客数占比</div>
                </div>
                <i class="el-icon-question"></i>
            </el-tooltip>
            <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
        </div>
        <div class="results" v-if="resultsVisible">
            <div v-if="searchPort==='2'">
                <el-radio-group v-model="positionTypeOfAPP" @change="changePositionType">
                    <el-radio-button :label="1">APP搜索页
                        <el-tooltip
                            content="京东APP搜索结果页中，穿插在自然结果中且打有“广告”或“hot”标识的原生广告"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                        <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                    <el-radio-button :label="4">京东M端搜索页
                        <el-tooltip
                            content="京东M端搜索结果页中，穿插在自然结果中且打有“广告”或“hot”标识的原生广告"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                            <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                    <el-radio-button :label="2">微信搜索页
                        <el-tooltip
                            content="微信->发现->购物->京东APP搜索结果页中，穿插在自然结果中且打有“广告”或“hot”标识的原生广告"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                            <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                    <el-radio-button :label="3">手Q搜索页
                        <el-tooltip
                            content="手Q->动态->京东购物->京东APP搜索结果页中，穿插在自然结果中且打有“广告”或“hot”标识的原生广告"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                            <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                </el-radio-group>
            </div>
            <div v-else>
                <el-radio-group v-model="positionTypeOfPC" @change="changePositionType">
                    <el-radio-button :label="3">信息流原生
                        <el-tooltip
                            content="京东PC搜索结果页中，穿插在自然结果中且打有“广告”标识的原生广告"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                        <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                    <el-radio-button :label="1">左侧商品精选
                        <el-tooltip
                            content="京东PC搜索结果页中，左侧列表，商品精选位置"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                            <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                    <el-radio-button :label="2">底部商品精选
                        <el-tooltip
                            content="京东PC搜索结果页中，底部列表，商品精选位置"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                            <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                    <el-radio-button :label="4">商品精选
                        <el-tooltip
                            content="京东PC搜索结果页中，左侧列表底部，商家精选位置"
                            placement="bottom"
                            popper-class="tooltip"
                        >
                            <i class="iconfont el-icon-question"></i>
                        </el-tooltip>
                    </el-radio-button>
                </el-radio-group>
            </div>
            <div v-loading="listLoading">
                <ul v-if="list.length">
                    <li v-for="(item,index) in list.slice((this.pagination.page-1)*this.pagination.size,this.pagination.page*this.pagination.size)" :key="index">
                        <a class="img-box" :href="item.goodsUrl" target="_blank">
                            <img :src="item.imgUrl" alt="商品图片">
                        </a>
                        <div class="price-box">
                            <span>第{{item.rank}}名</span>
                            <span>￥{{item.price}}</span>
                        </div>
                        <a class="goodsName" :href="item.goodsUrl" target="_blank" :title="item.goodsName">{{item.goodsName}}</a>
                        <div class="commentNumAndSkuId">
                            <span class="commentNumAndSkuId-commentNum">
                                <span>{{item.commentNum}}</span>
                                <span>条评价</span>
                            </span>
                            <span class="commentNumAndSkuId-skuId">
                                <a :href="item.goodsUrl" target="_blank">{{item.skuId}}</a>
                                <img src="../../../assets/images/copyLogo.png" alt="" @click="copyUrl(item.skuId)"/>
                            </span>
                        </div>
                        <div class="shopName" :class="item.isSelfshop==='1'?'self':'pop'" :title="item.shopName">{{item.shopName}}</div>
                    </li>
                </ul>
                <div v-else class="noData-box">
                    <div v-if="!listLoading">
                        <img src="../../../assets/images/noData.png" alt="">
                        <div>暂无数据</div>
                    </div>
                </div>
                <div class="pagination-box" v-if="pagination.total>pagination.size">
                    <el-pagination
                        background
                        :current-page="pagination.page"
                        :page-size="pagination.size"
                        :total="pagination.total"
                        @current-change="changePage"
                        layout="prev, pager, next"
                        next-text="下一页"
                        prev-text="上一页"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <scoring-modal v-if="scoringModalVisible" type='13' :token="token"  @closeModal="scoringModalVisible=false"/>
    </div>
</template>

<script>
import { getExpressInfo } from "../../../api/jdFunction"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"
import addressOptions from "../../../utils/addressList";
import {copyUrl} from "../../../utils/common"

export default {
    data(){
        return{
            token:'',
            keyword:'',
            port:'2',//2:无线 1：PC
            activedAddress: "",//地区
            addressOptions,
            positionTypeOfAPP:1,//1：APP搜索页 2：微信搜索页 3：手Q搜索页  4：京东M端搜索页
            positionTypeOfPC:3,//1：左侧商品精选 2：底部商品精选 3：信息流原生 4：商家精选
            searchKeyword:'',//点击查询，保存关键词
            searchPort:'2',//点击查询，保存端口
            searchAddress:[],//点击搜索，保存地区
            scoringModalVisible:false,
            searchBtnLoading:false,
            resultsVisible:false,
            list:[],
            pagination:{
                page:1,
                size:10,
                total:null
            },
            listLoading:false
        }
    },
    computed: {
        ...mapState(["_token"])
    },
    components:{scoringModal},

    mounted(){
        this.token = this.$route.query.token|| this._token
    },
    methods:{
        handleAddressChange(val) {
            if (val.indexOf("江苏") > -1 && !this.addressOptions[0].cities.length) {
                this.addressOptions[0].cities = [{ label: "南京" }];
            } else if (val.indexOf("浙江") > -1 && !this.addressOptions[1].cities.length) {
                this.addressOptions[1].cities = [{ label: "杭州" }];
            }
        },

        async queryExpress(){

            if(this.keyword===''){
                return this.$message.error('请输入关键词')
            }else if(this.activedAddress.length===0){
                return this.$message.error('请选择地区')
            }
            
            let positionType = null
            if(this.port==='2'){
                this.positionTypeOfAPP = 1 //APP搜索页 
                positionType = this.positionTypeOfAPP
            }else{
                this.positionTypeOfPC = 3 //信息流原生
                positionType = this.positionTypeOfPC
            }
            let params = {
                equipment:this.port,
                keyword:this.keyword,
                cityValue:this.activedAddress.length===1?this.activedAddress[0]:this.activedAddress[1],
                type:positionType
            }
            this.searchBtnLoading = true
            this.resultsVisible = false
            this.searchKeyword = this.keyword
            this.searchPort = this.port
            this.searchAddress = this.activedAddress
            let {data:res} = await getExpressInfo({params,token:this.token})

            this.searchBtnLoading = false
            if(res.code===200){
                this.resultsVisible = true
                this.list = res.data
                this.pagination.total = res.data.length
            }else{
                this.$message.error(res.msg)
            }
        },

        async changePositionType(val){
            this.pagination.page = 1
            this.list = []
            this.pagination.total = null
            this.listLoading = true
            let params = {
                equipment:this.searchPort,
                keyword:this.searchKeyword,
                cityValue:this.activedAddress.length===1?this.activedAddress[0]:this.activedAddress[1],
                type:this.searchPort==='2'?this.positionTypeOfAPP:this.positionTypeOfPC
            }
            let {data:res} = await getExpressInfo({params,token:this.token})
            this.listLoading = false
            if(res.code===200){
                this.list = res.data
                this.pagination.total = res.data.length
            }else{
                this.$message.error(res.msg)
            }
        },

        changePage(currentPage){
            this.pagination.page = currentPage
        },

        copyUrl(url){
			copyUrl(url)
			this.$message.success("复制成功")
		},
    }
}
</script>

<style lang='scss' scoped>
    .queryExpress{
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

            /deep/ .el-cascader{
                line-height: 28px;
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

            .port-label,.address-label{
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
            padding: 16px 20px 0 10px;

            .el-icon-question{
                color: #999;
            }
            /deep/ .el-radio-button{
                width: 120px;
                height: 28px;

                .el-radio-button__inner{
                    width: 120px;
                    height: 28px;
                    line-height:28px;
                    font-size: 12px;
                    border-radius: 4px;
                    padding: 0;
                    color: #333 !important;
                    border-color: #D3D3D3 !important;
                    background: #fff !important;
                }

                &.is-active .el-radio-button__inner{
                    color: var(--themeColor) !important;
                    border-color: var(--themeColor) !important;
                }

                &:not(:first-child).is-active .el-radio-button__inner{
                    border-left: #fff !important;
                }
            }

            /deep/ .el-radio-button+.el-radio-button{
                margin-left: 6px;
            }

            ul{
                width:100%;
                display: flex;
                flex-wrap: wrap;
                padding-top: 10px;
                li{
                    width: 19%;
                    font-size: 12px;
                    padding:8px 12px 10px;
                    margin:0 0 1.25% 1.25%;
                    box-sizing: border-box;
                    color:#333;
                    box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);
                    border-radius: 6px;

                    &:first-child,&:nth-child(6){
                        margin-left:0 ;
                    }

                    .img-box{
                        display: flex;
                        justify-content: center;

                        img{
                            width: 164px;
                            height: 164px;
                        }
                    }

                    .goodsName{
                        box-sizing: content-box;
                        height: 15px;
                        line-height: 15px;
                        padding-top: 9px;
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

                    .price-box,.commentNumAndSkuId{
                        display: flex;
                        justify-content: space-between;
                        padding-top: 9px;
                    }

                    .commentNumAndSkuId{
                        &-commentNum{
                            display: flex;
                            span:first-child{
                                font-weight: bold;
                            }
                        }

                        &-skuId{
                            display: flex;
                            align-items: center;

                            a{
                                color:#999;

                                &:hover{
                                    color: #4D75FF;
                                }
                            }

                            img{
                                height: 14px;
                                margin-left: 3px;
                                cursor: pointer;
                            }
                        }
                    }

                    .shopName{
                        display: -webkit-box;
                        /* ! autoprefixer: off */
                        -webkit-box-orient: vertical;
                        /* autoprefixer: on */
                        -webkit-line-clamp: 1;
                        overflow: hidden;
                        padding-top: 9px;
                        &.self::before,&.pop::before{
                            display: inline-block;
                            width: 30px;
                            height: 16px;
                            font-size: 12px;
                            box-sizing: border-box;
                            text-align: center;
                            border-radius: 2px;
                            margin-right: 5px;
                        }
                        &.self::before{
                            content: '自营';
                            color: var(--themeColor);
                            border: 1px solid var(--themeColor);
                        }
                        &.pop::before{
                            content: 'POP';
                            color: #4D75FF;
                            border: 1px solid #4D75FF;
                        }
                    }
                }
            }

            .noData-box{
                height: 60vh;
                &>div{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #999;
                    font-size: 14px;
                }
            }

            .pagination-box{
                text-align: center;
            }
        }
    }
</style>