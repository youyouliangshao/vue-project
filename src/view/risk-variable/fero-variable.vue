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
			<div class="advertisement">
				<a href="javascript:;" target="_blank">
					<!--<img :src="imgsrc" alt="">-->
				</a>
			</div>
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="24">
						<div>
							<el-form :inline="true" ref="form" :model="formData" label-width="" @submit.native.prevent>
								<el-form-item label="变量主题：">
									<el-select v-model="formData.subject" placeholder="请选择变量主题">
										<el-option label="全部" value=""></el-option>
										<el-option v-for="item in variableTypeList" :label="item.subject" :value="item.subject"></el-option>

									</el-select>
								</el-form-item>
								<el-form-item label="变量类型：">
									<el-select v-model="formData.type" placeholder="请选择变量类型">
										<el-option label="全部" value=""></el-option>
										<el-option label="数值型" value="NUMBER"></el-option>
										<el-option label="字符型" value="STRING"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="变量来源：">
									<el-select v-model="formData.variableSource" placeholder="请选择变量来源">
										<el-option label="全部" value=""></el-option>
										<el-option v-for="item in sourceOption" :label="item.variableSource" :value="item.variableSource"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item class="fr">
									<el-button type="primary" @click="SearchBusinessList">筛选</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-table :data="list.list">
				<el-table-column
						prop="name"
						label="code"
						:formatter="dataFormat"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="subject"
						label="变量主题"
						:formatter="dataFormat"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="chineseName"
						label="变量名称"
						:formatter="dataFormat"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="type"
						label="变量类型"
						:formatter="dataFormat"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="description"
						label="变量描述"
						:formatter="dataFormat"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="variableSource"
						label="变量来源"
						:formatter="dataFormat"
						align="center"
				>
				</el-table-column>
				<el-table-column
						label="购买数据 批量购买" class-name="tc last-column">
					<template scope="scope">
						<el-button type="text" size="small" >购买</el-button>
						<!--<a href="javascript:;" @click="">购买</a>-->
					</template>
				</el-table-column>
			</el-table>
			<div class="mb15 mt15 fr mr20">
				<el-pagination
						@current-change=""
						:current-page.sync="list.pageNum"
						:page-size="list.pageSize"
						layout="prev, pager, next, jumper"
						:page-count="list.pages"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
    import api from '../../api/api'
    import axios from '../../api/http'
    import advertisementsrc from '../../assets/images/advertisement.jpg'
    export default {
        created () {
            this.getBusinessList();
            this.getVariableTypeList();
        },
        data () {
            return {
                variableTypeList: [

                ],
                imgsrc:advertisementsrc,
                //汇数变量
                formData:{
                    subject:'',
                    type:'',
                    variableSource:'',
                    dataType:'C'
                },
                sourceOption:[],
                list:{},
                //页面信息
                page : {
                    name : "汇数平台变量",
                    url : "",
                    type : ''
                },
            }
        },
        methods: {
            dataFormat(row,column,cellValue){
                return window.common.isEffective(row,column,cellValue)
            },
            //  获取变量主题类型
            getVariableTypeList(){
                api.riskVariable.getVariableSubjectList({dataType:'C'}).then(result => {
                    this.variableTypeList = result.data.data;
                }).catch(result => {

                });
            },
            //获取业务数据变量列表
            getBusinessList(){
                axios.all([api.riskVariable.getVariableSource({dataType:this.formData.dataType}),api.riskVariable.getBusinessList(this.formData)]).then(axios.spread((sourceInfo,listInfo) => {
                    this.list = listInfo.data.data;
                    this.sourceOption=sourceInfo.data.data;
                    this.loading = false;
                })).catch(result => {
                    this.loading = false;
                });
            },
            SearchBusinessList(){
                axios.all([api.riskVariable.getBusinessList(this.formData)]).then(axios.spread((listInfo) => {
                    this.list = listInfo.data.data;
                    this.loading = false;
                })).catch(result => {
                    this.loading = false;
                });
            },
	        //搜索列表
            pageInfo(){
                this.page.url = this.$route.path;
            },

        }
    }
</script>