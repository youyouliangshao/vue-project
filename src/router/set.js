import header from '@/components/header';
import side from '@/components/side';
import panel from '@/view/model-set/model-index';
import fraudModelDetail from '@/view/model-set/fraud-model-detail';
import modelDetail from '@/view/model-set/model-detail';
import modelObj from '@/view/model-set/set-model-obj';
export default [
    {
        // 反欺诈模型列表
        path: '/anti-fraud',
        name: 'antiFraudList',
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: panel
        }
    },
    {
        // 反欺诈模型对象设置
        path: '/anti-fraud/obj',
        name: 'antiFraudObj',
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: modelObj
        }
    },
    {
        // 反欺诈模型详情
        path: '/anti-fraud/detail',
        name: 'antiFraudDetail',
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: fraudModelDetail
        }
    },
    {
        // 预授信模型列表
        path: '/pre-authorized',
        name: "preModelList",
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: panel
        }
    },
    {
        // 预授信模型对象设置
        path: '/pre-authorized/obj',
        name: 'preModelObj',
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: modelObj
        }
    },
    {
        //  预授信模型详情
        path: '/pre-authorized/detail',
        name: 'preAntiFraudDetail',
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: modelDetail
        }
    },
    {
        // 授信模型列表
        path: '/authorized',
        name: "authorizedList",
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: panel
        }
    },
    {
        // 授信模型对象设置
        path: '/authorized/obj',
        name: 'authorizedObj',
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: modelObj
        }
    },
    {
        //  授信模型详情
        path: '/authorized/detail',
        name: 'authorizedDetail',
        meta: {requireAuth: true},
        components: {
            header: header,
            side: side,
            main: modelDetail
        }
    },

]