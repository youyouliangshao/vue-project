<!--模型配置首页-->
<template>
    <div class="detection-index">
        <div class="breadcrumb">
            <el-breadcrumb>
                <el-breadcrumb-item class="history-nolink">
                    <i class="bicon-tier" style="margin-right: 11px;display: inline-block;height: 18px;width: 18px"></i>
                    <span>{{page.mainname}}</span></el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: page.url }" class="history-watch">{{page.name}}</el-breadcrumb-item>
                <el-breadcrumb-item class="history-watch">{{form.themeName}}_{{form.groupName}}</el-breadcrumb-item>
            </el-breadcrumb>
            <router-link :to="{ path: page.url }"><el-button type="primary" class="fr back-to-btn mgt10-mgr8">返回上一级</el-button></router-link>
        </div>
        <div class="variable-main single-list">
            <div class="single-list-p">
                    <span>{{form.themeName}}_{{form.groupName}}</span>
                    <span class="single-list-right">
                        <el-select v-model="modelType" placeholder="全部" @change="changeType">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="数值型" value="NUMBER"></el-option>
                            <el-option label="枚举型" value="STRING"></el-option>
                        </el-select>
                    </span>
                </div>
            <div class="single-list-table">
                <el-table :data="list.list"  style="width: 100%" >
                    <el-table-column prop="chineseName" label="变量名称" align="center">
                    </el-table-column>
                    <el-table-column prop="type" label="变量类型" align="center">
                        <template scope="scope">
                            <span v-if="scope.row.type=='NUMBER'">数值型</span>
                            <span v-if="scope.row.type=='STRING'">枚举型</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template scope="scope">
                            <el-button type="text" size="small" v-if="scope.row.type=='NUMBER'" @click="skipDetail('NUMBER',scope.row.name,scope.row.chineseName)">查看测算结果</el-button>
                            <el-button type="text" size="small"  v-if="scope.row.type=='STRING'" @click="skipDetail('STRING',scope.row.name,scope.row.chineseName)">查看测算结果</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mb15 fr tailAfter-margin">
                    <el-pagination
                            @current-change="getLists"
                            :current-page.sync="list.pageNum"
                            :page-size="list.pageSize"
                            layout="prev, pager, next, jumper"
                            :page-count="list.pages"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../../api/api'
    import axios from '../../../api/http'

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
                    url : '/single-calculate',
                    type : ''
                },
                list:{},
                groupId:'',
                form:{
                    themeName:'',
                    groupName:''
                },
                modelType:'',
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
                this.form.themeName=this.$route.query.themeName;
                this.form.groupName=this.$route.query.groupName;
                this.groupId=this.$route.query.group;
            },
            //列表
            getList(){
                let data={};
                data.groupId=this.groupId;
                data.type=this.modelType;
                api.singleCalculateList.getList(data).then(result => {
                    this.list=result.data.data;
                }).catch(result => {
                });
            },
            //分页
            getLists(val){
                let data={};
                data.groupId=this.groupId;
                data.type=this.modelType;
                data.pageNum=val;
                api.singleCalculateList.getList(data).then(result => {
                    this.list=result.data.data;
                }).catch(result => {
                });
            },
            //切换
            changeType(val){
                this.getList();
            },
            //跳转结果
            skipDetail(val,value,value1){
                switch (val) {
                    case 'NUMBER':
                        var pushParams={
                            name:'detail-number',
                            query : {
                                mainname:this.page.mainname,
                                name:this.page.name,
                                themeName:this.$route.query.themeName,
                                groupName:this.$route.query.groupName,
                                group:this.$route.query.group,
                                code:value,
                                codeName:value1,
                            }
                        };
                        this.$router.push(pushParams);
                        break;
                    case 'STRING':
                        var pushParams={
                            name:'detail-string',
                            query : {
                                mainname:this.page.mainname,
                                name:this.page.name,
                                themeName:this.$route.query.themeName,
                                groupName:this.$route.query.groupName,
                                group:this.$route.query.group,
                                code:value,
                                codeName:value1,
                            }
                        };
                        this.$router.push(pushParams);
                        break;
                }
            },
        }
    }
</script>