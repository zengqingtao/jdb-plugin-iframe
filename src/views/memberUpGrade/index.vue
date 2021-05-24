<template>
  <div class="member-upGrade">
	<div class="content">
        <div class="pay-list">
            <div class="pay-item pay-item__level00">
                <div class="pay-item__header">体验版</div>
                <div class="pay-item__feature">
                    适用于新用户<br/>
                    初步体验店长管家的功能
                </div>
                <div class="pay-item__desc">
                    满足日常数据查询分析，店铺诊断，
                报表整理和竞品监控的需求。
                （购买体验版后，可永久免费使用
                插件工具所有功能）
                </div>
                <div class="pay-item__money">
                    <div class="pay-item__money--price">98</div>
                    元/年
                </div>
                <div @click="toBuy" class="pay-item__btn">立即购买</div>
            </div>
            <div class="pay-item pay-item__level01">
                <div class="pay-item__header">标准版</div>
                <div class="pay-item__feature">
                    适合中低层级店铺<br/>
                    初步尝试知识付费或线下大课
                </div>
                <div class="pay-item__desc">
                    满足店铺诊断，课程培训，资源对接等基本要求
                    快速提升团队岗位能力和完善资源提升销售
                </div>
                <div class="pay-item__money">
                    <div class="pay-item__money--price">6980</div>
                    元/年
                </div>
                <div @click="toBuy" class="pay-item__btn">立即购买</div>
            </div>
            <div class="pay-item pay-item__level02">
                <div class="pay-item__header">高级版</div>
                <div class="pay-item__feature">
                    适合成长型潜力店铺<br/>
                    加固运营知识学习与提升运营效率
                </div>
                <div class="pay-item__desc">
                    满足店铺诊断，课程培训，资源对接，数据报表等需求，可绑定3个店铺和拥有3个学习账户，帮助商家经营好多个店铺
                </div>
                <div class="pay-item__money">
                    <div class="pay-item__money--price">12800</div>
                    元/年
                </div>
                <div class="pay-item__money--old">原价：19999元/年</div>
                <div @click="toBuy" class="pay-item__btn" >立即购买</div>
            </div>
            <div class="pay-item pay-item__level03">
                <div class="pay-item__header">专业版</div>
                <div class="pay-item__feature">
                    适合稳定型品牌店铺<br/>
                    进阶学习团队管理经验与人脉圈子拓展
                </div>
                <div class="pay-item__desc">
                    满足团队学习覆盖面更广的培训课程知识，同时通过自动分析与诊断系统，配合数字化报表监控系统，提高工作效率与运营决策
                </div>
                <div class="pay-item__money">
                    <div class="pay-item__money--price">19800</div>
                    元/年
                </div>
                <div class="pay-item__money--old">原价：29999元/年</div>
                <div @click="toBuy" class="pay-item__btn" >立即购买</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import config from "../../config/index"
import { getShopInfo } from "../../api/jdFunction"
export default {
    data(){
        return{
            token:this.$route.query.token,
            account:this.$route.query.account,
            dzgj_token:''
        }
    },
    mounted(){
        this.getDZGJToken()
    },
	methods:{

        async getDZGJToken(){
            let {data:res} = await getShopInfo({params:{},token:this.token})
            if(res.code===200){
                this.dzgj_token = res.data.token
            }else{
                this.$message.error(res.msg)
            }
        },

        toBuy(){
            let url = ''
            if(this.$route.query.token){
                url = config.dzgjUrl+'authorization?account='+this.account+'&token='+this.dzgj_token+'&path=softwareOrdering'
            }else{
                url = config.dzgjUrl+'softwareOrdering'
            }
            window.open(url)
            this.getDZGJToken()
        }
    }
};

</script>

<style lang="scss" scoped>
	.member-upGrade{
		height: 100%;

		.content{
			height:100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .pay-list {
                display: flex;
                align-items: center;
                justify-content: center;

                .pay-item {
                    width: 290px;
                    height: 460px;
                    background: #FFFFFF;
                    box-shadow: 0 3px 24px 0 rgba(138, 138, 138, 0.22);
                    border-radius: 6px;
                    transition: transform 0.6s, box-shadow 1s;
                    margin-right: 20px;

                    &:last-child {
                        margin-right: 0;
                    }

                    &:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 36px 0 rgba(138, 138, 138, 0.22);
                    }

                    &__level00 {
                        .pay-item__header {
                            color: #B39B8C;
                            background: linear-gradient(-23deg, #E1D4CC,#F0EDE8 );
                        }

                        .pay-item__money {
                            color: #333;
                            padding-top: 50px;
                        }

                        .pay-item__money--price {
                            color: #B39B8C;
                        }

                        .pay-item__btn {
                            color: #B39B8C;
                            background: #E5DCD6;
                        }
                    }
                    &__level01 {
                        .pay-item__header {
                            color: #798BAC;
                            background: linear-gradient(-23deg, #C7D2DC, #E9F1FD);
                        }

                        .pay-item__money {
                            color: #798BAC;
                        }

                        .pay-item__money--price {
                            color: #798BAC;
                        }

                        .pay-item__btn {
                            color: #798BAC;
                            background: #DAE3EE;
                        }
                    }

                    &__level02 {
                        .pay-item__header {
                            background: linear-gradient(-23deg, #DD3131, #F04444);
                        }

                        .pay-item__money {
                            padding-top: 40px;
                        }

                        .pay-item__money--price {
                            color: #E1251B;
                        }

                        .pay-item__btn {
                            margin-top: 20px;
                            background: #E1251B;
                        }
                    }

                    &__level03 {
                        .pay-item__header {
                            background: linear-gradient(-23deg, #DCB698, #C78D66);
                        }

                        .pay-item__money {
                            padding-top: 40px;
                        }

                        .pay-item__money--price {
                            color: #D6956C;
                        }

                        .pay-item__btn {
                            margin-top: 20px;
                            background: #D6956C;
                        }
                    }

                    &__header {
                        width: 290px;
                        line-height: 70px;
                        border-radius: 6px 6px 0 0;
                        font-size: 28px;
                        font-weight: bold;
                        color: #FFFFFF;
                        text-align: center;
                    }

                    &__feature {
                        text-align: center;
                        font-size: 14px;
                        color: #666666;
                        line-height: 20px;
                        padding-top: 42px;
                    }

                    &__desc {
                        font-size: 14px;
                        color: #999999;
                        line-height: 20px;
                        text-align: center;
                        padding: 20px 35px 0;
                    }

                    &__money {
                        padding-top: 70px;
                        display: flex;
                        justify-content: center;
                        align-items: flex-end;
                        font-size: 18px;

                        &--price {

                            font-size: 34px;
                            font-weight: bold;
                            margin-right: 2px;
                        }

                        &--old {
                            font-size: 14px;
                            text-decoration: line-through;
                            color: #999999;
                            line-height: 20px;
                            text-align: center;
                            padding-top: 2px;
                        }
                    }

                    &__btn {
                        width: 160px;
                        line-height: 48px;
                        border-radius: 24px;
                        font-size: 16px;
                        color: #FFFFFF;
                        text-align: center;
                        margin: 30px auto 0;
                        cursor: pointer;

                        &--disabled {
                            pointer-events: none;
                            cursor: default;
                            background: #eee !important;
                            color: #999 !important;
                        }
                    }
                }
            }
		}
	}
	
</style>