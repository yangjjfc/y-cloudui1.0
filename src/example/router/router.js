/* layout */
// const _import = require('./_import_' + process.env.NODE_ENV);

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 * virtual : this is the virtual menu
 **/
import Layout from '@/example/layout/Layout.vue';
const Menu = [
    {
        path: 'dialog',
        name: 'dialog',
        meta: {
            name: '弹出模态框'
        },
        component: () => import('../pages/dialog/index')
    },{
        path: 'fileUpload',
        name: 'fileUpload',
        meta: {
            name: '图片上传'
        },
        component: () => import('../pages/fileUpload/index')
    },{
        path: 'icon',
        name: 'icon',
        meta: {
            name: '阿里图标'
        },
        component: () => import('../pages/icon/index')
    },{
        path: 'importExcel',
        name: 'importExcel',
        meta: {
            name: '导入excel'
        },
        component: () => import('../pages/importExcel/index')
    },{
        path: 'pagination',
        name: 'pagination',
        meta: {
            name: '分页'
        },
        component: () => import('../pages/pagination/index')
    },{
        path: 'print',
        name: 'print',
        meta: {
            name: '打印'
        },
        component: () => import('../pages/print/index')
    },{
        path: 'regionPicker',
        name: 'regionPicker',
        meta: {
            name: '省市区选择联动'
        },
        component: () => import('../pages/regionPicker/index')
    },{
        path: 'table',
        name: 'table',
        meta: {
            name: '表格扩展'
        },
        component: () => import('../pages/table/index')
    },{
        path: 'tableTree',
        name: 'tableTree',
        meta: {
            name: '表格树'
        },
        component: () => import('../pages/treeTable/index')
    },{
        path: 'editor',
        name: 'editor',
        meta: {
            name: '文本编辑器'
        },
        component: () => import('../pages/editor/index')
    }
];
const constantRouterMap = [
    { path: '', redirect: '/login' },
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/login/index')
    }, {
        path: '/app',
        component: Layout,
        meta: {name: '固定页面'},
        children: [
            {
                path: 'hello',
                name: 'hello',
                meta: {
                    name: '欢迎页面'
                },
                component: () => import('../pages/index/hello')
            }
        ].concat(Menu)
    }
];

const RouterMap = {
    Menu,
    map: constantRouterMap
};

export default RouterMap;
