<template>
    <div class="queryRanking">
        <div class="options">
            <span>SKU：</span>
            <el-input v-model="skuId" size="small" clearable placeholder="请输入SKU查询" ></el-input>
            <span class="keyword-label">关键词：</span>
            <div>
                <el-input
                    v-model="keyword"
                    ref="myInput"
                    size="small"
                    placeholder="输入关键词，按回车键分隔开"
                    :disabled="keywordList.length>=keywordMaxLength"
                    @keyup.enter.native="addkeyword()"
                    class="keyword-input"
                    :class="keywordList.length===keywordMaxLength?'input-width-0':''"
                    >
                    <template slot="prepend">
                        <span v-for="(item,index) in keywordList" :key="index">
                        {{item}}
                        <i
                            class="el-icon-error"
                            style="cursor:pointer;"
                            @click="delKeyword(index)"
                        ></i>
                        </span>
                    </template>
                </el-input>
                <span class="keyword-input-tip">({{all_List.length}}/3)</span>
            </div>
            <div>
                <span class="product-label">产品：京东</span>
                <span class="sort-label">排序：综合排序</span>
            </div>
            <div class="btn-box">
                <el-button type="primary" class="search-btn"  @click="queryRanking" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
                <el-button type="primary" class="reset-btn" @click="reset" onfocus="this.blur()">重置</el-button>
                <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
            </div>
        </div>
        <div class="results" v-if='resultsVisible'>
            <div class="goodsInfo">
                <div class="goodsInfo-item">
                    <img :src="goodsInfo.imgUrl" alt="">
                    <div class="right">
                        <a class="goodsInfo-item-goodsName" :href="goodsInfo.goodsUrl" target="_blank" :title="goodsInfo.goodsName">{{goodsInfo.goodsName}}</a>
                        <div class="goodsInfo-item-sku" v-if="goodsInfo.skuId">
                            <a :href="goodsInfo.goodsUrl" target="_blank">sku：{{goodsInfo.skuId}}</a>
                            <img src="../../../assets/images/copyLogo.png" @click="copySku(goodsInfo.skuId)" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <el-table :data="tabelData" v-if="tabelDataVisible" :default-sort = "{prop: 'index', order: 'ascending'}">
                <el-table-column label="关键词" prop="index">
                    <template slot-scope="scope">{{scope.row.keyword}}</template>
                </el-table-column>
                <el-table-column label="APP排名">
                    <template slot-scope="scope">
                        <div>{{scope.row.appRank||'不在查询范围内'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="PC排名" prop="pcRank">
                    <template slot-scope="scope">
                        <div>{{scope.row.pcRank||'不在查询范围内'}}</div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span>近7天访客数</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-info"></i>
                            <div slot="content" class="tooltip-content">
                                <div>近7天这个关键词为这个sku商品带来的访客数。通过DMP数据分析得到</div>
                            </div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        <div>{{scope.row.visitor===0?0:(scope.row.visitor||'--')}}</div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span>近7天成交客户数</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-info"></i>
                            <div slot="content" class="tooltip-content">
                                <div>近7天这个关键词为这个sku商品带来的成交客户数。通过DMP数据分析得到</div>
                            </div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        <div>{{scope.row.transaction===0?0:(scope.row.transaction||'--')}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <scoring-modal v-if="scoringModalVisible" type='12' :token="token"  @closeModal="scoringModalVisible=false"/>
    </div>
</template>

<script>
import {getRankingGoodsInfo,getRankingInfo} from "../../../api/jdFunction"
import {skuReg,copyUrl} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"

export default {
    data(){
        return{
            token:'',
            skuId:'',
            keyword:'',
            keywordList:[],
            keywordMaxLength:3,
            scoringModalVisible:false,
            responseNum:0,
            searchBtnLoading:false,
            resultsVisible:false,
            goodsInfo:{},
            tabelData:[], 
            tabelDataVisible:false
        }
    },
    computed: {
        ...mapState(["_token","_skuId"]),

        all_List(){
            let list = []
            if(this.keywordList.length===0){
                if(this.keyword===''){
                    list = []
                }else{
                    list.push(this.keyword)
                }
            }else{
                this.keywordList.forEach(element => {
                    list.push(element)
                });
                if(this.keyword!==''){
                    list.push(this.keyword)
                }
            }
            return list 
        }
    },
    components:{scoringModal},

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
            }else if(this.all_List.length===0){
                return '请输入关键词' 
            }else{
                return ''
            }
        },

        async queryRanking(){
            let valid = this.validParams()
            if(valid!=='') return this.$message.error(valid)
            
            this.$store.commit("CHANGE_SKUID", this.skuId);

            this.responseNum = 0
            this.searchBtnLoading = true
            this.resultsVisible = false
            this.tabelDataVisible = false
            this.tabelData = []

            this.getRankingGoodsInfo()
            this.getRankingInfo()
        },

        async getRankingGoodsInfo(){
            let params = {
                skuId:this.skuId
            }
            let {data:res} = await getRankingGoodsInfo({params,token:this.token})
            if(res.code===200){
                this.resultsVisible = true
                this.goodsInfo = res.data
            }else{
                this.$message.error(res.msg)
            }
        },
        async getRankingInfo(){
            let num = this.all_List.length
            this.all_List.forEach((element,index) => {
                let params = {
                    skuId:this.skuId,
                    keyword:element
                }
                getRankingInfo({params,token:this.token}).then(res=>{
                    res = res.data
                    this.responseNum++
                    this.searchBtnLoading = this.responseNum===num?false:true
                    if(res.code===200){
                        this.tabelDataVisible = true
                        res.data.length!==0?res.data[0].index=index:''
                        this.tabelData = this.tabelData.concat(res.data)    
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            });
        },
        

        addkeyword(){
            if(this.keyword!==''&&this.keywordList.length<this.keywordMaxLength){
                this.keywordList.push(this.keyword)
                this.keyword = ''
            }
        },

        delKeyword(index){
            this.keywordList.splice(index,1)
        },

        reset(){
            this.skuId = ''
            this.keyword = ''
            this.keywordList = []
        },

        copySku(skuId){
            copyUrl(skuId)
            this.$message.success('复制成功')
        }
    }
}
</script>

<style lang='scss' scoped>
    .queryRanking{
        
        .options{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            padding-top: 11px;
            color: #333;
            font-size: 14px;

            /deep/ .el-input,/deep/ .el-input__inner{
                width: 150px;
                height: 28px;
            }

            /deep/ .el-input__suffix{
                display: flex;
                align-items: center;
            }

            /deep/ .keyword-input.el-input,/deep/ .keyword-input.el-input .el-input__inner{
                width: 190px;
            }

            /deep/ .keyword-input.el-input .el-input__inner{
                padding: 0 5px;
            }

            /deep/ .input-width-0.el-input,/deep/ .input-width-0 .el-input__inner{
                width: 0 !important;
                padding: 1px;
            }

            /deep/ .el-icon-error{
                font-size: 16px;
            }

            .keyword-input-tip{
                margin-left: 3px;
            }
            
            .keyword-label{
                height: 48px;
                line-height: 48px;
                padding-left: 20px;
            }

            .product-label,.sort-label{
                padding-left: 20px;
            }

            .search-btn.el-button{
                width: 70px;
                height: 28px;
                padding: 0;
                margin-left: 20px;
            }

            .reset-btn.el-button{
                width: 70px;
                height: 28px;
                padding: 0;
                background: #fff;
                color:var(--themeColor);

                &:hover{
                    color: #fff;
                }
            }

            .score-btn{
                margin-left: 20px;
                padding: 0;
            }
        }

        .tip{
            height: 300px;
            line-height: 300px;
            text-align: center;
            font-size: 14px;

            a{
                color: #4d75ff;
            }
        }

        .results{
            margin-top: 10px;
            padding:0 20px 0 10px;

            .goodsInfo{
                height: 100px;
                border-radius: 6px;
                border: 1px solid #EEEEEE;

                &-item{
                    display: flex;
                    align-items: center;
                    padding: 10px 10px;
                    
                    img{
                        width: 77px;
                        height: 78px;
                    }

                    .right{
                        margin-left:8px;
                        color: #333;
                        font-size: 14px;

                        .goodsInfo-item-goodsName{
                            width: 585px;
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

                        .goodsInfo-item-sku{
                            margin-top: 10px;
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
                                margin-left: 5px;
                                cursor: pointer;
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
                        }
                    }
                }
            }

            /deep/ .el-table{
                border:1px solid #eee;
                margin-top: 10px;
                border-bottom: 0;
                border-radius: 10px;

                .cell{
                    text-align: center;
                }

                .el-icon-info{
                    color: rgb(153, 153, 153);
                }
            }
        }
    }
</style>