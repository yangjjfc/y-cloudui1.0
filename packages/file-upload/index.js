import FileUpload from './src/main';

/* istanbul ignore next */
FileUpload.install = function(Vue) {
    Vue.component(FileUpload.name, FileUpload);
};

export default FileUpload;
