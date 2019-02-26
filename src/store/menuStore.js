/**
 * 菜单管理
 */
export default {
    homeMenu: [
        {
            name: '首页',
            icon: 'icon-shouye',
            link: {
                path: '/index',
            },
        },
    ],
    fullMenu: [
        {
            name: '权限管理',
            icon: 'icon-quanxianguanli',
            children: [
                {
                    name: '用户管理',
                    link: {
                        path: '/authority/userList',
                    },
                },
                {
                    name: '角色配置',
                    link: {
                        path: '/authority/roleConfig',
                    },
                },
                {
                    name: 'Team管理',
                    link: {
                        path: '/authority/team',
                    },
                },
                {
                    name: '任务管理',
                    link: {
                        path: '/missionControl/list',
                    },
                },
            ],
        },
        {
            name: '操作日志',
            icon: 'icon-caozuorizhi',
            children: [
                {
                    name: '操作日志',
                    link: {
                        path: '/logs/logHistory',
                    },
                },
            ],
        },
    ],
};
