export default [
    {
        path: '/',
        component: resolve => require(['../views/entry.vue'], resolve),
        redirect: '/index',
        children: [
            {
                path: 'index',
                name: 'index',
                meta: { title: '首页' },
                component: resolve => require(['../views/index.vue'], resolve),
            },
            {
                path: 'error/:code',
                name: 'error',
                meta: { title: '错误' },
                component: resolve => require(['../views/error.vue'], resolve),
            },
        ],
    },
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: resolve => require(['../views/login.vue'], resolve),
    },
    {
        path: '/err/:code',
        name: 'err',
        meta: { title: '错误' },
        component: resolve => require(['../views/error.vue'], resolve),
    },
    {
        path: '*',
        redirect: '/error/404',
    },
    {
        path: '/authority', // 权限管理
        component: resolve => require(['../views/entry.vue'], resolve),
        redirect: '/authority',
        children: [
            {
                path: 'userList',
                name: 'userList',
                meta: { title: '用户管理' },
                component: resolve => require(['../views/authority/userList.vue'], resolve),
            },
            {
                path: 'roleConfig',
                name: 'roleConfig',
                meta: { title: '角色配置' },
                component: resolve => require(['../views/authority/roleConfig.vue'], resolve),
            },
            {
                path: 'team',
                name: 'team',
                meta: { title: 'Team管理' },
                component: resolve => require(['../views/authority/team/team.vue'], resolve),
            },
        ],
    },
    {
        path: '/logs', // 日志管理
        component: resolve => require(['../views/entry.vue'], resolve),
        redirect: '/logs',
        children: [
            {
                path: 'logHistory',
                name: 'logHistory',
                meta: { title: '操作日志' },
                component: resolve => require(['../views/logs/logHistory.vue'], resolve),
            },
        ],
    },
    {
        path: '/missionControl', // 任务管理
        component: resolve => require(['../views/entry.vue'], resolve),
        redirect: '/missionControl',
        children: [
            {
                path: 'list',
                name: 'list',
                meta: { title: '任务管理列表' },
                component: resolve => require(['../views/missionControl/list.vue'], resolve),
            },
        ],
    },
];
