### region-picker 省市区选择联动

> 选择省市区地址，获取相应地区的名称及ID。这里使用的是前端固定的地址数据。


示例代码：

``` html
<yl-region-picker 
    value=""
    codes="330106"
    :disabled="false"
    @change="getAreaId"
    @input="getAreaName"
></yl-region-picker>
```



## Example
```html
<yl-region-picker codes="330106" @change="getAreaId" @input="getAreaName"></yl-region-picker>
```

```js
export default {
    data() {
        return {};
    },
    methods: {
        getAreaId(val){
            console.log(val);   // val 为省市区地址ID
        },
        getAreaName(val){
            console.log(val);   // val 为省市区地址名称
        }
    }
};
```
