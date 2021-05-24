<template>
    <div class="message-content-modal">
        <div class="body">
            <i class="el-icon-close" @click="closeModal"></i>
            <div class="content">
                <div class="title">{{msg.notificationTitle}}</div>
                <div class="sender-and-time">
                    <div>{{msg.sender}}</div>
                    <div class="time">{{msg.createTime}}</div>
                </div>
                <div class="notification-content ql-snow ql-editor" v-html="msg.notificationContent"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { getNotificationById } from "../../../api/inviteFriend"
export default {
    data(){
        return{
            msg:{}
        }
    },
    props:{
        token:{
            type:String,
            default:''
        },
        id:{
            type:String,
            default:''
        }
    },

    mounted(){
        this.getNotificationById()
    },

    methods:{

        closeModal(){
            this.$emit('closeModal')
        },

        async getNotificationById(){
            let params = {id:this.id}
            let { data:res } = await getNotificationById({params,token:this.token})
            if(res.code===200){
                this.msg = res.data
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
        z-index: 2100;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.3);

        .body{
            width: calc(70% - 200px);
            height: 90%;
            background: #fff;
            border-radius: 10px;
            position: relative;
            padding: 20px 0 20px;

            /deep/ .el-icon-close{
                position: absolute;
                top: 0;
                right: -40px;
                font-size: 18px;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }

            .content{
                height: 100%;
                overflow-y:auto;
    
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
                    font-size: 12px;//必须是12px,富文本的字体大小单位是em
                    padding: 0 40px;
                    height: unset;
                    overflow-y: unset;

                    /deep/ img {//防止富文本的图片过大问题
                        max-width: 100%;
                    }
                }

            }
        }
    }
</style>