<template>
    <div v-if="showAll"  style="overflow:hidden">
        <el-table :data="mixData" stripe border v-on="config.events" v-bind="config.attrs" ref="table" :max-height="height" >
            <template v-for="cItem in columns" v-if="!cItem.isHide">
                <template v-for="item in [formatItem(cItem)]">
                    <slot v-if="item.slot && !item.hide" :name="item.slot" :label="item.label" :col="item"></slot>
                    <el-table-column   v-bind="formatItem(item)" :key="item.mathRound"  v-else-if="item.type=='operate' && !item.hide"  >
                        <template slot-scope="scope">
                            <template v-for="(filItem) in [filterBtns(scope.row,item.btns)]"  >
                                <template v-for="subItem in filItem.splice(0,(filItem.length>4?3:4))" >    
                                    <el-button  :key="subItem.mathRound"  type="text" class="table-btns" size="mini" @click="subItem.event(scope.row)">{{subItem.name}}
                                    </el-button>
                                </template>
                            </template>
                            <template v-for="(filItem,fillIndex) in [filterBtns(scope.row,item.btns)]"  >
                                <template v-if="filItem.length>4">
                                    <el-dropdown  size="mini" :key="fillIndex">
                                        <span class="el-dropdown-link" >
                                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <template  v-for="subItem in filItem.splice(filItem.length>4?3:4)">
                                                    <el-dropdown-item :key="subItem.mathRound" @click.native="subItem.event(scope.row)" >{{subItem.name}}</el-dropdown-item>
                                                </template>
                                            </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column v-bind="item" :key="item.mathRound" v-else-if="item.field && !item.hide">
                        <template slot-scope="scope">
                            <div v-html="scope.row[item.field]"></div>
                        </template>
                    </el-table-column> 

                    <el-table-column v-bind="item" :key="item.mathRound" v-else-if="item.type=='index' && !item.hide">
                        <template slot="header" slot-scope="scope">
                            <yl-icon className="icon-tubiao-2" class="svg-table-title" v-if="!item.show" @click.native="handleSet(scope,item)"></yl-icon>
                            <span v-else>序号</span>
                        </template>
                    </el-table-column> 

                    <el-table-column  v-bind="item" :key="item.mathRound"  v-else-if="!item.hide"></el-table-column>
                </template>
            </template>
        </el-table>
        <div v-if="isTableSet">
            <my-table-expand :isShow.sync="isTableSet" :sourceColumns="config.col" :columns.sync="columns" :name="config.name" @change="expandChange" :isShowTotalRow="show.setTotalRow"></my-table-expand>
        </div>
        <slot name='content'></slot>
    </div>
</template>

