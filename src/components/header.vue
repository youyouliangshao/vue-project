<template>
  <div class="header">
    <div class="container">
      <h1 class="logo">
        <a :href="consoleDomain" class="logo-title"><i class="bicon-logo"></i></a>
      </h1>
      <div class="logo-subtitle">首页</div>
      <div class="account">
        <div class="account-info">
          <!--<i class="bicon-back-message"></i>-->
          <!--<i class="red-point"></i>-->
          <span class="account-welcome">您好！<a href="javascript:;">{{ empName }}</a></span>
        </div>
        <div class="account-pop">
          <div class="account-link">
            <a :href="consoleDomain+'/user/setting'" title="">个人设置</a>
            <a id="logout" @click="logOut" href="javascript:;" title="">退出</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api/api'
  import {profiles,cookie} from '../config'
  export default {
    name: 'header',
    data () {
      return {
        loading: false,
        empName: '',
        consoleDomain:profiles.consoleDomain(),
        error: null
      }
    },
    created () {
      this.getEmpName()
    },
    methods : {
      logOut (){
        api.base.logOut().then(result =>{
            console.log(this.consoleDomain)
            window.location.href=this.consoleDomain;
        })
      },
      getEmpName (){
          this.empName = this.$store.state.empName
      }
    },
    watch: {
//      $route : 'getEmpName'
    },
  }
</script>
