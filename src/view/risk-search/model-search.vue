<!--模型配置首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风控结果查询</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: page.url }" class="history-watch">{{page.name}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="page-main page-padding" >
			<h2 class="f20 tl search-margin">请选择要查询的模型</h2>
			<div class="el-row" style="position: relative;">
				<el-row>
					<el-col :span="24">
						<div>
							<el-form :inline="true" ref="form" label-width="">
								<el-form-item label="模型类型：">
									<el-select placeholder="请选择模型类型" v-model="modelType">
										<el-option label="全部" value=""></el-option>
										<el-option label="反欺诈模型" value="1"></el-option>
										<el-option label="预授信模型" value="2"></el-option>
										<el-option label="授信模型" value="3"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item class="fr">
									<el-button type="primary" @click="getSearchList">筛选</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-col>
				</el-row>
			</div>
			<el-table :data="list.list">
				<el-table-column
						prop="subModelType"
						label="模型类型"
						:formatter="convertMessage"
						align="center"
				>
				</el-table-column>
				<el-table-column
						prop="modelNameSon"
						label="模型名称"
						align="center"
				>
				</el-table-column>
				<el-table-column label="操作" class-name="tc last-column">
					<template scope="scope">
						<router-link :to="{ name: 'model-obj',params:{id:scope.row.id}}">
							<el-button type="text" size="small">查询</el-button>
						</router-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="mb15 fr mr20 mt15">
				<el-pagination
						@current-change="getPaginationList"
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
    export default {
        created () {
			this.getSearchList();
        },
        data () {
            return {
                modelType:'',
                pageNum:'',
                form:{
                    subject:'',
                    type:''
                },
                list:'',
                //页面信息
                page : {
                    name : "风控查询",
                    url : "",
                    type : ''
                },
            }
        },
        components : {},
        methods: {
            //模型类型转换
            convertMessage(row, column, cellValue){
                var returnValue='';
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
            getSearchList(){
                api.riskSearch.getSearchList({riskModelId:this.modelType}).then(result => {
                    console.log(result);
                    this.list = result.data.data;
                }).catch(result => {

                });
            },
            getPaginationList(val){
                api.riskSearch.getSearchList({riskModelId:this.modelType,pageNum:val}).then(result => {
                    this.list = result.data.data;
                }).catch(result => {

                });
            },
            pageInfo(){
                this.page.url = this.$route.path;
            },

        }
    }
</script>
