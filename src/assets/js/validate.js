/**
 * validate 自定义校验规则及提示 on 2017/8/28.
 */
import Vue from 'vue'
import VeeValidate, {Validator} from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN';

Validator.addLocale(zh);
const config = {
  locale: 'zh_CN',
  events: ''
};
Vue.use(VeeValidate,config);
var diyMessage={
  handleFormType:function(field){
      var arr=field.split('|');
  }
};
const dictionary = {
  zh_CN: {
    messages: {
      required: (field)=> {
        var retValue='';
        var arr=field.split('|');
        console.log(arr)
        if(arr[1] != undefined){
          switch(arr[1]){
              case 'select':
                    retValue = '请选择'+arr[0];
                  break;
              default :
                  retValue = '请输入'+arr[0];
          }
        }else{
            retValue = '请输入'+arr[0];
        }
        return retValue;
      },
      max_value: (field, params, data) => field +" 不能大于" + params,
      between: (field, params, data) => field +" 只能输入" + params[0] +'-' + params[1],
      numeric: (field, params, data) => field +" 只能输入正整数",
      decimal: (field, params, data) => "数据格式有误，请重新输入",
      twoDemical:()=>'最多可输入两位小数'
    },
    attributes:{
      email:'邮箱',
      password:'密码',
      phone: '手机',
      idCard:'身份证',
        number:'数字'
    },
    config:{
      errorBagName: 'errorBags', // change if property conflicts.
      fieldsBagName: 'fieldBags'

    }
  }
};
Validator.updateDictionary(dictionary);
Validator.extend('idCard', {
    messages: {
        zh_CN:field => field + '必须是合法身份证号',
    },
    validate: value => {
        return value = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(value);
    }
});
Validator.extend('morethanzero', {
    messages: {
        zh_CN:field => field + '必须是大于等于零的正整数',
    },
    validate: value => {
        return value = /^([0-9]+)$/.test(value);
    }
});
Validator.extend('twoDemical', {
    messages: {
        zh_CN:field => '最多可输入两位小数',
    },
    validate: value => {
        return value = /^[+-]?\d*\.?\d{0,2}$/.test(value)

    }
});
/*Vue.use(VeeValidate,config);*/
