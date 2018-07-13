<!--变量管理首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风险变量管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/variable-manage' }">变量管理</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">设置变量</el-breadcrumb-item>
			</el-breadcrumb>
			<router-link :to="{ path: '/variable-manage' }"><el-button type="primary" class="fr back-to-btn mgt10-mgr8">返回上一级</el-button></router-link>
		</div>
		<div class="variable-main clearfix">
			<div class="variable-detail-top">
				<span>{{this.requestParams.subjectTitle}}</span>/<span>{{this.requestParams.groupName}}</span>
			</div>
			<div class="variable-detail-button">
				<div class="variable-detail-float">
					<el-button type="primary" size="small" @click="modelObjSet">添加变量</el-button>
				</div>
			</div>
			<el-table
					:data="tableData.list"
					style="width: 100%">
				<el-table-column
						prop="name"
						label="code"
						align="center"
						>
				</el-table-column>
				<el-table-column
						prop="chineseName"
						label="变量名称"
						align="center"
						>
				</el-table-column>
				<el-table-column
						prop="type"
						label="变量类型"
						align="center"
						:formatter="switchType"
						width="245"
				>
				</el-table-column>
				<el-table-column
						prop="valueList"
						label="备注"
						align="center"
						width="245">
				</el-table-column>
				<el-table-column
						label="操作"
						align="center"
				>
					<template scope="scope">
						<div  class="group-bbtn" v-if="scope.$index != '0'">
							<el-button  class=" group-left" type="text" size="mini" @click="openRuleSet(scope.$index)">编辑</el-button>
							<el-button  class=" model-color" type="text" size="mini" @click="delDivideGroup(scope.row.id)">删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="mb15 fr mr20 mt15">
				<el-pagination
						@current-change="getVarListWithPagination"
						:current-page.sync="tableData.pageNum"
						:page-size="tableData.pageSize"
						layout="prev, pager, next, jumper"
						:page-count="tableData.pages"
				>
				</el-pagination>
			</div>
		</div>
		<!--编辑-->
		<el-dialog @close="cancelRule" title="编辑变量" size="tiny" :visible.sync="dialog.divideGroup" class="mtt100 dialog-red">
			<el-form  label-width="100px" @submit.native.prevent>
				<el-form-item label="变量名称" :class="{'is-error': errors.has('form-2.变量名称')}">
					<el-input data-vv-scope="form-2" v-validate="rules.dividelName" data-vv-value-path="currentValue" data-vv-name="变量名称" v-model="divideGroup.modelName"></el-input>
					<div v-show="errors.has('form-2.变量名称')" class="el-form-item__error">{{ errors.first('form-2.变量名称') }}</div>
					<i class="c-red">*</i>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.divideGroup = false;">取 消</el-button>
				<el-button type="primary" @click="confirmDivideGroup" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 删除变量 -->
		<el-dialog title="删除变量" size="tiny" :visible.sync="dialog.delDivideGroup" class="mtt100">
			<p class="dialog-message">确定删除当前变量？</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.delDivideGroup = false">取 消</el-button>
				<el-button type="primary" @click="confirmDeleteDivideGroup" :loading="loading.btn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 添加变量 -->
		<el-dialog @close="cancelObjSet()" title="添加变量" custom-class="obj-dialog" :visible.sync="dialog.modelObjSet" size="tiny" class="dialog-red dialog-only">
			<el-form label-width="70px" @submit.native.prevent>
				<el-form-item label="变量名称" :class="{'is-error': errors.has('变量名称')}">
					<el-input v-validate="rules.objName" v-model="analyzeObj.objectName" data-vv-value-path="currentValue" data-vv-name="变量名称"></el-input>
					<div v-show="errors.has('变量名称')" class="el-form-item__error">{{ errors.first('变量名称') }}</div>
					<i class="c-red">*</i>
				</el-form-item>
				<el-form-item label="变量类型" :class="{'is-error': errors.has('变量类型|select')}">
					<el-select  v-validate="'required'" @change="clearDefaultValue" v-model="analyzeObj.objectSubject" data-vv-value-path="value" data-vv-name="变量类型|select" placeholder="请选择" style="width: 100%;">
						<el-option label="数值型" value="NUMBER"></el-option>
						<el-option label="枚举型" value="STRING"></el-option>
					</el-select>
					<div v-show="errors.has('变量类型|select')" class="el-form-item__error">{{ errors.first('变量类型|select') }}</div>
					<i class="c-red">*</i>
				</el-form-item>
			</el-form>
			<p class="set-cancel" v-if="analyzeObj.objectSubject=='STRING'">
				设置枚举值：
				<span class="w295">
					<i @click="addObjItem" class="el-icon-plus"></i>
						添加枚举值
				</span>
			</p>
			<el-form inline="false" label-width="70px"  class="set-form-labers" v-if="analyzeObj.objectSubject=='STRING'" @submit.native.prevent>
				<template v-for="(objItem,index) in relevanceObjArr">
					<el-form-item label="枚举值" :class="{'is-error': errors.has('枚举值'+(index + 1))}">
						<el-input  v-validate="'required'" v-model="objItem.objectName" data-vv-value-path="currentValue" :data-vv-name="'枚举值'+(index + 1)" style="width: 200px;"></el-input>
						<div v-show="errors.has('枚举值'+(index + 1))" class="el-form-item__error">{{ errors.first('枚举值'+(index + 1)) }}</div>
						<i class="c-red">*</i>
					</el-form-item>

					<span v-if="objItem.del" class="rule-item-oper rule-span-lsiu variable-rule-top">
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
    import axios from '../../api/http'
    import store from  '../../store/index'
    export default {
        created () {
            this.pageInfo();
        },
        data () {
            return {
                delVarId:'',
                divideGroupNew:{},
                requestParams:{
                    groupId:'',
                    categoryId:'',
	                pageNum:''
                },
	            firstLineObj:{
                    name:this.$route.query.titleCode,
                    chineseName:this.$route.query.titleUnique,
                    type:'NUM',
                    valueList:'唯一标识（keycode）'
	            },
                loading:{
                    group:false,
                    rule:false,
                    btn:false,
                },
                divideGroup:{
                    modelName:''
                },
                dialog : {
                    divideGroup:false,
                    delDivideGroup:false,
                    modelObjSet: false
                },
                analyzeObj : {
                    objectName : '',
                    objectSubject : ''
                },
                relevanceObjArr : [
                    {
                        objectName : '',
                        del : false,
                    }
				],
                // 校验规则
                rules: {
                    dividelName:'required|max:20',
                    objName: 'required|max:20',
                },
                tableData: {
					list:[
                        {
                            name:this.$route.query.titleCode,
                            chineseName:this.$route.query.titleUnique,
                            type:'NUM',
                            valueList:'唯一标识（keycode）'
                        }
					]
                }
            }
        },
        methods: {
            switchType(row, column, cellValue){
				if(cellValue == 'NUMBER'){
					return '数值型'
				}else if(cellValue == "STRING"){
                    return '枚举型'
				}else if(cellValue == "NUM"){
                    return '字符型'
                }
            },
            clearDefaultValue(){
                if(this.analyzeObj.objectSubject == 'STRING'){
                    this.relevanceObjArr =[
                        {
                            objectName : '',
                            del : false,
                        }
                    ]
                }

            },
            //获取列表
            pageInfo(){
				this.requestParams.categoryId=this.$route.query.categoryId;
                this.requestParams.groupId=this.$route.query.groupId;
                this.requestParams.groupName=this.$route.query.groupName;
                this.requestParams.subjectTitle=this.$route.query.subjectTitle;
                this.requestParams.titleUnique=this.$route.query.titleUnique;
                this.requestParams.titleCode=this.$route.query.titleCode;
                this.getVarList();
			},
            getVarList(){
                api.riskManage.getVarListById(this.requestParams).then(result => {
                    if(result.data.success === true){
						this.tableData=result.data.data
                        this.tableData.list.unshift(this.firstLineObj);
                    }
                }).catch(result => {

                });
            },
            getVarListWithPagination(Num){
                this.requestParams.pageNum=Num;
                api.riskManage.getVarListById(this.requestParams).then(result => {
                    if(result.data.success === true){
                        this.tableData=result.data.data
                        this.tableData.list.unshift(this.firstLineObj);
                    }
                }).catch(result => {

                });
            },
            //关闭编辑
            cancelRule(){

            },
            // 编辑弹层
            openRuleSet(index){
                this.divideGroupNew=this.tableData.list[index];
                this.$validator.errors.clear();
                this.divideGroup.modelName=this.divideGroupNew.chineseName;
                this.dialog.divideGroup = true;
            },
            //确认编辑提交
            confirmDivideGroup(){
                this.$validator.validateAll('form-2').then((valid) => {
                    if(valid === true){
                        api.riskManage.updateVarListById(
                            {id:this.divideGroupNew.id,
                                type:this.divideGroupNew.type,
                                chineseName:this.divideGroup.modelName,
                                categoryId:this.requestParams.categoryId,
                                groupId:this.requestParams.groupId,
                            }
                        ).then(result => {
                            this.$message(result.data.message);
                            this.getVarList();
                            this.dialog.divideGroup = false;
                        }).catch(result => {

                        });
                    }
                })
            },
            //删除分组弹层
            delDivideGroup(ruleGroupId){
                this.dialog.delDivideGroup = true;
                this.delVarId=ruleGroupId;
            },
            //确认删除风控变量
            confirmDeleteDivideGroup(){
                api.riskManage.delVarListById(this.delVarId).then(result => {
                    this.getVarList();
                    this.$message(result.data.message);
                    this.dialog.delDivideGroup = false
                }).catch(result =>{
                    this.dialog.delDivideGroup = false
                });
            },
			//添加变量
            modelObjSet(){
                this.$validator.errors.clear();
                this.dialog.modelObjSet = true;
            },
            cancelObjSet(){
                this.analyzeObj = {
                    objectName : '',
                        objectSubject : ''
                };
                this.pageInfo();
            },
            // 添加对象数组
            addObjItem(){
                this.relevanceObjArr.push({
                    objectName : '',
                    del : true
                });
            },
            // 删除对象数组
            delObjItem(index){
                this.relevanceObjArr.splice(index,1);
            },
            // 确认修改对象数组
            submitObjSet(){
                this.$validator.validateAll().then(valid => {
                    if(valid){
                        var data={};
                        if(this.analyzeObj.objectSubject == 'NUMBER'){
                             data={
                                type:this.analyzeObj.objectSubject,
                                chineseName:this.analyzeObj.objectName,
                                categoryId:this.requestParams.categoryId,
                                groupId:this.requestParams.groupId,
                                groupName:this.requestParams.groupName,
	                             status:'ENABLED',
                                 controlType:'text',
                                 version:'0',
                                 valueList:''
                            }
                        }else{
                            var objArr=this.relevanceObjArr;
                            var str='';
                                for(var i=0;i<objArr.length;i++){
									if(i == objArr.length-1){
                                        str+=objArr[i].objectName;
									}else{
                                        str+=objArr[i].objectName+',';
									}
                                }
                            data={
                                type:this.analyzeObj.objectSubject,
                                chineseName:this.analyzeObj.objectName,
                                categoryId:this.requestParams.categoryId,
                                groupId:this.requestParams.groupId,
                                groupName:this.requestParams.groupName,
                                status:'ENABLED',
	                            version:'0',
                                controlType:'list',
                                valueList:str
                            }
                        }
                        api.riskManage.addVarListById(data).then(result => {
                            if(result.data.success === true){
                                this.$message(result.data.message);
                                this.dialog.modelObjSet = false;
                                this.getVarList();
                            }
                        }).catch(result => {
                            //this.$message.error(result.data.message);
                        });

                    }
                });
            }
        }
    }
</script>
