<!--模型配置首页-->
<template>
	<div class="detection-index">
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
	            <el-breadcrumb-item class="history-nolink">
                    <i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>模型配置</el-breadcrumb-item>
	            <el-breadcrumb-item :to="{ path: page.url }" class="history-watch">{{page.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="page-main">
            <div class="model-list" :class="this.$route.name" v-loading="loading">
                <div class="model-item add-model" @click="addModel">
                    <i class="el-icon-plus"></i>
                    <p class="add-model-msg">点击新建</p>
                </div>
                <div class="model-item" v-for="item in modelList">
                   <span @click="getModelStatus(item)">
                          <div class="model-item-bg"></div>
                        <p class="model-tit">{{item.modelNameSon}}</p>
                        <p v-if="item.status === 'Y'" class="model-status"><i class="icon-enable"></i>启用中</p>
                        <p v-else-if="item.status === 'N'" class="model-status"><i class="icon-disable"></i>禁用中</p>
                        <p class="model-desc" :title="item.modelDesc">模型描述：{{item.modelDesc || '暂无'}}</p>
                   </span>
                </div>
            </div>
        </div>
        <el-dialog :title="'新建'+ page.name" size="tiny" :visible.sync="modelDialog">
            <el-form :model="model" label-width="80px" @submit.native.prevent>
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
                <el-button @click="modelDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitModel" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
    import api from '../../api/api'
    import store from  '../../store/index'
    export default {
       /* name:"offlineImport",*/
        created () {
            this.pageInfo();
        },
        data () {
            return {
//                页面信息
                page : {
                    name : "",
                    url : "",
                    type : ''
                },
                loading : false,
                btnLoading : false,
//                模型列表
                modelList: [],
                modelDialog: false,
                model: {
                    riskModelId: null,
                    subModelType: null,
                    modelNameSon: '',
                    modelDesc: ''
                },
                rules: {
                    modelName: 'required|max:20',
                    modelDesc: 'max:50'
                }
            }
        },
        watch : {
            '$route': 'pageInfo'
        },
        components : {

        },
        methods: {
            pageInfo(){
                this.loading = true;
                // 根据路由设置页面信息
                if(this.$route.name === 'antiFraudList'){
                    this.page.name = "反欺诈模型";
                    this.page.type = 1
                }else if(this.$route.name === 'preModelList'){
                    this.page.name = "预授信模型";
                    this.page.type = 2
                }else if(this.$route.name === 'authorizedList'){
                    this.page.name = "授信模型";
                    this.page.type = 3
                }
                this.page.url = this.$route.path;
                api.model.list(this.page.type).then(result => {
                    this.modelList = result.data.data;
                    this.loading = false;
                }).catch(result => {
                    this.loading = false;
                })
            },
            getModelStatus(item){
                var url=this.detailLink(item);
                this.$router.push(url)
                 var status=(item.status)
                 if(status == 'Y'){
                    store.commit("storeAbleState",false);
                 }else{
                    store.commit("storeAbleState",true);
                 }
            },
            detailLink(item){
                let link = '';
                if(item.signFlag === 'Y'){

                    link = this.page.url +'/detail?id=' + item.id
                }else {
                    link = this.page.url +'/obj?id=' + item.id
                }
                return link
            },
//            打开添加模型弹层
            addModel(){
                this.model.modelNameSon = '';
                this.model.modelDesc = '';
                this.$validator.errors.clear();
                this.modelDialog = true
            },
//            提交添加模型
            submitModel(){
                this.$validator.validateAll().then((valid) => {
                    if(valid === true){
                        this.btnLoading = true;
                        this.model.riskModelId = this.page.type;
                        this.model.subModelType = this.page.type;
                        api.model.add(this.model).then(result => {
                            console.log("then:"+result);
                            this.pageInfo();
                            this.$message.success('新建成功');
                            this.modelDialog = false;
                            this.btnLoading = false;
                        }).catch(result => {
                            this.btnLoading = false;
                        });
                    }
                })
            }
        }
    }
</script>
