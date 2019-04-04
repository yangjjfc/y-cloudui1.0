//import $ from 'jquery';
import '@/assets/plugins/boxer/jquery.fs.boxer.js';
import '@/assets/plugins/boxer/jquery.fs.boxer.css';
import { getFileType } from '@/utils/global.common';

const bind = (el, binding, vnode) => {
    let imgSrc = binding.value;
    if (imgSrc) {
        let type = getFileType(imgSrc);
        if (['pdf', 'image'].includes(type)) {
            $(el).boxer();
        }
    }
    $(el).click(function () {
        return false;
    });
};

export default {
    bind(...rest) {
        bind(...rest);
    },
    update(...rest) {
        bind(...rest);
    }
}