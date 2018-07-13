/**
 *  配置信息
 */
import vueCookie from 'vue-cookie'
import tld from 'tldjs'

const profiles = {
    // 环境变量
    env: () => process.env.NODE_ENV,
    prodenv: () => process.env.PROD_TOKEN,
    apiDomain: () => {
        let domain = '';
        if (profiles.prodenv() === 'dev' || profiles.prodenv() === 'development') {
            //测试环境接口地址
            domain = 'http://api.domain.com'
        } else {
            //正式环境接口地址
            domain = 'http://' + document.domain;
        }
        return domain;
    },
    cookieDomain: () => {
        let domain = '';
        if (this.prodenv() === 'dev' || this.prodenv() === 'development') {
            domain = 'localhost'
        } else {
            domain = tld.getDomain(document.domain);
        }
        return domain;
    },
    consoleDomain: () => {
        return process.env.CONSOLE_DOMAIN
    }
};
const cookie = {
    token: () => {
        return vueCookie.get('btoken');
    },
    empAccount: () => {
        return vueCookie.get('empAccount');
    }
};
export {profiles, cookie};
