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
								<el-form-item class="fr">
									<el-button type="primary" @click="getBuiinessList">筛选</el-button>
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
			</el-table>
			<div class="mb15 mt15 fr mr20">
				<el-pagination
						@current-change="getBuiinessList"
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
    export default {
        created () {
			this.getBuiinessList();
			this.getVariableTypeList();
        },
        data () {
            return {
                variableTypeList: [

                ],
                //业务数据变量
                formData:{
                  subject:'',
	              type:'',
                  dataType:'B'
                },
				//接收对象，
                list:{},
				//页面信息
                page : {
                    name : "业务数据变量",
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
                api.riskVariable.getVariableSubjectList({dataType:'B'}).then(result => {
                    this.variableTypeList = result.data.data;
                }).catch(result => {

                })
            },
            //获取业务数据变量列表
	        getBuiinessList(val){
                this.formData.pageNum=val;
                api.riskVariable.getBusinessList(this.formData).then(result => {
                    if(result.data.success === true){
                        this.list = result.data.data;
                    }
                }).catch(result => {

                })
	        },
            pageInfo(){
                this.page.url = this.$route.path;
            },

        }
    }
</script>
