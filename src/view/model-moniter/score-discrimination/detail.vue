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
				</el-row>
				<el-row>
					<el-col :span="24">
						<p class="mt5 f18">监控详情</p>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="w200">
						<p class="mt5">建模时点：<span>{{modelList.modelingAt}}</span></p>
						<span><i class="warn-icon bicon-mark"></i></span>
					</el-col>
					<el-col class="w200">
						<p class="mt5">监控时点：<span>{{modelList.monitoringAt}}</span></p>
					</el-col>
				</el-row>
			</div>
			<div class="echart-panel">
				<el-row>
					<el-col :span="11">
						<div class="left-chart">
							<div class="chart-title">
								<h1>Kolmogorov-Smirnov校验</h1>
							</div>
							<el-col :span="24">
								<div id="ks_chart" style="height: 420px;">

								</div>
							</el-col>
						</div>
					</el-col>
					<el-col :span="2">
						&nbsp;
					</el-col>
					<el-col :span="11">
						<div class="right-chart">
							<div class="chart-title">
								<h1>吉尼系数</h1>
							</div>
							<el-col :span="24">
								<div id="gini_chart" style="height: 420px;">

								</div>
							</el-col>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-row>
				<el-col :span="24">
					<el-button class="export-btn set-btn fr" @click="exportDiscrimination"><i class="el-icon-upload2"></i>&nbsp;导出</el-button>
				</el-col>
			</el-row>
			<div>
					<el-table
							:data="modelList.mtrScoreDistinguishDtoListTotal"
							border
							style="overflow-x:auto"
							class="mt20 w1800"
					>
						<el-table-column
								label="序号"
						>
							<template scope="scope">
								{{scope.$index+1}}
							</template>
						</el-table-column>
						<el-table-column
								label="评分等级"
								prop="scoreGrade"
						        width="180"
						>
						</el-table-column>
						<el-table-column
								label="好账户数"
								prop="goodNum"
						>
						</el-table-column>
						<el-table-column
								label="好账户数列占比"
								prop="goodPercent"
						>
							<template scope="scope">
								<div v-if="scope.row.goodPercent != undefined">{{((scope.row.goodPercent*100).toFixed(2))+'%'}}</div>
							</template>
						</el-table-column>
						<el-table-column
								label="坏账户数"
								prop="badNum"
						>
						</el-table-column>
						<el-table-column
								label="坏账户数列占比"
								prop="badPercent"
						>
							<template scope="scope">
								<div v-if="scope.row.badPercent != undefined">{{((scope.row.badPercent*100).toFixed(2))+'%'}}</div>
							</template>
						</el-table-column>
						<el-table-column
								label="累计好账户占比（A）"
								width="140"
								prop="goodTotalPercent"
						>
							<template scope="scope">
								<div v-if="scope.row.goodTotalPercent != undefined">{{((scope.row.goodTotalPercent*100).toFixed(2))+'%'}}</div>
							</template>
						</el-table-column>
						<el-table-column
								label="累计坏账户占比（B）"
								width="140"
								prop="badTotalPercent"
						>
							<template scope="scope">
								<div v-if="scope.row.badTotalPercent != undefined">{{((scope.row.badTotalPercent*100).toFixed(2))+'%'}}</div>
							</template>
						</el-table-column>
						<el-table-column
								label="KS=max|A-B|"
								prop="ks"
						>
							<template scope="scope">
								<div v-if="scope.row.ks != undefined">{{((scope.row.ks).toFixed(2))}}</div>
							</template>
						</el-table-column>
						<el-table-column
								label="GINI"
								prop="gini"
						>
							<template scope="scope">
								<div v-if="scope.row.gini != undefined">{{((scope.row.gini).toFixed(3))}}</div>
							</template>
						</el-table-column>
					</el-table>
			</div>
		</div>
	</div>
