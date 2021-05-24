<!--插件主页-->
<template>
    <div class="plugin-home-page">
        <div class="left">
            <div class="carousel-box">
                <el-carousel :arrow="carouselList.length<=1?'never':'hover'" :height="imgHeight" @change="changeCarousel" :class="carouselList.length<=1?'showInitialIndex':''">
                    <el-carousel-item v-for="(item,index) in carouselList" :key="index">
                        <a :href="item.link" target="_blank">
                            <img class="swiper-img" :src="item.imageUrl" ref='swiperImg' alt />
                        </a>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="account-info">
                <div class="row1">
                    <div class="account">登录账号：{{accountInfo.account}}</div>
                    <div class="actived-state">
                        激活状态：{{accountInfo.activatedState}}
                        <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                            <div slot="content">
                                激活码分为普通激活码和特权激活码。<br/>
                                普通激活码可以永久免费使用插件。<br/>
                                特权激活码可以永久免费使用插件，并解封特权功能。<br/>
                                普通激活状态，可以通过特权激活码激活插件，解封特权。
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </div>
                    <el-button type="primary" @click="activedPluginVisible = true" onfocus="this.blur()">激活插件</el-button>
                </div>
                <div class="row2">
                    <div class="package">
                        店长管家套餐：{{accountInfo.setMealType||'暂无套餐'}}
                        <el-button v-if="!accountInfo.setMealType&&dzgj_token" type="text" onfocus="this.blur()" @click="toBuyPackage">购买套餐</el-button>
                    </div>
                    <div class="privilege-actived-code">
                        特权激活码：{{accountInfo.privilegeActivationCodeNumber}}个
                        <el-button type="text" v-if="accountInfo.privilegeActivationCodeNumber"  @click="privilegeActivedCodeTableVisible = true">查看</el-button>
                        <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                            <div slot="content">
                            购买了会员套餐后，可以获赠多个特权激活码。特权激活码可以赠送给其他用户。
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </div>
                </div>
                <div class="valid-date">
                    套餐有效期至：{{accountInfo.validTime||'暂无套餐'}}
                    <el-tooltip placement="bottom" popper-class="tooltip" :enterable="false">
                        <div slot="content">
                            购买了店长管家会员套餐后，可永久免费使用插件和永久拥有插件所有功能的使用权限
                        </div>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </div>
            </div>
            <div class="invitation-info">
                <div class="invitation-title">
                    <div class="text">邀请推广</div>
                    <img src="../../../assets/images/pluginHomePage/invitation.png" @click="$router.push('/dataQuery/inviteFriend')" alt="">
                </div>
                <div class="invitation-content">
                    <div class="valid-invitation-number">
                        <div class="number">
                            <span>{{validInviteNumber}}</span>
                            <span>人</span>
                        </div>
                        <div class="text">有效邀请人数</div>
                    </div>
                    <div class="member-interests">
                        <div class="member-interests-title">会员权益</div>
                        <ul>
                            <li v-for="(item,index) in interests" :key="index">
                                <div class="interests-content" :title="item.content">{{item.content}}</div>
                                <div v-if="showBtn">
                                    <el-button v-if="item.inviteNum<=authorityNumber" class="isHaveAuthority">已解封</el-button>
                                    <el-button v-else  @click="$router.push('/dataQuery/inviteFriend')">解封</el-button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="promotion-link">
                    个人专属推广链接：{{promotionLink}}
                    <img src="../../../assets/images/copyLogo.png" @click="copyUrl(promotionLink)" alt="">
                </div>
            </div>
        </div>
        <div class="right">
            <ul class="notification-box">
                <li v-for="(item,index) in newMsgList" :key="index" @click="msgId=item.id;messageContentVisible = true">
                    <div class="isNew" v-if="item.whetherNew">new</div>
                    <div class="title-and-time"  :title="item.notificationTitle">
                        <div class="title">{{item.notificationTitle}}</div>
                        <div class="time">{{item.createTime}}</div>
                    </div>
                </li>   
            </ul>
            <div class="QR-code-box">
                <div class="QR-code-item">
                    <img src="../../../assets/images/pluginHomePage/ssssGzh.jpg" alt="">
                    <div class="QR-code-item-right">
                        <div class="QR-code-item-name">搜索书生公众号</div>
                        <div class="QR-code-item-desc">了解最新京东搜索规则和运营指导</div>
                    </div>
                </div>
                <div class="QR-code-item">
                    <img src="../../../assets/images/pluginHomePage/ssssKcGzh.jpg" alt="">
                    <div class="QR-code-item-right">
                        <div class="QR-code-item-name">搜索书生课堂公众号</div>
                        <div class="QR-code-item-desc">了解最新搜索书生课程和店长管家的资讯</div>
                    </div>
                </div>
                <div class="QR-code-item">
                    <img src="../../../assets/images/pluginHomePage/dzgjGw.png" alt="">
                    <div class="QR-code-item-right">
                        <div class="QR-code-item-name">店长顾问微信号</div>
                        <div class="QR-code-item-desc">
                            <p>店长管家、插件、搜索书生课堂有疑问，</p>
                            <p>请加店长顾问微信咨询</p>
                        </div>
                    </div>
                </div>
                <div class="QR-code-item version-record" @click="$router.push('/dataQuery/versionRecord')">
                    <div class="version-record-img-box"> 
                        <img src="../../../assets/images/pluginHomePage/version.png" alt="">
                    </div>
                    <div class="QR-code-item-right">
                        <div class="QR-code-item-name">版本更新记录</div>
                    </div>
                </div>
            </div>
        </div>
        <message-content v-if="messageContentVisible" :id="msgId" :token="token" @closeModal="messageContentVisible = false" />
        <privilege-actived-code v-if="privilegeActivedCodeTableVisible" :token="token"  @closeModal="privilegeActivedCodeTableVisible = false"/>
        <actived-plugin v-if="activedPluginVisible" :token="token" @closeModal="activedPluginVisible = false" @success="activedPluginSuccess"/>
    </div>
