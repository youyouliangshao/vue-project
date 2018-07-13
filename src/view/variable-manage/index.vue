<!--变量管理首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风险变量管理</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">变量管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="variable-main clearfix">
			<div class="left-risk-rule delect-border variable-main-left">
				<p class="rule-head table-title">主题<i v-show="showEdit" @click="addRule" class="el-icon-plus"></i></p>
				<el-table
						class="dimension-info-table"
						v-loading="loading.group"
						:data="ruleGroups"
						highlight-current-row
						@row-click="viewRuleLists"
						:stripe="true"
						style="width: 100%"
						height="400"
				>
					<el-table-column
							label="名称"
							prop="titleName"
					>
					</el-table-column>
					<el-table-column
							label="唯一标识（keycode）"
							prop="titleUnique"
					>
					</el-table-column>
					<el-table-column label="操作" class-name="text-right">
						<template scope="scope">
							<div v-show="showEdit" class="group-bbtn">
								<el-button  class="" type="text" size="mini" @click="editRuleGroup(scope.$index)">编辑</el-button>
								<el-button  class=" model-color" type="text" size="mini" @click="delRuleGroup(scope.row.id)">删除</el-button>
								<!--<div class="graded-arrow">
									<i class="el-icon-arrow-right"></i>
								</div>-->
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class=" variable-main-right">
				<p class="rule-head table-title">分组<span v-show="showEdit"><i v-show="this.viewRuleGroupId" @click="openRuleSet()" class="el-icon-plus"></i></span></p>
				<el-table
						class="dimension-info-table"
						v-loading="loading.group"
						:data="tableData"
						highlight-current-row
						:stripe="true"
						style="width: 100%"
						height="400"
				>
					<el-table-column
							label="名称"
							prop="groupName"
					>
					</el-table-column>
					<el-table-column
							label="操作"
							class="variable-margins"
							class-name="text-right"
					>
						<template scope="scope">
							<div v-show="showEdit" class="group-bbtn ">
								<router-link :to="{ name: 'variable-detail',query:{groupId:scope.row.id,subjectTitle:subjectLine,categoryId:viewRuleGroupId,groupName:scope.row.groupName,titleUnique:titleUnique,titleCode:titleCode}}">
									<el-button  class="" type="text" size="mini" >设置变量</el-button>
								</router-link>
								<el-button  class=" group-left" type="text" size="mini" @click="openRuleSet(scope.$index)">编辑</el-button>
								<el-button  class=" model-color" type="text" size="mini" @click="delDivideGroup(scope.row.id)">删除</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!--新建/编辑主题-->
		<el-dialog @close="cancelRuleGroup" :title="dialog.ruleGroupTitle" size="tiny" :visible.sync="dialog.addRuleGroup" class="mtt100 dialog-red">
			<el-form  label-width="100px" @submit.native.prevent>
				<el-form-item label="主题名称" :class="{'is-error': errors.has('form-1.主题名称')}">
					<el-input data-vv-scope="form-1" v-validate="rules.modelName" data-vv-value-path="currentValue" data-vv-name="主题名称" v-model="ruleGroup.titleName"></el-input>
					<div v-show="errors.has('form-1.主题名称')" class="el-form-item__error">{{ errors.first('form-1.主题名称') }}</div>
					<i class="c-red">*</i>
				</el-form-item>
				<el-form-item label="唯一标识" :class="{'is-error': errors.has('form-1.唯一标识')}">
					<el-input data-vv-scope="form-1" v-validate="rules.modelCode" data-vv-value-path="currentValue" data-vv-name="唯一标识" v-model="ruleGroup.titleUnique"></el-input>
					<div v-show="errors.has('form-1.唯一标识')" class="el-form-item__error">{{ errors.first('form-1.唯一标识') }}</div>
					<i class="c-red">*</i>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.addRuleGroup = false;">取 消</el-button>
				<el-button type="primary" @click="confirmAddRule" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!--新建/编辑分组-->
		<el-dialog @close="cancelRule" :title="dialog.divideGroupTitle" size="tiny" :visible.sync="dialog.divideGroup" class="mtt100 dialog-red">
			<el-form  label-width="100px" @submit.native.prevent>
				<el-form-item label="分组名称" :class="{'is-error': errors.has('form-2.分组名称')}">
					<el-input data-vv-scope="form-2" v-validate="rules.dividelName" data-vv-value-path="currentValue" data-vv-name="分组名称" v-model="divideGroup.modelName"></el-input>
					<div v-show="errors.has('form-2.分组名称')" class="el-form-item__error">{{ errors.first('form-2.分组名称') }}</div>
					<i class="c-red">*</i>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.divideGroup = false;">取 消</el-button>
				<el-button type="primary" @click="confirmDivideGroup" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 删除主题 -->
		<el-dialog title="删除主题" size="tiny" :visible.sync="dialog.delRuleGroup" class="mtt100">
			<p class="dialog-message">确定删除当前主题？</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.delRuleGroup = false">取 消</el-button>
				<el-button type="primary" @click="confirmDeleteRuleGroup" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 删除分组 -->
		<el-dialog title="删除分组" size="tiny" :visible.sync="dialog.delDivideGroup" class="mtt100">
			<p class="dialog-message">确定删除当前分组？</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.delDivideGroup = false">取 消</el-button>
				<el-button type="primary" @click="confirmDeleteDivideGroup" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import api from '../../api/api'
    import axios from '../../api/http'
    import store from  '../../store/index'
    export default {
        created () {
            this.getRuleGroupList();
        },
        data () {
            return {
                subjectLine:{

                },
                titleCode:'',
                titleUnique:'',
	            thirdNeedP:{},
                showEdit:true,
                viewRuleGroupId : null,
                loading:{
                    group:false,
                    rule:false,
                    btn:false,
				},
                dialog : {
                    addRuleGroup : false,
                    ruleDialog:false,
                    divideGroup:false,
                    delRuleGroup : false,
                    delDivideGroup:false
                },
                ruleGroup: {
                    id: undefined,
                    titleName: '',
                    titleUnique: '',
                    version: ''
                },
                divideGroup:{
                    modelName:''
				},
                divideGroupNew:{
                },
                delRuleGroupId:'',
                delDivideGroupId:'',
				// 校验规则
                rules: {
                    modelName: 'required|max:20',
                    modelCode: 'required|max:20',
                    modelDesc: 'max:50',
                    dividelName:'required|max:20',
                },

                ruleGroups:[],
                tableData:[],
            }
        },
		watch:{

		},
        methods: {
            //获取主题列表
            getRuleGroupList(){
                this.loading.group = true;
                api.riskManage.getVarList().then(result => {
                    this.ruleGroups = result.data.data;
                    this.loading.group = false;
                }).catch(result => {
                    this.loading.group = false;
                })
            },
            //关闭主题弹窗
            cancelRuleGroup(){
                this.getRuleGroupList();
                this.viewRuleGroupId=false;
                this.tableData = [];
            },
			//关闭分组
            cancelRule(){
                this.viewRuleList(this.viewRuleGroupId);
            },
			//查看分组
            viewRuleLists(row){
                this.subjectLine=row.titleName;
                this.titleUnique=row.titleUnique;
                this.titleCode=row.titleCode;
                this.viewRuleList(row.id)
            },
            //查看规则列表
            viewRuleList(ruleGroupId){
                api.riskManage.getGroupList(ruleGroupId).then(result => {
                    this.tableData = result.data.data;
                    this.viewRuleGroupId = ruleGroupId;

                }).catch(result => {

                });

            },
            //新建主题
            addRule(){
                this.ruleGroup = {
                    modelName: '',
                    modelCode:''
                };
                this.$validator.errors.clear();
                this.dialog.ruleGroupTitle = '新建主题';
                this.dialog.addRuleGroup = true;
            },
            //编辑主题
            editRuleGroup(index){
                //this.ruleGroup.id=id;
                this.ruleGroup = this.ruleGroups[index];
                this.$validator.errors.clear();
                this.dialog.ruleGroupTitle = '编辑主题';
                this.dialog.addRuleGroup = true;
            },
            //确认添加主题
            confirmAddRule(){
                this.$validator.validateAll('form-1').then((valid) => {
                    if(valid === true){

                        if(this.ruleGroup.id != undefined){
                            api.riskManage.updateVarList({
	                            titleName: this.ruleGroup.titleName,
                                titleUnique: this.ruleGroup.titleUnique,
                                id:this.ruleGroup.id,
                                version:this.ruleGroup.version
                            }).then(result => {
                                this.getRuleGroupList();
                                this.dialog.addRuleGroup = false;
                                this.$message(result.data.message);
                            }).catch(result => {

                            })

                        }else{
                            api.riskManage.addVarList({ titleName: this.ruleGroup.titleName,
                                titleUnique: this.ruleGroup.titleUnique}).then(result => {
                                this.getRuleGroupList();
                                this.$message(result.data.message);
                                this.dialog.addRuleGroup = false;
                            }).catch(result => {

                            })
                        }
                    }
                })
            },
            //  分组新建/编辑弹层
            openRuleSet(index){
                if(index !== undefined){
                    this.dialog.divideGroupTitle = '编辑分组';
                    this.divideGroupNew=this.tableData[index];
                    this.delRuleGroupId = this.divideGroupNew.id;
                    this.divideGroup.modelName=this.divideGroupNew.groupName;
                }else {
                    this.dialog.divideGroupTitle = '新建分组';
                    this.divideGroup.modelName='';
                    this.delRuleGroupId='';
                }
                this.$validator.errors.clear();
                this.dialog.divideGroup = true
            },
			//确认提交分组
            confirmDivideGroup(){
                this.$validator.validateAll('form-2').then((valid) => {
                    if(valid === true){
                       if(this.delRuleGroupId != ''){
                           api.riskManage.updateGroupList({
                               groupCode: this.divideGroupNew.groupCode,
                               groupName: this.divideGroup.modelName,
                               id:this.divideGroupNew.id,
                               titleId: this.divideGroupNew.titleId,
                               version:this.divideGroupNew.version
                           }).then(result => {
                               this.dialog.divideGroup = false;
                               this.$message(result.data.message);
                           }).catch(result => {

                           })
                       }else{
                           api.riskManage.addGroupList(
	                           {groupName:this.divideGroup.modelName,
		                        titleId:this.viewRuleGroupId,
	                           }
                           ).then(result => {
                               this.$message(result.data.message);
                               this.dialog.divideGroup = false;
                           }).catch(result => {

                           })
                       }
                    }
                })
            },
            //删除主题弹层
            delRuleGroup(ruleGroupId){
                this.delRuleGroupId = ruleGroupId;
                this.dialog.delRuleGroup = true;
            },
            //确认删除主题弹层
            confirmDeleteRuleGroup(){
                api.riskManage.delVarList(this.delRuleGroupId).then(result => {
                    this.tableData = [];
                    this.getRuleGroupList();
                    this.$message(result.data.message);
                    this.dialog.delRuleGroup = false;
                }).catch(result => {

                })
            },

            //删除分组弹层
            delDivideGroup(ruleGroupId){
        		this.delDivideGroupId = ruleGroupId;
        		this.dialog.delDivideGroup = true;
   			 },
            //确认删除分组弹层
            confirmDeleteDivideGroup(){
                api.riskManage.delGroupList(this.delDivideGroupId).then(result => {
                    this.$message(result.data.message);
                    this.viewRuleList(this.viewRuleGroupId);
                    this.dialog.delDivideGroup = false
                }).catch(result =>{
                });
			},
        }
    }
</script>