</template>
<script>
    import api from '../../../api/api'
    import axios from '../../../api/http'
    import echarts from 'echarts'
    export default {
        created () {
            this.pageInfo();
        },
        mounted(){
            this.getChartAndTableTata();
        },
        data () {
            return {
                modelList:{},
	            chartList:{
                    arrGood:[],
                    arrBad:[],
                    bar1:[],
                    bar2:[],
		            ksData:[],
		            ksDatax:[
		                [0,0]
		            ]
	            },
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
                    url : '/score-discrimination',
                    type : ''
                },

                optionKs:{
                    title:{
                      text:'',
                      show:false
                    },
	                grid:{
                        left:'65'
	                },
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params){
                            return '评分区间:'+params.name + '<br/>'
                                + params.seriesName + ' : ' + params.value +'%'+ '<br/>'


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
                    legend: {
                        x:'left',
                        itemWidth:12,
                        itemHeight:12,
                        itemGap:28,
                        padding: [15, 20, 12, 16],
                        data: ['累计好账户占比', '累计坏账户占比']
                    },
                    xAxis :
                        {
                            name:'class',
                            type : 'category',
                            data : ['1','2','3','4','5','6','7'],
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#888'
                                }
                            },
                            axisTick:{
                                show:false
                            }
                        }
                    ,
                    yAxis :
                        {
                            type : 'value',
                            name: '累\n计\n占\n比',
                            // min : 0,
                            // max : 100,
                            nameLocation:'middle',
                            nameRotate:0,
                            nameGap:43,
                            axisLabel: {
                                textStyle: {
                                    color: '#888'
                                },
                                formatter: '{value}%'
                            },
                            boundaryGap: false,
                            splitLine: {show: false},
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#888'
                                }
                            },
                            nameTextStyle: {
                                color: '#888'
                            },
                            axisTick:{
                                show:false
                            }
                        },
                    series : [
                        {
                            name:'累计好账户占比',
                            type:'line',
                            smooth: true,
                            symbol:'roundRect',
                            data:[],
                            itemStyle:{
                                normal: {
                                    color: "#50e399"
                                }
                            }
                        },
                        {
                            name:'累计坏账户占比',
                            type:'line',
                            smooth: true,
                            symbol:'roundRect',
                            data:[],
                            itemStyle:{
                                normal:{
                                    color:'#ff6477'
                                }
                            }
                        },
                        {
                            name:'累计坏账户百分比2',
                            type:'bar',
                            stack: '1',
                            barWidth:6,

                            data:[],
                            itemStyle:{
                                normal:{
                                    color:'#fff'

                                },
                                emphasis:{
                                    color:'rgba(0,0,0,0)'
                                }
                            }
                        },
                        {
                            name:'KS=',
                            type:'bar',
                            stack: '1',
                            barWidth:6,
                            data:[],

                            itemStyle:{

                                normal:{
                                    color:'#BAE9FF'


                                }
                            }
                        }
                    ]
                },
                optionGini:{
                    title:{
                        text:'',
                        show:false
                    },
                    grid:{
                        left:'65'
                    },
                    tooltip : {
                        trigger: 'item',
			               formatter: function (params){
				               if(params.seriesName == 'line1'){
                                   return '累计好账户占比:'+params.data[0] +'%'+'<br/>'
                                       +' 累计坏账户占比: ' + params.data[1] +'%'+ '<br/>'
				               }


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
                    xAxis :
                        {
                            name: '累计好账户占比',
                            type : 'value',
                            nameLocation:'middle',
                            nameGap:28,
                            splitLine: {show: false},
                           /* max: 100,*/
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#888'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#888'
                                },
                                formatter: '{value}%'
                            },
                           axisTick:{
                                show:false
                            }
                        }
                    ,
                    yAxis :
                        {
                           /* max: 100,*/
                            type: 'value',
                            name: '累\n计\n环\n账\n户\n占\n比',
                            nameLocation:'middle',
                            nameRotate:0,
                            nameGap:43,
                            boundaryGap: false,
                            splitLine: {show: false},
                            nameTextStyle: {
                                color: '#888'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#888'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#888'
                                },
                                formatter: '{value}%'
                            },
                            axisTick:{
                                show:false
                            }
                        },
                    series : [
                        {
                            type:'line',
	                        name:'line1',
                            smooth: true,
                            symbol:'roundRect',
                            data:[],
                            itemStyle:{
                                normal: {
                                    color: "#50e399"
                                }
                            }
                        },
                        {
                            type:'line',
                            name:'line2',
                            smooth: true,
                            symbol:'roundRect',
                            data:[],
                            itemStyle:{
                                normal: {
                                    color: "#efefef"
                                }
                            }
                        },
                    ]
                }
            }
        },
        watch:{
            $route : 'pageInfo'
        },
        methods: {
            //详情页
            pageInfo(){
                this.page.mainname=this.$route.query.mainname;
                this.page.name=this.$route.query.name;
                this.formData.modelName=this.$route.query.id;
            },
            getChartAndTableTata(){
                api.modelMoniter.getDiscriminationList({riskModelId:this.formData.modelName}).then(result => {
                    if(result.data.success == true){
                        this.modelList=result.data.data;
                        var objArr=this.modelList.mtrScoreDistinguishDtoList
                        for(var i=0;i<objArr.length;i++){
                            var arr=['','']
							this.chartList.arrGood.push(objArr[i].goodTotalPercent);
                            this.chartList.arrBad.push(objArr[i].badTotalPercent);
                            arr[0]=objArr[i].goodTotalPercent;
                            arr[1]=objArr[i].badTotalPercent;
                            this.chartList.ksData.push(arr);
                        };
                        var xArr1=[];
                        var xArr2=[];
                        for(var i=0;i<objArr.length;i++){
                            xArr1.push(objArr[i].goodTotalPercent);
                            xArr2.push(objArr[i].badTotalPercent);
                        }
                        var maxX1=Math.max.apply(null, xArr1)
                        var maxX2=Math.max.apply(null, xArr2)
	                    if(maxX1>maxX2){
                            this.chartList.ksDatax.push([maxX2,maxX2])
	                    }else{
                            this.chartList.ksDatax.push([maxX1,maxX1])
	                    }
                        //GINI线
                        this.optionGini.series[0].data=this.chartList.ksData;
	                    //GINI坐标对角线
                        this.optionGini.series[1].data=this.chartList.ksDatax;

                        this.getFourVal(this.chartList.arrGood,this.chartList.arrBad,this.chartList.bar1,this.chartList.bar2);


                        this.optionKs.title.text=this.modelList.modelType+'-'+this.modelList.modelName+'-KS校验-'+window.common.getNowFormatDate();
                        this.optionGini.title.text=this.modelList.modelType+'-'+this.modelList.modelName+'-GINI系数-'+window.common.getNowFormatDate();
	                    this.optionKs.series[0].data=this.chartList.arrGood;
                        this.optionKs.series[1].data=this.chartList.arrBad;
                        this.optionKs.series[2].data=this.chartList.bar1;
                        this.optionKs.series[3].data=this.chartList.bar2;
                        //画KS图表
                        var myChartKs = this.$echarts.init(document.getElementById('ks_chart'))
                        myChartKs.setOption(this.optionKs);
						//画GINI图表
                        var myChartGini = this.$echarts.init(document.getElementById('gini_chart'))
                        myChartGini.setOption(this.optionGini);
                    }
                }).catch(result => {

                });
            },
            exportDiscrimination(){
                window.location.href=api.modelMoniter.exportDiscriminationList(this.formData.modelName);
            },
            // 获取评分模型变量稳定性数据
            getFourVal:function(a,b,c,d){
		        /*取数组最小值*/
                for(var i=0;i<=a.length;i++){
                    if((a[i]-b[i])>0){
                        c.push(b[i]);
                    }else if((a[i]-b[i])<0){
                        c.push(a[i]);
                    }else if((a[i]-b[i])==0){
                        c.push(a[i]);
                    }

                }
		        /*取数组相减绝对值*/
                for(var i=0;i<=a.length;i++){
                    if((a[i]-b[i])>0){
                        d.push(a[i]-b[i]);
                    }else if((a[i]-b[i])<0){
                        d.push(b[i]-a[i]);
                    }else if((a[i]-b[i])==0){
                        d.push(0);
                    }

                }
                return c;
                return d;
            },
        }
    }
</script>