import Vue from 'vue';
import Router from 'vue-router';
import api from '../api/api';
import store from '../store/index';
import {profiles, cookie} from '../config';
import header from '@/components/header';
import side from '@/components/side';
import main from '@/view/main';
import setting from '@/router/set';

Vue.use(Router);
const router = new Router({
    mode: 'history',
    routes: [
        ...setting,
        {
            path: '/',
            meta: {
                requireAuth: true,
            },
            components: {
                header: header,
                side: side,
                main: main
            }
        }
    ]
});
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        api.base.getEmpInfo().then(function (result) {
            store.commit("updateEmpInfo", {
                token: cookie.token(),
                empAccount: result.data.data.empAccount,
                empName: result.data.data.empName
            });
            next();
        }).catch(function (result) {

        });
    } else {
        next();
    }
});
export default router;
