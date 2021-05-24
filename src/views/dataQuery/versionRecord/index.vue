<template>
    <div class="versionRecord">
        <div class="content" v-loading="loading">
            <div class="title">版本记录</div>
            <ul >
                <li v-for="(item,index) in list" :key="index" >
                    <div class="version-and-time">
                        <span>{{item.versionsName}}版本</span>
                        <span class="time">{{item.createTime}}</span>
                    </div>
                    <div>{{item.versionsContent}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getVersionList} from "../../../api/jdFunction"
import {mapState} from "vuex"

export default {
    data(){
        return{
            token:'',
            loading:false,
            list:[]
        }
    },
    computed: {
        ...mapState(["_token"])
    },
    mounted(){
        this.token = this.$route.query.token || this._token
        this.versionRecord()
    },
    methods:{
        async versionRecord(){
            this.loading = true
            let {data:res} = await getVersionList({token:this.token})
            this.loading = false
            if(res.code===200){
                this.list = res.data
            }else{this.$message.error(res.msg)}
        }
    }
}
</script>

<style lang="scss" scoped>
    .versionRecord{
        height: 100%;

        .content{
            height: 100%;
            padding: 0 20px 0 10px;

            .title{
                color: #333;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                padding: 20px 0;
            }

            ul{
                padding-left: 40px;

                li{
                    color: #333;
                    font-size: 14px;
                    .version-and-time{
                        font-weight: bold;
                        padding-bottom: 10px;

                        .time{
                            padding-left: 5px;
                        }
                    }

                }
                li+li{
                    margin-top: 30px;
                }
            }

        }
        
    }
</style>