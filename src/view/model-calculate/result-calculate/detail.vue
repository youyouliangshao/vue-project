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
						<!--<p class="model-name-title"><span>{{modelType}}</span>_<span>{{modelName}}</span></p>-->
						<p class="model-name-title"><span>{{modelList.modelType}}</span>_<span>{{modelList.modelName}}</span></p>
					</el-col>
					<el-col :span="6">
						<el-button type="primary" class="fr ml5" @click="openCalculate"><i class=""></i>样本数据设置</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<p class="mt5 f18">测算详情</p>
					</el-col>
				</el-row>
			</div>
			<div class="echart-panel">
				<el-row>
					<el-col :span="24">
						<div class="full-chart clearfix">
							<div class="chart-title">
								<h1>样本数据评分分布图</h1>
							</div>
							<el-col :span="24">
								<div id="data_simple" style="height: 420px;">

								</div>
							</el-col>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<el-dialog @close="" title="样本数据设置" custom-class="obj-dialog" :visible.sync="dialog.simple" size="small" class="dialog-red">
			<el-form class="set-form-labers" label-width="100px" @submit.native.prevent>
				<el-form-item label="请求地址：">
					<div>{{popDetail.url}}</div>
				</el-form-item>
				<el-form-item label="接口样例：" label-width="400px">
					<div class=""><a href="javascript:;" class="copyto" :data-clipboard-text="popDetail.interfaceExample">复制</a></div>
				</el-form-item>
				<el-row>
					<el-col :span="10">
						<el-input type="textarea" readonly class="min200" v-model="popDetail.interfaceExample">
						</el-input>
					</el-col>
				</el-row>

			</el-form>
		</el-dialog>
	</div>
