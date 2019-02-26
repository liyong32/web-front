<template>
    <v-layout id="entry" @click.native="clickContain">
        <v-header class="header" v-show="!fullScreen">
            <div class="left">
                <!--<img src="../assets/img/logo.png" alt="" class="logo">-->
                <span class="title">{{websiteTitle}}</span>
            </div>
            <div class="right">
                <v-popover class="login-userinfo-box" ref="exportDownloadBtn" placement="bottom">
                    <div class="user-info">
                        <i class="iconfont icon-yonghu-yuan"></i>
                        <span>{{userInfo && userInfo.nick_name}}</span>
                    </div>
                    <div slot="content" class="userInfo-contain">
                        <div class="logout-line" @click="logout">
                            <i class="iconfont icon-tuichu"></i>
                            <span>退出登录</span>
                        </div>
                    </div>
                </v-popover>
            </div>
        </v-header>
        <v-layout>
            <v-sider v-show="!fullScreen" :width="200" v-model="collapsed">
                <div class="menu-box" :class="{collapsed: collapsed}">
                    <v-menu theme="dark" v-if="menu.length" :mode="collapsed?'vertical':'inline'" :data="menu" @item-click="menuSelect" ref="menuTree">
                        <template slot-scope="{data}">
                            <router-link v-if="data.icon" :class="'iconfont ' + data.icon" :to="data.link" tag="i"></router-link>
                            <router-link :to="data.link" :class="{'class1-submenu': data.icon}" style="display:inline">{{data.name}}</router-link>
                        </template>
                        <template slot-scope="{data}" slot="sub">
                            <i v-if="data.icon" :class="'iconfont ' + data.icon"></i>
                            <span :class="{'class1-submenu': data.icon}">{{data.name}}</span>
                        </template>
                    </v-menu>
                    <v-spin v-else tip="Loading..."><div></div></v-spin>
                </div>
                <div class="sider-collapsed" @click="collapsedSider">
                    <i class="iconfont icon-left2-copy"></i>
                </div>
            </v-sider>
            <v-layout>
                <div class="pageToolbar">
                    <div class="tools pull-right">
                        <v-icon :type="fullscreenIcon" :title="fullscreenText" @click.native="gotoFullscreen"></v-icon>
                    </div>
                    <v-breadcrumb v-if="breadcrumbs.length">
                        <v-breadcrumb-item>
                            <i :class="'iconfont ' + activeIcon"></i>
                        </v-breadcrumb-item>
                        <v-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index"><v-icon v-if="breadcrumb.icon" type="home">{{breadcrumb.icon}}</v-icon>{{breadcrumb.name}}</v-breadcrumb-item>
                    </v-breadcrumb>
                </div>
                <div class="iframe-content">
                    <!-- <v-spin :spinning="spinning" tip="页面加载中...">
                        
                    </v-spin> -->
                    <vLoading type="roll" v-model="spinning" text="页面加载中..."></vLoading>
                    <router-view class="iframe iframeContain" ref='iframeContain' v-if="userInfo"></router-view>
                    <vInputModal></vInputModal>
                </div>
            </v-layout>
        </v-layout>
    </v-layout>
