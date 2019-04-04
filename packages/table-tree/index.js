import MyTableTree from './src/main';

/* istanbul ignore next */
MyTableTree.install = function(Vue) {
    Vue.component(MyTableTree.name, MyTableTree);
};

export default MyTableTree;
