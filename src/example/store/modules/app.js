import { Http } from '@/index';
import {
    TOGGLE_SIDEBAR,
    SETICONS,
    GETUSERLEVEL,
    GETDELIVERYSTYLE,
    GETPROVINCETREE,
    GETEXPRESSCODE,
    WAREHOUSELIST,
    SETPRODUCT,
    SETCHECKEDROW
} from '../mutation-types.js';
const URL = {
    iconsList: 'brp.icon.findListForString', // icon接口
    provinceTree: 'bdc.region.provinceTree', // 查询省
    findListByEnterpriseNoForDubbo:
        'cdc.warehouse.findListByEnterpriseNoForDubbo', // 根据企业编号查询仓库列表
    iconUrl: 'http://at.alicdn.com/t/font_503119_asl70r0ia3k.css', // 图标列表来自于 iconfont 当前版本库
    findeByCode: 'dict.dictionary.findeByCode' // 数据字典维护的数据
};
let reverseComponentName = (str) => str.replace(/(\/|\.)/g, '');
const permission = {
    state: {
        sidebar: {
            // 侧边栏状态
            opened: !parseInt(sessionStorage.getItem('sidebarStatus'))
        },
        activeNav: '',
        tempNavs: [], // 临时导航
        cachedViews: [], // 缓存Views
        auth: {}
    },
    mutations: {
        // 设置菜单是否展开
        [TOGGLE_SIDEBAR]: state => {
            if (state.sidebar.opened) {
                sessionStorage.setItem('sidebarStatus', 1);
            } else {
                sessionStorage.setItem('sidebarStatus', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
        },
        [SETICONS] (state, data) {
            state.iconlist = data;
        },
        [GETUSERLEVEL]: (state, data) => {
            state.userLevel = data;
        },
        [GETPROVINCETREE]: (state, data) => {
            state.provinceTree = data;
        },
        [GETEXPRESSCODE]: (state, data) => {
            state.expressList = data;
        },
        setAuth: (state, data) => {
            state.auth = data;
        },
        // 添加或设置tab
        setTempNavs: (state, item) => {
            if (item instanceof Array) {
                state.tempNavs = item;
                state.cachedViews = item.filter(data => !data.meta.noCache).map(data => reverseComponentName(data.name));
                return;
            }
            let indexNo = 0,
                notInclude = true;
            state.tempNavs.forEach((data, index) => {
                data.name === state.activeNav && (indexNo = index);
                // 已包含
                if (data.name === item.name) {
                    Object.assign(data, item);
                    // data.label = item.label;
                    notInclude = false;
                }
            });
            if (notInclude) {
                state.tempNavs.splice(indexNo + 1, 0, { ...item });
            }
            state.activeNav = item.name;
            let cacheName = reverseComponentName(item.name);
            if (!item.meta.noCache && !state.cachedViews.includes(cacheName)) {
                state.cachedViews.push(cacheName);
            }
        },
        // 删除单个 tab
        removeNav: (state, obj) => {
            let tabs = state.tempNavs;
            if (tabs.length === 1) {
                return;
            }
            let { closeName, targetName } = { closeName: state.activeNav, ...obj };
            // 算出下一个激活router name
            if (closeName === state.activeNav && !targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === closeName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            targetName = nextTab.name;
                        }
                    }
                });
            }
            targetName && (state.activeNav = targetName);
            state.tempNavs = tabs.filter(tab => tab.name !== closeName);
            let cacheName = reverseComponentName(closeName);
            for (const i of state.cachedViews) {
                if (i === cacheName) {
                    const index = state.cachedViews.indexOf(i);
                    state.cachedViews.splice(index, 1);
                    break;
                }
            }
        },
        setActiveNav: (state, data) => {
            state.activeNav = data;
        }
    },
    actions: {
        // 菜单状态
        ToggleSideBar ({ commit }) {
            commit('TOGGLE_SIDEBAR');
        }
    }
};

export default permission;
