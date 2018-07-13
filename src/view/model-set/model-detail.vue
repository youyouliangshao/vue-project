<!-- 模型详情页 -->
<template>
	<div class="detection-index" v-loading.fullscreen.lock="loading">
		<div class="breadcrumb">
			<el-breadcrumb>
				<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
				<el-breadcrumb-item class="history-nolink">
						<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					模型配置
				</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: page.listUrl}">{{page.typeName}}</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">{{model.modelNameSon}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="model-oper">
			<div class="model-edit">
				<el-button v-if="model.status === 'N'" type="primary" @click="dialog.modelEnabled = true">启用模型
				</el-button>
				<el-button v-if="model.status === 'Y'" type="primary" @click="dialog.modelDisabled = true">禁用模型
				</el-button>
				<el-button type="primary" v-show="showEdit" @click="editModel">修改模型信息</el-button>
				<el-button type="primary" v-show="showEdit" @click="modelObjSet">设置模型对象</el-button>
				<el-button type="danger" @click="dialog.modelDel = true">删除模型</el-button>
			</div>
		</div>
		<div class="model-tab-panel" :class="this.$route.name">
			<div class="panel-hd">
				<div class="model-item-bg"></div>
				<h2 class="page-tit">
					{{model.modelNameSon}}
					<span v-if="model.status === 'Y'"><i class="icon-enable"></i>启用中</span>
					<span v-else=""><i class="icon-disable"></i>禁用中</span>
				</h2>
				<P class="model-desc">模型描述：{{model.modelDesc || '暂无'}}</P>
				<div class="panel-arrow"></div>
			</div>
			<div class="panel-bd">
				<div class="">
					<div class="model-obj-item">
						<div class="analyze-icon"></div>
						<div class="obj-item-main">
							<p class="obj-item-tit">分析对象：</p>
							<p class="obj-item-name">{{analyzeObj.objectName}}</p>
						</div>
					</div>
				</div>
				<div class="link-obj-list">
					<div v-for="item in relevanceObjArr" class="model-obj-item">
						<div class="link-icon"></div>
						<div class="obj-item-main">
							<p class="obj-item-tit">关联对象：</p>
							<p class="obj-item-name">{{item.objectName}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="card-container">
				<div class="tab-card">
					<el-tabs v-model="activeTab" type="card" @tab-click="tabClick">
						<el-tab-pane name="graded-card" label="评分卡">
							<graded-card :model="model" :modelObjList="modelObjList"
							             :variableNameList="variableNameList"
							             v-on:infoUpdate="infoUpdate"></graded-card>
						</el-tab-pane>
						<el-tab-pane name="graded-grade" label="评分等级">
							<graded-grade :model="model" v-on:gradeUpdate="gradeUpdate"
							              v-on:infoUpdate="infoUpdate"></graded-grade>
						</el-tab-pane>
						<el-tab-pane name="risk-strategy" label="风险策略">
							<risk-strategy :model="model" :modelObjList="modelObjList" v-on:gradeUpdate="gradeUpdate"
							              v-on:infoUpdate="infoUpdate"></risk-strategy>
						</el-tab-pane>
						<el-tab-pane name="risk-rule" label="风险规则">
							<risk-rule :model="model" :modelObjList="modelObjList"
							           :variableNameList="variableNameList"></risk-rule>
						</el-tab-pane>
						<el-tab-pane name="risk-grade-strategy" label="风险等级策略">
							<risk-grade-strategy :model="model" :modelObjList="modelObjList" :grade="grade"
							                     v-on:changeTab="changeTab"></risk-grade-strategy>
						</el-tab-pane>
						<el-tab-pane name="risk-pricing-strategy" label="风险定价策略">
							<risk-pricing-strategy :model="model" v-on:infoUpdate="infoUpdate"></risk-pricing-strategy>
						</el-tab-pane>
						<el-tab-pane name="risk-limit-strategy" label="风险额度策略">
							<risk-limit-strategy :model="model" v-on:infoUpdate="infoUpdate"></risk-limit-strategy>
						</el-tab-pane>
					</el-tabs>
				</div>
			</div>
		</div>
		<!--启用模型弹层-->
		<el-dialog title="启用模型" size="tiny" :visible.sync="dialog.modelEnabled" class="mtt100">
			<p class="add-graded-tips">启用模型后将不能编辑模型内容</p>
			<p class="add-graded-message">确定启用当前模型?</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelEnabled = false">取 消</el-button>
				<el-button type="primary" @click="confirmEnable">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 禁用模型 -->
		<el-dialog title="禁用模型" size="tiny" :visible.sync="dialog.modelDisabled" class="mtt100">
			<p class="add-graded-message">确定禁用当前模型?</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelDisabled = false">取 消</el-button>
				<el-button type="primary" @click="confirmDisabled">确 定</el-button>
			</div>
		</el-dialog>
		<!--修改模型信息弹层-->
		<el-dialog @close="cancelEdit" class="mtt150" title="修改模型信息" size="tiny" :visible.sync="dialog.modelEdit" top="50%" @submit.native.prevent>
			<el-form :model="model" label-width="120px" @submit.native.prevent>
				<el-form-item label="模型名称" :class="{'is-error': errors.has('form-model.模型名称')}">
					<el-input data-vv-scope="form-model" v-validate="rules.modelName" data-vv-value-path="currentValue" data-vv-name="模型名称"
					          v-model="model.modelNameSon"></el-input>
					<div v-show="errors.has('form-model.模型名称')" class="el-form-item__error">{{ errors.first('form-model.模型名称') }}</div>
				</el-form-item>
				<el-form-item label="模型描述(选填)" :class="{'is-error': errors.has('form-model.模型描述')}">
					<el-input data-vv-scope="form-model"type="textarea" v-validate="rules.modelDesc" data-vv-value-path="currentValue"
					          data-vv-name="模型描述" v-model="model.modelDesc"></el-input>
					<div v-show="errors.has('form-model.模型描述')" class="el-form-item__error">{{ errors.first('form-model.模型描述') }}</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelEdit = false;">取 消</el-button>
				<el-button type="primary" @click="confirmEdit">确 定</el-button>
			</div>
		</el-dialog>
		<!--删除模型弹层-->
		<el-dialog title="删除模型" size="tiny" :visible.sync="dialog.modelDel" class="mtt100">
			<el-form :model="model" label-width="120px">
				<p class="add-graded-message">确定删除当前模型?</p>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelDel = false">取 消</el-button>
				<el-button type="primary" @click="confirmDelete">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 模型对象编辑 -->
		<el-dialog @close="cancelObjSet()" title="设置模型对象" custom-class="obj-dialog" :visible.sync="dialog.modelObjSet" class="model-set" size="tiny">
			<p class="set-cancel"> 分析对象：</p>
				<el-form :inline="true" class="set-form-labers" @submit.native.prevent>
						<el-form-item label="名称" :class="{'is-error': errors.has('form-obj.分析对象名称')}">
							<el-input data-vv-scope="form-obj" v-validate="rules.objName" v-model="analyzeObj.objectName"
							          data-vv-value-path="currentValue" data-vv-name="分析对象名称" style="width: 223px"></el-input>
							<div v-show="errors.has('form-obj.分析对象名称')" class="el-form-item__error">{{ errors.first('form-obj.分析对象名称')
								}}
							</div>
						</el-form-item>
						<el-form-item label="主题" :class="{'is-error': errors.has('form-obj.分析对象主题|select')}">
							<el-select data-vv-scope="form-obj" disabled v-validate="'required'" v-model="analyzeObj.SubjectAndCatogory"
							           data-vv-value-path="value" data-vv-name="分析对象主题|select" placeholder="请选择" style="width: 223px">
								<el-option
										v-for="item in variableTypeList"
										:label="item.subject"
										:value="JSON.stringify({subject:item.subject,categoryId:item.categoryId})">
								</el-option>
							</el-select>
							<div v-show="errors.has('form-obj.分析对象主题|select')" class="el-form-item__error">
								{{ errors.first('form-obj.分析对象主题|select') }}
							</div>
						</el-form-item>
					</el-form>
			<p class="set-cancel">
				关联对象：
				<span class="w295">
					<i @click="addObjItem" class="el-icon-plus"></i>
						添加关联对象
				</span>
			</p>
			<el-form :inline="true" class="set-form-labers" @submit.native.prevent>
						<template v-for="(objItem,index) in relevanceObjArr">
							<el-form-item label="名称" :class="{'is-error': errors.has('form-obj.关联对象名称'+(index + 1))}">
								<el-input data-vv-scope="form-obj" v-validate="rules.objName" v-model="objItem.objectName"
								          data-vv-value-path="currentValue" style="width: 223px"
								          :data-vv-name="'关联对象名称'+(index + 1)"></el-input>
								<div v-show="errors.has('form-obj.关联对象名称'+(index + 1))" class="el-form-item__error">
									{{ errors.first('form-obj.关联对象名称' + (index + 1)) }}
								</div>
							</el-form-item>
							<el-form-item label="主题" :class="{'is-error': errors.has('form-obj.关联对象主题'+(index + 1)+'|select')}">
								<el-select data-vv-scope="form-obj" :disabled="objItem.del !== true" v-model="objItem.SubjectAndCatogory"
								           placeholder="请选择" v-validate="'required'" data-vv-value-path="value"
								           :data-vv-name="'关联对象主题'+(index + 1)+'|select'" style="width: 223px">
									<el-option
											v-for="item in variableTypeList"
											:label="item.subject"
											:value="JSON.stringify({subject:item.subject,categoryId:item.categoryId})">
									</el-option>
								</el-select>
								<div v-show="errors.has('form-obj关联对象主题'+(index + 1)+'|select')" class="el-form-item__error">
									{{ errors.first('关联对象主题' + (index + 1) + '|select') }}
								</div>
							</el-form-item>
							<span v-if="objItem.del" class="rule-item-oper rule-span-lsiu">
                                <a href="javascript:;" @click="delObjItem(index)"><i class="el-icon-circle-cross"></i>删除</a>
                            </span>
						</template>
					</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelObjSet = false;">取 消</el-button>
				<el-button type="primary" @click="submitObjSet()" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import api from '../../api/api'
    import store from  '../../store/index'
    import gradedCard from "../../components/graded-card.vue";
    import gradedGrade from "../../components/graded-grade.vue";
    import riskRule from "../../components/risk-rule.vue";
    import riskStrategy from "../../components/risk-strategy.vue";
    import riskGradeStrategy from "../../components/risk-grade-strategy.vue";
    import riskPricingStrategy from "../../components/risk-pricing-strategy.vue";
    import riskLimitStrategy from "../../components/risk-limit-strategy.vue";
    export default {
        created() {
            this.getVariableTypeList();
            this.pageInfo();
            this.getVariableNameList();
            if (this.$route.hash) {
                this.activeTab = this.$route.hash.replace('#', '');
            }
        },
        data() {
            return {
                variableTypeList: [

                ],
                showEdit:store.state.ableOrNot,
                loading: true,
                grade: [],
                page: {
                    listUrl: '',
                    typeName: ''
                },
                // 校验规则
                rules: {
                    modelName: 'required|max:20',
                    modelDesc: 'max:50',
                    objName: 'required|max:20'
                },
                activeTab: 'graded-card',
//                模型信息
                model: {},
                // 对象主题
                objType: [
                    {
                        label: "个人",
                        value: "个人"
                    },
                    {
                        label: "公司",
                        value: "公司"
                    }
                ],
                modelObjList: [],
                variableNameList: [],
                analyzeObj : {
                    riskModelId: this.$route.query.id,
                    objectType : 'A',
                    objectName : '',
                    objectSubject:'',
                    titleId:'',
                    SubjectAndCatogory : '',
                },
                relevanceObjArr: [],
                dialog: {
                    modelEnabled: false,
                    modelDisabled: false,
                    modelEdit: false,
                    modelDel: false,
                    modelObjSet: false
                }
            }
        },
        components: {
            'graded-card': gradedCard,
            'graded-grade': gradedGrade,
            'risk-rule': riskRule,
            'risk-grade-strategy': riskGradeStrategy,
            'risk-pricing-strategy': riskPricingStrategy,
            'risk-limit-strategy': riskLimitStrategy,
            'risk-strategy':riskStrategy
        },
        watch: {
            '$route': 'pageInfo'
        },
        methods: {
            //  获取变量主题类型
            getVariableTypeList(){
                api.riskVariable.getVariableSubjectList({dataType:'B,C'}).then(result => {
                    this.variableTypeList = result.data.data;
                }).catch(result => {

                })
            },
            pageInfo(){
                this.loading = true;
                if (this.$route.name === 'antiFraudDetail') {
                    this.page.listUrl = '/anti-fraud';
                    this.page.typeName = '反欺诈模型'
                } else if (this.$route.name === 'preAntiFraudDetail') {
                    this.page.listUrl = '/pre-authorized';
                    this.page.typeName = '预授信模型'
                } else if (this.$route.name === 'authorizedDetail') {
                    this.page.listUrl = '/authorized';
                    this.page.typeName = '授信模型'
                }
                api.model.detail({subModelId: this.$route.query.id}).then(result => {
                    var status=(result.data.data.status)
	                 if(status == 'Y'){
                        store.commit("storeAbleState",false);
                        this.showEdit=false;
                    }else{
                        store.commit("storeAbleState",true);
                         this.showEdit=true;
                    }
                    this.model = result.data.data;

                    if(this.model.logicBaseScore == undefined || this.model.logicBaseScore == ''){
                        this.model.logicBaseScore =0
                    }
                    this.loading = false
                }).catch(result => {
                    this.loading = false
                });
                api.model.modelObjList(this.$route.query.id).then(result => {
                    this.modelObjList = result.data.data;
                    this.relevanceObjArr = [];
                    result.data.data.forEach((value, index, array) => {
                        if(value.objectType === "A"){
                            var obj={subject:value.objectSubject,categoryId:value.titleId};
                            this.analyzeObj.objectName= value.objectName;
                            this.analyzeObj.objectSubject= value.objectSubject;
                            this.analyzeObj.titleId= value.titleId;
                            this.analyzeObj.id= value.id;
                            this.analyzeObj.version=value.version;
                            this.analyzeObj.SubjectAndCatogory=JSON.stringify(obj)

                        }else {
                            //回显用objRet
                            var objRet=JSON.stringify({subject:value.objectSubject,categoryId:value.titleId});
                            var obj={
                                riskModelId: this.$route.query.id,
                                objectType : 'B',
                                objectName : value.objectName,
                                SubjectAndCatogory : objRet,
                                objectSubject : value.objectSubject,
                                titleId:value.titleId,
                                id:value.id,
                                version:value.version
                                //del : true
                            }
                            this.relevanceObjArr.push(obj);
                        }
                    })
                }).catch(result => {

                });
            },
            infoUpdate(data){
                if (data === 'model') {
                    this.pageInfo();
                }
            },
            // 通过参数类型获取参数名列表
            getVariableNameList(){
//                api.model.variableNameList({name:type}).then(result => {
                api.model.getRiskVariableList({dataTypes: 'A,D'}).then(result => {
                    this.variableNameList = result.data.data
                })
            },
            gradeUpdate(data){
                this.grade = data;
            },
            changeTab(data){
                this.activeTab = data;
            },
            tabClick(tab, event){
//                location.hash = tab.name;
                this.$router.replace({query: this.$route.query, hash: tab.name})
            },
            //修改模型弹层
            editModel(){
                this.$validator.errors.clear();
                this.dialog.modelEdit = true;
            },
            cancelEdit(){
                this.pageInfo();
            },
            //确认启用模型
            confirmEnable(){
                api.model.enabled({id: this.model.id, status: "Y"}).then(result => {
                    if (result.data.success === true) {
                        this.$message(result.data.message);
                        this.pageInfo();
                        this.dialog.modelEnabled = false;
                        store.commit("storeAbleState",false);
                        this.modelState=false;
                    }
                })
            },
            // 确认禁用模型
            confirmDisabled(){
                api.model.disabled({id: this.model.id, status: "N"}).then(result => {
                    if (result.data.success === true) {
                        this.$message(result.data.message);
                        this.pageInfo();
                        this.dialog.modelDisabled = false;
                        store.commit("storeAbleState",true);
                        this.modelState=true;
                    }
                })
            },
            //确认编辑模型
            confirmEdit(){
                this.$validator.validateAll('form-model').then((valid) => {
                    if (valid === true) {
                        api.model.edit({
                            id: this.model.id,
                            modelNameSon: this.model.modelNameSon,
                            modelDesc: this.model.modelDesc
                        }).then(result => {
                            if (result.data.success === true) {
                                this.pageInfo();
                                this.dialog.modelEdit = false
                            }
                        }).catch(result => {
                        })
                    }
                })
            },
            //确认删除模型
            confirmDelete(){
                api.model.del(this.model.id).then(result => {
                    if (result.data.success === true) {
                        this.dialog.modelDel = false;
                        this.$router.push({path: this.page.listUrl})
                    }
                }).catch(result => {
                })
            },
            /**
             *  模型对象修改
             */
            //修改模型对象
            modelObjSet(){
                this.$validator.errors.clear();
                this.dialog.modelObjSet = true;
            },
            cancelObjSet(){
                this.pageInfo();
            },
            // 添加对象数组
            addObjItem(){
                this.relevanceObjArr.push({
                    riskModelId: this.$route.query.id,
                    objectType : 'B',
                    objectName : '',
                    SubjectAndCatogory : '',
                    objectSubject : '',
                    titleId:'',
                    del : true
                })
            },
            // 删除对象数组
            delObjItem(index){
                this.relevanceObjArr.splice(index, 1);
            },
            // 确认修改对象数组
            submitObjSet(){
                this.$validator.validateAll('form-obj').then(valid => {
                    if (valid) {
                        let data = [];
                        var tempObj=this.analyzeObj;
                        tempObj.objectSubject=JSON.parse(tempObj.SubjectAndCatogory).subject;
                        tempObj.titleId=JSON.parse(tempObj.SubjectAndCatogory).categoryId;
                        //delete tempObj.SubjectAndCatogory
                        data.push(tempObj);
                        for(var i=0;i<this.relevanceObjArr.length;i++){
                            var obj=this.relevanceObjArr[i];
                            obj.objectSubject=JSON.parse(obj.SubjectAndCatogory).subject;
                            obj.titleId=JSON.parse(obj.SubjectAndCatogory).categoryId;
                            //delete obj.SubjectAndCatogory
                            data.push(obj)
                        }
                        api.model.editModelObj(data).then(result => {
                            if(result.data.success === true){
                                this.$message(result.data.message);
                                this.dialog.modelObjSet = false;
                                this.pageInfo();
                            }
                        }).catch(result => {
                            this.$message.error(result.data.message);
                        })
                     /*   let data = [];
                        data.push(this.analyzeObj);
                        data = data.concat(this.relevanceObjArr);
                        api.model.editModelObj(data).then(result => {
                            if (result.data.success === true) {
                                this.$message(result.data.message);
                                this.dialog.modelObjSet = false;
                                this.pageInfo();
                            }
                        }).catch(result => {
                            this.$message.error(result.data.message);
                        })*/
                    }
                })
            }
        }
    }
</script>
<style></style>