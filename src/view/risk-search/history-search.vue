<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风控结果查询</el-breadcrumb-item>
				<el-breadcrumb-item :to="{path:page.url}" class="history-watch">{{page.name}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="page-main page-padding">
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="24">
						<div>
							<el-form :inline="true" ref="form" label-width="" @submit.native.prevent>
								<el-form-item label="模型类型：">
									<el-select placeholder="全部" v-model="form.modelType" @change="changeModelType">
										<el-option label="全部" value=""></el-option>
										<el-option label="反欺诈模型" value="1"></el-option>
										<el-option label="预授信模型" value="2"></el-option>
										<el-option label="授信模型" value="3"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="模型名称：">
									<el-select placeholder="全部" v-model="form.modelName">
										<el-option label="全部" value=""></el-option>
										<el-option v-for="item in modelList" :label="item.modelNameSon" :value="item.modelNameSon"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="查询方式：">
									<el-select placeholder="请选择查询方式" v-model="form.queryMethod">
										<el-option label="全部" value=""></el-option>
										<el-option label="页面查询" value="P"></el-option>
										<el-option label="接口查询" value="I"></el-option>
									
									</el-select>
								</el-form-item>
								
								<div class="block">
									<span class="demonstration">查询时间 : &nbsp;&nbsp;&nbsp;</span>
									<el-date-picker
											v-model="form.startCreatedAt"
											type="date"
											placeholder="选择日期时间"
											format="yyyy-MM-dd"
									        @change="dateChangeStart"
									>
									</el-date-picker>
									<span class="demonstration">&nbsp;&nbsp;至&nbsp;&nbsp;</span>
									<el-date-picker
											v-model="form.endCreatedAt"
											type="date"
											placeholder="选择日期时间"
											align="right"
											format="yyyy-MM-dd"
											@change="dateChangeEnd"
											>
									</el-date-picker>
								</div>
								<el-form-item class="fr">
									<el-button type="primary" @click="getHistoryListed">筛选</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-table :data="modelHistoryList.list">
				<el-table-column
						prop="createdAt"
						label="查询时间"
						width="180px"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="modelType"
						label="模型类型"
                        :formatter="convertMessage"
						width="110px"
						align="center"
                >
				</el-table-column>
				<el-table-column
						prop="modelName"
						label="模型名称"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="modelObjects"
						label="查询对象信息"
						width="300px"
						align="center"

                >
					<template scope="scope">
						<div v-if="scope.row.modelObjects">
							<div v-for="item in JSON.parse(scope.row.modelObjects)">
								<div v-if="item.riskModelObjectName != undefined">
									{{item.riskModelObjectName+':'+item.params}}
								</div>
								<div v-else>-</div>
							</div>
						</div>
						<div v-else>
							-
						</div>

					</template>
				</el-table-column>
				<el-table-column
						prop="queryMethod"
						label="查询方式"
                        :formatter="queryMethodMessage"
						align="center"
                >
				</el-table-column>
				<el-table-column
						prop="createdBy"
						label="查询用户"
						align="center"
				>
				</el-table-column>
				<el-table-column label="结果" class-name="tc last-column">
					<template scope="scope">
						<router-link :to="{ name: 'history-result',params:{uuid:scope.row.uuid}}">
							<el-button type="text" size="small">查看</el-button>
							
						</router-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="mb15 fr mr20 mt15">
				<el-pagination
						@current-change="getHistoryListedPageNum"
						:current-page.sync="modelHistoryList.pageNum"
						:page-size="modelHistoryList.pageSize"
						layout="prev, pager, next, jumper"
						:page-count="modelHistoryList.pages"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
    import api from '../../api/api'
    export default {
        created () {
		 this.getModelList();
         this.getHistoryListed();
        },
        data () {
            return {
                formatData:'',
                //页面信息
				hello:{
				    age:"gant",
					bank:"host",
				},
                page : {
                    name : "历史查询结果清单",
                    url : "model-search",
                    type : ''
                },
                modelList:'',
				modelHistoryList:'',
                pageNum:'',
                //与后台接口字段对应
                form:{
                    modelType:null,
                	modelName:null,
                    queryMethod:null,
                    startCreatedAt:null,
                    endCreatedAt:null,
                    pageNum:null
                },
                list:'',
        
            }
        },
        components : {},
        methods: {
            //切换模型类别
            changeModelType(){
                api.riskSearch.getAllModelListWithoutPagination({riskModelId:this.form.modelType}).then(result => {
                    this.form.modelName=null;
                    this.modelList = result.data.data;
                }).catch(result => {

                })
            },
            dateChangeStart(val) {
                this.form.startCreatedAt=val
            },
            dateChangeEnd(val) {
                this.form.endCreatedAt=val
            },
            getModelList(){
                api.riskSearch.getSearchList({riskModelId:''}).then(result => {
                    this.modelList = result.data.data.list;
                }).catch(result => {

                })
            },
            getHistoryListed(){
                    api.riskSearch.getHistoryList(this.form).then(result => {
                        this.modelHistoryList = result.data.data;
                    }).catch(result => {

                    })
			},
            getHistoryListedPageNum(pageNum){
                    this.form.pageNum=pageNum;
                    api.riskSearch.getHistoryList(this.form).then(result => {
                        this.modelHistoryList = result.data.data;
                    }).catch(result => {

                    })
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
                let html='<p>';
                let objStr=JSON.parse(cellValue)
                for(let i=0;i<objStr.length; i++){
                    html+=objStr[i].riskModelObjectName+':'+objStr[i].params+'</p>';
                }
                return html;
            },
            queryMethodMessage(row, column, cellValue){
                let returnValue='';
                switch(cellValue){
                    case 'I':
                        returnValue='接口查询';
                        break;
                    case 'P':
                        returnValue='页面查询';
                        break;
                }
                return returnValue;
            }

        }
    };
  
</script>
