<!--数据管理首页-->
<template>
	<div class="detection-index">
		<div class="breadcrumb">
			<el-breadcrumb>
				<el-breadcrumb-item class="history-nolink">
					<i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
					风险变量管理</el-breadcrumb-item>
				<el-breadcrumb-item class="history-watch">数据管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="page-main page-padding bgc-white" style="padding: 20px;">
			<div class="el-row" style="position: relative;" v-show="showBtn.index">
				<el-row>
					<el-col :span="24">
						<div>
							<el-form :inline="true" ref="form" label-width="" @submit.native.prevent>
								<el-form-item label="主题：">
									<el-select v-model="searchData.title" @change="changeTitleStatus(searchData.title)">
										<el-option label="请选择" value=""></el-option>
										<el-option v-for="item in titleOptions" :label="item.titleName" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="分组：">
									<el-select v-model="searchData.group" :disabled="groupStatus" @change="changeGroupStatus(searchData.group)">
										<el-option label="请选择" value=""></el-option>
										<el-option v-for="item in groupOptions" :label="item.groupName" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item class="fr">
									<el-button type="primary" @click="searchDataList(searchData.title, searchData.group)" :disabled="submitStatus">确定</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-col>
				</el-row>
			</div>
			<div style="display: block;" class="bgc-white" v-show="showTable" :row-style="{'white-space': 'nowrap'}">
				<h2 class="f20 tl">{{viewDataLabel.title.titleName}}/{{viewDataLabel.group.groupName}}</h2>
				<div class="model-oper" style="height: 50px;">
					<div class="model-edit fr" style="padding-right: 20px;">
						<!--  初始页面按钮-->
						<router-link style="margin-left: 10px;" :to="{ name: 'data-manage-excel', query: {titleName: viewDataLabel.title.titleName, groupName: viewDataLabel.group.groupName, groupId: searchData.group, titleId:searchData.title}}" v-show="showBtn.index">
						<el-button type="primary" @click="console.log('sss')">EXCEL文件导入数据</el-button>
						</router-link>
						<el-button style="margin-left: 10px;" type="primary" @click="showPortExample" v-show="showBtn.index">接口导入数据</el-button>
						<el-button style="margin-left: 10px;" type="primary"  @click="dialog.dataHandAdd = true;" v-show="showBtn.index">手动添加数据</el-button>
						<el-button style="margin-left: 10px;" type="danger" @click="showButton('delete')" v-show="showBtn.index">删除数据</el-button>
						<!--  删除页面按钮-->
						<el-button style="margin-left: 10px;" type="primary" v-show="!showBtn.index" @click="showButton('index')">取消删除</el-button>
						<el-button style="margin-left: 10px;" type="danger" v-show="showBtn.delete" @click="isSelectedDelete" >删除数据</el-button>
						<!--  取消按钮-->
					</div>
				</div>
			</div>
			<!--@select-all="isSelected = true;"-->
			<div v-show="showTable" class="data-manage-table bgc-white" id="data_manage_table">
				<el-table
						ref="thisTable"
						:data="list"
						@select="selectList"
						@select-all="selectList"
						max-height="480"
				>
					<el-table-column
							type="selection"
							width="45"
							v-if="showBtn.delete"
					>
					</el-table-column>
					<el-table-column
							type="index"
							label="编号"
							align="left"
							width="140"
					>
					</el-table-column>
					<el-table-column
					prop="keycode"
					:label="viewDataLabel.title.titleUnique + '（keycode）'"
					align="center"
                    min-width="200"
					>
						<template scope="scope">
							<p :title="scope.row.keycode" class="p-ellipsis tl">{{scope.row.keycode}}</p>
						</template>
					</el-table-column>
					<el-table-column
							v-for="(item, index) in struct" :label="item.title"
							:prop="item.code"
							align="center"
                            :show-overflow-tooltip="true"
							width="200"
					>
						<template scope="scope">
							<p :title="scope.row[item.code]" class="p-ellipsis tl">{{scope.row[item.code]}}</p>
						</template>
					</el-table-column>
				</el-table>
				<!--<div class="mb15 fr mr20 mt15">-->
					<!--<el-pagination-->
							<!--@current-change="getPaginationList"-->
							<!--:current-page.sync="list.pageNum"-->
							<!--:page-size="list.pageSize"-->
							<!--layout="prev, pager, next, jumper"-->
							<!--:page-count="list.pages"-->
					<!--&gt;-->
					<!--</el-pagination>-->
				<!--</div>-->
			</div>
			<!-- 手动添加数据 -->
			<el-dialog @close="clearHandAdd" title="添加数据" custom-class="obj-dialog" :visible.sync="dialog.dataHandAdd" size="small" class="dialog-red">
				<el-form :inline="true" class="set-form-labers" label-width="300px" @submit.native.prevent style="height: 280px; overflow-y: scroll">
					<el-form-item :label="viewDataLabel.title.titleUnique + ''" :class="{'is-error': errors.has(viewDataLabel.title.titleUnique + '')}">
                        <el-input v-validate="rules.keycode" v-model="addData.keycode" data-vv-value-path="currentValue" :data-vv-name="viewDataLabel.title.titleUnique + ''" style="width: 223px"></el-input>
						<div v-show="errors.has(viewDataLabel.title.titleUnique + '')" class="el-form-item__error">{{ errors.first(viewDataLabel.title.titleUnique + '') }}</div>
						<i class="c-red">*</i>
					</el-form-item>
					<el-form-item
							v-for="item, index in struct"
							:label="item.title" :class="{'is-error': errors.has(item.title)}">
						<el-input v-if="item.info.type == 'NUMBER'" v-validate="rules.NUMBER" v-model="codeDataArr[index]" data-vv-value-path="currentValue" :data-vv-name="item.title" style="width: 223px"></el-input>
						<div v-if="item.info.type == 'NUMBER'" v-show="errors.has(item.title)" class="el-form-item__error">{{ errors.first(item.title) }}</div>
						<el-select v-if="item.info.type == 'STRING'" v-validate="rules.STRING" v-model="codeDataArr[index]" data-vv-value-path="currentValue" :data-vv-name="item.title" style="width: 223px">
							<el-option label="请选择" value=""></el-option>
							<el-option v-for="x in item.info.valueList" :label="x" :value="x"></el-option>
						</el-select>
						<div v-if="item.info.type == 'STRING'" v-show="errors.has(item.title)" class="el-form-item__error">{{ errors.first(item.title) }}</div>
						<!--<div v-show="errors.has(item.title)" class="el-form-item__error">{{ errors.first(item.title) }}</div>-->
						<!--<i class="c-red">*</i>-->
					</el-form-item>
					<!--<el-form-item label="变量类型" :class="{'is-error': errors.has('变量类型|select')}">-->
						<!--<el-select  v-validate="'required'" v-model="analyzeObj.objecttitle" data-vv-value-path="value" data-vv-name="变量类型|select" placeholder="请选择" style="width: 223px">-->
							<!--<el-option label="数值型" value="NUMBER"></el-option>-->
							<!--<el-option label="枚举型" value="STRING"></el-option>-->
						<!--</el-select>-->
						<!--<div v-show="errors.has('变量类型|select')" class="el-form-item__error">{{ errors.first('变量类型|select') }}</div>-->
						<!--<i class="c-red">*</i>-->
					<!--</el-form-item>-->
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialog.dataHandAdd = false;">取 消</el-button>
					<el-button type="primary" @click="addDataSubmit" :loading="loading.btn">确 定</el-button>
				</div>
			</el-dialog>
            <!-- 接口导入数据 -->
            <el-dialog @close="" title="接口导入数据" custom-class="obj-dialog" :visible.sync="dialog.dataPortAdd" size="small" class="dialog-red">
                <el-form :inline="true" class="set-form-labers" label-width="155px" @submit.native.prevent>
                    <el-form-item label="请求地址" :class="{'is-error': errors.has('请求地址')}">{{portData.port}}
                        <!--<el-input v-validate="rules.port" v-model="portData.port" data-vv-value-path="currentValue" data-vv-name="接口导入数据" style="width: 223px"></el-input>-->
                        <!--<div v-show="errors.has('身份证号（keycode）')" class="el-form-item__error">{{ errors.first('身份证号（keycode）') }}</div>-->
                        <!--<i class="c-red">*</i>-->
                    </el-form-item>
                    <br>
                    <el-form-item label="接口样例">
                        <el-input type="textarea" rows="10" v-validate="rules.port" v-model="portData.data" data-vv-value-path="currentValue" data-vv-name="接口导入数据" style="width: 460px"></el-input>
                    </el-form-item>
                </el-form>
                <!--<div slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="dialog.dataPortAdd = false;">取 消</el-button>-->
					<!--<el-button type="primary" @click="portDataAdd" :loading="loading.btn">确 定</el-button>-->
                <!--</div>-->
            </el-dialog>
			<!-- 删除数据 -->
			<el-dialog title="删除数据" size="tiny" :visible.sync="dialog.dataDelete" class="mtt100">
				<p class="dialog-message">确定删除所选数据？</p>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialog.dataDelete = false">取 消</el-button>
					<el-button type="primary" @click="dataDeleteSubmit" :loading="loading.btn">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
    import api from '../../api/api';
    import axios from '../../api/http';
    import {profiles,cookie} from '../../config'
    export default {
        created () {
			this.pageInfo();
        },
        data () {
            return {
                //  请求转圈
				loading:{
				    btn: false
				},
                //  搜索数据
                searchData:{
                    title:'',
                    group:''
                },
				//  数据的label
				viewDataLabel:{
                    title:{},
                    group:{}
				},
                groupStatus: true,
                submitStatus: true,

                titleOptions:[],
				groupOptions:[],

				showTable: false,
                //  数据列表
				list:[],
                //  变量结构
                struct:[],
				//  各种功能的显示和隐藏
				showBtn:{
                    index: true,
					delete: false,
					add: false
				},
				//  弹层显示
				dialog:{
                    dataHandAdd: false,
                    dataPortAdd: false,
					dataDelete: false
				},
                // 校验规则
                rules: {
                    port: 'required',
					keycode: 'required',
                    NUMBER: 'decimal',
                    STRING: ''
                },
				//  手动添加数据
				addData: {},
				codeArr: [],
				titleArr: [],
				codeDataArr: [],
				//  接口添加数据
                portData: {
                   // port:profiles.apiDomain() + ':8207/b/v1/st-var/data/add-list/' + this.searchData.group,
                    port:'',
                    data:''
                },
				//  批量删除数据
				dataDeleteObj:{
				    keycodes: ''
				},
				//  判断删除-未选择，提示错误
				isSelected: false,
            }
        },
        methods: {
            //  初始化
			pageInfo(){
                this.viewTitleList();
			    this.viewDataLabel.title.titleName = this.$route.query.titleName || '';
                this.viewDataLabel.group.groupName = this.$route.query.groupName || '';
                this.list = this.$route.query.list || '';
                this.searchData.title = this.$route.query.titleId * 1 || '';
                this.searchData.group = this.$route.query.groupId * 1 || '';
                this.groupStatus = this.$route.query.titleId ? false : true;
                this.submitStatus = this.$route.query.groupId ? false : true;
                this.$route.query.titleId ? this.viewGroupList(this.$route.query.titleId) : '';
				if(this.$route.query.titleId && this.$route.query.groupId){
                    this.viewTableList(this.$route.query.groupId);
                    this.viewTableStruct(this.$route.query.groupId);
                    this.showTable = true;
				}
			},
            //  选择主题变更分组状态内容
			changeTitleStatus(titleId){
				this.groupStatus = titleId ? false : true;
                this.searchData.group = titleId == this.searchData.group ? this.searchData.group : '';
                titleId ? this.viewGroupList(titleId) : this.showTable = false;
			},
            //  选择分组变更可否点击确定
            changeGroupStatus(groupId){
                this.submitStatus = groupId ? false : true;
                this.showTable = groupId ? this.showTable : false;
            },
			//  获取主题options
            viewTitleList(){
                api.riskDataManage.getTitleList().then(result => {
                    this.titleOptions = result.data.data;
                    if(this.$route.query.titleId){
                        this.viewGroupList(this.$route.query.titleId);
                        this.viewDataLabel.title = this.titleOptions.find(item => {
                            return item.id === this.$route.query.titleId * 1;
                        });
					}
                }).catch(result => {});

            },
            //  获取分组options
            viewGroupList(titleId){
                api.riskDataManage.getGroupList(titleId).then(result => {
                    this.groupOptions = result.data.data;
                }).catch(result => {});
            },
			//  确认筛选数据
            searchDataList(titleId, groupId){
                this.getLabel(titleId, groupId);
                this.viewTableList(groupId);
                this.viewTableStruct(groupId);
                this.showTable = true;
			},
			//  获取主题和分组的label值
			getLabel(titleId, groupId){
                this.viewDataLabel.title = this.titleOptions.find(item => {
                    return item.id === titleId;
				});
                this.viewDataLabel.group = this.groupOptions.find(item => {
                    return item.id === groupId;
                });
                console.log(this.viewDataLabel.title);
			},
            //  获取分组结构table struct
            viewTableStruct(groupId){
			    this.loading.btn = true;
                api.riskDataManage.getTableStruct(groupId).then(result => {
                    let arr = [];
                    this.codeArr = result.data.data.VAR_HEAD_CODE_ARRAY;
                    this.titleArr = result.data.data.VAR_HEAD_TITLE_ARRAY;
                    for(let i = 0; i < result.data.data.VAR_HEAD_TITLE_ARRAY.length; i++){
                        let obj = {};
                        obj.title = result.data.data.VAR_HEAD_TITLE_ARRAY[i];
                        obj.code = result.data.data.VAR_HEAD_CODE_ARRAY[i];
                        this.addData[result.data.data.VAR_HEAD_CODE_ARRAY[i]] = '';
                        this.codeDataArr[i] = '';
                        obj.info = result.data.data.VAR_INFO_ARRAY[i];
                        if(obj.info.valueList){
                            obj.info.valueList = obj.info.valueList.split(',');
						}
                        arr[i] = obj;
                    }
                    this.struct = arr;
					this.loading.btn = false;
					console.log(this.codeDataArr);
                }).catch(result => {
                    this.loading.btn = false;
                });
            },
			//  展示查询列表详情table
			viewTableList(groupId){
			    api.riskDataManage.getTableList(groupId).then(result => {
					this.list = result.data.data;
				});
			},
			//  功能页面按钮变换
			showButton(type){
			    switch (type){
					case 'index': this.showBtn.index = true; this.showBtn.delete = false; this.showBtn.add = false; this.clearSelects();
					break;
					case 'delete': this.showBtn.index = false; this.showBtn.delete = true; this.showBtn.add = false;
					break;
					case 'add': this.showBtn.index = false; this.showBtn.delete = false; this.showBtn.add = true;
					break;
				}
			},
			//  接口传递数据样例
			showPortExample(){
                this.dialog.dataPortAdd = true;
			    let arr = this.codeArr;
			    let brr = this.titleArr;
			    let str = '[{' + '\n';
                str += '"keycode":"(' + this.viewDataLabel.title.titleUnique + ')",\n';
			    for(let i = 0; i < arr.length; i++){
			        if(i === arr.length - 1){
                        str += '"' + arr[i] + '":"(' + brr[i] + ')"\n';
					}else{
                        str += '"' + arr[i] + '":"(' + brr[i] + ')",\n';
					}
				}
				str += '},{' + '\n';
                str += '"keycode":"(' + this.viewDataLabel.title.titleUnique + ')",\n';
                for(let i = 0; i < arr.length; i++){
                    if(i === arr.length - 1){
                        str += '"' + arr[i] + '":"(' + brr[i] + ')"\n';
                    }else{
                        str += '"' + arr[i] + '":"(' + brr[i] + ')",\n';
                    }
                }
				str += '}]';
			    this.portData.data = str;
                this.portData.port=profiles.apiDomain() + ':8207/b/v1/st-var/data/add-list/'+this.searchData.group;
			},
			//  手动添加数据
			addDataSubmit(){
                this.$validator.validateAll().then(valid => {
                    if(valid){
                        let params = {};
                        params.groupId = this.searchData.group;
                        for(let i = 0; i < this.codeArr.length; i++){
                            let theCode = this.codeArr[i];
                            this.addData[theCode] = this.codeDataArr[i];
						}
                        params.data = this.addData;
                        api.riskDataManage.addData(params).then(result => {
                            if(result.data.success === true){
                                this.$message(result.data.message);
                                this.viewTableList(params.groupId);
                                this.dialog.dataHandAdd = false;
                            }
                        }).catch(result => {
                            // this.$message.error(result.data.message);
                            // this.dialog.dataHandAdd = false;
                        });
                    }
                });
			},
			//  获取要删除数据的列表
			selectList(selection, row){
			    let arr = [];
			    for(let i = 0; i < selection.length; i++){
					arr[i] = selection[i].keycode;
					this.dataDeleteObj.keycodes = arr.join();
				}
				console.log(selection.length);
				this.isSelected = selection.length > 0 ? true : false;
			},
			//  是否勾选数据
			isSelectedDelete(){
			    this.isSelected ? this.dialog.dataDelete = true : this.$message.error('请选择需要删除的数据');
			},
			//  确认删除
			dataDeleteSubmit(){
			    let params = {};
			    params.dataDeleteObj = this.dataDeleteObj;
				params.groupId = this.searchData.group;
				api.riskDataManage.deleteDatas(params).then(result => {
				    console.log(result);
                    this.$message(result.data.message);
                    this.dialog.dataDelete = false;
                    this.viewTableList(this.searchData.group);
                    this.viewTableStruct(this.searchData.group);
                    this.showTable = true;
				}).catch(result => {
                    this.$message.error(result.data.message);
                    this.dialog.dataDelete = false;
				});
			},
			//  清空全部选择
            clearSelects(){
                this.$refs.thisTable.clearSelection();
			},
			//  清空手动添加数据弹窗数据
			clearHandAdd(){
			    for(let item in this.addData){
			        this.addData[item] = '';
				}
				for(let i = 0; i < this.codeDataArr.length; i++){
			        this.codeDataArr[i] = '';
				}
				this.errors.clear();
			},
        }
    };
</script>