</template>
<script>
    import api from '../../../api/api'
    import axios from '../../../api/http'
    import echarts from 'echarts'
    import {profiles,cookie} from '../../../config'
    import Clipboard from 'clipboard'
    export default {
        created () {
            this.pageInfo();
            this.getExample();
        },
        data () {
            return {
                dialog:{
                  simple:false
                },
                popDetail:{},
                modelList:{},
                formData:{
                    modelType:'2,3',
                    paramType:'C',
                    modelName:'',
                },
                list:[],
                //页面名称
                urlName:'',
                //页面信息
                page : {
                    mainname:'',
                    name : '',
                    url : '/result-calculate',
                    type : ''
                },
                chartList:{
                    arrGrid:[],
                    arrBar:[],
                    arrx:[]
                },
                optionCalculate:{
                    title:{
                        text:'',
                        show:false
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: function (params){
                        /*    var str1='';
                            var str2='';
                            if(params[0].value=='-' || params[0].value==''){
                                str1='-';
                            }else{
                                str1=core.format.number(parseFloat(params[0].value),'#,##0');
                            }
                            if(params[1].value=='-' || params[1].value==''){
                                str2='-';
                            }else{
                                str2=parseFloat(params[1].value);
                            }*/
                            return params[0].seriesName + ' : ' + params[0].value+ '<br/>'+ params[1].seriesName + ' : ' + params[1].value + '<br/>'


                        },
                        axisPointer: {
                            type: 'cross',
                            lineStyle:{
                                type:'dashed'
                            }
                        },
                        backgroundColor:'#f4f9ff',
                        borderWidth:1,
                        padding:[8,11],
                        borderColor:'#65a1e7',
                        textStyle:{
                            color:'#4080e8'
                        }
                    },
/*                    legend: {
                        x:'left',
                        itemWidth:12,
                        itemHeight:12,
                        selectedMode:true,
                        itemGap:28,
                        padding: [15, 20, 12, 16],
                        data: ['项目数量','授信额度']
                    },*/
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        },
                        right:30
                    },
                    xAxis :{
                        name:'',
                        type : 'category',
                        data: [],
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#E5E5E5'
                            }
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#888888'
                            },
                            margin:15
                        },
                        axisTick:{
                            show:false
                        },
                        axisPointer:{
                            show:true,
                            label:{
                                show:false
                            },
                            lineStyle:{
                                width:1,
                                type:'dashed',
                                //color:'#4080E8'
                            }
                        }
                    },
                    yAxis: [
                        {
                            type: 'value',
                            position: 'left',
                            name: '',
                            min:0,
                            //max:credit.creditamount.initYaxisValue1,
                            offset:'15',
                            axisLabel: {
                                textStyle: {
                                    color: '#888'
                                },
                                formatter: '{value}'
                            },
                            axisLine: {
                                show:false
                            },
                            axisTick: {
                                show:false
                            },
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed'
                                }
                            }
                        },
                        {
                            type: 'value',
                            position: 'right',
                            name: '',
                            min:0,
                           // max:credit.creditamount.initYaxisValue2,
                            offset:'15',
                            axisLabel: {
                                textStyle: {
                                    color: '#888'
                                },
                                formatter: '{value}'
                            },
                            axisLine: {
                                show:false
                            },
                            axisTick: {
                                show:false
                            },
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:'频数',
                            type:'bar',
                            barWidth:30,
                            yAxisIndex:0,
                            data:[],
                            itemStyle:{
                                normal:{
                                    color:'#50e399'
                                }
                            }
                        },
                        {
                            name:'频率',
                            type:'line',
                            symbol:'rect',
                            yAxisIndex:1,
                            data:[],
                            itemStyle:{
                                normal:{
                                    color: "#fdb913"
                                }
                            }
                        }
                    ]
                }
            }
        },
        watch:{
            $route : 'pageInfo'
        },
        mounted(){
            this.getCalculateDetail();
            new Clipboard('.copyto');
        },
        methods: {
            //详情页
            pageInfo(){
                this.page.mainname=this.$route.query.mainname;
                this.page.name=this.$route.query.name;
                this.formData.modelName=this.$route.query.id;
            },
            exportDiscrimination(){
                window.location.href=api.modelMoniter.exportDiscriminationList(this.formData.modelName);
            },
            getCalculateDetail(){
                api.singleCalculateList.getCalculateList({riskModelId:this.formData.modelName}).then(result => {
                    if(result.data.success == true){
                        this.modelList=result.data.data;
                        var resArr=result.data.data.mtrScoreDistinguishDtoList;
                        for(var i=0;i<resArr.length;i++){
                            this.chartList.arrGrid.push(resArr[i].totalNum)
                            this.chartList.arrBar.push(resArr[i].totalNumPercent)
                            this.chartList.arrx.push(resArr[i].scoreGrade)
                        }
                        this.optionCalculate.series[0].data=this.chartList.arrGrid;
                        this.optionCalculate.series[1].data=this.chartList.arrBar;
                        this.optionCalculate.xAxis.data=this.chartList.arrx;

                        this.optionCalculate.title.text=this.modelList.modelType+'-'+this.modelList.modelName+'-样本数据评分分布图';
                        //画GINI图表
                        var myChartCalculate = this.$echarts.init(document.getElementById('data_simple'))
                        myChartCalculate.setOption(this.optionCalculate);
                    }
                }).catch(result => {

                });
            },
            strTrim(str){
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            openCalculate(){
                this.dialog.simple=true;
            },
	        getExample(){
                api.singleCalculateList.getCalculateExample({riskModelId:this.formData.modelName}).then(result => {
                    if(result.data.success == true){
                        this.popDetail=result.data.data;
                        var strArr=this.popDetail.interfaceExample;
                        var finalStr='';
                        for(var i=0;i<strArr.length;i++){
                            if(strArr[i] == '$'){
                                finalStr=finalStr+' \n '
                            }else{
                                finalStr+=this.strTrim(strArr[i])
                            }
                        }
                        this.popDetail.interfaceExample=finalStr;
                        this.popDetail.url=profiles.apiDomain() + ':8207'+this.popDetail.url;
                    }
                }).catch(result => {

                });
	        },

        }
    }
</script>