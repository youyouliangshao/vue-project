<!--数据管理首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风险变量管理</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch" :to="{name: 'data-manage', query: {titleName: titleName, groupName: groupName, groupId: groupId, titleId: titleId}}">数据管理</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">EXCEL导入数据</el-breadcrumb-item>
			</el-breadcrumb>
			<router-link :to="{name:'data-manage', query: {titleName: titleName, groupName: groupName, groupId: groupId, titleId: titleId}}">
				<el-button type="primary" class="fr mgt10-mgr8 back-to-btn">返回上一级</el-button>
			</router-link>
		</div>
		<div class="page-main page-padding bgc-white" style="padding: 20px;">
			<div style="display:block;" class="bgc-white">
				<h2 class="f20 tl ">{{titleName}}/{{groupName}}</h2>
				<div class="model-oper" style="height: 50px;">
					<div class="model-edit" style=" padding-right: 20px;">
						<el-button type="primary" @click="getExcelModel(groupId)">下载EXCEL模板</el-button>
						<el-upload
								style="display:inline-block"
								:show-file-list="false"
								:on-success="uploadSuccess"
								:auto-upload="true"
								:action="uploadFileUrl"
								:on-error="uploadError"
						>
							<!--<el-button size="small" type="primary">点击上传</el-button>-->
							<!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
							<el-button style="margin-left: 10px;" type="primary" @click="">上传文件</el-button>
						</el-upload>
					</div>
				</div>
			</div>
			<div class="bgc-white clearfix">
				<el-table :data="theData.list">
					<el-table-column
							prop="fileName"
							label="文件"
							align="center"
					>
					</el-table-column>
					<el-table-column
							prop="updatedAt"
							label="上传时间"
							align="center"
					>
					</el-table-column>
					<el-table-column
							prop="updatedBy"
							label="上传人"
							align="center"
					>
					</el-table-column>
					<el-table-column
							label="操作"
							class-name="tc last-column">
						<template scope="scope">
						<el-button type="primary" size="small" @click="importExcelFile(scope.$index)">导入</el-button>
						<el-button type="danger" size="small" @click="deleteConfirm(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="mb15 fr mr20 mt15" v-if="theData.pages > 1">
					<el-pagination
							@current-change="viewTableFilesListPagination"
							:current-page.sync="theData.pageNum"
							:page-size="theData.pageSize"
							layout="prev, pager, next, jumper"
							:page-count="theData.pages"

					>
					</el-pagination>
				</div>
			</div>
			<!-- 上传文件 -->
			<!--<el-dialog @close="" title="上传文件" custom-class="obj-dialog" :visible.sync="dialog.uploadFile" size="tiny" class="dialog-red">-->
				<!--<el-upload-->
						<!--class="upload-demo"-->
						<!--ref="upload"-->
						<!--action="https://jsonplaceholder.typicode.com/posts/"-->
						<!--:on-preview="handlePreview"-->
						<!--:on-remove="handleRemove"-->
						<!--:file-list="fileList"-->
						<!--:auto-upload="false">-->
					<!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
					<!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
					<!--<div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>-->
				<!--</el-upload>-->
			<!--</el-dialog>-->
			<!-- 删除文件 -->
			<el-dialog title="删除文件" size="tiny" :visible.sync="dialog.fileDelete" class="mtt100">
				<p class="dialog-message">确定删除当前文件？</p>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialog.fileDelete = false">取 消</el-button>
					<el-button type="primary" @click="deleteExcelFile(fileId)">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="导入数据" size="tiny" :visible.sync="dialog.fileExport" class="mtt100 c333">
				<p class="dialog-message">确定导入当前数据文件：<span>{{this.tempFileUpload.fileName}}</span></p>
				<p class="dialog-message mt10 f12c666">上传时间：<span>{{this.tempFileUpload.createdAt}}</span></p>
				<p class="dialog-message f12c666">上传人：<span>{{this.tempFileUpload.createdBy}}</span></p>
				<p class="dialog-message f12c666 mt20">文件格式为.xlsx或.xls，系统会对文件格式、文件内项目格式做校验</p>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialog.fileExport = false">取 消</el-button>
					<el-button type="primary" @click="confirmExportFile">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
    import api from '../../api/api';
    import axios from '../../api/http';
    export default {
        created () {
			this.pageInfo();
			this.viewTableFilesList(this.groupId);
        },
        data () {
            return {
                searchData:{
                    title:'',
                    group:'',
					pageNum: ''
                },
                groupStatus: true,
				groupOptions:[],

				titleName:'',
				groupName:'',
				groupId:'',
                titleId:'',

				theData: {
                    list:[],
				},

				dialog:{
                    fileUpload: false,
					fileDelete: false,
					fileExport:false
				},
	            tempFileUpload:{},
				//  文件id
				fileId: '',

				//  上传文件
				uploadFileUrl: api.riskDataManage.uploadFile({titleId:this.$route.query.titleId, groupId:this.$route.query.groupId}),
            }
        },
        methods: {
            pageInfo(){
                this.titleName = this.$route.query.titleName;
                this.groupName = this.$route.query.groupName;
                this.searchData.group = this.groupId = this.$route.query.groupId;
                this.searchData.title = this.titleId = this.$route.query.titleId;
			},
			//  下载EXCEL模板
			getExcelModel(groupId){
                window.location.href = api.riskDataManage.getExcelModel(groupId);
            },
            //  获取上传文件列表
            viewTableFilesList(groupId){
			    let params = {};
			    params.groupId = groupId;
                api.riskDataManage.getExcelFilesList(params).then(result => {
                    this.theData = result.data.data;
//					this.list = result.data.data.list;
                }).catch(result => {});
            },
			//  点击分页，文件列表刷新
			viewTableFilesListPagination(pageNum){
                let params = {};
                params.groupId = this.groupId;
                params.pageNum = pageNum;
                api.riskDataManage.getExcelFilesList(params).then(result => {
                    this.theData = result.data.data;
//					this.list = result.data.data.list;
                }).catch(result => {});
			},
	        //确认导入
            confirmExportFile(){
                api.riskDataManage.importExcel(this.tempFileUpload.id).then(result => {
                    console.log(result);
                    this.$message(result.data.message);
                    this.dialog.fileExport=false;
                }).catch(result => {
                    this.$message.error(result.message);
                    this.dialog.fileExport=false;
                });
            },
			//  导入excel内容
			importExcelFile(index){
			    this.dialog.fileExport=true;
				this.tempFileUpload=this.theData.list[index];
			},
			//  删除确认-弹窗
			deleteConfirm(id){
			    this.dialog.fileDelete = true;
			    this.fileId = id;
			},
			//  删除excel文件
			deleteExcelFile(id){
			    api.riskDataManage.deleteExcel(id).then(result => {
                    this.$message(result.data.message);
                    this.dialog.fileDelete = false;
                    this.viewTableFilesList(this.$route.query.groupId);
				}).catch(result => {
                    this.dialog.fileDelete = false;
				    this.$message(result.data.message);
				});
			},
			//  上传成功后，刷新列表
			uploadSuccess(response, file, fileList){
			    if(response.success == true){
                    this.$message(response.message);
                    this.viewTableFilesList(this.$route.query.groupId);
			    }else{
                    this.$message.error(response.message);
			    }
			}
        }
    };
</script>