</template>
<script>
    import {
        account,
    } from '@/services/api';
    import {
        mapState,
    } from 'vuex';
    import Cookies from 'js-cookie';
    import vInputModal from '../../components/vInputModal.vue';
    import vLoading from '../../components/vLoading';

    export default {
        components: {
            vInputModal,
            vLoading,
        },
        data() {
            return {
                fullScreen: false, // 全屏标志
                collapsed: false,
                spinning: false,
                breadcrumbs: [{ name: '首页' }],
                menu: [],
                token: '',
                activeIcon: '',
            };
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                const token = Cookies.get('token');
                vm.token = token;
            });
        },
        mounted() {
            this.getMenu();
            this.$nextTick(() => {
                this.autoSelect();
                this.showPage();
            });
            window.Bus.$on('page-entry', (r) => {
                this.spinning = r;
            });
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo,
            }),
            fullscreenIcon() {
                return this.fullScreen ? 'shrink' : 'arrow-salt';
            },
            fullscreenText() {
                return this.fullScreen ? '退出全屏' : '全屏';
            },
            user() {
                return this.$store.state.userInfo;
            },
        },
        watch: {
            collapsed() {
                this.$nextTick(() => {
                    this.triggerResize();
                    setTimeout(this.triggerResize, 300);
                });
            },
            userInfo() {
            },
        },
        methods: {
            clickContain() {
                window.Bus.$emit('click-contain');
            },
            showPage() {
                if (this.$route.path.match(/\/missionControl\//)) {
                    return;
                }
                const ifShow = this.userInfo && this.userInfo.menu && this.userInfo.menu.indexOf(this.$route.path) >= 0;
                if (!ifShow) {
                    this.$router.push({
                        path: '/index',
                    });
                }
            },
            // 根据当前用户权限获取菜单
            getMenu() {
                this.menu = [];
                const homeMenu = this.$store.state.homeMenu;
                const menuArr = [...this.$store.state.fullMenu];
                // if (this.userInfo.isadmin) {
                //     this.menu = this.menu.concat(homeMenu, menuArr);
                //     return;
                // }
                const arr = this.userInfo.menu ? JSON.parse(this.userInfo.menu) : [];
                const userMenu = arr.filter(item => item.indexOf('/') >= 0);
                // console.log(userMenu);
                const filterChildren = children => children.filter((child) => {
                    if (child.link) {
                        return child.link && userMenu.includes(child.link.path);
                    }
                    return true;
                });
                const tagParent = (node) => {
                    if (node.parent) {
                        const parent = node.parent;
                        parent.isMatch = true;
                        tagParent(parent);
                    } else {
                        parent.isMatch = false;
                    }
                };
                const buildTree = (input, parentNode) => {
                    const node = {};
                    node.name = input.name;
                    node.parent = parentNode;
                    if (input.link) {
                        node.link = input.link;
                        node.isLeaf = true;
                        tagParent(node);
                    } else {
                        const nChildren = filterChildren(input.children).map(child => buildTree(child, node));
                        node.children = nChildren;
                        if (nChildren.length === 0) {
                            node.isMatch = false;
                        }
                    }
                    return node;
                };
                const nodes = menuArr.map((e) => {
                    const node = {};
                    node.name = e.name;
                    node.icon = e.icon;
                    node.isLeaf = false;
                    node.children = filterChildren(e.children).map(child => buildTree(child, node)).filter(item => (typeof item.isMatch === 'undefined' || item.isMatch));
                    return node;
                }).filter(e => e.isMatch);
                this.menu = this.menu.concat(homeMenu, nodes);
            },
            updateIcon(icon) {
                this.activeIcon = icon || 'icon-shouye';
            },
            // 页面刷新时根据path展开相应的菜单
            autoSelect() {
                const path = this.$route.path;
                let parentObj = null;
                let find = false;
                const breadPath = [];
                const findEle = (arr, parent) => {
                    parentObj = parent;
                    for (let i = 0; i < arr.length; i++) {
                        const item = arr[i];
                        if (item.children) {
                            if (!find) {
                                findEle(item.children, item);
                                if (parent) {
                                    parentObj = parent;
                                }
                            }
                        } else if (item.link) {
                            if (item.link.path === path) {
                                item.selected = true;
                                find = true;
                                if (parent) {
                                    parent.expand = true;
                                    if (parent.name !== item.name) {
                                        breadPath.push({ name: parent.name }, { name: item.name });
                                    }
                                    if (parent.icon) {
                                        this.updateIcon(parent.icon);
                                    }
                                }
                                break;
                            }
                        }
                    }
                };
                findEle(this.menu);
                if (parentObj && find) {
                    parentObj.expand = true;
                    if (breadPath.findIndex(item => (item.name === parentObj.name)) < 0) {
                        breadPath.unshift({ name: parentObj.name });
                    }
                    this.updateIcon(parentObj.icon);
                } else {
                    breadPath.push({
                        name: this.$route.meta.title,
                    });
                    if (this.$route.meta.title === '首页') {
                        this.updateIcon('icon-shouye');
                    }
                }
                this.breadcrumbs = breadPath;
            },
            menuSelect(pathData) {
                const path = [];
                for (const data of pathData) {
                    path.push({ name: data.name });
                }
                document.title = path[path.length - 1].name;
                this.breadcrumbs = path;
                this.updateIcon(pathData[0].icon);
            },
            triggerResize() {
                if (document.createEvent) {
                    window.dispatchEvent(new Event('resize'));
                } else {
                    const event = document.createEvent('HTMLEvents');
                    event.initEvent('resize', true, true);
                    window.fireEvent(`on${event.eventType}`, event);
                }
            },
            gotoFullscreen() {
                this.fullScreen = !this.fullScreen;
                // 触发resize事件，页面元素重新布局，二期使用dom操作库优化代码  todo
                this.$nextTick(() => {
                    this.triggerResize();
                    setTimeout(this.triggerResize, 300);
                });
            },
            logout() {
                this.$modal.confirm({
                    iconType: 'exclamation-circle',
                    title: '退出系统 ?',
                    content: '我们期待与您的下次见面，您确定要退出系统吗？',
                    okText: '确定，下次见',
                    onOk: () => {
                        account.logout({ token: this.token }).then((r) => {
                            if (r.status) {
                                this.$pub.logout();
                            } else {
                                this.$message.error(r.msg);
                            }
                        }).catch((e) => {
                            this.$message.error(e);
                        });
                    },
                    onCancel: () => {},
                });
            },
            collapsedSider() {
                this.collapsed = !this.collapsed;
            },
        },
    };
