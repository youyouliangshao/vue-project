<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					<span>{{page.mainname}}</span></el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: page.url }" class="history-watch">{{page.name}}</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">监控详情</el-breadcrumb-item>
			</el-breadcrumb>
			<router-link :to="{ path: page.url }"><el-button type="primary" class="fr back-to-btn mgt10-mgr8">返回上一级</el-button></router-link>
		</div>
		<div class="variable-main">
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="18">
						<p class="model-name-title"><span>{{result.modelType}}</span>_<span>{{result.modelName}}</span></p>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<p class="mt5 f18">接口详情</p>
					</el-col>
				</el-row>
					<el-form class="set-form-labers " @submit.native.prevent>
						<el-form-item label="请求地址："label-width="100px">
							<div>{{result.url}}</div>
						</el-form-item>
						<el-form-item label="接口样例："label-width="660px">
							<div class=""><a href="javascript:;" class="btn" :data-clipboard-text="result.interfaceExample">复制</a></div>
						</el-form-item>
						<el-row>
							<el-col :span="10">
								<el-input type="textarea" readonly class="min200" v-model="result.interfaceExample">
								</el-input>
							</el-col>
						</el-row>
					</el-form>
			</div>
		
		</div>
	</div>
</template>
<script>
    import api from '../../../api/api'
    import axios from '../../../api/http'
    import {profiles,cookie} from '../../../config'
    import Clipboard from 'clipboard'
    export default {
        created () {
            this.pageInfo();
            this.getRetMessageBack();
        },
        data () {
            return {
                result:{
				},
                modelDtoList: {},
                exceptionList: [],
                modelList: {},
                //页面名称
                urlName: '',
                //页面信息
                page: {
                    mainname: '',
                    name: '',
                    url: '/message-back',
                    type: ''
                },
                formData:{
                    modelName:''
				}
            }
        },
        watch: {
            $route: 'pageInfo'
        },
        mounted() {
           new Clipboard('.btn');
        },
	    destroyed(){

	    },
        methods: {
            //详情页
            pageInfo(){
                this.page.mainname = this.$route.query.mainname;
                this.page.name = this.$route.query.name;
                this.formData.modelName = this.$route.query.id;
            },
            //获取信息回传详情
            strTrim(str){
                 return str.replace(/(^\s*)|(\s*$)/g, "");
        },
			getRetMessageBack(){
                api.modelMoniter.getMessageBack({riskModelId:this.$route.query.id}).then(result => {
                 	this.result=result.data.data;
	                var strArr=this.result.interfaceExample;
                    var finalStr='';
                    for(var i=0;i<strArr.length;i++){
                        if(strArr[i] == '$'){
                            finalStr=finalStr+' \n '
                        }else{
                            finalStr+=this.strTrim(strArr[i])
                        }
                    }
                    this.result.interfaceExample=finalStr;
                    this.result.url=profiles.apiDomain() + ':8207'+this.result.url;
                }).catch(result => {

                });
			},
			// 回传信息的样例复制到剪切板
            copyToClickboard(){
                var ele = document.getElementById("text");
                ele.select();
                document.execCommand("Copy");
			}
        }
    }
</script>