### print 打印

> 使用C-Lodop打印控件 


示例代码：
``` html
<yl-print :show.sync="print.show" :data="print.data" :type="print.type"></yl-print>
```

```js
print: {
    show: false,
    data: {
        // logistics:物流管理           cdc.expressTemplate.getPrintTemplate
        // order:订单,随行单,发货单      oms.billTemplate.findBaseTemplateNoByBillType
        // '': 无需获取模板编号
        type: 'logistics',
        // type为 logistics 时，logisticsNo = no
        // type为 order 时，billType = no
        no: '', // 打印单据编号
        url: '',    // 打印接口地址
        params: {}  // 打印接口接收的参数  如：{ 'outStorageNo': this.data.outStorageNo }
        customer: {} // 用户自定义内容,方便更新打印状态,更新状态使用
    },
    type:'view' // print,view,testPreview
}

// 打印方法如下所示
funcPrint (msg, type) {
    this.print.show = true;
    let _json = {
        params: {expressNo: msg.expressNo}, 
        no: msg.logisticsNo || '',
        type: 'logistics',
        url: 'oms.express.print',
        customer: {
            type: 'expressNo',
            arr: [msg.expressNo],
            _self: this,
            mold: 'String'
        }  
    };  
    this.print.data = {...this.print.data, ..._json};
}
```



## Example Codes
```html
<el-button type="primary" @click="funcPrint">打印</el-button>
```

```js
data() {
    return {
        print: {
            show: false,
            data: {
                no: 'ims-purchase-order'
            }
        }
    };
},
methods: {
    funcPrint (msg, type) {
        this.print.show = true;
        let _json = {
            params: {billNo: 'CGDD201808010006'},
            url: 'ims.purchase.get'
        };
        this.print.data = {...this.print.data, ..._json};
    }
}
```


### Attributes
|  参数      |   说明   |   类型  |   可选值   |   默认值   | 是否必填 |
| :-------- | :-------| :-------|:--------|:--------|:--------|
| show  | 是否显示打印控件 |  Boolean   |  -- | false | 是 |
| data  | 打印相关参数，具体可参考上面代码备注 |  Object   |  -- | -- |是|
| type | 打印单据类型  |  String   |  'print','view','testPreview','' | 'print' |否|