</template>
<script>
import { getValidInviteNumber,getInvitationCode,getNewMessageNotification,getPluginAdvertisingImgUrl } from "../../../api/inviteFriend"
import { getAccountInfo,getAuthorityNumber } from "../../../api/user"
import { getShopInfo } from "../../../api/jdFunction"
import config from "../../../config"
import { copyUrl } from "../../../utils/common" 
import{mapState} from "vuex"
import messageContent from "./messageContent"
import PrivilegeActivedCode from '../../dialog/privilegeActivedCode.vue'
import ActivedPlugin from '../../dialog/activedPlugin.vue'
export default {
    data() {
        return{
            account:'',
            token:'',
            carouselList:[],
            imgHeight:'260px',
            newMsgList:[],
            accountInfo:{},
            showBtn:false,
            validInviteNumber:0,
            authorityNumber:0,
            promotionLink:'',
            messageContentVisible:false,
            msgId:'',
            interests:[
                {content:'1.秒杀分析，可查看商品秒杀的销量数据。',inviteNum:1},
                {content:'2.坑产计算可查询500名商品。',inviteNum:2},
                {content:'3.a.坑产计算可查询1000名商品；b.可使用搜索分析功能。',inviteNum:3}
            ],
            privilegeActivedCodeTableVisible:false,
            activedPluginVisible:false,
            dzgj_token:'',
        }
    },

    computed:{
        ...mapState(['_token','_account'])
    },
    
    components:{
        messageContent,
        PrivilegeActivedCode,
        ActivedPlugin
    },

    mounted(){
        this.account = this._account
        this.token = this._token
        this.getPluginAdvertisingImgUrl()
        this.getNewMessageNotification()
        this.getValidInviteNumber()
        this.getAuthorityNumber()
        this.getInvitationCode()
        this.getAccountInfo()
        this.getDZGJToken()
    },
    
    methods:{

        async getPluginAdvertisingImgUrl(){//获取广告图片
            let params = {location:24}
            let {data:res} = await getPluginAdvertisingImgUrl({params,token:this.token})
            if(res.code===200){
                this.carouselList = res.data
                if(this.carouselList.length){
                    this.changeCarousel(0)
                }
            }else{
                this.$message.error(res.msg)
            }
        },

        async getNewMessageNotification(){
            let params = {
                serveType:'1',//店长管家插件
                pageNo:1,
                pageSize:5
            }
            let { data:res } = await getNewMessageNotification({params,token:this.token})
            if(res.code===200){
                this.newMsgList = res.data
            }else{
                this.$message.error(res.msg)
            }
        },

        // 获取有效邀请人数
		async getValidInviteNumber(){
			let {data:res} = await getValidInviteNumber({token:this.token})
			if(res.code===200){
				this.validInviteNumber = res.data.invitationNumber
			}else{
				this.$message.error(res.msg)
			}
		},

        // 获取使用功能权限数量
		async getAuthorityNumber(){
            this.showBtn = false
			let {data:res} = await getAuthorityNumber({token:this.token})
			if(res.code===200){
                this.showBtn = true
				this.authorityNumber = res.data
			}else{
				this.$message.error(res.msg)
			}
		},

        async getAccountInfo(){
            let {data:res} = await getAccountInfo({token:this.token})
            if(res.code===200){
                this.accountInfo = res.data
            }else{
                this.$message.error(res.msg)
            }

        },

        async getDZGJToken(){
            let {data:res} = await getShopInfo({params:{},token:this.token})
            if(res.code===200){
                this.dzgj_token = res.data.token
            }else{
                this.$message.error(res.msg)
            }
        },

        // 获取邀请码
		async getInvitationCode(){
			let {data:res} = await getInvitationCode({token:this.token})
			if(res.code===200){
				this.promotionLink = config.dzgjUrl+'register?shareCode='+res.data
			}else{
				this.$message.error(res.msg)
			}
		},

        activedPluginSuccess(){
            this.$message.success('激活账号成功！')
            this.activedPluginVisible = false
            //重新请求会员权益个数、账号信息
            this.getAuthorityNumber()
            this.getAccountInfo()
        },

        toBuyPackage(){
            let url = config.dzgjUrl+'authorization?account='+this.account+'&token='+this.dzgj_token+'&path=softwareOrdering'
            window.open(url)
            this.getDZGJToken()
        },

        copyUrl(url){
            copyUrl(url)
            this.$message.success('复制成功')
        },

        changeCarousel(index){
            let timer = setInterval(() => {
                if(this.$refs.swiperImg[index]){
                    this.imgHeight = this.$refs.swiperImg[index].height + 'px' 
                    clearInterval(timer)
                }
            }, 500);
        }
    }
}
</script>
<style lang="scss" scoped>
    .plugin-home-page{
        padding: 20px 20px 0;
        display: flex;

        .left{
            flex: 1;
            min-width: 697px;

            .carousel-box{
                width: 100%;
                overflow: hidden;
                border-radius: 10px;

                /deep/ .el-carousel--horizontal {
                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .swiper-img {
                    width: 100%;
                    display: block;
                    border-radius: 10px;
                }

                // 如果轮播图片只有一张，就不显示指示器
                .showInitialIndex {

                    /deep/ .el-carousel__indicator--horizontal {
                        display: none;
                    }
                }
            }  

            .account-info{
                height: 116px;
                background: #FFFFFF;
                box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);
                border-radius: 10px;
                font-size: 14px;
                color: #333;
                padding: 22px 10px 0 20px;
                margin-top: 20px;

                .row1{
                    display: flex;

                    .account{
                        width: 303px;
                    }

                    .actived-state{
                        flex: 1;

                        .el-icon-question{
                            color: #999;
                        }
                    }

                    .el-button{
                        width: 70px;
                        height: 24px;
                        padding: 0;
                        font-size: 12px;
                        margin-top: -12px;
                    }
                }

                .row2{
                    display: flex;
                    padding-top: 12px;

                    .package{
                        width: 303px;
                    }

                    .el-button{
                        padding: 0;
                        font-size: 12px;
                        margin-left: 5px;
                    }

                    .el-icon-question{
                        color: #999;
                    }

                }

                .valid-date{
                    padding-top: 12px;

                    .el-icon-question{
                        color: #999;
                    }
                }

            }

            .invitation-info{
                height: 394px;
                margin-top: 20px;
                padding: 0 20px;
                background: #FFFFFF;
                box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);
                border-radius: 10px;

                .invitation-title{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;

                    .text{
                        color: #333;
                        font-size: 18px;
                        font-weight: bold;
                    }

                    img{
                        width: 149px;
                        height: 48px;
                        cursor: pointer;
                    }
                }

                .invitation-content{
                    height: 234px;
                    margin-top: 10px;
                    display: flex;
                    border-radius: 10px;
                    box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);
                    background: url("../../../assets/images/pluginHomePage/invitation01.png") no-repeat left bottom;
                    background-size:136px 85px;

                    .valid-invitation-number{
                        width: 210px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        .number{
                            height: 38px;
                            line-height: 38px;
                            color: #333;
                            font-weight: bold;
                            margin-top: 15px;

                            span:first-child{
                                font-size: 48px;
                            }

                            span:last-child{
                                font-size: 24px;
                                margin-left: -5px;
                            }
                        }

                        .text{
                            color: #999;
                            font-size: 14px;
                            padding-top: 10px;
                        }

                    }

                    .member-interests{
                        flex: 1;
                        padding:30px 30px 0  0;

                        &-title{
                            color: #333;
                            font-size: 14px;
                            font-weight: bold;
                        }

                        ul{
                            flex: 1;
                            padding-top: 10px;
                            display: flex;
                            flex-direction: column;

                            li{
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                color: #333;
                                font-size: 14px;

                                .interests-content{
                                    flex: 1;
                                    display: -webkit-box;
                                    /* ! autoprefixer: off */
                                    -webkit-box-orient: vertical;
                                    /* autoprefixer: on */
                                    -webkit-line-clamp: 1;
                                    overflow: hidden;
                                    padding-right: 10px;

                                }

                                .el-button{
                                    width: 64px;
                                    height: 26px;
                                    padding: 0;
                                    font-size: 14px;
                                    color: #fff;
                                    background: var(--themeColor);
                                    border-color: var(--themeColor);

                                    &:hover{
                                        background: var(--defaultColor);
                                        border-color: var(--defaultColor);
                                    }
                                }

                                .isHaveAuthority.el-button{
                                    pointer-events: none;
                                    color: #999;
                                    background: #eee;
                                    border-color: #eee;
                                }
                            }

                            li+li{
                                padding-top: 10px;
                            }
                        }

                    }

                }

                .promotion-link{
                    height: 67px;
                    line-height: 67px;
                    margin-top: 20px;
                    padding-left: 33px;
                    color: #333;
                    font-size: 14px;
                    background: #FFFFFF;
                    box-shadow: 0px 6px 18px 0px rgba(216, 216, 216, 0.56);
                    border-radius: 10px;

                    img{
                        width: 11px;
                        cursor: pointer;
                    }
                }
            }
        }

        .right{
            min-width: 400px;
            margin-left: 20px;

            .notification-box{
                min-width: 244.72px;
                height: 260px;
                background: #fff;
                border-radius: 5px;
                box-shadow: 0px 2px 12px 0px rgba(175, 175, 175, 0.22);
                padding: 20px 20px 0 18px;
                box-sizing: border-box;
                background: url('../../../assets/images/pluginHomePage/invitation04.png') no-repeat right bottom;
                background-size: 250px 220px;

                li{
                    display: flex;
                    color: #333;
                    cursor: pointer;

                    .isNew{
                        width: 34px;
                        height: 16px;
                        text-align: center;
                        font-size: 12px;
                        color: #fff;
                        background: #E1251B;
                        border-radius: 6px 0px 6px 0px;
                        margin-right: 3px;
                    }

                    .title-and-time{
                        flex: 1;
                       
                        .title{
                            height: 17px;
                            line-height: 17px;
                            font-size: 16px;
                            color: #333;
                            display: -webkit-box;
                            /* ! autoprefixer: off */
                            -webkit-box-orient: vertical;
                            /* autoprefixer: on */
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                        }

                        .time{
                            font-size: 12px;
                            color: #999;
                            padding-top: 3px;
                        }
                    }
                }

                li+li{
                    margin-top:14px;
                }
            }

            .QR-code-box{
                flex:1;
                min-width: 244.72px;
                background: #FFFFFF;
                box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);
                border-radius: 10px;
                padding: 10px 19px 14px;
                margin-top: 20px;

                .QR-code-item{
                    width:100%;
                    height: 116px;
                    display: flex;
                    align-items: center;
                    background: #FFFFFF;
                    box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);
                    margin-top: 10px;
                    padding: 0 10px;

                    img{
                        width: 101px;
                        height: 101px;
                    }

                    img.version-img{//版本更新图片
                        width: 78px;
                        height: 97px;
                    }

                    .QR-code-item-right{
                        padding-left: 3px;

                        .QR-code-item-name{
                            color: #333;
                            font-size: 18px;
                            font-weight: bold;
                        }
    
                        .QR-code-item-desc{
                            color: #666;
                            font-size: 12px;
                            padding-top: 5px;
    
                            p:last-child{
                                padding-top: 3px;
                            }
                        }
                    }
                    

                    &.version-record{//版本更新
                        cursor: pointer;

                        .version-record-img-box{
                            width: 101px;
                            height: 101px;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            img{
                                width: 64px;
                                height: 79px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
