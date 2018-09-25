import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/trade_list',
                    component: resolve => require(['../components/page/TradeTable.vue'], resolve),
                    meta: { title: '消费记录' }
                },
                {
                    path: '/tradeType_list',
                    component: resolve => require(['../components/page/TradeType.vue'], resolve),
                    meta: { title: '消费类型' }
                },
                {
                    path: '/study_list',
                    component: resolve => require(['../components/page/StudyTable.vue'], resolve),
                    meta: { title: '学习记录' }
                },
                {
                    path: '/menstruation_list',
                    component: resolve => require(['../components/page/Menstruation.vue'], resolve),
                    meta: { title: '姨妈记录' }
                },
                {
                    path: '/user_list',
                    component: resolve => require(['../components/page/UserTable.vue'], resolve),
                    meta: { title: '用户信息' }
                },
                {
                    path: '/marriage_list',
                    component: resolve => require(['../components/page/Marriage.vue'], resolve),
                    meta: { title: '组建家庭' }
                },
                {
                    path: '/loginlog_list',
                    component: resolve => require(['../components/page/LoginLog.vue'], resolve),
                    meta: { title: '登录日志' }
                },
                 {
                    path: '/menstruation_chart',
                    component: resolve => require(['../components/page/MenstruationChart.vue'], resolve),
                    meta: { title: '大姨妈趋势图' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
