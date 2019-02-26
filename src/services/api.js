/**
 * 统一接口请求处理
 */

// 统一处理请求发送
const sendRequest = (modules, method, data, config) => {
    let url = `/${modules}/${method}`;
    url = `/api${url}`;
    return window.axios.post(url, data, {
        showLoading: false,
        showCodeError: true,
        showNetworkError: true,
        ...config,
    });
};

/**
 * 账户
 */
export const account = {
    // 登录
    login(data, config) {
        return sendRequest('user', 'login', data, config);
    },
    // 登出
    logout(data, config) {
        return sendRequest('user', 'logout', data, config);
    },
    // 搜索用户列表
    searchuser(data, config) {
        return sendRequest('user', 'searchuser', data, config);
    },
    // 用户-分页查询用户
    getUserList(data, config) {
        return sendRequest('user', 'userpage', data, config);
    },
    // 用户-分页角色列表
    getRoleList(data, config) {
        return sendRequest('user', 'rolepage', data, config);
    },
    // 用户-删除用户
    deleteuser(data, config) {
        return sendRequest('user', 'deleteuser', data, config);
    },
    // 用户-添加用户
    setuser(data, config) {
        return sendRequest('user', 'setuser', data, config);
    },
    // 用户-添加角色
    setrole(data, config) {
        return sendRequest('user', 'setrole', data, config);
    },
    // 用户-删除角色
    deleterole(data, config) {
        return sendRequest('user', 'deleterole', data, config);
    },
    // 用户-用户信息
    userInfo(data, config) {
        return sendRequest('user', 'userinfo', data, config);
    },
    // team管理- 查询team列表
    teampage(data, config) {
        return sendRequest('user', 'teampage', data, config);
    },
    // team管理-新增
    addteam(data, config) {
        return sendRequest('user', 'addteam', data, config);
    },
    // team管理-修改team
    setteam(data, config) {
        return sendRequest('user', 'setteam', data, config);
    },
    // team管理-新增/修改/删除team
    deleteteam(data, config) {
        return sendRequest('user', 'deleteteam', data, config);
    },
};

/**
 * 日志
 */
export const logs = {
    getLogs(data, config) {
        return sendRequest('log', 'getpage', data, config);
    },
    deletelog(data, config) {
        return sendRequest('log', 'deletelog', data, config);
    },
};

/**
 * 任务管理
 */
export const mission = {
    // 任务列表
    missionList(data, config) {
        return sendRequest('taskdispatch', 'select', data, config);
    },
    // 任务开始
    missionStart(data, config) {
        return sendRequest('taskdispatch', 'exec', data, config);
    },
};

