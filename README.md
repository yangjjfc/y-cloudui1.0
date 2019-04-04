# npm-common

### install
> `npm i ycloud-ui`


### 模块下page下文件夹命名规则如下所示
> 其中`a-model`为模块名称
```html
pages
    └─a-model
        ├─order
            └─index.vue
        └─product
            └─index.vue
```

### list

**第三方库**
* [x] axios //http 请求
* [x] vuex    // stroe
* [x] vue-router // 路由

**自定义组件**
* [x] icon-svg	// svg 图标
* [x] importExcel	// 导入Excel
* [x] regionPicker (填值的时候去掉绿色验证)	// 省市区选择器
* [ ] ScrollBar  //滚动条 待定
* [x] Error 	//错误页
* [x] FileUpload // 文件上传 需要优化
* [x] Pagination	// 分页组件
* [x] Print	// 打印
* [ ] YlEditor	// 富文本编辑器
* [x] YlTable （需要整合）	// 自定义列表
* [x] YlDialog	// 弹窗
* [x] YlTreeTable	// 表格树
* [ ] layout

**公用方法、指令**

* [x] global	// 公用方法
* [x] mixins	// 混入
* [ ] filter	// 过滤器
* [ ] directive	// 指令
* [x] print		// 打印


### 更改记录

-  更改表格树的实现 2019-1-5
-  表格计算高度的bug修复 2019-1-7
-  更改接口默认调用方式 2019-1-8
-  优化表格树的显示 2019-1-10
-  更新上传插件支持完成调用 2019-1-14
-  更新上传插件，支持逗号，分号，异步，pdf小图预览 2019-1-14
-  上传组件无图渲染  2019-1-25
-  修改富文本编辑器
-  修改dialog 默认点击modal 不关闭
-  优化包大小  2019-3-15

### npm发布
> npm publish

### 应用方更新包
> yarn upgrade ycloud-ui/ cnpm update ycloud-ui