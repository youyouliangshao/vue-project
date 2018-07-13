<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					模型配置</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: page.listUrl }">{{page.typeName}}</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">{{model.modelNameSon}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="model-oper">
			<div class="model-edit">
				<el-button v-if="model.status === 'N'" type="primary" @click="dialog.modelEnabled = true">启用模型</el-button>
				<el-button v-if="model.status === 'Y'" type="primary" @click="dialog.modelDisabled = true">禁用模型</el-button>
				<el-button v-show="showEdit" type="primary" @click="editModel">修改模型信息</el-button>
				<el-button v-show="showEdit" type="primary" @click="modelObjSet">设置模型对象</el-button>
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
		</div>
		<div class="tab-card tab-card-only">
			<el-tabs type="border-card" class="onlyone-tab">
				<el-tab-pane label="风险规则">
					<div class="graded-inner-hd">
						<el-button class="export-btn" @click="exportRule">导出规则文档</el-button>
					</div>
					<div class="bbb graded-inner-bd">
						<div class="left-risk-rule delect-border faud-left">
							<p class="rule-head table-title">规则组<i v-show="showEdit" @click="addRule" class="el-icon-plus"></i></p>
							<el-table
									class="dimension-info-table "
									v-loading="loading.group"
									:data="ruleGroups"
									highlight-current-row
									@row-click="viewRuleLists"
									:stripe="true"
									style="width: 100%"
                                    height="220"
							>
								<el-table-column
										label="名称"
										prop="ruleGroupName"
										width="245"
								>
								</el-table-column>
								<el-table-column
										label="操作"

								>
									<template scope="scope">
										<div class="group-bbtn" v-show="showEdit">
											<el-button @click="editRuleGroup(scope.$index)" class="group-btn" type="text" size="mini">编辑</el-button>
											<el-button @click="delRuleGroup(scope.row.id)" class="group-btn model-color" type="text" size="mini">删除</el-button>
											<div class="graded-arrow">
												<i class="el-icon-arrow-right"></i>
											</div>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="right-risk-rule faud-right">
							<div class="table-title table-w-only"><span class="ml10">规则 </span><span v-show="showEdit"><i v-show="this.viewRuleGroupId" @click="openRuleSet()" class="el-icon-plus"></i></span></div>
							<el-table v-loading="loading.rule" :data="tableData" style="" height="220" :stripe="true">
								<el-table-column
										prop="ruleCode"
										label="规则码"
										width="100">
								</el-table-column>
								<el-table-column
										prop="ruleName"
										label="规则名称"
										width="245">
								</el-table-column>
								<el-table-column
										prop="ruleContent"
										label="规则描述"
										width="200">
									<template scope="scope">
										<el-popover trigger="hover" placement="top" v-if="scope.row.ruleContent!=''">
											<p>{{ scope.row.ruleContent }}</p>
											<div slot="reference">
												<el-span class="references">{{ scope.row.ruleContent }}</el-span>
											</div>
										</el-popover>
										<span v-else>
											{{ scope.row.ruleContent }}
										</span>
									</template>
								</el-table-column>
								<el-table-column
										prop="controlLevel"
										label="控制力度"
										width="100">
								</el-table-column>
								<el-table-column
										prop="ruleState"
										label="状态"
										width="100">
									<template scope="scope">
										<template v-if="scope.row.ruleStatus === 'ENABLED'">
											<span class="status-point enabled"></span>启用
										</template>
										<template v-else="">
											<span class="status-point disabled"></span>禁用
										</template>
									</template>
								</el-table-column>
								<el-table-column
										prop="ruleConditionName"
										label="条件"
										width="200"
								>
									<template scope="scope">
										<el-popover trigger="hover" placement="top" v-if="scope.row.ruleConditionName!=''">
											<p>{{ scope.row.ruleConditionName }}</p>
											<div slot="reference">
												<el-span class="references">{{ scope.row.ruleConditionName }}</el-span>
											</div>
										</el-popover>
										<span v-else>
											{{ scope.row.ruleConditionName }}
										</span>
									</template>
								</el-table-column>
								<el-table-column
										prop="ruleState"
										label=""
										align="right"
										width="120">
									<template scope="scope">
										<div v-show="showEdit">
											<el-button type="text" size="small" @click="openRuleSet(scope.$index,scope.row.subModelId)">编辑</el-button>
											<el-button type="text" size="small" @click="delRule(scope.row.id)" class="model-color">删除</el-button>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!--启用模型弹层-->
		<el-dialog title="启用模型" size="tiny" :visible.sync="dialog.modelEnabled" class="mtt100">
			<p class="add-graded-tips">启用模型后将不能编辑模型内容</p>
			<p class="add-graded-message">确定启用当前模型?</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelEnabled = false">取 消</el-button>
				<el-button type="primary" @click="confirmEnable" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 禁用模型 -->
		<el-dialog title="禁用模型" size="tiny" :visible.sync="dialog.modelDisabled" class="mtt100">
			<p class="add-graded-message">确定禁用当前模型?</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelDisabled = false">取 消</el-button>
				<el-button type="primary" @click="confirmDisabled" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!--修改模型信息弹层-->
		<el-dialog @close="cancelEdit" title="修改模型信息" size="tiny" :visible.sync="dialog.modelEdit" top="50%" class="mtt150">
			<el-form :model="model" label-width="120px" @submit.native.prevent>
				<el-form-item label="模型名称" :class="{'is-error': errors.has('模型名称')}">
					<el-input v-validate="rules.modelName" data-vv-value-path="currentValue" data-vv-name="模型名称" v-model="model.modelNameSon"></el-input>
					<div v-show="errors.has('模型名称')" class="el-form-item__error">{{ errors.first('模型名称') }}</div>
				</el-form-item>
				<el-form-item label="模型描述(选填)" :class="{'is-error': errors.has('模型描述')}">
					<el-input type="textarea" v-validate="rules.modelDesc" data-vv-value-path="currentValue" data-vv-name="模型描述" v-model="model.modelDesc"></el-input>
					<div v-show="errors.has('模型描述')" class="el-form-item__error">{{ errors.first('模型描述') }}</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelEdit = false;">取 消</el-button>
				<el-button type="primary" @click="confirmEdit" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!--删除模型弹层-->
		<el-dialog title="删除模型" size="tiny" :visible.sync="dialog.modelDel" class="mtt100">
			<p class="add-graded-message">确定删除当前模型?</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.modelDel = false">取 消</el-button>
				<el-button type="primary" @click="confirmDelete" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!--新建规则组-->
		<el-dialog @close="cancelRuleGroup" :title="dialog.ruleGroupTitle" size="tiny" :visible.sync="dialog.addRuleGroup" class="mtt100">
			<el-form :model="model" label-width="120px" @submit.native.prevent>
				<el-form-item label="规则组名称" :class="{'is-error': errors.has('form-1.规则组名称')}">
					<el-input data-vv-scope="form-1" v-validate="rules.modelName" data-vv-value-path="currentValue" data-vv-name="规则组名称" v-model="ruleGroup.ruleGroupName"></el-input>
					<div v-show="errors.has('form-1.规则组名称')" class="el-form-item__error">{{ errors.first('form-1.规则组名称') }}</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.addRuleGroup = false;">取 消</el-button>
				<el-button type="primary" @click="confirmAddRule" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 删除规则组 -->
		<el-dialog title="删除规则组" size="tiny" :visible.sync="dialog.delRuleGroup" class="mtt100">
			<p class="dialog-message">确定删除当前规则组？</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.delRuleGroup = false">取 消</el-button>
				<el-button type="primary" @click="confirmDeleteRuleGroup" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!--删除规则弹层-->
		<el-dialog title="删除规则" size="tiny" :visible.sync="dialog.delRule" class="mtt100">
			<p class="dialog-message">确定删除当前规则？</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.delRule = false">取 消</el-button>
				<el-button type="primary" @click="confirmDeleteRule" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 条件编辑 -->
		<el-dialog @close="cancelRule" :title="dialog.ruleGroupTitles" size="" custom-class="rule-dialog" :visible.sync="ruleDialog">
			<el-form :inline="true" label-width="80px" @submit.native.prevent>
				<el-form-item label="规则名称" :class="{'is-error': errors.has('form-2.规则名称')}">
					<el-input data-vv-scope="form-2" v-model="ruleItem.ruleName" v-validate="rules.modelName" data-vv-value-path="currentValue" data-vv-name="规则名称" placeholder="规则名称"></el-input>
					<div v-show="errors.has('form-2.规则名称')" class="el-form-item__error">{{ errors.first('form-2.规则名称') }}</div>
				</el-form-item>
				<el-form-item label="规则状态">
					<el-radio-group data-vv-scope="form-2" v-model="ruleItem.ruleStatus" v-validate="'required'" data-vv-value-path="value" data-vv-name="规则状态|select">
						<el-radio :label="'ENABLED'">启用</el-radio>
						<el-radio :label="'DISABLED'">禁用</el-radio>
					</el-radio-group>
					<div v-show="errors.has('form-2.规则状态|select')" class="el-form-item__error">{{ errors.first('form-2.规则状态|select') }}</div>
				</el-form-item>
			</el-form>
			<el-form label-width="80px" @submit.native.prevent>
				<el-form-item label="规则描述" :class="{'is-error': errors.has('form-2.规则描述')}">
					<el-input data-vv-scope="form-2" v-model="ruleItem.ruleContent" v-validate="'max:50'" data-vv-value-path="currentValue" data-vv-name="规则描述" type="textarea"></el-input>
					<div v-show="errors.has('form-2.规则描述')" class="el-form-item__error">{{ errors.first('form-2.规则描述') }}</div>
				</el-form-item>
				<el-form-item label="控制力度" :class="{'is-error': errors.has('form-2.控制力度|select')}">
					<el-select data-vv-scope="form-2" v-model="ruleItem.controlLevel" v-validate="'required'" data-vv-value-path="currentValue" data-vv-name="控制力度|select" placeholder="">
						<el-option label="禁止性" value="禁止性"></el-option>
						<el-option label="限制性" value="限制性"></el-option>
						<el-option label="风险提示性" value="风险提示性"></el-option>
					</el-select>
					<div v-show="errors.has('form-2.控制力度|select')" class="el-form-item__error">{{ errors.first('form-2.控制力度|select') }}</div>
				</el-form-item>
			</el-form>
			<p class="rule-set-title">条件设置</p>
			<div class="">
				<template v-for="(ruleItems,index) in ruleArr">
					<el-form :inline="true" @submit.native.prevent>
						<el-row>
							<el-col :span="3"><el-form-item>
								<!-- index 0 -->
								<el-select v-model="ruleArr[index][0]" placeholder="">
									<el-option v-for="item in bracketsOption" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item></el-col>
							<el-col :span="4"><el-form-item>
								<!-- index 1 -->
								<el-select @change="getVariableNameList(index)" v-model="ruleArr[index][1]" placeholder="模型对象">
									<el-option v-for="item in modelObjList" :label="item.objectName" :value="item.id"></el-option>
								</el-select>
							</el-form-item></el-col>
							<el-col :span="4"><el-form-item>
								<!-- index 2-->
								<el-select @change="variableNameChange(index)" v-model="ruleArr[index][2]" placeholder="选择变量">
									<!--<el-option value="" label="请选择"></el-option>-->
									<el-option v-for="item in variableNameList[index]" :label="item.chineseName" :value="JSON.stringify({type:item.type,chineseName:item.chineseName,name:item.name,controlType:item.controlType})"></el-option>
								</el-select>
							</el-form-item></el-col>
							<el-col :span="3"><el-form-item>
								<el-select v-model="ruleArr[index][3]" placeholder="请选择">
									<!--<el-option value="" label="请选择"></el-option>-->
									<el-option v-for="item in conditionOption" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item></el-col>
							<el-col :span="3">
								<el-form-item>
									<el-select  @change="dataTypeChange(index)" v-model="ruleArr[index][4]" placeholder="常量">
										<!--<el-option value="" label="请选择"></el-option>-->
										<el-option v-for="item in dataTypeOption" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<template v-if="ruleArr[index][4] === '常量'">
								<el-col :span="4"><el-form-item>
									<el-select v-if="variableValueList[index] !=''" v-model="ruleArr[index][5]" placeholder="常量">
										<!--<el-option value="" label="请选择"></el-option>-->
										<el-option v-for="item in variableValueList[index]" :label="item" :value="item"></el-option>
									</el-select>
									<el-input v-else="" v-model="ruleArr[index][5]" placeholder="常量"></el-input>
								</el-form-item></el-col>
							</template>
							<template v-else-if="ruleArr[index][4] === '变量'">
								<el-col :span="4"><el-form-item>
									<el-select @change="variableTypeChange(index,5)" v-model="ruleArr[index][5]" placeholder="模型对象">
										<el-option v-for="item in modelObjList" :label="item.objectName" :value="item.id"></el-option>
									</el-select>
								</el-form-item></el-col>
								<el-col :span="4"><el-form-item>
									<el-select @change="variableNameChange(index)" v-model="ruleArr[index][6]" placeholder="选择变量">
										<!--<el-option value="" label="请选择"></el-option>-->
										<el-option v-for="item in variableNameListV[index]" :label="item.chineseName" :value="JSON.stringify({type:item.type,chineseName:item.chineseName,name:item.name,controlType:item.controlType})"></el-option>
									</el-select>
								</el-form-item></el-col>
							</template>
							<el-col :span="3"><el-form-item>
								<el-select v-model="ruleArr[index][7]" placeholder="">
									<!--<el-option value="" label="请选择"></el-option>-->
									<el-option v-for="item in bracketsOption" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item></el-col>
							<el-col :span="2"><div class="rule-item-oper">
								<a href="javascript:;" @click="addRuleArr(index)"><i class="el-icon-plus"></i></a>
								<a href="javascript:;" @click="delRuleArr(index)"><i class="el-icon-close"></i></a>
							</div></el-col>
						</el-row>
					</el-form>
					<el-form v-if="(index+1) !== ruleArr.length" :inline="true">
						<el-row>
							<el-col :span="3"><el-form-item>
								<el-select v-model="ruleArr[index][8]" placeholder="关系">
									<el-option v-for="item in logicalOption" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item></el-col>
						</el-row>
					</el-form>
				</template>
			</div>
			<div class="" v-html="ruleHtml"></div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="ruleDialog = false;">取 消</el-button>
				<el-button type="primary" @click="submitRule()" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
        <!-- 模型对象编辑 -->
        <el-dialog @close="cancelObjSet()" title="设置模型对象" custom-class="obj-dialog" :visible.sync="dialog.modelObjSet" size="tiny">
			<p class="set-cancel"> 分析对象：</p>
			<el-form :inline="true" class="set-form-labers" @submit.native.prevent>
				<el-form-item label="名称" :class="{'is-error': errors.has('分析对象名称')}">
					<el-input v-validate="rules.objName" v-model="analyzeObj.objectName" data-vv-value-path="currentValue" data-vv-name="分析对象名称" style="width: 223px"></el-input>
					<div v-show="errors.has('分析对象名称')" class="el-form-item__error">{{ errors.first('分析对象名称') }}</div>
				</el-form-item>
				<el-form-item label="主题" :class="{'is-error': errors.has('分析对象主题|select')}">
					<el-select disabled v-validate="'required'" v-model="analyzeObj.SubjectAndCatogory" data-vv-value-path="value" data-vv-name="分析对象主题|select" placeholder="请选择" style="width: 223px">
						<el-option
								v-for="item in variableTypeListBC"
								:label="item.subject"
								:value="JSON.stringify({subject:item.subject,categoryId:item.categoryId})">
						</el-option>
					</el-select>
					<div v-show="errors.has('分析对象主题|select')" class="el-form-item__error">{{ errors.first('分析对象主题') }}</div>
				</el-form-item>
			</el-form>
           	<p class="set-cancel">
				关联对象：
				<span class="w295">
					<i @click="addObjItem" class="el-icon-plus"></i>
						添加关联对象
				</span>
			</p>
				<el-form :inline="true"  class="set-form-labers">
                        <template v-for="(objItem,index) in relevanceObjArr">
                            <el-form-item label="名称" :class="{'is-error': errors.has('关联对象名称'+(index + 1))}">
                                <el-input v-validate="rules.objName" v-model="objItem.objectName" data-vv-value-path="currentValue" :data-vv-name="'关联对象名称'+(index + 1)" style="width: 223px"></el-input>
                                <div v-show="errors.has('关联对象名称'+(index + 1))" class="el-form-item__error">{{ errors.first('关联对象名称'+(index + 1)) }}</div>
                            </el-form-item>
                            <el-form-item label="主题" :class="{'is-error': errors.has('关联对象主题'+(index + 1) +'|select')}">
                                <el-select :disabled="objItem.del !== true" v-model="objItem.SubjectAndCatogory" placeholder="请选择" v-validate="'required'" data-vv-value-path="value" :data-vv-name="'关联对象主题'+(index + 1) +'|select'" style="width: 223px">
	                                <el-option
			                                v-for="item in variableTypeListBC"
			                                :label="item.subject"
			                                :value="JSON.stringify({subject:item.subject,categoryId:item.categoryId})">
	                                </el-option>
                                </el-select>
                                <div v-show="errors.has('关联对象主题'+(index + 1) +'|select')" class="el-form-item__error">{{ errors.first('关联对象主题'+(index + 1) +'|select') }}</div>
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
    export default {
        created () {
            this.getVariableTypeListBC();
            this.pageInfo();
            //this.getVariableNameList();
            this.getRuleGroupList();
        },
        data () {
            return {
                variableTypeListBC: [

                ],
                showEdit:store.state.ableOrNot,
                // 校验规则
                rules: {
                    modelName: 'required|max:20',
                    modelDesc: 'max:50',
                    objName : 'required|max:20'
                },
                page : {
                    listUrl : '',
                    typeName : ''
				},
				dialog : {
                    modelEnabled : false,
					modelDisabled : false,
					modelEdit : false,
					modelDel : false,
                    addRuleGroup : false,
					ruleGroupTitle : '',
                    ruleGroupTitles : '',
                    delRuleGroup : false,
                    delRule:false,
                    modelObjSet: false
				},
				loading : {
                    btn : false,
                    group : false,
					rule : false
				},
//				模型信息
                model: {},
                modelObjList : [],
//				规则组
	            ruleGroups:[],
//				待删除规则组ID
                delRuleGroupId : null,
                delRuleItemId : null,
				// 编辑规则组
				ruleGroup: {
                    id: undefined,
                    modelId: undefined,
                    subModelId: undefined,
                    ruleGroupName: ''
				},
                viewRuleGroupId : null,
                viewId:'',
//				条件列表
                tableData: [],
//				风控条件
				ruleItem: {
                    ruleName : '',
                    ruleStatus : 'DISABLED',
                    controlLevel : '禁止性',
                    ruleContent : '',
                    ruleCondition : '',
                    ruleConditionName : ''
				},
                // 对象主题
                objType : [
                    {
                        label : "个人",
                        value : "个人"
                    },
                    {
                        label : "公司",
                        value : "公司"
                    }
                ],
/*                analyzeObj : {
                    riskModelId: this.$route.query.id,
                    objectType : 'A',
                    objectName : '',
                    objectSubject : ''
                },*/
                analyzeObj : {
                    riskModelId: this.$route.query.id,
                    objectType : 'A',
                    objectName : '',
                    objectSubject:'',
                    titleId:'',
                    SubjectAndCatogory : '',
                },
                relevanceObjArr : [],
				// 风控条件设置数据
                // 规则弹层切换用
                ruleDialog: false,
                variableTypeInt: false,
                variableNameInt: false,
				dataTypeInt: false,
                // 规则拆分数组
                ruleArr: [
                    [
                        '','','','','','','','',''
                    ]
                ],
                // 规则字符串
                reportRule: '',
                // 保存用预览
                ruleView: '',
                // 带样式的预览
                ruleHtml: '',
                // 括号选项
                bracketsOption : [
                    {
                        label: '无',
                        value: ''
                    },
                    {
                        label: '(',
                        value: '('
                    },
                    {
                        label: ')',
                        value: ')'
                    }
                ],
				// 常量变量
                dataTypeOption: [
                    {
                        label: '常量',
                        value: '常量'
                    },
                    {
                        label: '变量',
                        value: '变量'
                    },
				],
                // 规则类型选项数组
                variableTypeList: [

                ],
                variableNameList: [
                    [],[],[],[],[],[],[],[],[],[]
                ],
                //变量 规则名选项数组
                variableNameListV:[
                    [],[],[],[],[],[],[],[],[],[]
                ],
                variableValueList: [

                ],
                // 条件选项
                conditionOption : [
                    {
                        label: '==',
                        value: '=='
                    },{
                        label: '!=',
                        value: '!='
                    },{
                        label: '<',
                        value: '<'
                    },{
                        label: '>',
                        value: '>'
                    },{
                        label: '<=',
                        value: '<='
                    },{
                        label: '>=',
                        value: '>='
                    }
                ],
                // 逻辑选项
                logicalOption : [
                    {
                        label: 'AND',
                        value: 'AND'
                    },{
                        label: 'OR',
                        value: 'OR'
                    }
                ]
            }
        },
        components : {},
        watch : {
            ruleArr : {
                handler: function (val, oldVal) {
                    this.ruleTxt();
                    for (let i = 0; i< val.length; i++){
                        if(oldVal[i]){
                            if(val[i][2] &&(val[i][2] !== oldVal[i][2])){
                                this.getVariableValueList(JSON.parse(val[i][2]).name,i);
                            }
                        }else {
                            if(val[i][2]){
                                this.getVariableValueList(JSON.parse(val[i][2]).name,i);
                            }
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            //  获取变量主题类型
            getVariableTypeListBC(){
                api.riskVariable.getVariableSubjectList({dataType:'B,C'}).then(result => {
                    this.variableTypeListBC = result.data.data;
                }).catch(result => {

                })
            },
            pageInfo(){
                if(this.$route.name === 'antiFraudDetail'){
					this.page.listUrl = '/anti-fraud';
					this.page.typeName = '反欺诈模型'
                }
				api.model.detail({subModelId:this.$route.query.id}).then(result => {
                    var status=(result.data.data.status)
                    if(status == 'Y'){
                        store.commit("storeAbleState",false);
                        this.showEdit=false;
                    }else{
                        store.commit("storeAbleState",true);
                        this.showEdit=true;
                    }
				    this.model = result.data.data;
				}).catch(result => {

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
                          /*  riskModelId: this.$route.query.id,
                                objectType : 'B',
                                objectName : '',
                                SubjectAndCatogory : '',
                                objectSubject : '',
                                titleId:'',
                                del : true*/
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
            exportRule(){
				window.location.href = api.model.exportRule(this.model.id)
			},
//			获取规则组列表
            getRuleGroupList(){
                this.loading.group = true;
				api.model.ruleGroupList(this.$route.query.id).then(result => {
				    this.ruleGroups = result.data.data;
                    this.loading.group = false
				}).catch(result => {
                    this.loading.group = false
				})
			},
	        //修改模型弹层
            editModel(){
                this.$validator.errors.clear();
                this.dialog.modelEdit = true;
            },
            cancelEdit(){
                this.pageInfo();
			},
			// 删除规则
            delRule(id){
                this.delRuleItemId = id;
                this.dialog.delRule = true;
			},
	        //添加规则组
            addRule(){
                this.ruleGroup = {
                    id: undefined,
                    modelId: undefined,
                    subModelId: undefined,
                    ruleGroupName: ''
                };
                this.$validator.errors.clear();
                this.dialog.ruleGroupTitle = '新建规则组';
                this.dialog.addRuleGroup = true;
            },
            cancelRuleGroup(){
                this.getRuleGroupList();
                this.viewRuleGroupId=false;
                this.tableData = [];

			},
//			编辑规则组
            editRuleGroup(index){
				this.ruleGroup = this.ruleGroups[index];
                this.$validator.errors.clear();
                this.dialog.ruleGroupTitle = '编辑规则组';
                this.dialog.addRuleGroup = true;
			},
//			删除规则组弹层
            delRuleGroup(ruleGroupId){
                this.delRuleGroupId = ruleGroupId;
                this.dialog.delRuleGroup = true;
			},
//			确认删除规则组
            confirmDeleteRuleGroup(){
				api.model.delRuleGroup(this.delRuleGroupId).then(result => {
				    this.getRuleGroupList();
				    this.$message(result.data.message);
				    this.dialog.delRuleGroup = false;
                    if(this.delRuleGroupId === this.viewRuleGroupId){
                        this.viewRuleGroupId = null;

                    }
                    this.tableData = [];
				})
			},
			//点击切换
            viewRuleLists(row){
                this.viewRuleList(row.id)
			},
	        //查看规则列表
	        viewRuleList(ruleGroupId){
                this.loading.rule = true;
                api.model.ruleItemList(ruleGroupId).then(result => {
                    this.tableData = result.data.data;
                    this.viewRuleGroupId = ruleGroupId;
                    this.loading.rule = false;
				}).catch(result => {
                    this.loading.rule = false;
				});

	        },
	        //确认启用模型按钮
            confirmEnable(){
	            this.loading.btn = true;
				api.model.enabled({id:this.model.id,status:"Y"}).then(result => {
				    if(result.data.success === true){
                        this.$message(result.data.message);
				        this.pageInfo();
				        this.dialog.modelEnabled = false;
                        store.commit("storeAbleState",false);
                        this.showEdit=false;
					}
                    this.loading.btn = false;
				}).catch(result => {
                    this.loading.btn = false;
				})
            },
			// 确认禁用模型按钮
            confirmDisabled(){
                this.loading.btn = true;
                api.model.disabled({id:this.model.id,status:"N"}).then(result => {
					if(result.data.success === true){
                        this.$message(result.data.message);
						this.pageInfo();
						this.dialog.modelDisabled = false;
                        store.commit("storeAbleState",true);
                        this.showEdit=true;
					}
                    this.loading.btn = false;
				}).catch(result => {
                    this.loading.btn = false;
				})
			},
            //确认编辑模型
            confirmEdit(){
                this.$validator.validateAll().then((valid) => {
                    if(valid === true){
                        this.loading.btn = true;
                        api.model.edit({
							id:this.model.id,
							modelNameSon:this.model.modelNameSon,
                            modelDesc:this.model.modelDesc
                        }).then(result => {
                            if(result.data.success === true){
                                this.pageInfo();
                                this.dialog.modelEdit = false
							}
                            this.loading.btn = false;
						}).catch(result =>{
                            this.loading.btn = false;
						})
                    }
                })
            },
            //确认删除模型
            confirmDelete(){
                this.loading.btn = true;
				api.model.del(this.model.id).then(result => {
				    if(result.data.success === true){
				        this.dialog.modelDel = false;
                        this.$router.push({ path: this.page.listUrl })
					}
                    this.loading.btn = false;
				}).catch(result => {
                    this.loading.btn = false;
				})
            },
			// 确认删除规则
            confirmDeleteRule(){
                this.loading.btn = true;
                api.model.delRuleItem(this.delRuleItemId).then(result => {
                    this.$message(result.data.message);
                    this.viewRuleList(this.viewRuleGroupId);
                    this.loading.btn = false;
                    this.dialog.delRule = false;
                }).catch(result =>{
                    this.loading.btn = false;
				});
			},
	        //确认添加规则组
            confirmAddRule(){
                this.$validator.validateAll('form-1').then((valid) => {
                    if(valid === true){
                        this.loading.btn = true;
                        this.ruleGroup.modelId = this.model.riskModelId;
                        this.ruleGroup.subModelId = this.model.id;
                        if(this.ruleGroup.id){
							api.model.editRuleGroup(this.ruleGroup).then(result => {
                                this.$message(result.data.message);
                                this.getRuleGroupList();
                                this.dialog.addRuleGroup = false;
                                this.loading.btn = false;
                            }).catch(result => {
                                this.loading.btn = false;
							})
						}else {
                            api.model.addRuleGroup(this.ruleGroup).then(result => {
                                this.$message(result.data.message);
                                this.getRuleGroupList();
                                this.dialog.addRuleGroup = false;
                                this.loading.btn = false;
							}).catch(result => {
                                this.loading.btn = false;
							})
						}
                        this.viewRuleGroupId=false;
                        this.tableData = [];
                    }
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
                this.relevanceObjArr.splice(index,1);
            },
            // 确认修改对象数组
            submitObjSet(){
                this.$validator.validateAll().then(valid => {
                    if(valid){
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
                            this.$message.error(result.message);
                        })
                    }
                })
            },
			cancelRule(){
                this.viewRuleList(this.viewRuleGroupId);
			},
            /**
			 * 风控条件编辑弹层
             */
            //  打开规则编辑弹层
            openRuleSet(index,id){
                if(index !== undefined){
                    this.dialog.ruleGroupTitles = '编辑规则';
                    this.variableTypeInt = true;
                    this.variableNameInt = true;
                    this.dataTypeInt = true;
                    this.ruleItem = this.tableData[index];
                    this.reportRule = this.tableData[index].ruleCondition;
                    this.reportRuleDisassemble();
				}else {
                    this.dialog.ruleGroupTitles = '新建规则';
                    this.ruleItem = {
                        ruleName : '',
                        ruleStatus : 'DISABLED',
                        controlLevel : '禁止性',
                        ruleContent : '',
                        ruleCondition : '',
                        ruleConditionName : ''
                    };
                    this.ruleArr = [
                        [
                            '','','','','','','','',''
                        ]
                    ];
				}
				this.$validator.clean();
                this.ruleDialog = true
            },
            //  获取参数类型
            getVariableTypeList(){
                api.model.variableTypeList().then(result => {
                    this.variableTypeList = result.data.data;
                })
            },
            // 回显获取列表
            retVariableNameListV(paramter,index){

                var tempArr=this.modelObjList;
                var objectSubject='';
                for(var i=0;i<tempArr.length;i++){
                    if(tempArr[i].id == paramter){
                        objectSubject=tempArr[i].objectSubject;
                    }
                }
                api.model.getVariableListWithSubject({subject:objectSubject}).then(result => {
                    this.variableNameListV.splice(index,1,result.data.data)
                })
            },
            // 回显获取列表
            retVariableNameList(paramter,index){
                var tempArr=this.modelObjList;
                var objectSubject='';
                for(var i=0;i<tempArr.length;i++){
                    if(tempArr[i].id == paramter){
                        objectSubject=tempArr[i].objectSubject;
                    }
                }
                api.model.getVariableListWithSubject({subject:objectSubject}).then(result => {
                    this.variableNameList.splice(index,1,result.data.data)
                })
            },
            // 通过参数类型获取参数名列表
            getVariableNameList(index){
                this.ruleArr[index][2]='';
                var tempId=this.ruleArr[index][1];
                var tempArr=this.modelObjList;
                var objectSubject='';
                for(var i=0;i<tempArr.length;i++){
                    if(tempArr[i].id == tempId){
                        objectSubject=tempArr[i].objectSubject;
                    }
                }
                api.model.getVariableListWithSubject({subject:objectSubject}).then(result => {

                    this.variableNameList.splice(index,1,result.data.data)

                })
            },
            // 通过参数类型获取参数名列表V变量
            getVariableNameListV(index){
                this.ruleArr[index][6]='';
                var tempId=this.ruleArr[index][5];
                var tempArr=this.modelObjList;
                var objectSubject='';
                for(var i=0;i<tempArr.length;i++){
                    if(tempArr[i].id == tempId){
                        objectSubject=tempArr[i].objectSubject;
                    }
                }
                api.model.getVariableListWithSubject({subject:objectSubject}).then(result => {
                    this.variableNameListV.splice(index,1,result.data.data)
                })
            },
            // 通过参数名获取参数值列表
            getVariableValueList(name,index){
                api.model.variableValueList({name:name}).then(result => {
                    this.variableValueList.splice(index,0,result.data.data);
                })
            },
            // 参数类型改变 num为改变的参数类型序号
            variableTypeChange(num,index){
                this.getVariableNameListV(num);
                if(!this.variableTypeInt){
                    if(index === 1){
                        this.ruleArr[num][2] = '';
					}else {
                        this.ruleArr[num][6] = '';
					}
                    if(this.ruleArr[num][4] === '常量'){
                        this.ruleArr[num][5] = ''
                    }
				}else {
//                    this.variableTypeInt = false;
				}
            },
            // 参数名改变 num为改变的参数名序号
            variableNameChange(num){
                if(this.ruleArr[num][2]){
                    this.getVariableValueList(JSON.parse(this.ruleArr[num][2]).name,num);
                    if(!this.variableNameInt && this.ruleArr[num][4] === '常量'){
                        this.ruleArr[num][5] = ''
                    }
                }else {
//                    this.variableNameInt = false;
                }
            },
            dataTypeChange(num){
                if(this.ruleArr[num][4] === '常量'){
                    this.ruleArr[num].splice(6,1, '');
                }else if(this.ruleArr[num][4] === '变量'){

                }
                if(!this.dataTypeInt){
                    this.ruleArr[num].splice(5,1, '');
                }
            },
            // 添加一个规则数组
            addRuleArr(index){
                if(this.ruleArr.length < 10){
                    this.ruleArr.splice(index+1,0,['','','','','','','','','']);
                }else {
                    this.$message.error('最多允许创建10个条件');
                }
            },
            // 删除一个规则数组
            delRuleArr(index){
                if(index === 0){
                    this.$message.error('第一行条件不能删除');
                }else {
                    this.variableTypeInt = true;
                    this.variableNameInt = true;
                    this.dataTypeInt = true;
                    this.ruleArr.splice(index,1);
                    if(this.ruleArr.length === 1){
                        this.ruleArr[index-1].splice(-1,1,'')
                    }
                    setTimeout( () => {
                        this.variableTypeInt = false;
                        this.variableNameInt = false;
                        this.dataTypeInt = false;
                    },500);

                }
            },
            // 风控条件预览
            ruleTxt(){
                let viewHtml = '';  // 下方预览用HTML
                let viewTxt = ''; // 保存用预览
                for(let index = 0; index < this.ruleArr.length; index++){
                    let items = this.ruleArr[index];
                    let dataType = '';
                    for (let i=0; i< items.length; i++){
                        // 第1位需要循环ID获得name
                        if(i === 1){
							this.modelObjList.forEach((value,index,arr) =>{
							    if(items[i] === value.id){
                                    viewHtml += value.objectName;
                                    viewTxt += value.objectName;
								}
							})
                        }else if(i === 2){  // 第2位是一个json对象
                            if(items[i]){
                                let obj = JSON.parse(items[i]);
                                viewHtml += obj.chineseName;
                                viewTxt +=  obj.chineseName;
                            }
                        }else if(i === 4){  // 第4位不显示在预览 常量变量判断
                            dataType = items[i];
							/*if(items[i] === '常量'){

							}else if(items[i] === '变量'){

							}*/
						}else if(i === 5){
                            if(dataType === '常量'){
                                viewHtml += items[i];
                                viewTxt += items[i]
							}else if(dataType === '变量'){
                                this.modelObjList.forEach((value,index,arr) =>{
                                    if(items[i] === value.id){
                                        viewHtml += value.objectName;
                                        viewTxt += value.objectName;
                                    }
                                })
							}
						}else if(i === 6){
                            if(dataType === '常量'){

                            }else if(dataType === '变量'){
                                if(items[i]){
                                    let obj = JSON.parse(items[i]);
                                    viewHtml += obj.chineseName;
                                    viewTxt +=  obj.chineseName;
                                }
                            }
                        }else if(i === 8){ // 第8位 前要换行
                            viewHtml += '<br>' + items[i];
							viewTxt += items[i]
						}else {
                            viewHtml += items[i];
                            viewTxt += items[i]
                        }
                    }
                    viewHtml += '<br>';
                }
                this.ruleHtml = viewTxt;
                this.ruleView = viewTxt;
            },
            // 构造风控条件字符串
            reportRuleString(){
                let reportRule = '';
                for(let index = 0; index < this.ruleArr.length; index++){
                    let items = this.ruleArr[index];
                    let dataType = '';
                    for (let i=0; i< items.length; i++){
                        if(i !== 0 && i !== 6 && i !== 7 && i !== 8){
                            if(!items[i]){
                                return false;
                            }
                        }
                        // 第一个参数前和 AND OR前后不添加 |
                        if(i !== 0 && i !== 8 && i !== 6){
                            reportRule += '|';
                        }
                        // 每组的第2位参数有3个参数传递
                        if(i === 2){
                            if(items[i]){
                                let obj = JSON.parse(items[i]);
                                let chineseName = '';  // 参数名称（中文）
                                let name = '';  // 参数名称（英文）
                                let controlType = obj.controlType;  // 参数类型（控件类型）
                                if(obj.type === 'NUMBER'){
                                    chineseName = '#{' + obj.chineseName + '}';
                                    name = '#{' + obj.name + '}';
                                }else {
                                    chineseName = '${' + obj.chineseName + '}';
                                    name = '${' + obj.name + '}';
                                }
                                reportRule += chineseName + '|' + name + '|' + controlType
                            }
                        }else if(i === 4){
                            dataType = items[i];
                            reportRule += items[i]
						}else if(i === 6){
                            if(dataType === '常量'){

							}else if(dataType === '变量'){
                                reportRule += '|';
                                if(items[i]){
                                    let obj = JSON.parse(items[i]);
                                    let chineseName = '';  // 参数名称（中文）
                                    let name = '';  // 参数名称（英文）
                                    let controlType = obj.controlType;  // 参数类型（控件类型）
                                    if(obj.type === 'NUMBER'){
                                        chineseName = '#{' + obj.chineseName + '}';
                                        name = '#{' + obj.name + '}';
                                    }else {
                                        chineseName = '${' + obj.chineseName + '}';
                                        name = '${' + obj.name + '}';
                                    }
                                    reportRule += chineseName + '|' + name + '|' + controlType
                                }
							}
						}else {
                            reportRule += items[i]
                        }
                    }
                }
                this.reportRule = reportRule;
            },
            // 解析风控条件字符串
            reportRuleDisassemble(){

                if(this.reportRule){

                    let ruleString = this.reportRule;
//                  (|${子女数}|${children}|list|<=|更多|)AND(|${居住状况}|${dwell_info}|list|>=|直系亲属房产|)
                    // 先将字符串在逻辑运算符处拆分成数组
                    let ruleArr = ruleString.split(/AND|OR/);  // 条件片段数组
                    let condition = ruleString; // 条件逻辑运算符
                    let conditionArr = []; // 条件逻辑运算符数组
                    for (let i = 0;i<ruleArr.length; i++){
                        condition = condition.replace(ruleArr[i],'|');
                    }
                    // 将处理过的字符串从分隔符处拆分成数组
                    conditionArr = condition.split('|');
                    // 将运算符前后的|去掉
                    conditionArr.splice(0,1);  // 去掉第一项
                    conditionArr.splice(-1,1);  // 去掉最后一项
//
                    let ruleArrAll = [];
                    for (let n = 0; n< ruleArr.length; n++){
                        let ruleArrItemTemp = ruleArr[n].split('|');
                        let ruleArrItem = [];  // 每条条件数组
                        let index2 = {};  // 临时存放第2位的对象
                        let index6 = {};  // 临时存放第6位的对象
                        let dataType = '';
                        for (let d = 0; d<ruleArrItemTemp.length; d++){
                            if(d === 1){
                                this.retVariableNameList(ruleArrItemTemp[1],n);
                                ruleArrItem.push(parseInt(ruleArrItemTemp[d]))
							}else if(d === 2){
                                if(ruleArrItemTemp[d].indexOf('#') === 0){
                                    index2.type = 'NUMBER'
                                }else {
                                    index2.type = 'STRING'
                                }
                                index2.chineseName =  ruleArrItemTemp[d].replace(/[{}$#]/g,'');
                            }else if(d === 3){
                                index2.name =  ruleArrItemTemp[d].replace(/[{}$#]/g,'');
                            }else if(d === 4){
                                index2.controlType = ruleArrItemTemp[d];
                                ruleArrItem.push(JSON.stringify(index2))
                            }else if(d === 6){

                                dataType = ruleArrItemTemp[d];
                                ruleArrItem.push(ruleArrItemTemp[d])
							}else if(d === 7){
                                if(dataType === '常量'){
                                    ruleArrItem.push(ruleArrItemTemp[d])
								}else if(dataType === '变量'){
                                    this.retVariableNameListV(ruleArrItemTemp[7],n);
                                    ruleArrItem.push(parseInt(ruleArrItemTemp[d]))
								}
							}else if( d === 8){
                                if(dataType === '常量'){
                                    ruleArrItem.push('');
                                    ruleArrItem.push(ruleArrItemTemp[d])
                                }else if(dataType === '变量'){
                                    if(ruleArrItemTemp[d].indexOf('#') === 0){
                                        index6.type = 'NUMBER'
                                    }else {
                                        index6.type = 'STRING'
                                    }
                                    index6.chineseName =  ruleArrItemTemp[d].replace(/[{}$#]/g,'');
                                }
							}else if(d === 9){
                                index6.name =  ruleArrItemTemp[d].replace(/[{}$#]/g,'');
							}else if(d === 10){
                                index6.controlType = ruleArrItemTemp[d];
                                ruleArrItem.push(JSON.stringify(index6))
							}else {
                                ruleArrItem.push(ruleArrItemTemp[d])
                            }
                        }
                        if(conditionArr[n]){
                            ruleArrItem.push(conditionArr[n]);
                        }else {
                            ruleArrItem.push('');
                        }
                        ruleArrAll.push(ruleArrItem)
                    }
                    this.ruleArr = ruleArrAll;
                }
                setTimeout(()=>{
                    this.variableTypeInt = false;
                    this.variableNameInt = false;
                    this.dataTypeInt = false;
				},200)
            },
            submitRule(){
                this.$validator.validateAll('form-2').then((valid) => {
                    if(valid){
                        this.loading.btn = true;
                        this.reportRuleString();
                        this.ruleItem.ruleCondition = this.reportRule;
                        this.ruleItem.subModelId = this.$route.query.id;
                        this.ruleItem.ruleGroupId = this.viewRuleGroupId;
                        this.ruleItem.modelId = this.model.riskModelId;
                        this.ruleItem.ruleConditionName = this.ruleView;
                        api.model.checkCondition(this.ruleItem.ruleCondition).then(result => {
                            if(this.ruleItem.id){
                                api.model.editRuleItem(this.ruleItem).then(result => {
                                    this.$message(result.data.message);
                                    this.viewRuleList(this.viewRuleGroupId);
                                    this.ruleDialog = false;
                                    this.loading.btn = false;
                                }).catch(result => {
                                    this.loading.btn = false;
                                })
                            }else {
                                api.model.addRuleItem(this.ruleItem).then(result => {
                                    this.$message(result.data.message);
                                    this.viewRuleList(this.viewRuleGroupId);
                                    this.ruleDialog = false;
                                    this.loading.btn = false;
                                }).catch(result => {
                                    this.loading.btn = false;
                                })
                            }
						}).catch(result => {
                            this.loading.btn = false;
						});
					}
				});
            }
        }
    }
</script>
