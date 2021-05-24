<template>
    <div class="commentAnaltsis">
        <div class="content">
            <div class="options">
                <span class="sku-label">SKU：</span>
                <el-input placeholder="请输入SKU查询" size="small" clearable v-model="skuId"></el-input>
                <el-button type="primary" class="search-btn" @click="commentAnalysis" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
                <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
            </div>
            <el-table :data="tableData" v-if="!initEntry">
                <el-table-column prop="dimensionality" label="维度" align="center"></el-table-column>
                <el-table-column prop="skuId" label="sku" align="center" width="155px">
                    <template slot-scope="scope">
                        <div class="sku-box" v-if="scope.row.skuId">
                            <a :href="scope.row.goodsUrl" target="_blank">{{scope.row.skuId}}</a>
                            <img src="../../../assets/images/copyLogo.png" @click="copySku(scope.row.skuId)" alt="">
                        </div>
                        <div v-else>-</div>
                    </template>                    
                </el-table-column>
                <el-table-column prop="commentCount" label="全部评价" align="center"></el-table-column>
                <el-table-column prop="proportion" label="占比" align="center">
                    <template slot-scope="scope">
                        {{scope.row.proportion}}%
                    </template>
                </el-table-column>
                <el-table-column prop="showCount" label="晒图" align="center"></el-table-column>
                <el-table-column prop="videoCount" label="视频晒图" align="center"></el-table-column>
                <el-table-column prop="afterCount" label="追评" align="center"></el-table-column>
                <el-table-column prop="goodCount" label="好评" align="center"></el-table-column>
                <el-table-column prop="generalCount" label="中评" align="center"></el-table-column>
                <el-table-column prop="poorCount" label="差评" align="center"></el-table-column>
            </el-table>
            <scoring-modal v-if="scoringModalVisible" type='7' :token="token"  @closeModal="scoringModalVisible=false"/>
        </div>
    </div>
</template>

<script>
import {commentAnalysis} from "../../../api/jdFunction"
import {skuReg,copyUrl} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"

export default {
    data(){
        return{
            token:'',
            skuId:'',
            searchBtnLoading:false,
            initEntry:true,
            tableData:[],
            scoringModalVisible:false
        }
    },
    computed: {
        ...mapState(["_token","_skuId"])
    },
    components:{scoringModal},
    mounted(){
        this.token = this.$route.query.token || this._token
        this.skuId = this.$route.query.skuId || this._skuId
        this.commentAnalysis()
    },
    methods:{
        async commentAnalysis(){

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
            let {data:res} = await commentAnalysis({params,token:this.token})
            this.searchBtnLoading = false
            if(res.code===200){
                this.initEntry = false
                 this.tableData = res.data               
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
    .commentAnaltsis{
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

            /deep/ .el-table{
                margin-top: 20px;
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;

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
                        width: 12px;
                        height: 14px;
                        margin-left: 5px;
                        cursor: pointer;
                    }
                }
            }
        }
        
    }
</style>