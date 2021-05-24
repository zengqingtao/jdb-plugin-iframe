<template>
    <div class="copySkuId-container">
        <div class="one-sku-box">
            <div class="label">单个sku:</div>
            <div class="sku">{{skuId}}</div>
            <el-button type="primary" onfocus="this.blur()" @click="copySkuId(skuId)">复制</el-button>
        </div>
        <div class="more-sku-box">
            <div class="label">多个sku:</div>
            <div class="sku" v-loading="loading">{{skus}}</div>
            <el-button type="primary" onfocus="this.blur()" v-if="!loading"  @click="copySkuId(skus)">复制</el-button>
        </div>
    </div>
</template>

<script>
import {getMoreSkuId} from "../../api/jdFunction"
import {copyUrl} from "../../utils/common"
export default {
    data(){
        return{
            token:this.$route.query.token,
            skuId:this.$route.query.skuId,
            skus:'',
            loading:false
        }
    },
    mounted(){
        this.getMoreSkuId()
    },
	methods:{

        async getMoreSkuId(){
            let params = {sku:this.skuId}
            this.loading = true
            let {data:res} = await getMoreSkuId({params,token:this.token})
            this.loading = false
            if(res.code===200){
                this.skus = res.data
            }else{
                this.$message.error(res.msg)
            }
        },

        copySkuId(skuId){
            copyUrl(skuId)
            this.$message.success('复制成功')
        }
    
    }
};

</script>

<style lang="scss" scoped>
	.copySkuId-container{
        padding: 50px 50px 40px;

        .one-sku-box,.more-sku-box{
            display: flex;
            flex-wrap: wrap;
            color: #333;
            font-size: 14px;
            
            .label{
                min-width: 70px;
            }

            .sku{
                width: 290px;
                word-wrap: break-word;
                margin-right: 15px;
                
            }
        }

        .more-sku-box{
            margin-top: 15px;
            
            .sku{
                height: 160px;
                line-height: 20px;
                 display: -webkit-box;
                /* ! autoprefixer: off */
                -webkit-box-orient: vertical;
                /* autoprefixer: on */
                -webkit-line-clamp: 8;
                overflow: hidden;
            }
        }

        .el-button{
            width: 70px;
            height: 28px;
            padding: 0;
        }
    }
</style>