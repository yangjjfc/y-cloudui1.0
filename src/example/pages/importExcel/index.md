### 导入Excel


示例代码：
``` html
<yl-import-excel :show.sync="imoprt.show" :url="imoprt.url" :params="imoprt.params" @success="getList"></yl-import-excel>
```

```js
imoprt: {
    show: false,
    params: {
        readParams: {}, // 读取参数
        importsParams: {},  // 导入参数
        checParams: {}, // 校验参数
        downParams: {}  // 下载模板参数
    },
    url: {
        read: 'cdc.customer.readExcel', // 读取接口
        imports: 'cdc.customer.importExcel',    // 导入接口
        checExcel: 'cdc.customer.checkExcel',   // 校验接口
        downFile: 'cdc.customer.importExcelTemplate'    //下载模板接口
    }
}
```

## Example Codes
```html
<el-button type="primary" @click="importWare">导入</el-button>

<yl-import-excel :show.sync="imoprt.show" :url="imoprt.url" :params="imoprt.params" @success="getList"></yl-import-excel>
```

```js
data() {
    return {
        imoprt: {
            show: false,
            params: {
                readParams: {},
                importsParams: {},
                checParams: {},
                downParams: {}
            },
            url: {
                read: 'cdc.customer.readExcel',
                imports: 'cdc.customer.importExcel',
                checExcel: 'cdc.customer.checkExcel',
                downFile: 'cdc.customer.importExcelTemplate'
            }
        }
    };
},
methods: {
    importWare(){
        this.imoprt.show = true;
    },
    getList(){
        console.log('导入成功');
    }
}
```


### Attributes
|  参数      |   说明   |   类型  |   可选值   |   默认值   | 是否必填 |
| :-------- | :-------| :-------|:--------|:--------|:--------|
| show  | 是否显示导入控件 |  Boolean   |  true/false | false | 是 |
| params  | 四个相关接口参数，详见上诉代码 |  Object   |  -- | {readParams: {},checParams: {},importsParams: {},downParams: {}} |否|
| url | 四个相关接口路径，详见上诉代码  |  Object   |  -- | {read: '',imports: '',checExcel: '',downFile: ''} |是|


### Events
|  方法名      |   说明   |  参数  |
| :-------- | :-------| :-------|
| success  | 导入成功后的回调 |  --  |


