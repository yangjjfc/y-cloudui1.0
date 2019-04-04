import RegionPicker from './src/main';

/* istanbul ignore next */
RegionPicker.install = function (Vue) {
    Vue.component(RegionPicker.name, RegionPicker);
};

export default RegionPicker;
