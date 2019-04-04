import boxer from './boxer'

const install = function(Vue) {
  Vue.directive('boxer', boxer)
}
if (window.Vue) {
  window['boxer'] = boxer
  Vue.use(install); // eslint-disable-line
}

boxer.install = install
export default boxer
