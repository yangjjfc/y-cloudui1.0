```js
{
    name: 'otherInStock',
    uselocal: true, //是否使用本地数据
    col: [
        {type: 'selection', width: 60, align: 'center', unSave: true, fixed: true},
        {type: 'index', prop: 'indexX', label: '序号', show: false,width: 50, align: 'center', unSave: true, fixed: true },
        {type: 'operate',
            label: '操作',
            width: 100,
            btns: [{
                name: '查看',
                event: this.view //事件
            },
            {
                name: '编辑',
                event: this.view,
                hide: () => this.hideEdit //隐藏
            }],
            unSave: true,
            fixed: true
        },
        {label: '单据单号', prop: 'billNo', width: 170},
        {label: '仓库', slot: 'warehouseName'},
        {label: '往来单位', prop: 'supplierName'},
        {label: '经办人', prop: 'agentName'},
        {label: '单据日期', slot: 'billDate'},
        {label: '入库数量', prop: 'totalNum'},
        {label: '单据状态', slot: 'status'}
    ],
    show: {
        total: true, // 自定义合计
        setTotalRow: true // 显示设置表格合计列
    }, 
    events: {
        'sort-change': this.sortList,
        'filter-change': this.filterList
    }
}
```