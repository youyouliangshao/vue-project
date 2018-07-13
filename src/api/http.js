import axios from 'axios'
import {profiles,cookie} from '../config'
import { Message } from 'element-ui';
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = profiles.apiDomain();
axios.defaults.params = {
  token : cookie.token()
};
// http request 拦截器
axios.interceptors.request.use(function(config){
  if(!config.params){
    config.params = {};
    config.params.token = cookie.token();
  }
  return config;
},function(err){
  return Promise.reject(err);
});
// http response 拦截器
axios.interceptors.response.use(function (response) {
  return response;
},function (error) {
    if (error.response) {
      const currenturl = window.location.href;
      switch (error.response.status) {
          case 403:
          Message.error(error.response.data.message);
          window.location.href = profiles.consoleDomain() + "?redirecturl="+currenturl;
          break;
          default:
          Message.error(error.response.data.message);
          return Promise.reject(error.response.data);
          break
      }
    }else {
      error.response = {};
      return Promise.reject(error.response.data)
    }
    // console.log(JSON.stringify(error));
});
export default axios;
