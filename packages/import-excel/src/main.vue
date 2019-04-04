<template>
    <section class="included">
        <!-- 导入 -->
        <yl-dialog title="导入" :show.sync="shows" width="1000px" :hideDefaultButton="false" classx="import-dialog" closeButtonText="取消" :close="false" :disabledConfirmButton="disbtns.submit" @submit="submit" >
            <div slot="content" id="importbody">
                <div class="header">
                    <yl-icon className="icon-idea" class="icon-idea"></yl-icon>
                    <p>注：请下载模板填写数据再上传</p>
                    <el-button type="primary" icon="el-icon-download" size="mini" class="btn-down" @click="downFile('template')">下载模板</el-button>
                </div>
                <div class="session">
                    <el-form :inline="true" size="small">
                        <el-form-item label="上传文件 ：" label-width="100px">
                            <excel-upload @upload="readFile" :loading.sync="loading" @init="initData"></excel-upload>
                        </el-form-item>
                    </el-form>
                    <div class="table-box" v-loading="loading" element-loading-text="上传中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
                        <div class="table-no-show" v-if="!showTable">
                            <span>读取EXCEL后显示</span>
                        </div>
                        <yl-table :data="table.data" :list="table.list" v-if="showTable"></yl-table>
                    </div>
                    <div class="status" v-show="result.show" :class="{'error':!result.status,'success':result.status}" >
                        <yl-icon className="icon-tongyong-2" class="icon-status" v-if="!result.status"></yl-icon>
                        <p v-if="!result.status&&result.verify">数据校验失败结果请下载： 
                            <a @click.prevent="downFile('res')">校验结果</a>
                        </p>
                        <p v-else-if="!result.status&&!result.verify">导入失败结果请下载： 
                            <a @click.prevent="downFile('res')">导入失败结果</a>
                        </p>
                        <yl-icon className="icon-tongyong-1" class="icon-status" v-if="result.status"></yl-icon>
                        <p v-if="result.status">数据校验通过 !</p>
                    </div>
                </div>
            </div>
            <el-button type="primary" size="small" slot="btns" @click="checkExcel" :disabled="disbtns.check">数据校验</el-button>
        </yl-dialog>
    </section>
</template>

<script>

const scrollEnd = (domArr) => {
    let formatDom = (elem) => {
        let $dom = '';
        switch (elem.type) {
        case 'class':
            $dom = document.getElementsByClassName(elem.name)[0];
            break;
        case 'id':
            $dom = document.getElementById(elem.name);
            break;
        case 'name':
            $dom = document.getElementsByTagName(elem.name);
            break;
        default:
            break;
        }
        return $dom;
    };
    let dom0 = formatDom(domArr[0]); // 外层div
    let dom1 = formatDom(domArr[1]); // 内层div
    let $scrollLength = dom1.offsetHeight - dom0.offsetHeight;
    dom0.scrollTop = $scrollLength;
};

