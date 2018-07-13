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
						<p class="model-name-title"><span v-html="modelType"></span>_<span v-html="modelName"></span></p>
					</el-col>
					<el-col :span="6">
						<el-button type="primary" class="fr ml5" @click="setModelStability"><i class=""></i>&nbsp;建模时点参数设置</el-button>
						<el-button class="export-btn set-btn fr" @click="exportModelStability"><i class="el-icon-upload2"></i>&nbsp;导出</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<p class="mt5 f18">监控详情</p>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="w200">
						<p class="mt5">建模时点：<span>{{modelDtoList.modelingAt}}</span></p>
					</el-col>
					<el-col class="w15">
						<div v-if="modelShowFlag">
							<span class="c-red" style="cursor: pointer;" @mouseover="overShow" @mouseout="outHide"><i class="el-icon-information"></i></span>
							<p v-show="hoverShow" class="changedplease">模型发生过禁用，当前为最新建模时点，请修改建模时点参数</p>
						</div>
					</el-col>
					<el-col class="w200">
						<p class="mt5">监控时点：<span>{{modelDtoList.monitoringAt}}</span></p>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24"class="mt5">
						<p>注意！<span class="c-red">{{modelDtoList.exceptionNum}}</span>个指标出现异常：
							<a v-for="item in exceptionList" :href="'#red'+item.id">
								<span class="mr5 c-red">{{item.name}}</span>
							</a>
						</p>
					</el-col>
				</el-row>
			</div>
			<el-table
					:data="modelDtoList.scoreCardStabilityDtoList"
					style="width: 100%"
					border
					:row-class-name="handleRow"
			        class="mt20"
			>
				<el-table-column
						prop="name"
						label="指标"
						width="210"
						>
					<template scope="scope">
							<div class="c-red" v-if="scope.row.psiColor == 'red'" :id="'red'+scope.row.id">{{scope.row.name}}</div>
							<div v-else>{{scope.row.name}}</div>
					</template>
				</el-table-column>
				<el-table-column label="建模时点">
					<el-table-column
							prop="createModelParamValue"
							label="#账户"
							>
					</el-table-column>
					<el-table-column
							prop="createModelParamPercent"
							label="%账户"
							:formatter="formatterNull"
							>
					</el-table-column>
				</el-table-column>
				<el-table-column label="监控时点">
					<el-table-column
							prop="controlModelParamValue"
							label="#账户"
							>
					</el-table-column>
					<el-table-column
							prop="controlModelParamPercent"
							label="%账户"
							:formatter="formatterNull"
							>
					</el-table-column>
				</el-table-column>
				<el-table-column
						prop="paramPsi"
						label="PSI"
						>
					<template scope="scope">
						<div class="c-red" v-if="scope.row.psiColor == 'red'">{{formatterZero(scope.row.paramPsi)}}</div>
						<div v-else>{{formatterZero(scope.row.paramPsi)}}</div>
					</template>
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
            this.getMoniterDetail();
        },
        data () {
            return {
                modelName:'',
                modelType:'',
                modelDtoList:{},
	            exceptionList:[],
                modelList:{},
                modelDataFlag:'',
                modelShowFlag:false,
                hoverShow:false,
                formData:{
                    modelType:'2,3',
                    paramType:'A,B',
                    modelName:'',
                },
                //页面名称
                urlName:'',
                //页面信息
                page : {
                    mainname:'',
                    name : '',
                    url : '/target-stability',
                    type : ''
                },
            }
        },
        watch:{
            $route : 'pageInfo'
        },
        methods: {
            overShow(){
				this.hoverShow=true;
            },
            outHide(){
                this.hoverShow=false;
            },
            handleRow(row, index){
                if(row.paramType == 'A'){
				    return 'noBorder'
                }else if(row.paramType == 'T'){
                    return 'no-all-border'
                }
            },
            formatterZero(cellValue){
                if(cellValue == null || cellValue == '' || cellValue == undefined || cellValue == 0){
                    return ''
                }else{
                    return cellValue.toFixed(3)
                }
            },
            formatterNull(row, column, cellValue){
				if(cellValue == null || cellValue == '' || cellValue == undefined ){
					return ''
				}else{
                    return ((cellValue*100).toFixed(2))+'%'
				}
            },
            //详情页
            pageInfo(){
	            this.page.mainname=this.$route.query.mainname;
                this.page.name=this.$route.query.name;
                this.formData.modelName=this.$route.query.id;
            },
	        //导出
            exportModelStability(){
				window.location.href=api.modelMoniter.getMoniterDetailDownLoad(this.formData.modelName);
            },
	        //setModelStability
            setModelStability(){
                var pushParams={
                    name:'stability-set',
                    query : {
                        id: this.formData.modelName,
                        mainname:this.page.mainname,
                        name:this.page.name,
                        modelName:this.modelName,
                        modelType:this.modelType,
	                    modelTime:this.modelDtoList.modelingAt
                    }
                }
                this.$router.push(pushParams)
            },
	        getMoniterDetail(){
                api.modelMoniter.getMoniterDetaiById({paramType:this.formData.paramType,riskModelId:this.formData.modelName}).then(result => {
                    this.modelDtoList=result.data.data;
                    this.modelName=result.data.data.modelName;
                    this.modelType=result.data.data.modelType;
                    this.modelDataFlag=result.data.data.modelDataFlag;
                   /* 当modelDataFlag = E 指标和评分建模时点参数均未修改
                    当modelDataFlag = VFGE 指标建模时点参数修改，评分建模时点参数未修改
                    当modelDataFlag = VEGF 指标建模时点参数未修改，评分建模时点参数修改
                    当modelDataFlag = F 指标和评分建模时点参数均已修改*/
                    switch(this.modelDataFlag){
	                    case 'E':
                            this.modelShowFlag=true;
                            break;
                        case 'VFGE':
                            this.modelShowFlag=false;
                            break;
                        case 'VEGF':
                            this.modelShowFlag=true;
                            break;
                        case 'F':
                            this.modelShowFlag=false;
                            break;
                    }













                    console.log('scoreCardStabilityDtoList=')
                    console.log(JSON.parse(this.modelDtoList.scoreCardStabilityDtoList))
                    this.modelDtoList.scoreCardStabilityDtoList=JSON.parse(result.data.data.scoreCardStabilityDtoList)
	                if(result.data.data.scoreCardStabilityDtoListException){
                        this.modelDtoList.scoreCardStabilityDtoListException=JSON.parse(result.data.data.scoreCardStabilityDtoListException)
	                }else{
                        this.modelDtoList.exceptionNum=0
	                }
	                var excepTionArr=this.modelDtoList.scoreCardStabilityDtoListException;
	                for(var i=0;i<excepTionArr.length;i++){
                        var obj={
                            name:'',
                            id:''
                        }
                        obj.name=excepTionArr[i].name;
                        obj.id=excepTionArr[i].id;
                        this.exceptionList.push(obj)
	                }
                }).catch(result => {

                });
	        }
        }
    }
</script>