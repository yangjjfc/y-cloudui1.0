### pagination

- Attributes

|  参数      |   说明   |   类型  |   可选值   |   默认值   |
| :-------- | :-------| :-------|:--------|:--------|
| total  | 总页数 |  String, Number   |  -- | -- |
| pageSize | 单页显示数量  |  String, Number   |  -- | -- |
| pageIndex  | 页码 |  String, Number   |  -- | -- |
| pageSizes  | 每页显示个数选择器的选项设置 |  number[]   |  -- | [10, 20, 30, 40, 50, 100] |
| disabled  | 是否禁用 |  boolean   |  -- | false |
| layout  | 组件布局，子组件名用逗号分隔 |  Object   |  -- | total, sizes, prev, pager, next, jumper |




- Event 

|  事件名称      |   说明   |   	回调参数  |
| :-------- | :-------| :-------|
| change  | 改变页码事件 |   |


- 示例

``` html
    <yl-pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageIndex" @change="getList()"></yl-pagination>
```

```js
export default {
  data() {
    return {
      md,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 100
      }
    };
  },
  methods: {
        getList(){}

  }
};
```



