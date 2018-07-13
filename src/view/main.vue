<template>
  <div class="home">
    <div>
      <p class="welcome-message">欢迎！</p>
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

      }
    }
  }
</script>