</script>
<style lang="less" type="text/less">
    #entry {
        height: 100%;
        .ant-spin-container.ant-spin-blur {
            filter: none;
        }  
        .header {
            padding: 0;
            height: 54px;
            line-height: 54px;
            display: flex;
            justify-content: space-between;
            padding: 0 0 0 15px;
            box-sizing: border-box;
            align-items: center;
            background: #002140;
            .left {
                display: flex;
                align-items: center;
            }
            .right {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                height: 100%;
                .login-userinfo-box {
                    .ant-popover {
                        transform: translate3d(0,-8px, 0);
                        left: auto !important;
                        right: 5px !important;
                        width: 142px !important;
                    }
                    .ant-popover-arrow {
                        display: none;
                    }
                }
                > div + div {
                    margin-left: 10px;
                }
                .option-header-btn {
                    height: 30px;
                    width: 30px;
                    line-height: 33px;
                    text-align: center;
                    border-radius: 2px;
                    cursor: pointer;
                    color: rgba(255, 255, 255, 0.8);
                    > i {
                        font-size: 22px;
                    }
                }
                .ant-popover-wrapper {
                    display: inherit !important;
                    > div {
                        vertical-align: middle;
                    }
                }
                .userInfo-contain {
                    width: 110px;
                    i, span {
                        vertical-align: middle;
                    }
                    > div {
                        cursor: pointer;
                        &:hover {
                            color: #108ee9;
                        }
                    }
                }
                .user-info {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 14px;
                    font-weight: normal;
                    font-weight: 100;
                    padding: 0 15px;
                    cursor: pointer;
                    border-left: 1px solid #404042;
                    max-width: 180px;
                    overflow: hidden;
                    height: 100%;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    > i {
                        font-size: 25px;
                        margin-right: 5px;
                    }
                    > span , i {
                        vertical-align: middle;
                    }
                    &:hover {
                        background-color: #0c375f;
                    }
                }
            }
        }
        .dropdownMenu{
            font-size: 14px;
            cursor: pointer;
            margin: -8px -16px;
            line-height: 29px;
            text-indent: 20px;
            li:hover{
                color: #5c6fb4
            }
            li:not(:last-child){
                border-bottom: 1px solid #e9e9e9;
            }
        }
        .iframe-content {
            flex: 1;
            // z-index: 0;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
        }
        .pageToolbar{
            padding:5px 10px;
            z-index: 1;
            background-color: #fafafa;
            box-shadow: 0 1px 5px 0 rgba(0,0,0,.2);

            .tools {
                i{
                    cursor: pointer;
                }
                i:hover{
                    color: #369BE9;
                }
            }
        }
        .iframe{
            // flex:1;
            background-color: #fff;
            position: relative;
        }
        .title {
            margin-left: 15px;
            font-size: 18px;
            // color: #84849A;
            color: rgba(255,255,255, 0.8);
        }
    }
