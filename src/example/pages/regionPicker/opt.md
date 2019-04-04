### Attributes
|  参数      |   说明   |   类型  |   可选值   |   默认值   |
| :-------- | :-------| :-------|:--------|:--------|
| value  | 省市区地址名称 |  String   |  -- | -- |
| codes  | 省市区地址ID |  String / Number   |  -- | -- |
| disabled | 是否禁用  |  Boolean   |  -- | false |
| validateEvent  | 是否在选择之后进行表单验证 |  Boolean   |  -- | true |

### Events
|  方法名      |   说明   |  参数  |
| :-------- | :-------| :-------|
| change  | 用户确认选定的值时触发 |  省市区地址ID   |
| input  | 用户确认选定的值时触发 |  省市区地址名称   |
