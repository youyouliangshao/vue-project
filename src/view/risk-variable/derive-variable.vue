<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风险变量管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: page.url }" class="history-watch">{{page.name}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="page-main page-padding">
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="24">

					</el-col>
				</el-row>
			</div>
			<div class="table-title">衍生变量<i class="el-icon-plus" @click="openRuleSet()"></i></div>
			<el-table :data="list.list">
				<el-table-column
						prop="name"
						label="code"
						align="center"
				>
				</el-table-column>
				<el-table-column
						
						prop="chineseName"
						
						label="名称"
						
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="type"
						
						label="类型"
						
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="subject"
						label="主题"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="variableConditionName"
						label="衍生方法"
						align="center"
				>
				</el-table-column>
				<el-table-column label="操作" class-name="tc last-column">
					<template scope="scope">
						<el-button type="text" size="small" @click="openRuleSet(scope.$index)">编辑</el-button>
						<el-button type="text" size="small" @click="delDeriveInfo(scope.row.id)" class="model-color">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="mb15 fr mt15 mr20">
				<el-pagination
						@current-change="getDeriveList"
						:current-page.sync="list.pageNum"
						:page-size="list.pageSize"
						layout="prev, pager, next, jumper"
						:page-count="list.pages"
				>
				</el-pagination>
			</div>
		</div>
		<!--删除变量弹层-->
		<el-dialog title="删除变量" size="tiny" :visible.sync="dialog.delDeriveVariable">

					<p class="tc">确定删除当前衍生变量？</p>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog.delDeriveVariable = false">取 消</el-button>
				<el-button type="primary" @click="confirmDelDerive">确 定</el-button>
			</div>
		</el-dialog>
		<!--新增变量弹层-->
		<el-dialog :title="vname" size="tiny" :visible.sync="dialog.addDeriveVariable" class="derive-diaog" @close="getDeriveList">
			<el-form label-width="130px" @submit.native.prevent>
				<el-row>
					<el-col :span="24">
						<el-form-item label="衍生变量名称：" :class="{'is-error': errors.has('衍生变量名称')}">
							<el-input v-validate="rules.normName" maxlength="10" data-vv-value-path="currentValue" data-vv-name="衍生变量名称" placeholder="衍生变量名称" v-model="variable.chineseName" class="w200"></el-input>
							<i class="c-red">*</i>
							<div v-show="errors.has('衍生变量名称')" class="el-form-item__error">{{ errors.first('衍生变量名称') }}</div>
						</el-form-item>
						<el-form-item label="衍生变量类型：">
							<el-select disabled placeholder="数值型">
								<el-option label="数值型" value="数值型" selected></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="衍生变量主题："  :class="{'is-error': errors.has('衍生变量主题|select')}">
							<el-select @change="variableTypeChange" data-vv-value-path="value" data-vv-name="衍生变量主题|select" v-validate="rules.normWeight" v-model="tempVariable" placeholder="请选择变量主题" :disabled="editDisabled">
								<!--<el-option label="请选择" value=""></el-option>-->
								<el-option v-for="item in variableTypeList" :label="item.subject" :value="JSON.stringify({dataType:item.dataType,subject:item.subject})"></el-option>
								<!--<el-option v-for="item in variableTypeList" :label="item.subject" :value="item.subject"></el-option>-->
							</el-select>
							<i class="c-red">*</i>
							<div v-show="errors.has('衍生变量主题|select')" class="el-form-item__error">{{ errors.first('衍生变量主题|select') }}</div>
						</el-form-item>
						<el-form-item label="衍生方法：" class="text-indent">
						</el-form-item>
							<div class="rule-con">
								<template v-for="(ruleItems,index) in ruleArr">
								<el-form :inline="true">
									<el-row>
										<el-col :span="6">
											<el-form-item>
												<el-select v-model="ruleArr[index][0]" placeholder="">
													<el-option v-for="item in bracketsOption" :label="item.label" :value="item.value"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item :class="{'is-error': errors.has('变量'+ (index+1)+'|select')}">
												<el-select v-validate="rules.normWeight" @change="variableNameChange(index)" data-vv-value-path="value" :data-vv-name="'变量'+ (index+1)+'|select'" v-model="ruleArr[index][1]" placeholder="选择变量">
													<el-option v-for="item in variableNameList" :label="item.chineseName" :value="JSON.stringify({chineseName:item.chineseName,name:item.name})"></el-option>
												</el-select>
												<div v-show="errors.has('变量'+ (index+1)+'|select')" class="el-form-item__error">{{ errors.first('变量'+ (index+1)+'|select') }}</div>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<el-form-item>
												<el-select v-model="ruleArr[index][2]" placeholder="">
													<!--<el-option value="" label="请选择"></el-option>-->
													<el-option v-for="item in bracketsOption" :label="item.label" :value="item.value"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="4">
											<div class="rule-item-oper">
												<a href="javascript:;" @click="addRuleArr(index)"><i class="el-icon-plus"></i></a>
												<a href="javascript:;" @click="delRuleArr(index)"><i class="el-icon-close"></i></a>
											</div>
										</el-col>
									</el-row>
								</el-form>
								<el-form v-if="(index+1) !== ruleArr.length" :inline="true">
									<el-row>
										<el-col :span="6">
											<el-form-item :class="{'is-error': errors.has('运算符'+ (index+1)+'|select')}">
												<el-select v-model="ruleArr[index][3]" placeholder="" data-vv-value-path="value" :data-vv-name="'运算符'+ (index+1)+'|select'" v-validate="rules.normRequire">
													<el-option v-for="item in logicalOption" :label="item.label" :value="item.value"></el-option>
												</el-select>
												<div v-show="errors.has('运算符'+(index + 1)+'|select')" class="el-form-item__error">{{ errors.first('运算符'+(index + 1)+'|select') }}</div>
											</el-form-item>
										<!--	<el-form-item :class="{'is-error': errors.has('变量'+ (index+1)+'|select')}">
												<el-select v-validate="rules.normWeight" @change="variableNameChange(index)" data-vv-value-path="value" :data-vv-name="'变量'+ (index+1)+'|select'" v-model="ruleArr[index][1]" placeholder="选择变量">
													<el-option v-for="item in variableNameList" :label="item.chineseName" :value="JSON.stringify({chineseName:item.chineseName,name:item.name})"></el-option>
												</el-select>
												<div v-show="errors.has('变量'+ (index+1)+'|select')" class="el-form-item__error">{{ errors.first('变量'+ (index+1)+'|select') }}</div>
											</el-form-item>-->
										</el-col>
									</el-row>
								</el-form>
								</template>
							</div>
						<el-form-item label="描述：" class="text-indent">
						</el-form-item>
						<div class="rule-des" v-html="ruleHtml"></div>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!--<el-button @click="dialog.addDeriveVariable = false">取 消</el-button>-->
				<el-button @click="reloadForm">取 消</el-button>
				<el-button type="primary" @click="submitRule">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import api from '../../api/api'
    import advertisementsrc from '../../assets/images/advertisement.jpg'
    export default {
        data () {
            return {
                vname:'',
                delGroupId:'',
                loading : {
                    btn : false,
                    dimensionList : false,
                    normList : false,
                    dimensionGroup : false,

                },
                formDataType:{
                    dataType:'D'
                },
                formDataBC:{
                    dataType:'',
	                subject:'',
                    type:'NUMBER'
                },
	            editDisabled:false,
                formData:{
                    subject:'',
	                chineseName:'',
                    type:'',
                    variableSource:'',
                    pageNum:''
                },
                rules : {
                    normName : 'required|max:20',
                    normWeight:'required',
                    normRequire : 'required'
                },
                // 规则字符串
                reportRule: '',
                // 保存用预览
                ruleView: '',
                // 带样式的预览
                ruleHtml: '',
                imgsrc:advertisementsrc,
                dialog : {
                    delDeriveVariable : false,
                    addDeriveVariable:false,
                },
	            tempVariable:{},
                variable:{
                    chineseName: "",
                    type: "NUMBER",
                    subject: "",
                    subjectDataType:"",
                    variableCondition: '',
                },
	            list:{},
                // 规则拆分数组
                ruleArr: [
                    [
                        '','','',''
                    ]
                ],
                //条件设置
                variableTypeInt : false,
                variableNameInt : false,
                // 规则类型选项数组
                variableTypeList: [

                ],
                // 规则名选项数组
                variableNameList: [

                ],
                variableValueList: [

                ],
                tableData: [],
                bracketsOption : [
                    {
                        label: '无括号',
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
                // 逻辑选项
                logicalOption : [
                    {
                        label: '+',
                        value: '+'
                    },{
                        label: '-',
                        value: '-'
                    },{
                        label: '*',
                        value: '*'
                    },
                    {
                        label: '/',
                        value: '/'
                    }
                ],
                //页面信息
                page : {
                    name : "衍生变量",
                    url : "",
                    type : ''
                },
            }
        },
        created () {
            this.getDeriveList();
            this.getVariableTypeList();
        },
        components : {},
        watch: {
            ruleArr : {
                handler: function (val, oldVal) {
                    this.ruleTxt();
                },
                deep: true
            },
            model : 'tabInit'
        },
        methods: {
            getDeriveList(val){
                this.formDataType.pageNum=val;
                api.riskVariable.getDeriveVariableList(this.formDataType).then(result => {
                    if(result.data.success === true){
                        this.list = result.data.data;
                    }
                }).catch(result => {

                })
            },
            //  获取变量主题类型
            getVariableTypeList(){
                api.riskVariable.getVariableSubjectList({dataType:'B,C'}).then(result => {
                    this.variableTypeList = result.data.data;
                }).catch(result => {

                })
            },
            // 通过参数类型获取参数名列表
            getVariableNameList(){
                api.riskVariable.getVariableListAccordingSubject(this.formDataBC).then(result => {
                    this.variableNameList=result.data.data;
                }).catch(result => {

                })
            },
            getVariableNameListEdit(formData){
                api.riskVariable.getVariableListAccordingSubject(formData).then(result => {
                    this.variableNameList=result.data.data;
                }).catch(result => {

                })
            },
            // 通过参数名获取参数值列表
            getVariableValueList(name,index){
                api.model.variableValueList({name:name}).then(result => {
                    this.variableValueList.splice(index,0,result.data.data);
                }).catch(result => {

                })
            },
            // 参数类型改变 num为改变的参数类型序号
            variableTypeChange(){
				for(var i=0;i<this.ruleArr.length;i++){
					for(var j=0;j<this.ruleArr[i].length;j++){
                        this.ruleArr[i][1]=''
					}
				}
				this.ruleHtml=''
                this.variable.subjectDataType=JSON.parse(this.tempVariable).dataType;
                this.formDataBC.subject=JSON.parse(this.tempVariable).subject;
                this.formDataBC.dataType=JSON.parse(this.tempVariable).dataType;
                if(!this.variableTypeInt){
                    this.getVariableNameList();
                }else {
                    this.variableTypeInt = false;
                }
            },
            // 参数名改变 num为改变的参数名序号
            variableNameChange(num){
                if(!this.variableNameInt && this.ruleArr[num][2]){
                    this.getVariableValueList(JSON.parse(this.ruleArr[num][2]).name,num);
                    this.ruleArr[num][4] = ''
                }else {
                    this.variableNameInt = false;
                }
            },
            // 构造风控条件字符串
            reportRuleString(){
                let reportRule = '';
                var chineseRule='';
                var codeRule='';
                for(let index = 0; index < this.ruleArr.length; index++){
                    let items = this.ruleArr[index];
                    for (let i=0; i< items.length; i++){
                        // 第一个参数前和 AND OR前后不添加 |
                      /*  if(i !== 0 && i !== 3){
                            reportRule += '|';
                        }*/
                        // 每组的第2位参数有3个参数传递
                        if(i === 1){
                            if(items[i]){
                                let obj = JSON.parse(items[i]);
                                let chineseName = '';  // 参数名称（中文）
                                let name = '';  // 参数名称（英文）
                                chineseName = obj.chineseName;
                                name = '#{' + obj.name + '}';
                                chineseRule += chineseName+'|'
                                codeRule += name+'|'
                            }
                        }else {
                            chineseRule += items[i]+'|'
                            codeRule+=items[i]+'|'
                        }
                    }
                }
                this.reportRule = chineseRule+','+codeRule;
	            this.variable.variableCondition=chineseRule+','+codeRule;
            },
            // 风控条件预览
            ruleTxt(){
                let viewHtml = '';  // 下方预览用HTML
                let viewTxt = ''; // 保存用预览
                for(let index = 0; index < this.ruleArr.length; index++){
                    let items = this.ruleArr[index];
                    for (let i=0; i< items.length; i++){
                        // 第1位为JSON字符串 为条件中英文
                        if(i === 1 && items[1]){
                            let obj = JSON.parse(items[i]);
                            viewHtml += obj.chineseName;
                            viewTxt += obj.chineseName
                        }else if(i === 3){  // 要换行
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
            pageInfo(){
                this.page.url = this.$route.path;
            },
            // 添加一个规则数组
            addRuleArr(index){
                if(this.ruleArr.length < 10){
                    this.ruleArr.splice(index+1,0,['','','','']);
                }else {
                    this.$message.error('最多允许创建10个条件');
                }
            },
            // 删除一个规则数组
            delRuleArr(index){
                if(index === 0){
                    this.$message.error('第一行条件不能删除');
                }else {
                    this.ruleArr.splice(index,1);
                    if(this.ruleArr.length === 1){
                        this.ruleArr[index-1].splice(-1,1,'')
                    }
                }
            },
            //  打开规则编辑弹层
            openRuleSet(index){
                if(index !== undefined){
                    this.$validator.errors.clear();
                    this.editDisabled=true;
                    this.vname='编辑衍生变量';
                    this.variable = this.list.list[index];
                    this.reportRule = this.list.list[index].variableCondition;
                    var obj={}
                    obj.dataType=this.list.list[index].subjectDataType;
                    obj.subject=this.list.list[index].subject;
                    this.tempVariable=JSON.stringify(obj);
                    this.getVariableNameListEdit(obj);
                    //this.tempVariable=JSON.parse(this.tempVariable);
                   /* this.tempVariable.dataType=this.list.list[index].dataType;
                    this.tempVariable.subject=this.list.list[index].subject;
                    this.tempVariable=JSON.stringify(this.tempVariable)*/
                    this.reportRuleDisassemble();
                }else{
		            this.variableNameList=[];
                    this.$validator.errors.clear();
                    this.vname='新增衍生变量';
                    this.editDisabled=false;
                    this.variable = {
                        chineseName: "",
                        type: "NUMBER",
                        subject: "",
                        variableCondition: '',
                    };
                    this.tempVariable ="";
                    //this.reportRule='';
                    this.ruleArr=[
                        [
                            '','','',''
                        ]
                    ]
                }
                this.dialog.addDeriveVariable = true
            },
            // 解析风控条件字符串
            reportRuleDisassemble(){
                if(this.reportRule){
                    let ruleString = this.reportRule;
                    // 先将字符串在逻辑运算符处拆分成数组
                    let ruleArr = ruleString.split(/,/);  // 条件片段数组
                    let condition = ruleString; // 条件逻辑运算符
                    let conditionArr1 = []; // 条件逻辑运算符数组
                    let conditionArr2 = [];
                    // 将处理过的字符串从分隔符处拆分成数组
                    conditionArr1 = ruleArr[0].split('|');
                    conditionArr2 = ruleArr[1].split('|');
                    conditionArr1.pop();
                    conditionArr2.pop();
                    var result = [];
                    for(var i=0,len=conditionArr1.length;i<len;i+=4){
                        result.push(conditionArr1.slice(i,i+4));
                    }
	                var jsonArr=[];
					var jsonString='';
                    for(let n = 1; n< conditionArr1.length; n=n+4){
                            jsonString = {chineseName:conditionArr1[n],name:conditionArr2[n].replace(/[{}$#]/g,'')}
                            jsonArr.push(jsonString);
	                 }
                    for(var k=0;k<result.length;k++){
                        result[k][1]=JSON.stringify(jsonArr[k])
                     }
                    this.ruleArr = result;
	                //console.log(typeof(this.ruleArr[0][1]))

                }
                setTimeout(()=>{
                    this.variableTypeInt = false;
                    this.variableNameInt = false;
                },500)
            },
            delDeriveInfo(id){
                this.delGroupId = id;
                this.dialog.delDeriveVariable = true;
            },
            //确认删除衍生变量
            confirmDelDerive(){
                //this.loading.btn = true;
                api.riskVariable.delDeriveVariableList(this.delGroupId).then(result => {
                    if(result.data.success === true){
                        this.$message(result.data.message);
                        this.getDeriveList();
                        this.dialog.delDeriveVariable = false;
                    }
                }).catch(result =>{
                });
            },
	        //取消按钮重新拉数据
            reloadForm(){
                this.dialog.addDeriveVariable = false
                this.getDeriveList();
                this.getVariableTypeList();
            },
            submitRule(){
                this.$validator.validateAll().then((valid) => {
					if(valid){
					    this.reportRuleString();
					    this.variable.subject=JSON.parse(this.tempVariable).subject;
                        if(this.variable.id){
                            api.riskVariable.editDeriveVariableList(this.variable).then(result => {
                                if(result.data.success === true){
                                    this.$message(result.data.message);
                                    this.getDeriveList();
                                    this.dialog.addDeriveVariable = false;
                                }
                            }).catch(result =>{
                                //this.loading.btn = false;
                            });
                        }else {
	                        //this.variable.subjectDataType='';
                            api.riskVariable.addDeriveVariableList(this.variable).then(result => {
                                if(result.data.success === true){
                                    this.$message(result.data.message);
                                    this.getDeriveList();
                                    this.dialog.addDeriveVariable = false;

                                }
                            }).catch(result =>{
                                //this.loading.btn = false;
                            });
                        }
					}
                });
            }

        }
    }
</script>
