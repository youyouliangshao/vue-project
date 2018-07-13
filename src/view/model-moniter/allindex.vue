<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					<span>{{page.mainname}}</span></el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: page.url }" class="history-watch">{{page.name}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="variable-main">
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="24">
						<div>
							<el-form :inline="true" ref="form" :model="formData" label-width="">
								<el-form-item label="主题：" v-if="page.name=='单变量测算'">
									<el-select v-model="formList.modelType" placeholder="全部" @change="changeType">
										<el-option label="全部" value="0"></el-option>
										<el-option
												v-for="item in options"
												:key="item.id"
												:label="item.titleName"
												:value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="模型类型：" v-else>
									<el-select v-model="formData.modelType" placeholder="全部" @change="changeModelType">
										<el-option label="全部" value="2,3"></el-option>
										<el-option label="预授信模型" value="2"></el-option>
										<el-option label="授信模型" value="3"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="分组：" v-if="page.name=='单变量测算'">
									<el-select v-model="formList.modelName" placeholder="请选择分组名称">
										<el-option v-for="item in optionsGroup" :label="item.groupName" :value="JSON.stringify({titleName:item.titleName,id:item.id})"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="模型名称：" v-else>
									<el-select v-model="formData.modelName" placeholder="请选择模型名称">
										<el-option v-for="item in modelList" :label="item.modelNameSon" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item class="fr">
									<el-button type="primary" @click="selectModels" v-if="page.name=='单变量测算'">选择分组</el-button>
									<el-button type="primary" @click="selectModel" v-else>选择模型</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-col>
				</el-row>
				<div class="model-comment" v-if="this.urlName=='target-stability'">
					<p>1. 模型监控结果实时计算</p>
					<p>2. 模型禁用时将会清空建模时点数据</p>
					<p>3. 评分卡指标稳定性监控，主要监控评分卡指标分布是否发生偏移（PSI 值）</p>
					<p>4. 通过引擎页面查询的结果不计入模型监控</p>
					<p>5. 请先选择模型以查看监控结果</p>
				</div>
				<div class="model-comment" v-if="this.urlName=='score-stability'">
					<p>1. 模型监控结果实时计算</p>
					<p>2. 模型禁用时将会清空建模时点数据</p>
					<p>3. 评分卡评分稳定性监控，主要监控评分卡中评分结果分布是否发生偏移（PSI 值）</p>
					<p>4. 通过引擎页面查询的结果不计入模型监控</p>
					<p>5. 请先选择模型以查看监控结果</p>
				</div>
				<div class="model-comment" v-if="this.urlName=='score-discrimination'">
					<p>1. 评分模型评分区分力监控，主要监控评分卡中评分结果是否能够很好的区分开好坏账户（KS值，基尼系数）</p>
					<p>2. 区分力监控需要通过接口传入的方式传入审批结果的好坏账户结果（通过引擎页面查询的结果不计入模型监控）</p>
					<p>3. 请先选择模型以查看监控结果</p>
				</div>
				<div class="model-comment" v-if="this.urlName=='message-back'">
					<p>1. 模型监控过程中，有部分数据需要业务系统配合回传，如：好坏客户定义、审批结果等重要信息</p>
					<p>2. 信息回传需要业务系统配合，根据给出接口的请求方式和样例进行对接即可完成相关功能</p>
					<p>3. 请先选择模型以设置相应接口</p>
				</div>
				<div class="model-comment" v-if="this.urlName=='single-calculate'">
					<p>1. 模型变量测算通过直观简洁的方式对引擎接入的变量形成基础的统计分析功能</p>
					<p>2. 单变量测算针对数值型和枚举型数据提供不同的内容</p>
					<p>3. 请先选择变量分组以查看相应变量测算结果</p>
				</div>
				<div class="model-comment" v-if="this.urlName=='result-calculate'">
					<p>1. 评分卡评分结果测算利用样本数据，计算出评分结果，通过观察评分分布可直观的对模型进行调整</p>
					<p>2. 评分卡评分结果测算需要提前设定相应的样本数据</p>
					<p>3. 请先选择模型以查看测算结果</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import api from '../../api/api'
    import axios from '../../api/http'
    export default {
        created () {
            this.getList();
            this.pageInfo();
            this.changeModelType();
            this.changeType('0');
        },
        data () {
            return {
                list:{},
                modelList:{},
                options:[],
                optionsGroup:[],
                formData:{
                    modelType:'2,3',
                    modelName:'',
                },
                formList:{
                    modelType:'0',
                    modelName:'',
				},
                themeTitle:{},
                groupTitle:{},
	            //页面名称
                urlName:'',
                //页面信息
                page : {
                    mainname:'',
                    name : "",
                    url : "",
                    type : ''
                },
            }
        },
	    watch:{
            $route : 'pageInfo'
	    },
        methods: {
            //搜索列表
            pageInfo(){
                this.page.url = this.$route.url;
                this.urlName=this.$route.name;
                switch (this.urlName) {
	                case 'target-stability':
                        this.page.mainname='模型监控'
	                    this.page.name='评分卡指标稳定性'
	                    break;
                    case 'score-stability':
                        this.page.mainname='模型监控'
                        this.page.name='评分卡评分稳定性'
                        break;
                    case 'score-discrimination':
                        this.page.mainname='模型监控'
                        this.page.name='评分卡评分区分力'
                        break;
                    case 'message-back':
                        this.page.mainname='模型监控'
                        this.page.name='信息回传接口设置'
                        break;
                    case 'single-calculate':
                        this.page.mainname='模型测算'
                        this.page.name='单变量测算'
                        break;
                    case 'result-calculate':
                        this.page.mainname='模型测算'
                        this.page.name='评分卡评分结果测算'
                        break;
                }
            },
            selectModel(){
                if(this.formData.modelName != ''){
                    switch (this.urlName) {
                        case 'target-stability':
                            var pushParams={
                                name:'target-detail',
                                query : {
                                    id: this.formData.modelName,
                                    mainname:this.page.mainname,
                                    name:this.page.name
                                }
                            };
                            this.$router.push(pushParams);
                            break;
                        case 'score-stability':
                            var pushParams={
                                name:'score-detail',
                                query : {
                                    id: this.formData.modelName,
                                    mainname:this.page.mainname,
                                    name:this.page.name
                                }
                            }
                            this.$router.push(pushParams)
                            break;
                        case 'score-discrimination':
                            var pushParams={
                                name:'discrimination-detail',
                                query : {
                                    id: this.formData.modelName,
                                    mainname:this.page.mainname,
                                    name:this.page.name
                                }
                            }
                            this.$router.push(pushParams)
                            break;
                        case 'message-back':
                            var pushParams={
                                name:'message-back-detail',
                                query : {
                                    id: this.formData.modelName,
                                    mainname:this.page.mainname,
                                    name:this.page.name
                                }
                            }
                            this.$router.push(pushParams)
                            break;
                        case 'result-calculate':
                            var pushParams={
                                name:'result-detail',
                                query : {
                                    id: this.formData.modelName,
                                    mainname:this.page.mainname,
                                    name:this.page.name
                                }
                            }
                            this.$router.push(pushParams)
                            break;
                    }
                }else{
                    this.$message('请选择模型');
                };
			},
            //选择分组
            selectModels(){
                this.groupTitle = this.optionsGroup.find(item => {
                    return item.id === (JSON.parse(this.formList.modelName).id)*1;
                });
                this.themeTitle.titleName=JSON.parse(this.formList.modelName).titleName;
              /*  if(this.formList.modelType=='0'){
                    this.themeTitle.titleName='全部'
				}else{
                    this.themeTitle = this.options.find(item => {
                        return item.id === this.formList.modelType*1;
                    });
				}*/
                if(this.formList.modelName != ''){
                    var pushParams={
                        name:'single-detail',
                        query : {
                            id: this.formData.modelName,
                            mainname:this.page.mainname,
                            name:this.page.name,
                            theme:this.formList.modelType,
                            group:JSON.parse(this.formList.modelName).id,
                            themeName: this.themeTitle.titleName,
                            groupName:this.groupTitle.groupName,
                        }
                    }
                    this.$router.push(pushParams)
                }else{
                    this.$message('请选择分组');
                }
            },
	        //切换模型类型
            changeModelType(){
                this.formData.modelName='';
                api.modelMoniter.getModelListByType({riskModelId:this.formData.modelType}).then(result => {
	                this.modelList=result.data.data;
                }).catch(result => {

                });
            },
			//获取主题列表
            getList(){
                api.singleCalculateList.getSingleList().then(result => {
                    this.options=result.data.data;
                }).catch(result => {
                });
			},
			//分组
            changeType(val){
                this.formList.modelName='';
                this.optionsGroup=[];
                api.singleCalculateList.getGroupList({titleId:val}).then(result => {
                    this.optionsGroup=result.data.data;
                }).catch(result => {
                });

			},

        }
    }
</script>