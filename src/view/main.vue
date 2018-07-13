<template>
  <div class="risk-home">
    <!--<div v-if="mainTabs.length > 0">
      <el-tabs v-model="mainTabsVal" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in mainTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <component :is="item.content"></component>
        </el-tab-pane>
      </el-tabs>
    </div>-->
    <div>
      <p class="welcome-message">欢迎使用汇融风控引擎系统</p>
    </div>
  </div>

</template>

<script>
  import store from '../store/index'
  import api from '../api/api'
  export default {
    name: 'main',
    data() {
      return {
//        mainTabsVal: this.$store.state.mainTabsVal,
        //导航菜单是否展开
        spreadOrnot: this.$store.state.spread,
        mainTabs: this.$store.state.mainTabs,
      }
    },
    computed: {
      mainTabsVal () {
        return this.$store.state.mainTabsVal
      }
    },
    methods: {
      removeTab(targetName) {
        let tabs = this.mainTabs;
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            store.commit("removeMainTabs",tab.name);
            if (nextTab) {
              store.commit("changeMainTabVal",nextTab.name);
            }
          }
        });
      }
    }
  }
</script>
