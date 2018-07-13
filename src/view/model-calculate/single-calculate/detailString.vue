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
            <div class="single-number-content string-number">
                <p class="single-number-p">描述性统计分析
                    <span class="single-number-cust">	<el-button class="export-btn set-btn " @click="exportAnalysis"><i class="el-icon-upload2"></i>&nbsp;导出</el-button></span>
                </p>
                <el-row>
                    <el-col :span="8"><div class="grid-contents bg-purple">分组</div></el-col>
                    <el-col :span="8"><div class="grid-contents bg-purple-light">频数</div></el-col>
                    <el-col :span="8"><div class="grid-contents bg-purple-light">频率</div></el-col>
                </el-row>
                <el-row v-for="item in list.frequencyData">
                    <el-col :span="8"><div class="grid-contents bg-purple">{{item.groupName}}</div></el-col>
                    <el-col :span="8"><div class="grid-contents bg-purple-light">{{item.frequencyNum}}</div></el-col>
                    <el-col :span="8"><div class="grid-contents bg-purple-light">{{item.frequency}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="grid-contents bg-purple">总计</div></el-col>
                    <el-col :span="8"><div class="grid-contents bg-purple-light">{{frequencyTotal.frequencyNum}}</div></el-col>
                    <el-col :span="8"><div class="grid-contents bg-purple-light">{{frequencyTotal.frequency}}</div></el-col>
                </el-row>
            </div>
            <div class="single-number-content">
                <p class="single-number-p">频数分布饼状图
                </p>
                <div id="circle_chart" style="height: 375px;">

                </div>
            </div>
            <div class="single-number-content">
                <p class="single-number-p">
                    条形分布统计图
                </p>
                <div id="strip_chart" style="height: 375px;">

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
                frequencyTotal:{},
                percentile:{},
                //饼图配置项
                optionPie:{
                    title:{
                        text:'',
                        show:false
                    },
                    color:['#773F9B','#ffc537','#3582ff','#50e399','#ff3951','#EA7600','#5edbdc','#caa66d'],
                    animation: true,
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.name +':'+params.value
                        },
                        backgroundColor: '#f4f9ff',
                        borderWidth: 1,
                        padding: [8, 11],
                        borderColor: '#65a1e7',
                        textStyle: {
                            color: '#4080e8'
                        }
                    },
                    legend: {
                        orient : 'vertical',
                        /* x : 'left',*/
                        right:'32%',
                        top:95,
                        itemWidth:12,
                        itemHeight:12,
                        data:[],
                        selectedMode:false,
                        textStyle:{
                            color:'#888'
                        },
                        itemGap: 17,
                        selectedMode:true
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
                    calculable : false,
                    series : [
                        {
                            type:'pie',
                            radius : '55%',
                            center: ['36%', '50%'],
                            data:[],
                            label:{
                                normal:{
                                    show: true,
                                    formatter: '{d}%',
                                    textStyle:{
                                        color:'#4C4C4C'
                                    }
                                }
                            },
                            labelLine:{
                                normal:{
                                    show: true
                                    /* length2:0*/
                                }
                            }
                        }
                    ]
                },
                arrfrequencyNumPie:[],
                arrgroup:[],
                frequencyNum:[],
                frequency:[],
                //条形图
                optionLine: {
                    title:{
                        text:'',
                        show:false
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: function (params){
                            var str1='';
                            var str2='';
                            if(params[0].value=='-'){
                                str1='-';
                            }else{
                                str1=params[0].value;
                            }
                            if(params[1].value=='-'){
                                str2='-';
                            }else{
                                str2=params[1].value;
                            }
                            return params[0].seriesName + ' : ' + str1+ '<br/>'+ params[1].seriesName + ' : ' + str2 + '<br/>'


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
                        data: ['频数','频率']
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
                        },
                        {
                            type: 'value',
                            position: 'right',
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
                    this.frequencyTotal=this.list.frequencyTotal;
                    for(let index in this.list.frequencyData){
                        let obj={}
                        if(this.list.frequencyData[index].groupName != ''||this.list.frequencyData[index].groupName != null ||this.list.frequencyData[index].groupName != undefined){
                            obj.name=this.list.frequencyData[index].groupName;
                            this.arrgroup.push(this.list.frequencyData[index].groupName)
                        }else{
                            obj.name='';
                            this.arrgroup.push('')
                        }
                        if(this.list.frequencyData[index].frequencyNum != ''||this.list.frequencyData[index].frequencyNum != null ||this.list.frequencyData[index].frequencyNum != undefined){
                            obj.value=this.list.frequencyData[index].frequencyNum;
                            this.frequencyNum.push(this.list.frequencyData[index].frequencyNum)
                        }else{
                            obj.value='';
                            this.frequencyNum.push('')
                        }
                        if(this.list.frequencyData[index].frequency != ''||this.list.frequencyData[index].frequency != null ||this.list.frequencyData[index].frequency != undefined){
                            this.frequency.push(this.list.frequencyData[index].frequency)
                        }else{
                            this.frequency.push('')
                        }
                        this.arrfrequencyNumPie.push(obj);
                    }
                    //饼图
                    this.optionPie.series[0].data=this.arrfrequencyNumPie;
                    for(let index in this.arrgroup){
                        this.optionPie.legend.data.push(this.arrgroup[index]);
                    }
                    this.optionPie.title.text=this.page.themeName+'_'+this.page.groupName+'_'+ this.codeName+'-频数分布饼状图-';
                    var chartPie = this.$echarts.init(document.getElementById('circle_chart'));
                    chartPie.setOption(this.optionPie);
                    //条形
                    this.optionLine.series[0].data=this.frequencyNum;
                    this.optionLine.series[1].data=this.frequency;
                    this.optionLine.xAxis.data=this.arrgroup;
                    this.optionLine.title.text=this.page.themeName+'_'+this.page.groupName+'_'+ this.codeName+'-条形分布统计图-';
                    var chartLine = this.$echarts.init(document.getElementById('strip_chart'));
                    chartLine.setOption(this.optionLine);
                }).catch(result => {
                });
            },
            exportAnalysis(){
                window.location.href=api.singleCalculateList.exportAnalysiss(this.code);
            },
        }
    }
</script>