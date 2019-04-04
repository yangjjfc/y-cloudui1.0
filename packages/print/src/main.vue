<template>
    <section v-show="false">
        <!-- 打印 -->
        <object id="LODOP2" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="0" height="0">
            <param name="Caption" value="内嵌显示区域">
            <param name="Border" value="1">
            <param name="Color" value="#C0C0C0">
            <embed id="LODOP2_EM" TYPE="application/x-print-lodop" width="0" height="0" PLUGINSPAGE="install_lodop.exe">
        </object>
    </section>
</template>

<script>
import Printer from '@/utils/printer';
import {msgbox} from '@/utils/msgbox';
const URL = {
    getPrintTemplate: 'cdc.expressTemplate.getPrintTemplate', // 物流公司编号获取对应模板编号 logistics
    findBaseTemplateNoByBillType: 'oms.billTemplate.findBaseTemplateNoByBillType' // 订单,发货单,随行单编号获取对应模板编号 logistics
};
export default {
    name: 'yl-print',
    data () {
        return {
            templateNo: '',
            printer: new Printer({ 'printerDomId': 'LODOP2' })
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
            required: true
        },
        data: {
            type: Object,
            required: true,
            default: {
                type: '', // logistics,order 2种类型,也是是否请求的标识
                no: '', // 编号 'out-default'
                url: '', // url 'oms.outStorage.print'
                params: {},  // 参数 { 'outStorageNo': this.data.outStorageNo }
                customer: {} // 用户自定义内容,方便更新打印状态,更新状态使用
            }
        },
        type: {
            type: String,
            default: 'print' // print,view,testPreview
        }
    },    
    methods: {
        init () {
            this.printer.initCLodop().then(() => {
                let status = this.printer.init();
                if (status.code !== 'SUCCESS') {
                    this.eventCode(status); 
                    this.shows = false; 
                    return; 
                }
                setTimeout(() => { 
                    if (this.type === 'print') { // 打印
                        this.printer.print(this.templateNo, this.data.url, this.data.params, (val) => {
                            this.eventCode(val); 
                            this.$emit('update'); 
                            this.shows = false;  
                        }, () => {}, this.data.customer);    
                    } else if (this.type === 'view') { // 预览+打印
                        this.printer.preview(this.templateNo, this.data.url, this.data.params, (val) => {
                            this.eventCode(val); 
                            this.$emit('update'); 
                            this.shows = false;  
                        }, () => {}, this.data.customer);   
                    } else if (this.type === 'testPreview') { // 预览
                        this.printer.testPreview(this.templateNo).then(() => {
                            this.$emit('update'); 
                            this.shows = false;  
                        }).catch(() => {
                            this.$emit('update'); 
                            this.shows = false; 
                        }); 
                    }
                }, 200);
            }).catch(() => { this.eventCode({code: '68001'}); this.shows = false; });
        },
        // 处理code返回 {code:'SUCCESS', message: '成功'} ,{code:'0', message: '打印不成功，具体原因参考这里'}， {code: '68001', '安装打印控件'} 
        eventCode (msg) {
            switch (msg.code) {
            case '0': 
                this.$message({
                    message: msg.message,
                    type: 'error' 
                });    
                break;
            case '68001':
                msgbox('<font color=\'#FF00FF\'>CLodop云打印服务(localhost本地)未安装启动! 请点击下载安装,安装后请刷新页面。</font>');
                break;
            case 'SUCCESS':
                // this.$emit('change', this.data.params);
                break; 
            default:
                break;
            }
        },
        // 获取模板编号
        async getTemplateNo () {
            let params = {},
                res,
                url = this.data.type === 'logistics' ? URL.getPrintTemplate : URL.findBaseTemplateNoByBillType;
            if (this.data.type === 'logistics') { // 物流管理 
                params = {logisticsNo: this.data.no}; 
            } else if (this.data.type === 'order') { // 订单,随行单,发货单
                params = {billType: this.data.no};
            }
            try {
                res = await this.Http(url, params);
            } catch (err) {
                res = err; 
            } 
            return res; 
        }
    },
    created () {
        if (this.data.type) { // 需要获取模板编号
            this.getTemplateNo().then((res) => {
                if (res.data) {
                    this.templateNo = res.data;
                    this.init(); 
                } else { 
                    this.shows = false;
                }
            });  
        } else { // 无需获取模板编号
            this.templateNo = this.data.no;
            this.init(); 
        }
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        }
    }
};
</script>

