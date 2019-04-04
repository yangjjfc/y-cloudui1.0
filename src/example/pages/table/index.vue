<template>
  <section class="container_setion">
     <el-tag class="tag-title" style="margin-bottom:20px">demo:</el-tag>
    <yl-table :data="list" :config="config" :page="page">
      <el-table-column
        prop="warehouseNo"
        :label="props.label"
        slot-scope="props"
        :fixed="props.col.fixed"
        slot="warehouseName"
        column-key="warehouseNo"
        :filter-multiple="false"
        :filters="warehouseOptions"
        align="center"
      >
        <template slot-scope="scope">
          <div v-text="scope.row.warehouseName"></div>
        </template>
      </el-table-column>
      <el-table-column
        :label="props.label"
        slot-scope="props"
        prop="bill_date"
        :fixed="props.col.fixed"
        min-width="120"
        sortable="custom"
        align="center"
        slot="billDate"
      >
        <template slot-scope="scope">
          <div v-text="scope.row.billDate"></div>
        </template>
      </el-table-column>
      <el-table-column
        :label="props.label"
        slot-scope="props"
        :fixed="props.col.fixed"
        prop="status"
        min-width="90"
        sortable="custom"
        align="center"
        :filter-multiple="false"
        slot="status"
        column-key="status"
        :filters="openOptions"
      >
        <template slot-scope="scope">
          <div v-html="scope.row.statusX"></div>
        </template>
      </el-table-column>
    </yl-table>
    <el-progress :percentage="100" :show-text="false" style="margin:20px 0"  :stroke-width="2"></el-progress>
    <markdown  :content="md" />
  </section>
</template>
<script>
import md from "./index.md";
export default {
  data() {
    return {
      md,
      warehouseOptions: [],
      openOptions:[],
      config: {
        name: "otherInStock",
        uselocal: true, //是否使用本地数据
        col: [
          {
            type: "selection",
            width: 60,
            align: "center",
            unSave: true,
            hide:false,
            fixed: true
          },
          {
            type: "index",
            prop: "indexX",
            label: "序号",
            show: false,
            width: 50,
            align: "center",
            unSave: true,
            fixed: true
          },
          {
            type: "operate",
            label: "操作",
            width: 200,
            btns: [
              {
                name: "查看",
                event: this.view //事件
              },
              {
                name: "编辑",
                event: this.view,
                hide: () => this.hideEdit() //隐藏
              },
              {
                      name: '编辑222',
                    event: this.view,
                    // hide: () => this.hideEdit // 隐藏
                  },{
                      name: '编辑1111111111111111111',
                    event: this.view,
                    hide: () => this.hideEdit() // 隐藏
                  },{
                      name: '编辑22222222222222222222222222222222222',
                    event: this.view,
                    hide: () => this.hideEdit() // 隐藏
                  }
              //  {
              //     type: 'dropdown',
              //     name: '更多',
              //     arr: []
              // }
            ],
            unSave: true,
            fixed: true
          },
          { label: "单据单号", prop: "billNo", width: 170 },
          { label: "仓库", slot: "warehouseName" },
          { label: "往来单位", prop: "supplierName" },
          { label: "经办人", prop: "agentName" },
          { label: "单据日期", slot: "billDate" },
          { label: "入库数量", prop: "totalNum" },
          { label: "单据状态", slot: "status" }
        ],
        show: {
          total: true, // 自定义合计
          setTotalRow: true // 显示设置表格合计列
        },
        events: {
          "sort-change": this.sortList,
          "selection-change": this.filterList
        }
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      list: [	{
				"createTime":"2018-09-26 13:55:13",
				"totalInedNum":0.00,
				"supplierName":"reeeeeeeeeeeeee",
				"agentNo":"501710203971",
				"supplierNo":"000000203",
				"remark":"",
				"borrowReturnNum":0.00,
				"invoiceNo":"",
				"id":196,
				"warehouseName":"123123",
				"inType":"gh",
				"billExplain":"归还WNR-200A嗜碱细胞有核红细胞溶血素02等共计2行21.00件货品",
				"billNo":"QTRKD201809260001",
				"totalAmount":21.00,
				"enterpriseNo":"6017401899",
				"billType":"QTRKD",
				"status":"dsh",
				"billDate":"2018-09-26",
				"createName":"hzgjmygs",
				"deleted":0,
				"totalNum":21.00,
				"agentName":"hzgjmygs",
				"createNo":"501710203971",
				"warehouseNo":"0000131",
				"syncFlag":0
			},
			{
				"createTime":"2018-08-23 14:01:38",
				"totalInedNum":0.00,
				"supplierName":"广州奥康生物有限公司",
				"agentNo":"501710203971",
				"supplierNo":"000000192",
				"remark":"",
				"borrowReturnNum":0.00,
				"invoiceNo":"",
				"id":191,
				"warehouseName":"W1仓库",
				"inType":"",
				"billExplain":"",
				"billNo":"QTRKD201808230001",
				"totalAmount":55.00,
				"enterpriseNo":"6017401899",
				"billType":"QTRKD",
				"status":"cg",
				"billDate":"2018-07-07",
				"createName":"hzgjmygs",
				"deleted":0,
				"totalNum":2.00,
				"agentName":"hzgjmygs",
				"createNo":"501710203971",
				"warehouseNo":"0000022",
				"syncFlag":0
			},
			{
				"createTime":"2018-07-25 13:33:34",
				"totalInedNum":0.00,
				"supplierName":"上海广辉医药有限公司",
				"agentNo":"501810204135",
				"supplierNo":"000000186",
				"remark":"",
				"borrowReturnNum":0.00,
				"invoiceNo":"",
				"id":79,
				"warehouseName":"啥仓库",
				"inType":"qt",
				"billExplain":"12",
				"billNo":"QTRKD-20180725-000016",
				"totalAmount":5.00,
				"enterpriseNo":"6017401899",
				"billType":"QTRKD",
				"status":"cg",
				"billDate":"2018-07-07",
				"createName":"hzgjmygs",
				"deleted":0,
				"totalNum":3.00,
				"agentName":"财务2",
				"createNo":"501710203971",
				"warehouseNo":"0000075",
				"syncFlag":0
			}
		]
    };
  },
  methods: {
    sortList() {},
    filterList(...res) {
      console.log(res)

    },
    view(){
      console.log(33333333333333)
    },
    hideEdit() {
      return false;
    }
  },
  mounted() {
    setTimeout(() => {
    this.list=[...[...this.list,...this.list],...[...this.list,...this.list],...[...this.list,...this.list],...[...this.list,...this.list]]
      
    }, 1000);
  }
};
</script>

<style lang="scss">
</style>