<!--模型配置首页-->
<template>
    <div class="detection-index">
        <div class="breadcrumb">
            <el-breadcrumb>
                <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
                <el-breadcrumb-item class="history-nolink">
                    <i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
                    风控结果查询</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/history-search' }">历史查询结果清单</el-breadcrumb-item>
                <el-breadcrumb-item class="history-watch">{{page.modelName}}</el-breadcrumb-item>
            </el-breadcrumb>
            <router-link :to="{ path: page.url }"><el-button type="primary" class="fr back-to-btn mgt10-mgr8">返回上一级</el-button></router-link>
        </div>
        <!--查询详情组件-->
        <!--<search-detail :model="model" v-on:infoUpdate="infoUpdate"></search-detail>-->
        <div class="page-inner-main">
            <div class="handle-title clearfix">
                <div class="page-inner-main obj-background">
                    <div class="handle-title clearfix obj-top">
                        <h2 class="f20 tl fl">查询内容：</h2>
                        <el-button @click="exportResult" class="export-btn set-btn fr"><i class="el-icon-upload2"></i>&nbsp;导出查询结果</el-button>
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
                                        <p class="tc obj-pt"><span v-html="fit(searchResult.rstRiskQueryGradeList.gradeConditionName)"></span></p>
                                    </div>
                                    <p class="ahp-body tc pt80" ><span v-html="fit(searchResult.rstRiskQueryGradeList.gradeName)"></span><span v-if="fitBool(searchResult.rstRiskQueryGradeList.gradeConditionName)"style="color: #333; font-size: 14px; font-weight: normal;">级</span></p>
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
                                        <p class="ahp-body tc pt80" ><span v-html="fitt(searchResult.rstRiskQueryGradeList.riskPricePercent)"></span><span v-if="fitBool(searchResult.rstRiskQueryGradeList.riskPricePercent)"style="color: #333; font-size: 14px; font-weight: normal;">%</span></p>
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
                                <h1 class="touch-title mb20">触碰规则</h1>
                                <el-table :data="searchResult.rstRiskQueryRuleList" empty-text="未触碰规则" class="if-emptytable">
                                    <el-table-column
                                            prop="ruleGroupName"
                                            label="规则组"
                                    >
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
    </div>
</template>
<script>
    import api from '../../api/api'
    import searchDetail from '../../components/search-detail.vue'
    import commonjs from '../../assets/js/common'
    export default {
        created () {
            this.getSearchResult();
        },
        components: {
            'search-detail': searchDetail
        },
        data () {
            return {
                riskPolicy:[],
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
                rules : {
                    normName : 'required',
                    normRequire : 'required'
                },
                searchResult:{
                    riskQueryRecord:{
                        createdAt:'-',
                        modelType:'-',
                        modelName:'-',
                        modelObjects:'-',

                    },
                    rstRiskQueryGradeList:{
                        ahpScore:'—',
                        gradeConditionName:'—',
                        gradeName:'—',
                        riskLevel:'—',
                        riskPricePercent:'—',
                        riskDiscountRate:'—',
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
                dialog:{
                    changeModel:false
                },
                form:{
                    type:'',
                    name:''
                },
                //页面信息
                page : {
                    listUrl : '',
                    typeName : '',
                    modelName : '',
                    url : "/history-search",
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
            fitt(tablecell){
                if (tablecell == undefined || tablecell == null || tablecell== '' || tablecell == 0 || tablecell == '—') {
                    return "—";
                }else{
                    return tablecell;
                    alert('1')
                }

            },
            fitBool(val){
                return commonjs.utilsIsEffectiveBool(val)
            },
            //模型类型转换
            convertMessage(row, column, cellValue){
                let returnValue='';
                switch(cellValue){
                    case '1':
                        returnValue='反欺诈模型';
                        break;
                    case '2':
                        returnValue='预授信模型';
                        break;
                    case '3':
                        returnValue='授信模型';
                        break;

                }
                return returnValue;
            },
            //格式化对象列表
            formatObj(cellValue){
                var html='';
                var objStr=JSON.parse(cellValue)
                for(var i=0;i<objStr.length; i++){
                    html+=objStr[i].riskModelObjectName+':'+objStr[i].params;
                }
                return html
            },
            // 获取查询结果详情
            getSearchResult(){
                api.riskSearch.getHistoryResult(this.$route.params.uuid).then(result => {
                    this.page.modelName = result.data.data.riskQueryRecord.modelName;
                    this.resultModelType = result.data.data.riskQueryRecord.modelType;
                    let arObj={};
                    arObj=result.data.data.riskQueryRecord;
                    this.searchResult.riskQueryRecord=result.data.data.riskQueryRecord;
                    if(result.data.data.rstRiskQueryGradeList.length > 0 && result.data.data.rstRiskQueryGradeList[0]){
                        this.searchResult.rstRiskQueryGradeList=result.data.data.rstRiskQueryGradeList[0];
                        if(this.searchResult.rstRiskQueryGradeList.riskPricePercent !=undefined && this.searchResult.rstRiskQueryGradeList.riskPricePercent != null){
                            this.searchResult.rstRiskQueryGradeList.riskPricePercent=(parseFloat(result.data.data.rstRiskQueryGradeList[0].riskPricePercent)*100).toFixed(2);
                        }else{
                            this.searchResult.rstRiskQueryGradeList.riskPricePercent='—';
                        }

                    }
                    if(result.data.data.rstRiskQueryRuleList.length > 0){
                        this.searchResult.rstRiskQueryRuleList=result.data.data.rstRiskQueryRuleList;
                    }else {

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
                }).catch(result => {})
            },
            exportResult(){
                window.location.href = api.riskSearch.exportRiskSearchResult(this.$route.params.uuid)
            }
        }
    }
</script>
