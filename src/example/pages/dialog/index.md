### dialog

- Attributes

|  参数      |   说明   |   类型  |   可选值   |   默认值   |
| :-------- | :-------| :-------|:--------|:--------|
| modal  | 是否显示遮罩 |  Boolean   |  -- | true |
| show  | 是否显示dailog |  Boolean   |  -- | false |
| fullscreen  | 是否为全屏 |  Boolean   |  -- | false |
| title  | 弹框title |  String   |  -- | -- |
| width  | 弹框宽度 |  String   |  -- | 50% |
| close  | 点击model是否关闭 |  Boolean   |  -- | false |
| escClose  | esc关闭 |  Boolean   |  -- | true |
| center  | 是否对头部和底部采用居中布局 |  boolean   |  -- | false |
| appendToBody  | Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true |  boolean   |  -- | false |
| confirmButtonText  | 确认按钮text |  String   |  -- | 确定 |
| closeButtonText  | 关闭按钮text |  String   |  -- | 关闭 |
| disabledConfirmButton  | 禁用确认按钮 |  Boolean   |  -- | false |
| hideSubmitButton  | 隐藏确认按钮 |  Boolean   |  -- | false |
| hideCancelButton  | 隐藏取消按钮 |  Boolean   |  -- | false |
| classx  | Dialog 的自定义类名 |  String   |  -- | -- |



- slot 

|  name      |   说明   | 
| :-------- | :-------| 
| content  | 弹框content |
| btns | 扩展按钮数量 |


- Event 

|  事件名称      |   说明   |   	回调参数  |
| :-------- | :-------| :-------|
| submit  | 确认事件后回调函数 |   |
| reset | 取消事件后回调函数 |  |



- 示例

``` html
      <yl-dialog title="选择批号" :show.sync="show" width="1200px" @submit="submit">
        <div slot="content">弹框内容</div>
        <span slot='btns' style="margin-right:10px">
          <el-button type="primary" size="small" >暂存</el-button>
          <el-button type="primary" size="small" >暂存</el-button>
          <el-button type="primary" size="small" >暂存</el-button>
          <el-button type="primary" size="small" >暂存</el-button>
        </span>
    </yl-dialog>
```

```js
export default {
  data() {
    return {
      md,
      show:false
    };
  },
  methods: {
    submit() {
      this.show=false
    },
    showDialog() {
      this.show=true
    },
  },
  mounted() {}
};
```



