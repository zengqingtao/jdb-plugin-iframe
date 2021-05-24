<!--特权激活码弹窗-->
<template>
    <div class="privilege-activedCode-modal">
        <div class="content">
            <i class="el-icon-close" @click="closeModal"></i>
            <el-table :data="tableData" height="370px" v-loading="loading">
                <el-table-column label="序号" align="center">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column label="特权激活码" prop="activeCode" align="center"></el-table-column>
                <el-table-column label="使用手机号" prop="account" align="center"></el-table-column>
                <el-table-column label="激活时间" prop="activeTime" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getPrivilegeActivedCodeList } from "../../api/inviteFriend"
export default {
    data(){
        return{
            tableData:[],
            loading:false
        }
    },

    props:{
        token:{
            type:String,
            default:''
        }
    },

    mounted(){
        this.getPrivilegeActivedCodeList()
    },

    methods:{

        closeModal(){
            this.$emit('closeModal')
        },

        async getPrivilegeActivedCodeList(){
            let params = {
                pageNo:1,
                pageSize:10000
            }
            this.loading = true
            const {data:res} = await getPrivilegeActivedCodeList({params,token:this.token})
            this.loading = false
            if(res.code===200){
                this.tableData = res.data
            }else{
                this.$message.error(res.msg)
            }

        },
    }
}
</script>

<style lang="scss" scoped>
    .privilege-activedCode-modal{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.3);

        .content{
            width: 850px;
            height: 420px;
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding:20px 22px 30px;
                
            /deep/ .el-icon-close{
                color: #fff;
                font-size: 18px;
                position: absolute;
                right: -40px;
                top: 0;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            /deep/ .el-table{
                border: 1px solid #eee;
                border-bottom: 0;
                border-radius: 4px;
                    
                .cell{
                    font-size: 12px;
                }

                thead tr th{
                    background: #F8F8F8;
                }

                thead tr th,tbody tr td{
                    padding:8px 0 !important;
                }

                ::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }
                /*定义滚动条轨道 内阴影+圆角*/

                ::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    background-color: #f8f8f8;
                }


                /*定义滑块 内阴影+圆角*/

                ::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
                    background-color: #d3d3d3;
                }
            }
        }
    }
</style>