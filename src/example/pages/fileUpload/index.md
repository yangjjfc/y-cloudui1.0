### 自己封装element 上传组件

+ Attributes

|  参数      |   说明   |   类型  |   可选值   |   默认值   |
| :-------- | :-------| :-------|:--------|:--------|
| value  | 双向绑定值 |  String/Array   |  数组或者字符串 | -- |
| readonly  | 是否只读 |  Boolean   |  true/false | false |
| max  | 最大上传几张 |  Number   |  0-n| 5 |
| type  | 显示类型 |  string   |  同element | picture-card  |
| show  | 是否显示上传图片 |  Boolean   | true/false  | true  |
| beforeRemove  | 删除上传图片之前的回调 |  function   |  -- | --  |

- 说明  v-model值 如果是多张图字符串， 要以分号（如果你非要用逗号，我表示很无奈）分割。
- pdf预览用默认图显示。

###  事件
on-success  上传完成的钩子，参数为上传你成功后的地址

### 示例代码：
``` html
<yl-file-upload v-model="list" on-success="success"></yl-file-upload>
```
``` js
    {
        success(files){
            console.log(files);
        }
    }
```
