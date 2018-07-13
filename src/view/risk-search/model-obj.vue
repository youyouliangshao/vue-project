<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风控结果查询</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: page.url }">{{page.name}}</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">{{model.modelNameSon}}</el-breadcrumb-item>
			</el-breadcrumb>
			<router-link :to="{ path: page.url }"><el-button type="primary" class="fr back-to-btn mgt10-mgr8">返回上一级</el-button></router-link>
		</div>
		<div class="page-main">
			<h2 class="f20 tl">请输入查询对象信息：</h2>
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="24" class="item-fl">
							<el-form ref="form" label-width="" @submit.native.prevent>
								&nbsp;
									<el-form-item class='inp-only'  v-for="(item,index) in modelArr" :label="item.objectName+':'" :class="{'is-error': errors.has('form-2.对象信息' +(index+1))}">
										<el-input data-vv-scope="form-2" v-validate="rules.normName" data-vv-value-path="currentValue" :data-vv-name="'对象信息'+(index+1)" v-model="modelParams[index]" placeholder="请输入身份证号或社会信用编码信息"></el-input>
										<i class="c-red">*</i>
										<div v-show="errors.has('form-2.对象信息'+(index+1))" class="el-form-item__error">{{ errors.first('form-2.对象信息'+(index+1))}}</div>
									</el-form-item>
							</el-form>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form :inline="true" ref="form" label-width="" @submit.native.prevent>
							<el-form-item class="fl">
								<el-button type="primary" @click="fetchModelDetails">查询</el-button>
							</el-form-item>
							<el-form-item class="fl">
								<el-button type="primary" @click="dialog.changeModel = true">切换模型</el-button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
			</div>
		</div>
		<!--查询详情组件-->
		<div v-show="hasResult" class="page-inner-main">
			<div class="handle-title clearfix">
		<div class="page-inner-main obj-background">
			<div class="handle-title clearfix obj-top">
				<h2 class="f20 tl fl">查询内容：</h2>
				<el-button @click="exportResult" class="export-btn fr set-btn"><i class="el-icon-upload2"></i>&nbsp;导出查询结果</el-button>
			</div>
			<div class="obj-main clearfix">
				<div class="obj-content obj-first">
					<p class="obj-p">查询时间</p>
					<p class="obj-bottom">{{searchResult.riskQueryRecord.createdAt}}</p>
				</div>
				<div class="obj-content">
					<p class="obj-p">模型类型</p>
					<p class="obj-bottom" v-if="this.searchResult.riskQueryRecord.modelType=='-'">-</p>
					<p class="obj-bottom" v-if="this.searchResult.riskQueryRecord.modelType=='1'">反欺诈模型</p>
					<p class="obj-bottom" v-if="this.searchResult.riskQueryRecord.modelType=='2'">预授信模型</p>
					<p class="obj-bottom" v-if="this.searchResult.riskQueryRecord.modelType=='3'">授信模型</p>
				</div>
				<div class="obj-content">
					<p class="obj-p">模型名称</p>
					<p class="obj-bottom">{{searchResult.riskQueryRecord.modelName}}</p>
				</div>
				<div class="obj-contents">
					<p class="obj-p">查询对象信息</p>
					<p class="obj-bottom" v-if="this.searchResult.riskQueryRecord.modelObjects=='-'">-</p>

						<template v-else v-for="item in JSON.parse(searchResult.riskQueryRecord.modelObjects)">
							<p style="font-size: 14px;">{{item.riskModelObjectName+':'+item.params}}</p>
						</template>
				</div>
			</div>
			<div class="handle-title clearfix" style="margin-top: 15px; margin-bottom: 15px;" >
				<h2 class="f20 tl fl">查询结果：</h2>
			</div>
			<div class="ahps">
				<div class="ahps-margin">
					<div class="obj-tabs clearfix" v-if="resultModelType !== '1'">
						<div class="ahps-tabs obj-margin">
							<div class="risk-top">
								<p class="ahp-title tc pt25">评分</p>
							</div>
							<p class="ahp-body tc pt80"><span v-html="fit(searchResult.rstRiskQueryGradeList.ahpScore)"></span><span v-if="fitBool(searchResult.rstRiskQueryGradeList.ahpScore)"style="color: #333; font-size: 14px; font-weight: normal;">分</span></p>
						</div>
						<div class="ahps-tabs obj-margin">
							<div class="risk-top">
								<p class="ahp-title tc pt25">评分等级</p>
								<p class="tc obj-pt"><span v-html="searchResult.rstRiskQueryGradeList.gradeConditionName"></span></p>
							</div>
							<p class="ahp-body tc pt80" ><span v-html="fit(searchResult.rstRiskQueryGradeList.gradeName)"></span><span v-if="fitBool(searchResult.rstRiskQueryGradeList.gradeName)"style="color: #333; font-size: 14px; font-weight: normal;">级</span></p>
						</div>
						<div class="ahps-tabs obj-margin">
							<div class="risk-top">
								<p class="ahp-title tc pt25">风险等级</p>
								<p class="ahp-body tc pt80" v-html="fit(searchResult.rstRiskQueryGradeList.riskLevel)"></p>
							</div>
						</div>
						<div class="ahps-tabs obj-margin">
							<div class="risk-top">
								<p class="ahp-title tc pt25">风险定价</p>
								<p class="ahp-body tc pt80" ><span v-html="fit(searchResult.rstRiskQueryGradeList.riskPricePercent)"></span>
									<span v-if="fitBool(searchResult.rstRiskQueryGradeList.riskPricePercent)" style="color: #333; font-size: 14px; font-weight: normal;">%</span></p>
							</div>
						</div>
						<div class="ahps-tabs">
							<div class="risk-top">
								<p class="ahp-title tc pt25">风险额度</p>
								<p class="tc obj-pt">(风险折扣系数)</p>
							</div>
							<p class="ahp-body tc pt80" v-html="fit(searchResult.rstRiskQueryGradeList.riskDiscountRate)"></p>
						</div>
						<div v-for="item in riskPolicy" class="ahps-tabs" style="margin-top: 20px;">
							<div class="risk-top">
								<p class="ahp-title tc pt25">{{fit(item.name)}}</p>
								<p class="ahp-body tc pt80" ><span v-html="fit(item.result)"></span></p>
							</div>
						</div>
					</div>
					<div class="touch-rules">
						<h1 class="touch-title mb20">触碰规则：	</h1>
						<el-table :data="searchResult.rstRiskQueryRuleList" empty-text="未触碰规则" class="if-emptytable">
							<el-table-column
									prop="ruleGroupName"
									label="规则组">
							</el-table-column>
							<el-table-column
									prop="ruleName"
									label="规则">
							</el-table-column>
							<el-table-column
									prop="ruleDepict"
									label="描述">
							</el-table-column>
							<el-table-column
									prop="ruleConditionName"
									label="条件">
							</el-table-column>
							<el-table-column
									prop="controlLevel"
									label="控制力度">
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
		</div>
		</div>
		<!--切换模型弹层-->
		<el-dialog title="切换模型" size="tiny" :visible.sync="dialog.changeModel" class="derive-diaog">
			<el-form label-width="130px" @submit.native.prevent>
				<el-row>
					<el-col :span="24">
						<el-form-item label="模型类型：">
							<el-select v-model="modelType" @change="changeVariable">
								<el-option label="全部" value=""></el-option>
								<el-option label="反欺诈模型" value="1"></el-option>
								<el-option label="预授信模型" value="2"></el-option>
								<el-option label="授信模型" value="3"></el-option>
							</el-select>
							<!--<div v-show="errors.has('分组名称')" class="el-form-item__error">{{ errors.first('分组名称') }}</div>-->
						</el-form-item>
						<el-form-item label="模型名称：":class="{'is-error': errors.has('form-1.模型名称|select')}">
							<el-select data-vv-scope="form-1" v-model="convertModelId" data-vv-value-path="value" data-vv-name="模型名称|select" v-validate="rules.normRequire">
								<!--<el-option label="请选择" value=""></el-option>-->
								<el-option v-for="item in list" :label="item.modelNameSon" :value="item.id"></el-option>
							</el-select>
							<i class="c-red">*</i>
							<div v-show="errors.has('form-1.模型名称|select')" class="el-form-item__error">{{ errors.first('form-1.模型名称|select') }}</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.changeModel = false">取 消</el-button>
				<el-button type="primary" @click="confirmChangeModel">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import api from '../../api/api'
    import commonjs from '../../assets/js/common'
    export default {
        created () {
	        this.getObjList();
	        this.getModelList();
	        this.getModelDetail();
        },
        components: {

        },
        data () {
            return {
                riskPolicy:[],
                showpercent:true,
                cardType:'-',
                hasResult : false,
                resultModelType : '',
                modelParams:[],
                modelDetailObj:{
                    riskModelId:this.$route.params.id,
                    riskModelName:'',
                    riskModelType:"",
                    queryMethod:"P",
                    riskModelObjectDtoList:[

                    ]
                },
	            searchResult:{
                    riskQueryRecord:{
                        createdAt:'-',
                        modelType:'-',
                        modelName:'-',
	                    modelObjects:'-',

					},
		            rstRiskQueryGradeList:{
                        ahpScore:'-',
                        gradeConditionName:'-',
                        gradeName:'-',
                        riskLevel:'-',
                        riskPricePercent:'-',
                        riskDiscountRate:'-'
		            },
                    rstRiskQueryRuleList:[]

	            },
	            singleModel:{

	            },
                list:'',
                modelType:'',
	            convertModelId:'',
                modelId:this.$route.params.id,
	            modelArr:[],
                page : {
                    listUrl : '',
                    typeName : ''
                },
                rules : {
                    normName : 'required',
                    normWeight:'required',
                    normRequire : 'required',
                    normNameAndIdCard:'idCard|required'
                },
	            dialog:{
                  changeModel:false
	            },
                model:{
                    modelNameSon:'反欺诈模型'
                },
                form:{
                    type:'',
                    name:''
                },
                //页面信息
                page : {
                    name : "风控查询",
                    url : "/model-search",
                    type : ''
                },
            }
        },
        watch: {
            $route: {
                handler: function (val, oldVal) {
                    this.getObjList();
                },
                deep: true
            }
        },
        methods: {
            fit(val){
                return commonjs.utilsIsEffective(val)
            },
            fitBool(val){
                return commonjs.utilsIsEffectiveBool(val)
            },
            thisConvert(val){
                if (val == undefined || val == null || val== '' || val == 0) {
                    return "—";
                }
                return val;
            },
            //获取单个模型信息
            getModelDetail(){
                api.riskSearch.fetchModelDetail({subModelId:this.modelId}).then(result => {
                    this.singleModel = result.data.data;
                    this.modelDetailObj.riskModelName=this.singleModel.modelNameSon;
                    this.modelDetailObj.riskModelType=this.singleModel.subModelType;
                    this.model.modelNameSon=this.singleModel.modelNameSon;
                }).catch(result => {

                })
            },
            getModelDetailName(){
                api.riskSearch.fetchModelDetail({subModelId:this.convertModelId}).then(result => {
                    this.modelDetailObj.riskModelId=result.data.data.id;
                    this.modelDetailObj.riskModelName=result.data.data.modelNameSon;
                    this.modelDetailObj.riskModelType=result.data.data.subModelType;
                    this.model.modelNameSon=result.data.data.modelNameSon;
                }).catch(result => {

                })
            },
            //风控模型对象查询
            fetchModelDetails(){
                this.$validator.validateAll('form-2').then((valid) => {
                    console.log(this.$validator)
                    if(valid){
                        for(var i=0;i<this.modelDetailObj.riskModelObjectDtoList.length;i++){
                            this.modelDetailObj.riskModelObjectDtoList[i].params=this.modelParams[i]
                        }
                        api.riskSearch.fetchModelDetailList(this.modelDetailObj).then(result => {
                            this.hasResult = true;
                            this.resultModelType = result.data.data.riskQueryRecord.modelType;
                            this.cardType=result.data.data.scoreCardType;
                            let arObj={};
                            arObj=result.data.data.riskQueryRecord;
                            this.searchResult.riskQueryRecord=result.data.data.riskQueryRecord;
                            if(result.data.data.rstRiskQueryGradeList.length > 0 && result.data.data.rstRiskQueryGradeList[0]){
                                this.searchResult.rstRiskQueryGradeList=result.data.data.rstRiskQueryGradeList[0];

	                            if(result.data.data.rstRiskQueryGradeList[0].riskPricePercent && result.data.data.rstRiskQueryGradeList[0].riskPricePercent != undefined && result.data.data.rstRiskQueryGradeList[0].riskPricePercent != ''){
                                    this.searchResult.rstRiskQueryGradeList.riskPricePercent=parseFloat(result.data.data.rstRiskQueryGradeList[0].riskPricePercent*100).toFixed(2);
	                                this.showpercent=true;
	                              }else{
                                    this.searchResult.rstRiskQueryGradeList.riskPricePercent='—';
                                    this.showpercent=false;
	                            }
                            }
                            if(result.data.data.rstRiskQueryRuleList.length > 0){
                                this.searchResult.rstRiskQueryRuleList=result.data.data.rstRiskQueryRuleList;
                            }else {
                                this.searchResult.rstRiskQueryRuleList=[];
                            }
	                        if(result.data.data.rstRiskQueryGradeList[0].riskPolicy && result.data.data.rstRiskQueryGradeList[0].riskPolicy!=''){
                                var riskPolicy=result.data.data.rstRiskQueryGradeList[0].riskPolicy;
                                var arrriskPolicy=JSON.parse(riskPolicy)
                                this.riskPolicy=[];
		                        for(var i=0;i<arrriskPolicy.length;i++){
                                    var obj={}
                                    obj.name=arrriskPolicy[i].split(':')[0];
                                    obj.result=arrriskPolicy[i].split(':')[1];
                                    this.riskPolicy.push(obj);
		                        }
		                        console.log(this.riskPolicy)
	                        }
                        }).catch(result => {

                        })
                    }
                })

            },
	        //格式化对象列表
            formatObj(cellValue){
                var html='';
	            var objStr=JSON.parse(cellValue)
	            for(var i=0;i<objStr.length; i++){
                    html+=objStr[i].riskModelObjectName+':'+objStr[i].params+'<br>';
	            }
	            return html
            },
            //切换模型类型
            changeVariable(){
                this.convertModelId='';
                this.modelParams=[];
                this.list={};
				this.getModelList();
                this.getModelDetail();
            },
            //获取模型列表
            getModelList(){
                api.riskSearch.getAllModelListWithoutPagination({riskModelId:this.modelType}).then(result => {
                    this.list = result.data.data;
                }).catch(result => {

                })
            },
            //获取对象信息列表
            getObjList(){
                api.riskSearch.getObjList(this.$route.params.id).then(result => {
                    this.modelArr=result.data.data;
                    this.modelDetailObj.riskModelObjectDtoList=[];
                    for(var i= 0; i<this.modelArr.length;i++){
                        var gfObj={};
                        gfObj.riskModelObjectId=this.modelArr[i].id;
                        gfObj.riskModelId=this.modelArr[i].riskModelId;
                        gfObj.riskModelObjectType=this.modelArr[i].objectType;
                        gfObj.objectSubject=this.modelArr[i].objectSubject;
                        gfObj.riskModelObjectName=this.modelArr[i].objectName;
                        this.modelDetailObj.riskModelObjectDtoList.push(gfObj);
                    }

                }).catch(result => {

                })
            },
	        confirmChangeModel(){
                this.$validator.validateAll('form-1').then((valid) => {
                    if(valid){
                        //this.modelDetailObj.riskModelObjectDtoList=[]
	                    this.modelParams=[];
                        this.$route.params.id=this.convertModelId;
                        this.$router.push({ name: 'model-obj', params: { userId: this.convertModelId }})
                        this.getModelDetailName();
                        this.dialog.changeModel=false;
                        this.hasResult = false;
                        this.$validator.errors.clear('form-2');
                    }
                });
	        },
            //模型类型转换
//            convertMessage(row, column, cellValue){
//                var returnValue='';
//                switch(cellValue){
//                    case '1':
//                        returnValue='反欺诈模型';
//                        break;
//                    case '2':
//                        returnValue='预授信模型';
//                        break;
//                    case '3':
//                        returnValue='授信模型';
//                        break;
//
//                }
//                return returnValue;
//            },
            pageInfo(){
                this.page.url = this.$route.path;
            },
            exportResult(){
                window.location.href = api.riskSearch.exportRiskSearchResult(this.searchResult.riskQueryRecord.uuid)
            }

        }
    }
</script>
