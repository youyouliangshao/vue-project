import axios from './http'
import {profiles, cookie} from '../config'
const api = {
    base: {
        //退出登录
        logOut:() => axios.put('/logout'),
        // 获取菜单
        getMenu:() => axios.get('/menu'),
        // 获取用户信息
        getEmpInfo:() => axios.get('/individual/center/' + cookie.empAccount()),
        getdemo : params => axios.get('/demo',{params:params}),
    }

};
export default api;
