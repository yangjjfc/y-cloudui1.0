import { MessageBox, Message } from 'element-ui';
import { downloadFile } from './global.common';
/**
 * 下载
 */
const handleDownzip = () => {
    let file = process.env.IMAGE_DOWNLOAD + 'my/501622446704/printer-lodop-20180130155630792.zip';
    downloadFile(file, '安装包');
};
/**
 * print 弹出框
 * @param {*html} vnode 
 */
export const msgbox = (vnode) => {
    MessageBox.alert(vnode, '提示', {
        confirmButtonText: '下载安装',
        type: 'warning',
        showCancelButton: false,
        center: true,
        dangerouslyUseHTMLString: true
    }).then(() => {
        handleDownzip();
    }).catch(() => { }); 
};

export const message = (message, type = 'success') => {
    Message({
        message,
        type
    }); 
};