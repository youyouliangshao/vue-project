<template>
    <div class="side">
        <el-menu class="el-menu-vertical-demo" :default-active="activeMenu" :default-openeds="opens"
                 :collapse="isCollapse" theme="dark" router>
            <el-button-group v-model="isCollapse">
                <el-button :label="true" v-on:click="changeSpread" class="side_css">
                    <i class="bicon-it-sides" v-if="isCollapse"></i>
                    <i class="bicon-it-side" v-else="isCollapse"></i>
                </el-button>
            </el-button-group>
            <template v-for="(item,index) in sideMenu.parent" v-model='sideMenu'>
                <el-submenu :index="item.id + ''">
                    <template slot="title">
                        <i class="bicon-risk-message"></i>
                        <span slot="title">{{item.name}}</span>
                    </template>
                    <el-menu-item v-for="child in item.child" :index="child.url" :key="child.id"><i
                            :class="'bicon-risk-'+child.menuCode"></i>{{child.name}}
                    </el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import api from '../api/api'
    import store from '../store/index'

    export default {
        name: 'side',
        data() {
            return {
                isCollapse: true,
                loading: false,
                sideMenu: {
                    parent: []
                },
                opens: [],
                error: null
            }
        },
        created() {
            this.getMenu()
            this.changeSpread()
        },
        computed: {
            activeMenu: function () {
                let urlArr = this.$store.state.activeMenu.split('/');
                if (urlArr[1]) {
                    console.log('/' + urlArr[1])
                    return '/' + urlArr[1]
                } else {
                    return '/'
                }
            }
        },
        watch: {
//      $route : 'getMenu'
        },
        methods: {
            changeSpread: function () {
                let openState = {}
                if (this.isCollapse == true) {
                    this.isCollapse = false;
                    let tab1 = false;
                    store.commit("isCollapse", tab1);

                } else {
                    this.isCollapse = true;
                    let tab2 = true;
                    store.commit("isCollapse", tab2);
                }
            },
            getMenu() {

            }
        }
    }
</script>