</style>
<style lang="less" type="text/less">
    #entry {
        .ant-layout {
            overflow: hidden;
            height: 100%;
        }
        .ant-spin-container,.iframeContain {
            min-height: 100%;
            width: 100%;
        }
        .ant-layout-sider {
            height: 100%;
            display: flex;
            flex-direction: column;
            -moz-user-select:none;/*火狐*/
            -webkit-user-select:none;/*webkit浏览器*/
            -ms-user-select:none;/*IE10*/
            -khtml-user-select:none;/*早期浏览器*/
            user-select:none;
            .menu-box {
                flex: 1;
                overflow: auto;
                &.collapsed {
                    overflow: visible;
                }
            }
            .sider-collapsed {
                width: 100%;
                height: 40px;
                cursor: pointer;
                background-color: #1E2642;
                border-top: 1px solid #1d1f27;
                color: #d2c8c8;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0 15px;
                .iconfont {
                    transition: all 0.3s;
                    font-size: 15px;
                }
            }
        }
        .ant-layout-sider-collapsed {
            .sider-collapsed {
                justify-content: center;
                .iconfont {
                    transform: rotate(180deg);
                }
            }
        }
        .ant-menu {
            flex: 1;
        }
        .ant-layout-sider-trigger {
            border-top: 1px solid #1d1f27;
        }
        .normal-contain.iframe {
            overflow: auto;
        }
        .ant-menu-submenu-title {
            .anticon {
                margin-right: 3px;
            }
        }
        .ant-layout-sider-collapsed {
            .anticon {
                font-size: 16px;
                margin-left: 8px;
            }
            .class1-submenu {
                display: none !important;
            }
            .ant-menu-submenu-vertical > .ant-menu-submenu-title:after {
                display: none;
            }
        }
        .ant-spin-nested-loading{
            height:100%;
            & > div > .ant-spin {
                max-height: none;
            }
        }
        .ant-menu-dark .ant-menu-sub {
            background: rgb(25, 29, 45);
        }
        .ant-menu-dark, .ant-layout-sider, .ant-layout-sider-trigger {
            background-color: #1E2642;
        }
        .ant-menu-dark .ant-menu-item > a, .ant-menu-dark, .ant-menu-dark .ant-menu-sub{
            color: #fff
        }
        .ant-menu.ant-menu-dark .ant-menu-item-selected {
            background-color: #56576759;
        }
        .ant-popover-placement-bottomRight > .ant-popover-content > .ant-popover-arrow {
            right: 10px
        }
        .ant-layout-has-sider {
            .class1-submenu {
                margin-left: 5px;
            }
            .ant-menu-submenu-title {
                > span {
                    > i , span {
                        vertical-align: middle;
                    }
                }
            }
            .ant-layout-sider-collapsed {
                text-align: center;
                .ant-layout-has-sider {
                    .ant-menu-submenu-title {
                        > span {
                            > span {
                                margin-left: 0;
                            }
                        }
                    }
                }
            }
        }
        .silder-collapsed {
            height: 50px;
            background-color: red;
            width: 100%;
        }
        .ant-breadcrumb {
            > span {
                > span {
                    vertical-align: middle;
                }
            }
        }
    }
</style>
