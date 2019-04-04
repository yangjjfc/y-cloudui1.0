import ImportExcel from './src/main.vue';

/* istanbul ignore next */
ImportExcel.install = function (Vue) {
    Vue.component(ImportExcel.name, ImportExcel);
};

export default ImportExcel;
