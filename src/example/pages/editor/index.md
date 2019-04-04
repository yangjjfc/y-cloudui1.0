### 富文本编辑器

#### 首先要在public/index.html 里引入 Tinymce 的js 包， 然后再使用此组件。
``` html
    <script src="/plugins/tinymce4.7.5/tinymce.min.js"></script>
```

### 属性

|  参数      |   说明   |   类型  |   可选值   |   默认值   |
| :-------- | :-------| :-------|:--------|:--------|
| value  | 双向绑定内容 |  String   |  -- | -- |
| toolbar  | 需要的功能 |  Array   |  -- | [] |
| menubar  | 菜单栏上的菜单 |  Array/false   |  -- |  输入数量超过最大数量 |
| height  | 高度 |  Number   |  -- | -- |
| isUploadBtn  | 是否显示上传按钮 |  Boolean   |  -- | false |

### 代码实例
``` html
    <yl-editor :height="300" v-model="content"/>
```

### 参考api
[tiny 富文本](https://www.tiny.cloud/docs/configure/editor-appearance/#menubar)

