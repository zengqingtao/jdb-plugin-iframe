<template>
    <div class="message-content-modal">
        <div class="body">
            <i class="el-icon-close" @click="closeModal"></i>
            <ul class="left-nav">
                <li v-for="(item,index) in unReadMessage" :key="index" :class="activeIndex===index?'actived':''" @click="activeIndex=index">
                    <div>{{item.notificationType}}</div>
                    <i class="el-icon-arrow-right"></i>
                </li>
            </ul>
            <div class="right">
                <div class="content" v-if="unReadMessage[activeIndex]">
                    <div class="title">{{unReadMessage[activeIndex].notificationTitle}}</div>
                    <div class="sender-and-time">
                        <div>{{unReadMessage[activeIndex].sender}}</div>
                        <div class="time">{{unReadMessage[activeIndex].createTime}}</div>
                    </div>
                    <div class="notification-content ql-snow ql-editor" v-html="unReadMessage[activeIndex].notificationContent"></div>
                </div>
                <div class="btn-box">
                    <el-button type="primary" :loading="loading" @click="setHaveReadStateById(unReadMessage[activeIndex].id)" onfocus="this.blur()">我已阅读</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getUnreadMessage,setHaveReadStateById } from "../../../api/inviteFriend"
export default {
    data(){
        return{
            activeIndex:0,
            unReadMessage:[],
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
        this.getUnreadMessage()
    },

    methods:{

        closeModal(){
            this.$emit('closeModal')
        },

        async getUnreadMessage(){
            let params = {
                serveType:'1',//店长管家插件
                pageNo:1,
                pageSize:10//目前固定10条
            }
            this.loading = true
            let { data:res } = await getUnreadMessage({params,token:this.token})
            this.loading = false
            if(res.code===200){
                this.activeIndex = 0
                this.unReadMessage = res.data
                if(!res.data||res.data.length===0)this.closeModal()
            }else{
                this.$message.error(res.msg)
            }
        },

        async setHaveReadStateById(id){
            let params = {
                id
            }
            let {data:res} = await setHaveReadStateById({params,token:this.token})
            if(res.code===200){
                this.getUnreadMessage()
            }else{
                this.$message.error(res.msg)
            }
        }
        

    }
}
</script>

<style lang="scss" scoped>
    .message-content-modal{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.3);

        .body{
            width: 70%;
            height: 90%;
            background: #fff;
            border-radius: 10px;
            position: relative;
            display: flex;

            /deep/ .el-icon-close{
                position: absolute;
                top: 0;
                right: -40px;
                font-size: 18px;
                color: #fff;
                border: 1px solid #fff;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }

            .left-nav{
                width: 180px;
                height: 100%;
                padding: 0 10px;
                box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);
                overflow-y:auto ;

                &::-webkit-scrollbar {//设置滚动条宽度为0
                    width: 0px;
                    height: 0px;
                }

                li{
                    height: 50px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    
                    div{
                        flex: 1;
                        text-align: center;
                        color: #333;
                        font-size: 14px;

                    }

                    .el-icon-arrow-right{
                        font-size: 16px;
                        padding-right: 5px;
                    }

                    

                    &:hover,&.actived{
                        font-weight: bold;

                        .el-icon-arrow-right{
                            font-weight: bold;
                        }
                    }
                }
            }

            .right{
                flex: 1;
                height: 100%;
                padding-top: 20px;
                
                .content{
                    overflow-y:auto;
                    height: calc(100% - 60px);
        
                    .title{
                        color: #330606;
                        font-size: 24px;
                        font-weight: bold;
                        text-align: center;
                        padding-top: 24px;
                    }
        
                    .sender-and-time{
                        display: flex;
                        justify-content: center;
                        padding: 15px 0 40px;
                        font-size: 14px;
                        color: #330606;
        
                        .time{
                            padding-left:20px;
                        }
                    }
        
                    .notification-content{
                        padding: 0 25px;
                        height: unset;
                        overflow-y: unset;
                        font-size: 12px;//必须是12px,富文本的字体大小单位是em

                        /deep/ img {//防止富文本的图片过大问题
                            max-width: 100%;
                        }
                    }
                }

                .btn-box{
                    text-align: center;
                    padding: 10px 0 20px;

                    /deep/ .el-button{
                        width: 100px;
                        height: 30px;
                        font-size: 14px;
                        padding: 0;
                        border-radius: 4px;
                    }
                }
            }
        }
    }
</style>