<!--邀请好友-->
<template>
  <div class="invite-firend">
	<div class="content">
		<div class="reward-mechanism">
			<div class="reward-desc ql-snow ql-editor" v-html="rewardCopy"></div>
		</div>
		<div class="inviteNumber-and-promotionLink" v-loading="inviteNumberLoading">
			<div class="invite-number">
				<div class="number">
					<span>{{validInviteNumber}}</span>
					<span>人</span>
				</div>
				<div class="text">有效邀请人数</div>
			</div>
			<div class="promotion-link">
				个人专属推广链接：{{promotionLink}}
				<img src="../../../assets/images/copyLogo.png" @click="copyUrl(promotionLink)"/>
			</div>
		</div>
		<div class="invite-register-record" >
			<div class="invite-register-record-title">邀请注册记录</div>
			<el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
				<el-table-column label="序号" align="center">
					<template slot-scope="scope">
						<div>{{scope.$index+1+(pagination.page-1)*pagination.size}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="dzgjPhone" label="注册手机号" align="center"></el-table-column>
				<el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
				<el-table-column prop="invitationState" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.invitationState?'有效邀请':'无效邀请'}}</div>
					</template>
					<template slot="header">
                            <span>邀请状态</span>
                            <el-tooltip popper-class="tooltip" placement="bottom">
                                <i class="el-icon-question"></i>
                                <div slot="content" class="tooltip-content">
                                    <div>邀请用户注册账号后，若只是注册账号，没有安装并登录插件，属于无效邀请；</div>
									<div>需要新用户安装并登录插件后，邀请状态才能变为有效邀请。</div>
                                </div>
                            </el-tooltip>
                        </template>
				</el-table-column>
			</el-table>
			<div class="pagination-box" v-if="pagination.total>pagination.size">
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
	</div>
  </div>
</template>

<script>
import {copyUrl} from "../../../utils/common"
import {geRewardCopyById,getValidInviteNumber,getInviteRecordList,getInvitationCode} from "../../../api/inviteFriend"
import config from "../../../config/index"
import{mapState} from "vuex"
export default {
	name: "inviteFriend",
	data(){
		return{
			token:this.$route.query.token,
			rewardCopy:'',
			promotionLink:'',
			tableData:[],
			tableLoading:true,
			pagination:{
				page:1,
				size:10,
				total:null
			},
			validInviteNumber:0,
			inviteNumberLoading:true
		}
	},
	computed:{
		...mapState(['_token'])
	},
	mounted(){
		this.token = this.$route.query.token|| this._token
		this.geRewardCopy()
		this.getValidInviteNumber()
		this.getInviteRecordList()
		this.getInvitationCode()
	},

	methods:{

		// 获取奖励文案
		async geRewardCopy(){
			let { data:res } =await geRewardCopyById({id:2},this.token)
			if(res.code===200){
				this.rewardCopy = res.data.content
			}else{
				this.$message.error(res.data.msg)
			}
		},

		// 获取有效邀请人数
		async getValidInviteNumber(){
			let {data:res} =await getValidInviteNumber({token:this.token})
			this.inviteNumberLoading = false
			if(res.code===200){
				this.validInviteNumber = res.data.invitationNumber
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

		// 获取邀请记录列表
		async getInviteRecordList(){
			this.tableLoading = true
			let params = {
				pageNo:this.pagination.page,
				pageSize:this.pagination.size,
			}
			let {data:res} = await getInviteRecordList({params,token:this.token})
			this.tableLoading = false
			if(res.code===200){
				this.tableData = res.data.results
				this.pagination.total = res.data.totalCount
			}else{
				this.$message.error(res.msg)
			}
		},

		changePage(currentPage){
			this.pagination.page = currentPage
			this.getInviteRecordList()
		},

		copyUrl(url){
			copyUrl(url)
			this.$message.success("复制成功")
		}
	}
};

</script>

<style lang="scss" scoped>
	.invite-firend{
		height: 100%;

		.content{
			height:100%;
			padding: 18px 20px 0 20px;

			&::after{
				content: '';
				display: block;
				height: 10px;
			}
	
			.reward-mechanism{
				padding: 20px;
				border-radius: 10px;
				box-shadow: 0px 3px 24px 0px rgba(175, 175, 175, 0.22);

				.reward-desc.ql-editor{
					padding:0 ;
					height: unset;
					overflow-y: unset;
				}
			}


			.inviteNumber-and-promotionLink{
				height: 118px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-radius: 10px;
				box-shadow: 0px 6px 18px 0px rgba(216, 216, 216, 0.56);
				margin-top: 10px;

				.invite-number{
					text-align: center;

					.number{
						height: 33px;
						color: #333;
						font-weight: bold;

						span:first-child{
							font-size: 36px;
						}

						span:last-child{
							font-size: 18px;
							margin-left:-5px
						}
					}

					&>div:last-child{
						padding-top: 9px;
						color: #999;
						font-size: 14px;
					}

				}

				.promotion-link{
					display: flex;
					justify-content: center;
					align-items: center;
					padding-top: 10px;
					color: #333;
					font-size: 14px;

					img{
						width: 12px;
						height: 14px;
						margin-left: 5px;
						cursor: pointer;
					}
				}
			}

			
			.invite-register-record{
				margin-top: 10px;
				padding: 17px 20px 10px;
				border-radius: 10px;
				box-shadow: 0px 6px 18px 0px rgba(216, 216, 216, 0.56);

				&-title{
					text-align: center;
					color: #333;
					font-size: 16px;
					font-weight: bold;
				}

				/deep/ .el-table{
					margin-top: 18px;
					border: 1px solid #EEE;
					border-bottom: 0;
					border-radius:4px;

					thead tr th{
						background: #F8F8F8;
						padding: 8px 0;
						font-weight: bold;
					}

					.el-icon-question{
						color: #999;
					}
				}

				.pagination-box{
					text-align: center;
					padding-top: 20px;
				}
			}
		}

	}
	
</style>