<script>
    // 请求表格设置
    const URL = {
        getConfig: 'configure.configure.findListByKeys',
        setConfig: 'configure.configure.addOrUpdateConfigureForColumn' // 表格设置更新
    };
    import MyTableExpand from './MyTableExpand.vue';
    import cloneDeep from 'lodash.clonedeep';
    import  debounce  from 'lodash.debounce';
    export default {
        name: 'yl-table',
        data () {
            return {
                height:'auto',
                container:'document',
                pageKey: '', // 保存设置唯一key
                showAll: false, // hack方法,确保二次渲染不会出错
                columns: [], // 列表
                show: { // 显示
                    total: false, // 自定义合计
                    setTotalRow: true // 显示设置表格合计列
                },
                disAutoHeight:false, //关闭自动计算高度
                limitHeight:0,//缩小高度
                uselocal: false, // 使用本地配置
                isTableSet: false, // 是否显示列设置
                mixData: [] // 混合数据
            };
        },
        props: {
            //配置项
            config: {
                type: Object,
                default () {
                    return {
                        name: '', // 名字 
                        col: [{
                            label: '', 
                            prop: '', 
                            slot: '', 
                            unSave: true // 是否保存名称
                        }], // 列表 
                        operate: {}, // 操作
                        attrs: {}, // 属性绑定
                        events: {} // 事件
                    };
                },
                required: true
            },
            data: { // 数据
                type: Array,
                required: true
            },
            // 分页信息 小计 合计用
            page: {
                type: Object
            }
        },
        watch: {
            columns: {
                deep: true,
                handler: function () {
                    this._updateTotalLine();
                }
            },
            data: {
                deep: true,
                handler: function () {
                    this._updateTotalLine();
                }
            },
            showAll(val){
                if(val){
                    this.$nextTick(()=>{
                        this.countHeight()
                    })
                }
            }
        },
        methods: {
           
             // 得到页面的key
            _getPageKey () {
                let path = window.location.pathname.split('/').slice(1, 3);
                if (this.config.name) {
                    path.push(this.config.name);
                    this.pageKey = path.join('.');
                } else {
                    console.info('表格未设置关键词config.name');
                }
            },
           
            // 处理远程返回的配置数据，以本地数据为准做融合
            _mixConfig (colConfig, cols) {
                let res = [];
                cols.forEach(item => {
                    let col = colConfig.filter(data => data.name === item.label);
                    if (col.length) {
                        res.push({...item, ...col[0]});
                    } else {
                        res.push(item);
                    }
                });
                return res.sort((a, b) => a.index > b.index);
            },
            // 获取表格配置
            _getConfig () {
                 var cols = cloneDeep(this.config.col);
                if(this.uselocal){
                    this.columns = cols; // 列表设置
                    this.showAll = true;
                }else{
                    this.Http(URL.getConfig, {
                        keys: [this.pageKey]
                    }).then(res => {
                        if (res.data.length) {
                            let colConfig = JSON.parse(res.data[0].configureValue);
                            this.columns = this._mixConfig(colConfig, cols);
                        } else {
                            this.columns = cols; // 列表设置
                        }
                        this.showAll = true;
                    });
                }
            },
            filterBtns(row,msg){
                let arr= msg.filter(item=>{
                    item.mathRound=item.mathRound|| parseInt(Math.random()*10000000);
                    return this.showBtnFunc(row,item)
                })
                return arr;
            },
            //处理item
            formatItem(item){
                let obj={};
                for (let key of Object.keys(item)) {
                     if (typeof item[key] === 'function') {
                         obj[key]=item[key](item)
                     }else{
                         obj[key]=item[key]
                     }
                }
                obj.mathRound=obj.mathRound|| parseInt(Math.random()*10000000);
                return obj
            },
            //处理按钮
            showBtnFunc (row, item) {

                if (typeof item.hide === 'function') {
                    return !row.hideBtn && !item.hide(row);
                } else {
                    return !row.hideBtn && !item.hide;
                }
            },
            // 排序设置改变
            async expandChange (allList, saveList) {
                await this._updateConfig(saveList);
                this.isTableSet = false;
                this.showAll = false;
                this.$nextTick(() => {
                    this.columns = allList;
                    this.showAll = true;
                });
            },
            // 更新表格设置
            _updateConfig (config) {
                return this.Http(URL.setConfig, {
                    configures: [
                        {
                            key: this.pageKey,
                            configureValue: JSON.stringify(config)
                        }
                    ]
                });
            },

            // 更新是否显示合计行
            _updateTotalLine () {
                let result = [];
                let getColumnData = (name, code) => {
                    let headName = this.col.filter(item => item.prop)[0].prop,
                        obj = {
                            [headName]: name,
                            hideBtn: true
                        };
                    result.forEach(item => {
                        obj[item.label] = this.page[item[code]];
                    });
                    return obj;
                };
                this.columns.forEach(item => {
                    item.totalProps = item.totalProps || ['', ''];
                    item.totalRow && result.push({
                        label: item.prop,
                        sub: item.totalProps[0],
                        total: item.totalProps[1]
                    });
                });
                this.mixData = [...this.data];
                if (result.length && !this.show.total) {
                    this.mixData.push(getColumnData('小计', 'sub'));
                    // 合计
                    let maxPage = Math.ceil(this.page.total / this.page.pageSize);
                    if (maxPage === this.page.pageIndex) {
                        this.mixData.push(getColumnData('合计', 'total'));
                    }
                }
            },
            //设置
            handleSet(...scope){
                this.isTableSet = true;
            },
            countHeight(){
                    let $table=this.$refs.table.$el;
                    let clientTop = $table && $table.getBoundingClientRect().top;
                    let offsetTop = $table && $table.offsetTop;
                    let limitH = this.limitHeight + 100;
                    let elHeight=null;
                    switch (this.container) {
                        case 'document':
                            elHeight = window.innerHeight - clientTop-limitH;
                            this.$nextTick(()=>{
                                this.height=elHeight;
                            })
                            break;
                        case 'dialog':
                            let $dialogHeader= document.querySelector('.el-dialog__header');
                            let $dialogbody= document.querySelector('.el-dialog__body');
                            let bodyHeight=parseInt(window.getComputedStyle($dialogbody, null).getPropertyValue('max-height'));
                            elHeight = bodyHeight-(offsetTop-$dialogHeader.clientHeight)-limitH;
                            this.$nextTick(()=>{
                                this.height=elHeight;
                            })
                            break;
                        default:
                            break;
                    }
            }
        },
        created () {
            this.config.show && (this.show = {...this.show, ...this.config.show});
            this.uselocal = !!this.config.uselocal;
            this.disAutoHeight = !!this.config.disAutoHeight;
            this.container = this.config.container?this.config.container:this.container;
            this.limitHeight= this.config.limitHeight || 0;
            this._getPageKey();
            this._getConfig();
           
        },
        mounted(){
            if(!this.disAutoHeight){
                const debounceFunc = debounce(this.countHeight, 500);
                window.addEventListener('resize',debounceFunc);
                this.$once('hook:beforeDestroy', () => {  
                    window.removeEventListener('resize',debounceFunc)                                 
                })
            }
        },
        components: {
            MyTableExpand,
        }
    };
</script>
<style lang="scss" scoped>
// /deep/ .el-table__body-wrapper {
//     &::-webkit-scrollbar-track-piece {
//         background: #d3dce6;
//     }
//     &::-webkit-scrollbar {
//         width: 6px;
//         height:6px;
//     }
//     &::-webkit-scrollbar-thumb {
//         background: #99a9bf;
//         border-radius: 20px;
//     }
// }
.table-btns{
    margin-right: 5px !important;
    margin-left: 0px !important;
}
.svg-table-title {
    margin-top: 8px;
    cursor: pointer;
    width: 20px;
    height: 20px;
}


</style>


