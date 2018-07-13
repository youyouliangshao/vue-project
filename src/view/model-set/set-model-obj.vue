<!-- set-model-obj 设置模型对象页面 -->
<template>
    <div class="detection-index" v-loading.fullscreen.lock="loading">
        <div class="breadcrumb">
            <el-breadcrumb>
                <el-breadcrumb-item class="history-nolink">
                    <i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
                    模型配置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: page.listUrl }">{{page.typeName}}</el-breadcrumb-item>
                <el-breadcrumb-item class="history-watch">{{model.modelNameSon}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="background-color: #F3F4F8 ;height: 18px"></div>
        <div class="set-margin">
            <div class="model-tab-panel mode-tab-cover" :class="this.$route.name">
                <div class="panel-hd">
                    <div class="model-item-bg"></div>
                    <h2 class="page-tit">
                        {{model.modelNameSon}}
                        <span v-if="model.status === 'Y'"><i class="icon-enable"></i>启用中</span>
                        <span v-else=""><i class="icon-disable"></i>禁用中</span>
                    </h2>
                    <P class="model-desc">模型描述：{{model.modelDesc || '暂无'}}</P>
                </div>
            </div>
            <div style="height: 70px;background-color: white"></div>
                <div class="obj-set-opt">
                    <div class="obj-message">
                        <i class="el-icon-warning"></i> 请首先设置模型对象信息
                    </div>
                    <div class="obj-opt">
                        <el-button @click="backList">取 消</el-button>
                        <el-button type="primary" @click="confirmObj">确 定</el-button>
                    </div>
                </div>
                <div class="obj-inner auto-ht">
                    <el-row class="obj-item">
                        <el-col  :span="12"class="obj-item-label ">
                            <div class="obj-item-title" >
                                <p class="pre-model-box">
                            分析对象<span class="obj-item-desc">(必填)</span>：
                                 </p>
                             
                            </div>
                            <el-form :inline="true" label-width="60px" class="set-model-form">
                                <el-form-item label="名称" :class="{'is-error': errors.has('分析对象名称')}" class="mt23 " >
                                    <el-input v-validate="rules.objName" v-model="analyzeObj.objectName" data-vv-value-path="currentValue" data-vv-name="分析对象名称" class="name_label"></el-input>
                                    <div v-show="errors.has('分析对象名称')" class="el-form-item__error ">{{ errors.first('分析对象名称') }}</div>
                                </el-form-item>
                                <el-form-item label="主题" :class="{'is-error': errors.has('分析对象主题|select')}" >
                                    <el-select v-validate="'required'" v-model="analyzeObj.SubjectAndCatogory" data-vv-value-path="value" data-vv-name="分析对象主题|select" placeholder="请选择">
                                        <el-option
                                                v-for="item in variableTypeList"
                                                :label="item.subject"
                                                :value="JSON.stringify({subject:item.subject,categoryId:item.categoryId})">
                                        </el-option>
                                    </el-select>
                                    <input type="hidden" v-for="item in variableTypeList" :value="item.categoryId">
                                    <div v-show="errors.has('分析对象主题|select')" class="el-form-item__error">{{ errors.first('分析对象主题|select') }}</div>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="12" class="obj-item-label">
                            <div class="obj-item-title">
                                <p class="pre-model-box">
                                    关联对象 <span class="obj-item-desc">(选填)</span>：
                                </p>
                            </div>
                            <el-form :inline="true" label-width="60px" >
                                <template v-for="(objItem,index) in relevanceObjArr" >
                                    <div class="set-form-model set-form-margin">
                                        <el-form-item label="名称" :class="{'is-error': errors.has('关联对象名称'+(index + 1))}" class="set-margintop">
                                            <el-input v-validate="rules.objName" v-model="objItem.objectName" data-vv-value-path="currentValue" :data-vv-name="'关联对象名称'+(index + 1)" style="width: 223px"></el-input>
                                            <div v-show="errors.has('关联对象名称'+(index + 1))" class="el-form-item__error">{{ errors.first('关联对象名称'+(index + 1)) }}</div>

                                        </el-form-item>
                                        <el-form-item label="主题" :class="{'is-error': errors.has('关联对象主题'+(index + 1)+'|select')}">
                                            <el-select v-model="objItem.SubjectAndCatogory" placeholder="请选择" v-validate="'required'" data-vv-value-path="value" :data-vv-name="'关联对象主题'+(index + 1)+'|select'" style="width: 223px">
                                                <el-option
                                                        v-for="item in variableTypeList"
                                                        :label="item.subject"
                                                        :value="JSON.stringify({subject:item.subject,categoryId:item.categoryId})">
                                                </el-option>
                                            </el-select>
                                            <div v-show="errors.has('关联对象主题'+(index + 1)+'|select')" class="el-form-item__error">{{ errors.first('关联对象主题'+(index + 1)+'|select') }}</div>
                                        </el-form-item>
                                        <span class="rule-item-oper rule-span-abs">
                                            <a href="javascript:;" @click="delObjItem(index)"><i class="el-icon-circle-cross"></i>删除</a>
                                         </span>
                                    </div>
                                </template>
                                <p class="w295 tl"><i @click="addObjItem" class="el-icon-plus"></i>&nbsp;&nbsp;添加关联对象</p>
                            </el-form>

                        </el-col>
                    </el-row>
                </div>
        </div>
      
    </div>
</template>
<script>
    import api from '../../api/api'
    export default {
        created() {
            this.pageInfo();
            this.getVariableTypeList();
        },
        data() {
            return {
                loading : false,
                rules : {
                    objName : 'required|max:20'
                },
                page : {
                    listUrl : '',
                    typeName : ''
                },
                model : {},
                variableTypeList: [

                ],
//                分析对象
                analyzeObj : {
                    riskModelId: this.$route.query.id,
                    objectType : 'A',
                    objectName : '',
                    objectSubject:'',
                    titleId:'',
                    SubjectAndCatogory : '',
                },
                relevanceObjArr : [

                ]
            }
        },
        components: {},
        watch: {},
        methods: {
            pageInfo(){
                this.loading = true;
                if(this.$route.name === 'antiFraudObj'){
                    this.page.listUrl = '/anti-fraud';
                    this.page.typeName = '反欺诈模型'
                }else if(this.$route.name === 'preModelObj'){
                    this.page.listUrl = '/pre-authorized';
                    this.page.typeName = '预授信模型'
                }else if(this.$route.name === 'authorizedObj'){
                    this.page.listUrl = '/authorized';
                    this.page.typeName = '授信模型'
                }
                api.model.detail({subModelId:this.$route.query.id}).then(result => {
                    this.model = result.data.data;
                    this.loading = false
                }).catch(result => {
                    this.loading = false
                })
                console.log(this.$route.name)
            },
            //  获取变量主题类型
            getVariableTypeList(){
                api.riskVariable.getVariableSubjectList({dataType:'B,C'}).then(result => {
                    this.variableTypeList = result.data.data;
                }).catch(result => {

                })
            },
//            返回列表页
            backList(){
                this.$router.push(this.page.listUrl)
            },
            // 添加对象数组
            addObjItem(){
                this.relevanceObjArr.push({
                    riskModelId: this.$route.query.id,
                    objectType : 'B',
                    objectName : '',
                    SubjectAndCatogory : '',
                    objectSubject : '',
                    titleId:''
                })
            },
            // 删除对象数组
            delObjItem(index){
                this.relevanceObjArr.splice(index,1);
            },
//            确认保存对象
            confirmObj(){
                this.$validator.validateAll().then(valid => {
                    if(valid){
                        let data = [];
                        var tempObj=this.analyzeObj;
                        tempObj.objectSubject=JSON.parse(tempObj.SubjectAndCatogory).subject;
                        tempObj.titleId=JSON.parse(tempObj.SubjectAndCatogory).categoryId;
                        data.push(tempObj);
                        for(var i=0;i<this.relevanceObjArr.length;i++){
                            var obj=this.relevanceObjArr[i];
                            obj.objectSubject=JSON.parse(obj.SubjectAndCatogory).subject;
                            obj.titleId=JSON.parse(obj.SubjectAndCatogory).categoryId;
                        }
                        data = data.concat(this.relevanceObjArr);
                        api.model.setModelObj(data).then(result => {
                            if(result.data.success === true){
                                this.$message(result.data.message);
                                setTimeout(()=>{
                                    this.$router.push({
                                        path : this.page.listUrl + '/detail',
                                        query : {id: this.model.id}
                                    })
                                },500)
                            }
                        }).catch(result => {
                            this.$message.error(result.message);
                        })
                    }
                })
            }
        }
    }
</script>
<style></style>