import { downloadFile } from '@/utils/global.common';
import ExcelUpload from './ExcelUpload';
export default {
    name: 'yl-import-excel',
    data () {
        return {
            disbtns: { // 禁用按钮
                submit: true,
                check: true
            },
            showTable: false,
            loading: false,
            result: {
                verify: true,
                status: false,
                show: false
            },
            table: { // 表格数据设置
                data: [],
                list: {
                    col: [],
                    operate: {
                        isShow: false // 是否显示扩展列
                    },
                    attrs: {
                        height: 400
                    }
                }
            },
            oldData: '',
            _downfile: '', // 文件模板
            _resfile: '', // 结果文件
            _uploadfile: '' // 文件上传返回地址
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        params: {
            type: Object,
            required: false,
            default () {
                return {
                    readParams: {},
                    checParams: {},
                    importsParams: {},
                    downParams: {}
                };
            }
        },
        url: {
            type: Object,
            required: true,
            default () {
                return {
                    read: '',
                    imports: '',
                    checExcel: '',
                    downFile: ''  
                };
            }
               
        }
    },
    methods: {
        // 重新初始化data
        initData () {
            let _file = this._downfile,
                _oldData = this.oldData,
                {entries} = Object,
                _data = JSON.parse(_oldData);
            for (let [key, value] of entries(_data)) {
                this[key] = value;
            }
            this._downfile = _file;
            this.oldData = _oldData;
        },
        // 下载模板
        async downFile (type) {
            if (type === 'template' && !this._downfile) {
                let _data = Object.assign({}, this.params.downParams);
                await this.beforeDownFile(_data);
            }
            let file = (type === 'template') ? this._downfile : this._resfile;
            downloadFile(file, '模板');
        },
        // 读取excel
        readFile (flies) {
            this._uploadfile = flies;
            let _data = Object.assign({dfsFileUrl: flies}, this.params.readParams);
            this.Http(this.url.read, _data).then((res) => {
                let _arrColumns = [];
                res.data.columns.forEach((item, index) => {
                    let _columns = {
                        label: item.columnName,
                        prop: item.columnId,
                        width: 140
                    };
                    _arrColumns.push(_columns);
                });
                this.table.data = res.data.rows;
                this.table.list.col = _arrColumns;
                this.loading = false;
                this.showTable = true;
                this.disbtns.check = false;
            });
        },
        // 检测excel
        checkExcel () {
            let _data = Object.assign({dfsFileUrl: this._uploadfile}, this.params.checParams);
            this.Http(this.url.checExcel, _data).then((res) => {
                this.result = {
                    status: true,
                    show: true
                }; 
                this._resfile = res.data;
                this.disbtns.submit = false; // 可以确定
                this.toScrollEnd(); 
            }).catch(res => {
                if (res.code === 'FAILURE') {
                    this.result = {
                        status: false,
                        verify: true,
                        show: true
                    };
                    this._resfile = res.data;
                    this.toScrollEnd();
                }  
            });   
        },
        submit () {
            let _data = Object.assign({dfsFileUrl: this._uploadfile}, this.params.importsParams);
            this.Http(this.url.imports, _data).then((res) => {
                if (res.code === 'SUCCESS') {
                    this.$message({
                        message: '导入成功',
                        type: 'success' 
                    });   
                    this.$emit('success');
                    this.shows = false; 
                } 
            }).catch(res => {
                if (res.code === 'FAILURE') {
                    this.result = {
                        status: false,
                        verify: false,
                        show: true
                    };
                    this._resfile = res.data;
                    this.toScrollEnd();
                    this.$message({
                        message: '导入失败',
                        type: 'error' 
                    });    
                }
            });  
        },
         // 下载模板文件
        async beforeDownFile () { 
            return await this.Http(this.url.downFile).then(res => {
                this._downfile = res.data;
            });
        },
        // 滚动到最底端
        toScrollEnd () {
            this.$nextTick(() => {
                scrollEnd([{
                    name: 'el-dialog__body',
                    type: 'class'
                }, {
                    name: 'importbody',
                    type: 'id'
                }]);       
            });
        }
    },
    created () {
        this.oldData = JSON.stringify(this._data);
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
    },
    components: {
        ExcelUpload
    }
};
</script>

<style lang="scss" scoped>
/deep/ .import-dialog {
    .el-dialog__body {
        padding: 0;
    }
    .header {
        background: #FFFFF9;
        border-bottom: 1px #ffeccd solid;
        height: 52px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        .icon-idea {
            width: 35px;
            height: 35px;
        }
        p { 
            margin: 0 20px;
            color: #ff6600;
            font-size: 14px;
        }
        .btn-down {
            background: #ff8800;
            border-color: #ff8800;
        }
    }
    .session {
        padding: 20px 20px 10px 20px;
        .table-box {
            border: 1px solid #e6ebf5;
            height: 400px;
            margin-bottom: 10px;
            .table-no-show {
                width: 100%;
                height: 100%;
                text-align: center;
                line-height: 510px;
                background: url(./excel.png) no-repeat 50% 50%;
                background-color: #f0f0f0;
                span {
                    font-size: 16px;
                }
            }
        }
        .status {
            height: 45px;
            display: flex;
            font-size: 14px;
            align-items: center;
            padding-left: 10px;
            .icon-status {
                margin-right: 4px;
            }
        }
        .success {
            background: #edfaf3;
            border: 1px #c7eed9 solid;
            .icon-status {
                color: #13ce66;
            }
            p {
                color: #13ce66;
            }
        }
        .error {
            background: #fef0f0;
            border: 1px #ffcbda solid;
            .icon-status {
                color: #ff6600;
            }
            p {
                color: #ff6f6f;
                a {
                    color: #ff8800;
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
    .el-dialog__footer {
        text-align: center;
    }
}
</style>
