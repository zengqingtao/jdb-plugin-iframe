<template>
    <div class="queryOrder">
        <div class="content">
            <div class="options">
                <span class="sku-label">SKU：</span>
                <el-input placeholder="请输入SKU查询" size="small" clearable v-model="skuId"></el-input>
                <el-button type="primary" class="search-btn" @click="queryOrder" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
                <el-button type="text" @click="exportData" :loading="exportDataLoading">导出数据</el-button>
                <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
            </div>
            <div  v-if="resultsVisible">
                <el-table :data="tableData.slice((this.pagination.page-1)*this.pagination.size,this.pagination.page*this.pagination.size)">
                    <el-table-column prop="date" label="时间" align="center"></el-table-column>
                    <el-table-column prop="day1Sale" label="昨日成交商品件数" align="center"></el-table-column>
                    <el-table-column prop="day7Sale" label="近7天成交商品件数" align="center"></el-table-column>
                    <el-table-column prop="day15Sale" label="近15天成交商品件数" align="center"></el-table-column>
                    <el-table-column prop="day30Sale" label="近30天成交商品件数" align="center"></el-table-column>
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
            
            <scoring-modal v-if="scoringModalVisible" type='9' :token="token"  @closeModal="scoringModalVisible=false"/>
        </div>
    </div>
</template>

<script>
import {queryOrder,exportOrderCode,downloadFileByCode} from "../../../api/jdFunction"
import {skuReg} from "../../../utils/common"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"

export default {
    data(){
        return{
            token:'',
            skuId:'',
            searchBtnLoading:false,
            resultsVisible:false,
            tableData:[],
            scoringModalVisible:false,
            pagination:{
                page:1,
                size:10,
                total:null
            },
            exportDataLoading:false
        }
    },
    computed: {
        ...mapState(["_token","_skuId"])
    },
    components:{scoringModal},
    mounted(){
        this.token = this.$route.query.token || this._token
        this.skuId = this.$route.query.skuId || this._skuId
        this.queryOrder()
    },
    methods:{
        validaParams(){
            if(this.skuId===''){
                return '请输入SKU'
            }else if(!skuReg(this.skuId)){
                return 'SKU输入有误'
            }else{
                return ''
            }
        },

        async queryOrder(){
            let valid = this.validaParams()
            if(valid!=='')return this.$message.error(valid)

            this.$store.commit("CHANGE_SKUID", this.skuId);
            this.resultsVisible = false
            this.pagination.page = 1
            let params = {
                skuId:this.skuId
            }
            this.searchBtnLoading = true
            let {data:res} = await queryOrder({params,token:this.token})
            this.searchBtnLoading = false
            if(res.code===200){
                this.resultsVisible = true
                this.tableData = res.data       
                this.pagination.total = res.data.length        
            }else{this.$message.error(res.msg)}
        },

        changePage(currentPage){
            this.pagination.page = currentPage
        },

        async exportData(){
            let valid = this.validaParams()
            if(valid!=='')return this.$message.error(valid)
            this.exportDataLoading = true
            let params = {
                skuId:this.skuId
            }

            let {data:res} = await exportOrderCode({params,token:this.token})
            this.exportDataLoading = false
            if(res.code === 200){
                let url = downloadFileByCode + '?code='+res.data;
                window.open(url, "_self");
            }else{  
                this.$$message.error(res.msg)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .queryOrder{
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
                position: relative;

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
                    position: absolute;
                    right: 20px;
                }
            }

            /deep/ .el-table{
                margin-top: 20px;
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;
            }

            .pagination-box{
                text-align: center;
                padding-top: 10px;
            }
        }
        
    }
</style>