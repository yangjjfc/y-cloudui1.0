import Http from '../axios/index.js';
const URL = {
    expressNo: 'oms.express.updatePrintStatus',  // 打印回执
    outStorageNos: 'oms.outStorage.updatePrintStatus',  // 打印回执
    deliveryNos: 'oms.delivery.updatePrintStatus'  // 打印回执
};
export const updateStatus = (msg) => {
    console.log(msg);
    let key = msg.customer.type;
    let url = URL[key], _params = {};
    _params[key] = msg.customer.mold === 'String' ? msg.customer.arr[msg.index] : [msg.customer.arr[msg.index]];
    console.log(url, _params);
    Http(url, _params).then((res) => {
        console.log(msg.customer._self);
        msg.customer._self.getList();
    });
};