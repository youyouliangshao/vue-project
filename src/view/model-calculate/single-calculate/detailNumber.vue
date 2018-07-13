<!--模型配置首页-->
<template>
    <div class="detection-index">
        <div class="breadcrumb">
            <el-breadcrumb>
                <el-breadcrumb-item class="history-nolink">
                    <i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
                    <span>{{page.mainname}}</span></el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: url }" class="history-watch">{{page.name}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: urls,query:page }" class="history-watch">{{page.themeName}}_{{page.groupName}}</el-breadcrumb-item>
                <el-breadcrumb-item class="history-watch">测算详情</el-breadcrumb-item>
            </el-breadcrumb>
            <router-link :to="{ name: urls,query:page }"><el-button type="primary" class="fr back-to-btn mgt10-mgr8">返回上一级</el-button></router-link>
        </div>
        <div class="variable-main single-list">
            <p class="single-list-ps">{{codeName}}</p>
            <div class="single-number-content">
                <p class="single-number-p">描述性统计分析
                    <span class="single-number-cust">	<el-button class="export-btn set-btn " @click="exportAnalysis"><i class="el-icon-upload2"></i>&nbsp;导出</el-button></span>
                </p>
                <el-row class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">数量（非空值数量）</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(list.nonNullNum)}}</div></el-col>
                </el-row>
                <el-row >
                    <el-col :span="12"><div class="grid-contents bg-purple">均值</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(list.average)}}</div></el-col>
                </el-row>
                <el-row class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">方差</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(list.variance)}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="12"><div class="grid-contents bg-purple">众数</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(modes)}}</div></el-col>
                </el-row>
                <el-row  class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">变异系数</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(list.variation)}}</div></el-col>
                </el-row>

            </div>
            <div class="single-number-content">
                <p class="single-number-p">分位数分布
                    <span class="single-number-cust">	<el-button class="export-btn set-btn " @click="exportPercentile"><i class="el-icon-upload2"></i>&nbsp;导出</el-button></span>
                </p>
                <el-row class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">100% 最大值</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile100)}}</div></el-col>
                </el-row>
                <el-row >
                    <el-col :span="12"><div class="grid-contents bg-purple">99%</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile99)}}</div></el-col>
                </el-row>
                <el-row class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">95%</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile95 )}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="12"><div class="grid-contents bg-purple">90%</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile90)}}</div></el-col>
                </el-row>
                <el-row  class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">75% Q3</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile75)}}</div></el-col>
                </el-row>
                <el-row >
                    <el-col :span="12"><div class="grid-contents bg-purple">50% 中位数</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile50)}}</div></el-col>
                </el-row>
                <el-row class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">25% Q2</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile25)}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="12"><div class="grid-contents bg-purple">10%</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile10)}}</div></el-col>
                </el-row>
                <el-row  class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">5%</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile5)}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="12"><div class="grid-contents bg-purple">1%</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile1)}}</div></el-col>
                </el-row>
                <el-row  class="single-number-background">
                    <el-col :span="12"><div class="grid-contents bg-purple">0% 最小值</div></el-col>
                    <el-col :span="12"><div class="grid-contents bg-purple-light">{{fit(percentile.percentile0)}}</div></el-col>
                </el-row>
            </div>
            <div class="single-number-content">
                <p class="single-number-p">条形分布统计图
                </p>
                <div id="number_chart" style="height: 375px;">

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../../api/api'
    import axios from '../../../api/http'
    import commonjs from '../../../assets/js/common'
    import echarts from 'echarts'
    export default {
        created () {
            this.pageInfo();
            this.getList();
        },
        data () {
            return {
                //页面信息
                page : {
                    mainname:'',
                    name : '',
                    group:'',
                    themeName:'',
                    groupName:'',

                },
                url : '/single-calculate',
                urls:'single-detail',
                list:{},
                groupId:'',
                modelType:'',
                codeName:'',
                code:'',
                listNumber:[],
                modes:'',
                percentile:{},
                //条形图
                optionLines: {
                    title:{
                        text:'',
                        show:false
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: function (params){
                            var str1='';
                            if(params[0].value=='-'){
                                str1='-';
                            }else{
                                str1=params[0].value;
                            }
                            return params[0].seriesName + ' : ' + str1


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
                    legend: {
                        x:'left',
                        itemWidth:12,
                        itemHeight:12,
                        selectedMode:true,
                        itemGap:28,
                        padding: [15, 20, 12, 16],
                        data: ['数量']
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
                            max:null,
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
                            name:'数量',
                            type:'bar',
                            barWidth:30,
                            yAxisIndex:0,
                            data:[],
                            itemStyle:{
                                normal:{
                                    color:'#50e399'
                                }
                            }
                        }
                    ]
                },
            }
        },
        watch:{
            $route : 'pageInfo'
        },
        methods: {
            fit(val){
                return commonjs.utilsIsEffective(val)
            },
            //详情页
            pageInfo(){
                this.page.mainname=this.$route.query.mainname;
                this.page.name=this.$route.query.name;
                this.page.group=this.$route.query.group;
                this.page.themeName=this.$route.query.themeName;
                this.page.groupName=this.$route.query.groupName;
                this.codeName=this.$route.query.codeName;
                this.code=this.$route.query.code;
            },
            //列表
            getList(){
                api.singleCalculateList.getListAnalysis({name:this.code}).then(result => {
                    this.list=result.data.data;
                    if(this.list.mode && this.list.mode.length>0){
                        for(let index in this.list.mode){
                            if(index>0){
                                this.modes+=','+this.list.mode[index]
                            }else{
                                this.modes=this.list.mode[index]
                            }
                        }
                    }else{
                        this.modes=''
                    }
                    //条形图

                    /*if(this.list.barChartData&&this.list.barChartData.length>0){*/
                       for(let index in this.list.barChartData){
                            if(this.list.barChartData[index].midValue != ''||this.list.barChartData[index].midValue != null ||this.list.barChartData[index].midValue != undefined){
                                this.optionLines.xAxis.data.push(this.list.barChartData[index].midValue);
                            }else{
                                this.optionLines.xAxis.data.push('');
                            }
                            if(this.list.barChartData[index].count != ''||this.list.barChartData[index].count != null ||this.list.barChartData[index].count != undefined){
                                this.optionLines.series[0].data.push(this.list.barChartData[index].count);
                            }else{
                                this.optionLines.series[0].data.push('');
                            }
                        }
                        this.optionLines.title.text=this.page.themeName+'_'+this.page.groupName+'_'+ this.codeName+'-条形分布统计图-';
                        var chartLine = this.$echarts.init(document.getElementById('number_chart'));

                        chartLine.setOption(this.optionLines);
                  /*  }else{

                    }*/
                }).catch(result => {
                });
                api.singleCalculateList.getListPercentile({name:this.code}).then(result => {
                    this.percentile=result.data.data;
                }).catch(result => {
                });
            },
            exportAnalysis(){
                window.location.href=api.singleCalculateList.exportAnalysis(this.code);
            },
            exportPercentile(){
                window.location.href=api.singleCalculateList.exportPercentile(this.code);
            },
        }
    }
</script>