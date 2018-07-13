<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					<span>{{page.mainname}}</span></el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: url }" class="history-watch">{{page.name}}</el-breadcrumb-item>

				<el-breadcrumb-item :to="{ name: urlThird,query:page}"class="history-watch">监控详情</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">建模时点参数设置</el-breadcrumb-item>
			</el-breadcrumb>
			<router-link :to="{ name: urlThird,query:page}"><el-button type="primary" class="fr back-to-btn mgt10-mgr8">返回上一级</el-button></router-link>
		</div>
		<div class="variable-main">
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="18">
						<p class="model-name-title"><span>{{modelType}}</span>_<span>{{modelName}}</span></p>
					</el-col>
					<el-col :span="6">
						<el-button type="primary" class="fr ml5" @click="saveSet"><i class=""></i>&nbsp;保存</el-button>
						<router-link :to="{ name: urlThird,query:page}">
							<el-button type="primary" class="fr ml5"><i class=""></i>&nbsp;取消</el-button>
						</router-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="20">
						<p class="c-red mt5">提示：请录入所有建模时点参数值（输入类型为大于等于零的整数）</p>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="20">
						<p class="mt5">建模时点：<span>{{modelTime}}</span></p>
					</el-col>
				</el-row>
			</div>
			<el-table
					:data="setTable"
					style="width: 100%"
					border
					class="mt20"
			>
				<el-table-column
						prop="name"
						label="评分等级"
				>
				</el-table-column>
				<el-table-column label="建模时点">
					<el-table-column
							prop="paramValue"
							label="#账户"
					>
						<template scope="scope">
							<el-input v-model="scope.row.paramValue"></el-input>
						</template>
						<template scope="scope">
							<el-form @submit.native.prevent>
								<el-form-item>
									<el-input v-validate="rules.moreThanZero" data-vv-value-path="currentValue" data-vv-name="建模时点参数" v-model="scope.row.paramValue"></el-input>
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
    import api from '../../../api/api'
    import axios from '../../../api/http'
    export default {
        created () {
            this.pageInfo();
            this.getSetDetail();
        },
        data () {
            return {
                modelName:'',
                modelType:'',
	            setTable:[],
                formData:{
                    modelType:'2,3',
                    paramType:'C',
                    modelName:'',
                    modelTime:''
                },
                rules:{
                    // moreThanZero:'required|regex:{^([0-9]+)$}'
                    moreThanZero:'required|morethanzero'
                },
	           updateSetParams:{
                    riskModelId:'',
                    paramType:'C',
                    mtrModelParamSetList:[

                    ]
	            },
                //页面名称
                urlName:'',
                //页面信息
                page : {
                    mainname:'',
                    name : '',
	                id:''
                },
                urlThird : 'score-detail',
                url : '/target-stability',
            }
        },
        watch:{
            $route : 'pageInfo'
        },
        methods: {
            //详情页
            pageInfo(){
                this.page.mainname=this.$route.query.mainname;
                this.page.name=this.$route.query.name;
                this.page.id=this.$route.query.id;
                this.modelName=this.$route.query.modelName;
                this.modelType=this.$route.query.modelType;
                this.modelTime=this.$route.query.modelTime;
                this.formData.modelName=this.$route.query.id;
                //this.formData.modelName=this.$route.query.id;
            },
            getSetDetail(){
                api.modelMoniter.getSetDetaiById({paramType:this.formData.paramType,riskModelId:this.formData.modelName}).then(result => {
                    this.setTable=result.data.data;
                }).catch(result => {

                });
            },
	        //保存建模时点修改
            saveSet(){
                this.$validator.validateAll().then((valid) => {
                    console.log(this.$validator)
                    if(valid === true){
                        this.updateSetParams.mtrModelParamSetList=this.setTable;
                        this.updateSetParams.riskModelId=this.formData.modelName;
                        var newArray=this.updateSetParams.mtrModelParamSetList;
                        for(var i=0;i<newArray.length;i++){
                            delete newArray[i].createdAt;
                            delete newArray[i].createdBy;
                            delete newArray[i].updatedAt;
                            delete newArray[i].updatedBy;
                        }
                        api.modelMoniter.updateSet(this.updateSetParams).then(result => {
                            if(result.data.success == true){
                                this.$message(result.data.message);
                                this.$router.push({name: this.urlThird,query:this.page})
                            }
                        }).catch(result => {

                        });
                    }else{
                        this.$message.error('建模时点参数值请输入大于等于零的整数')
                    }
                })
            }

        }
    }
</script>