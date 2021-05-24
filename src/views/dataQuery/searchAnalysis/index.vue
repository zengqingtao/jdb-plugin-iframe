<!--搜索分析-->
<template>
    <div class="searchAnaltsis">
        <div class="content">
            <div class="options">
                <span class="sku-label">关键词：</span>
                <el-input placeholder="请输入关键词查询" size="small" clearable v-model="keyword"></el-input>
                <el-button type="primary" class="search-btn" @click="searchAnalysis" :disabled="authorityNumber<authority" :loading="searchBtnLoading" onfocus="this.blur()">查询</el-button>
                <el-button type="text" class="score-btn" @click="scoringModalVisible=true">评分</el-button>
            </div>
            <el-table :data="tableData" v-if="resultsVisible&!(authorityNumber<authority)">
                <el-table-column prop="" align="center">
                    <template slot="header">
                        <span>APP页面</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">
                                <div>
                                    京东APP搜索某个关键词，在搜索结果页面中，每一页有10个坑位，<br/>
                                    1个快车广告坑位和9个非快车广告坑位；计算平均访客、平均下单、<br/>
                                    平均转化、平均搜索占比时，会排除快车广告坑位的数据的影响。
                                </div>
                            </div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        第{{pageList[scope.$index]}}页
                    </template>
                </el-table-column>
                <el-table-column prop="avgVisitor" align="center">
                    <template slot="header">
                        <span>平均访客</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">
                                <div>当页最近7天平均每个坑位的访客数量</div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="avgOrder" align="center">
                    <template slot="header">
                        <span>平均下单</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">
                                <div>当页最近7天平均每个坑位的下单量</div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <template slot="header">
                        <span>平均转化</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">
                                <div>当页最近7天平均每个坑位的转化率</div>
                            </div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">{{scope.row.avgConversion}}%</template>
                </el-table-column>
                <el-table-column align="center">
                    <template slot="header">
                        <span>平均搜索占比</span>
                        <el-tooltip popper-class="tooltip" placement="bottom">
                            <i class="el-icon-question"></i>
                            <div slot="content" class="tooltip-content">
                                <div>当页最近7天平均每个坑位的搜索访客数量占比</div>
                            </div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">{{scope.row.avgSearchProportion}}%</template>
                </el-table-column>
            </el-table>
            <div class="authority-tip" v-if="authorityNumber<authority">
                <p>账号权限不足，无法使用该功能。</p>
                <el-button type="text" @click="$router.push('/dataQuery/inviteFriend')">解封权限</el-button>
            </div>
            <scoring-modal v-if="scoringModalVisible" type='15' :token="token"  @closeModal="scoringModalVisible=false"/>
        </div>
    </div>
</template>

<script>
import {searchAnalysis} from "../../../api/jdFunction"
import { getAuthorityNumber } from "../../../api/user"
import scoringModal from "../../dialog/scoring" 
import {mapState} from "vuex"

export default {
    data(){
        return{
            token:'',
            keyword:'',
            searchBtnLoading:false,
            resultsVisible:false,
            tableData:[],
            pageList:['一','二','三','四','五','六','七','八','九','十'],
            scoringModalVisible:false,
            authorityNumber:0,
            authority:3,
        }
    },
    computed: {
        ...mapState(["_token"])
    },
    components:{scoringModal},
    mounted(){
        this.token = this.$route.query.token || this._token
        this.getAuthorityNumber()
    },
    methods:{

        // 获取用户权限数量
		async getAuthorityNumber(){
			let {data:res} = await getAuthorityNumber({token:this.token})
			if(res.code===200){
				this.authorityNumber = res.data
			}else{
				this.$message.error(res.msg)
			}
		},

        async searchAnalysis(){

            if(this.keyword===''){
                return this.$message.error('请输入关键词')
            }

            let params = {
                keyword:this.keyword
            }
            this.resultsVisible = false
            this.searchBtnLoading = true
            let {data:res} = await searchAnalysis({params,token:this.token})
            this.searchBtnLoading = false
            if(res.code===200){
                this.resultsVisible = true
                this.tableData = res.data               
            }else{this.$message.error(res.msg)}
        }
    }
}
</script>

<style lang="scss" scoped>
    .searchAnaltsis{
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

                    &.is-disabled:hover{
                        border-color: #8f90c4 !important;
                        background: #8f90c4 !important;
                    }
                }
    
                .score-btn{
                    margin-left: 20px;
                }
            }

            /deep/ .el-table{
                margin-top: 16px;
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 10px;

                thead tr th{
                    padding: 3.5px 0;
                }

                tbody tr td{
                    font-size: 12px;
                    padding: 8.5px 0;
                }

                .el-icon-question{
                    color: #999;
                }
            }

            .authority-tip{
                height: 300px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #333;

                .el-button{
                    padding: 0;
                    color: #4D75FF;
                    font-size: 14px;
                }
            }
        }
        
    }
</style>