import Http from '../axios/index.js';
import {msgbox, message} from './msgbox';
import {updateStatus} from './updatePrintStatus';
export default class Printer {

    constructor (options) {
        this.interVal = null;// 定时器
        this.CreatedOKLodop7766 = null;
        this.CLODOP = null;
        this.currentUser = {
            userNo: '',
            userName: ''
        };
        this.printItems = {}; /* 缓存打印项目，格式如：{'pi_单据类型编号': 打印项目对象 */
        this.templates = {}; /* 缓存打印模板, 格式如：{'temp_模板编号': 模板对象} */
        this.papers = { // 默认的纸张尺寸
            'A4': {
                'name': '默认A4纸',
                'width': 210,
                'height': 297 
            },
            'express-default': {
                'name': '默认物流纸质面单',
                'width': 228,
                'height': 125
            },
            'bill-default': {
                'name': '针式打印纸',
                'width': 241,
                'height': 140
            }
        };

        if (options === undefined || options == null || typeof options !== 'object') {
            //
        } else {
            if (options.currentUser) {
                this.currentUser = options.currentUser;
            }
        }

        this.printerDomId = 'LODOP_PRINT';
        if (options.printerDomId && options.printerDomId !== '') {
            this.printerDomId = options.printerDomId;
        }

        this.URL = {
            template: 'tpm.template.get',
            configure: 'tpm.configure.get',
            printItem: 'tpm.printItem.get'
        };

        // 公共字段
        this.commonFields = [
            {
                fieldId: 'time',
                fieldName: '打印时间' // 格式如：2017年12月20日 13：00：00
            },
            {
                fieldId: 'date',
                fieldName: '当前日期' // 格式如：2017年12月20日
            },
            {
                fieldId: 'pageNum',
                fieldName: '页码' // 格式如：1/10页
            },
            {
                fieldId: 'printerNo',
                fieldName: '打印人编号' // 格式如：000000001，取 currentUser.userNo
            },
            {
                fieldId: 'printerName',
                fieldName: '打印人名称' // 格式如：张三，取 currentUser.userName
            }
        ];
    }

    /**
     * 初始化控件
     */
    init () {
        try {
            this.CLODOP = this.getLodop(document.getElementById(this.printerDomId), document.getElementById(this.printerDomId + '_EM'));
            if (!this.CLODOP || this.CLODOP === null) {
                console.log('打印控件初始化失败');
                return {
                    'code': '68001',
                    'message': '打印控件初始化失败'
                };
            } else {
                // this.CLODOP.SET_PTINT_MODE('CATCH_PRINT_STATU', true); // 开启打任任务的监控
                return {'code': 'SUCCESS'};
            }
        } catch (err) {
            return {
                'code': '0',
                'message': err
            };
        }
    }

    /**
     * 打印机设置
     */
    set () {
        console.log('set');
    }
    /**
     * 打开设置窗体
     */
    configDialog () {
        //
    }
    /**
     * 获取本机已安装的打印机列表
     */
    printerList () {
        if (this.CLODOP === undefined || this.CLODOP === null) {
            return [];
        }

        var pdCount = this.CLODOP.GET_PRINTER_COUNT();
        if (pdCount <= 0) {
            console.log('没有安装任何打印机');
            return [];
        } else {
            let printers = [];
            for (let i = 0; i < pdCount; i++) {
                let _strPName = pdCount.GET_PRINTER_NAME(i);
                printers[i] = _strPName;
            }
			
            return printers;
        }
    }
    /**
     * 获取系统已有的纸张列表
     */
    paperList () {
        // let lodopObj = getLodop();
    }
    /**
     * 从服务器端加载默认配置，如默认打印机、纸张
     */
    loadDefaultConfig () {
        Http(this.URL.configure, {})
            .then((res) => {
                // 成功 
            });
    }
    /**
     * 测试数据预览查看
     */
    async testPreview (templateNo) {
        // console.log('start get template <');
        return await this.loadTemplate(templateNo).then((v) => {  // 加载打印模板
            let templateObj = v.data;
            // console.log('> end get template');
            // console.log(templateObj);
            if (!templateObj) return; 
            // console.log('start load print item.');
            if (!templateObj.templateContent || templateContent === '') {
                console.log('打印模板未正常配置,返回数据：' + JSON.stringify(templateObj));
                return false;
            }
    
            // console.log('start get printItem <');
            let templateContent = templateObj.templateContent;
            this.loadPrintItem(
                    templateObj.dictNumber, 
                    templateObj.dictNumber.indexOf('express_form') > -1 ? 'expressForm' : 'bill'
                ).then((v) => { // 加载打印项目
                    let printItemObj = v.data;
                    // console.log('> end get printItem');
                    // console.log(printItemObj);
                    if (!printItemObj) return;
                    if (!printItemObj.printItem) {
                        // console.log('打印项目未正常配置,返回的数据：' + JSON.stringify(templateObj));
                        return false;
                    }
                    
                    let printItem = JSON.parse(printItemObj.printItem);

                    // 分析打印内容
                    let testData = {};

                    // fields
                    for (var _index in printItem.fields) {
                        testData[printItem.fields[_index].id] = printItem.fields[_index].testValue;
                    }

                    // tables
                    for (let _index in printItem.tables) {
                        let tableObj = printItem.tables[_index];
                        let datas = [];
                        let columns = tableObj.columns;
                        for (let _dataIndex in tableObj.testData) { // data
                            let _testData = tableObj.testData[_dataIndex];
                            let _data = {};
                            for (let _columnIndex in columns) {
                                let _columnId = columns[_columnIndex].id;
                                if (_testData[_columnId]) {
                                    _data[_columnId] = _testData[_columnId];
                                } else {
                                    _data[_columnId] = null;
                                }
                            }
                            datas[datas.length] = _data;
                        }
                        testData[tableObj.id] = datas;
                    }

                    // console.log('start debug applyData <');
                    // console.log(testData);
                    // console.log(printItem);
                    // console.log(templateContent);`
                    
                    let printContent = this.applyData(testData, templateContent, printItem);

                    // console.log(printContent);

                    // console.log('> end debug applyData');

                    if (printContent.code && printContent.code === '0') {
                        console.log('数据初始化失败:' + printContent.message);
                        return false;
                    }
                    window.LODOP = this.CLODOP;
                    printContent = printContent.replace(/{{LODOP.}}/g, 'window.LODOP.');
                    eval(printContent); //eslint-disable-line
                    window.LODOP.PREVIEW();
                });
        });
    } 
    /**
     * 预览
     * @param {*} templateNo 
     * @param {*} dataApiName 
     * @param {*} params 
     * @param {* 状态变化的回调} stateChangeCallBack 
     * @param {* 操作完成的回调} finishedCallback 
     */
    preview (templateNo, dataApiName, params, finishedCallback, stateChangeCallback, customer) {
        this.printWork(templateNo, dataApiName, params, finishedCallback, stateChangeCallback, customer, 'preview');
    }
    
    /**
     * 打印
     * @param {*} templateNo 
     * @param {*} dataApiName 
     * @param {*} params 
     * @param {* 状态变化的回调} stateChangeCallBack 
     * @param {* 操作完成的回调} finishedCallback 
     */
    print (templateNo, dataApiName, params, finishedCallback, stateChangeCallback, customer) {
        this.printWork(templateNo, dataApiName, params, finishedCallback, stateChangeCallback, customer, 'print');
    }

    /**
     * 打印或预览打印的主功能函数
     * @param {* 模板编号} templateNo 
     * @param {* 数据来源API别名} dataApiName 
     * @param {* 数据来源API入参} params 
     * @param {* 打印状态回调} stateChangeCallBack 
     * @param {* 操作类型，print-打印，preview-预览} actionType 
     */
    printWork (templateNo, dataApiName, params, finishedCallback, stateChangeCallback, customer, actionType) {
        if (this.CLODOP === undefined || this.CLODOP === null) {
            finishedCallback({
                code: '68001',
                message: '打印控件未初始化，请检查是否正常安装了打印控件' 
            });
            // console.log('68001');
            return;
        }

        let actionName = actionType === 'preview' ? '预览' : '打印';

        // console.log('start get template <');
        this.loadTemplate(templateNo).then((v) => {  // 加载打印模板
            // console.log(v);
            let templateObj = v.data;
            // console.log('> end get template');
            // console.log(templateObj);
            if (!templateObj) return;

            if (!templateObj.status || templateObj.status !== 'enabled') {
                finishedCallback({
                    code: '0',
                    message: '没有可用的打印模板' 
                });
                return false;
            }

            if (!templateObj.templateContent || templateObj.templateContent === '') {
                finishedCallback({
                    code: '0',
                    message: '打印模板未正常配置' 
                });
                console.log('打印模板未正常配置,返回数据：' + JSON.stringify(templateObj));
                return false;
            }
    
            // console.log('start get printItem <');
            let templateContent = templateObj.templateContent;
            this.loadPrintItem(
                    templateObj.dictNumber, 
                    templateObj.dictNumber.indexOf('express_form') > -1 ? 'expressForm' : 'bill'
                ).then((v) => { // 加载打印项目
                    let printItemObj = v.data;
                    // console.log('> end get printItem');
                    // console.log(printItemObj);
                    if (!printItemObj) return;
                    if (!printItemObj.printItem) {
                        if (stateChangeCallback) {
                            finishedCallback({
                                code: '0',
                                message: '打印项目未正常配置' 
                            });
                        }
                        console.log('打印项目未正常配置,返回的数据：' + JSON.stringify(templateObj));
                        return false;
                    }
                    
                    printItemObj = JSON.parse(printItemObj.printItem);

                    // console.log('start load data <');
                    this.loadData(dataApiName, params).then(v => { // 加载数据
                        let data = v.data;
                        // console.log('> end load data');
                        if (!data) {
                            finishedCallback({
                                code: '0',
                                message: actionName + '数据不能为空' 
                            });
                            return;
                        }
                        // console.log(data);

                        let tasks = [];
                        if (Array.isArray(data)) {
                            tasks = data;
                        } else {
                            tasks[0] = data;
                        }
                        
                        this.printJob(tasks, templateContent, printItemObj, finishedCallback, stateChangeCallback, customer, actionType);
                    }).catch(err => {
                        // console.log(actionName + '时遇到异常：' + err);
                        finishedCallback({
                            code: '0',
                            message: actionName + '异常，请联系系统管理员处理' 
                        });
                    });
                });
        });
    }

    /**
     * 打印或预览
     * @param {*} tasks 
     * @param {*} finishedCallback 
     * @param {*} stateChangeCallBack 
     * @param {*} actionType 
     */
    async printJob (tasks, templateContent, printItemObj, finishedCallback, stateChangeCallback, customer, actionType) {
        let printContent = '';
        for (let i = 0; i < tasks.length; i++) {
            let _data = tasks[i];
            printContent = this.applyData(_data, templateContent, printItemObj);
            if (printContent.code && printContent.code === '0') {
                finishedCallback(printContent);
                return false;
            }
            if (printContent === '') {
                finishedCallback({
                    code: '0',
                    message: (actionType === 'preview' ? '预览' : '打印') + '处理失败，请检查数据和模板是否完整' 
                });
                return false;
            }
            if (window.LODOP && window.LODOP.array) {
                for (let item of window.LODOP.array.entries()) {
                    // console.log(item);
                    clearTimeout(window.LODOP[item.id]);
                } 
            }
            window.LODOP = this.CLODOP;
            printContent = printContent.replace(/LODOP./g, 'window.LODOP.');
            eval(printContent); //eslint-disable-line
            window.LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true);
            let _jobId = actionType === 'preview' ? window.LODOP.PREVIEW() : window.LODOP.PRINT();
            await this.monitorJob(_jobId, _data, finishedCallback, stateChangeCallback, customer, i).then((data) => {
                // console.log(data);
                if (data === 'print') {
                    finishedCallback({
                        code: 'SUCCESS',
                        message: '成功'
                    });
                } else {
                    finishedCallback({
                        code: 'ERROR',
                        message: '失败'
                    });
                }
            });
        }
    }

    /**
     * 监控打印任务是否完成
     * @param {*} printContent 
     * @param {*} _data 
     * @param {*} finishedCallback  
     * @param {*} stateChangeCallBack 
     */
    async monitorJob (jobId, _data, finishedCallback, stateChangeCallback, customer, i) {
        let maxTime = 10;
        let getPrintStatus = (type, id, index, num = 0) => {
            window.LODOP.On_Return = (TaskID, Value) => {
                if (Value === '1' || num > maxTime) {
                    clearTimeout(window.LODOP[`interVal${id}`]);
                    window.LODOP[`interVal${id}`] = null;
                    if (num > maxTime) {
                        message('打印失败', 'error');
                        // console.log('打印失败或超时'); 
                    } else {
                        window.LODOP.array[index].customer && (updateStatus(window.LODOP.array[index]));
                        message('打印完成');
                        // console.log('打印完成'); 
                    }
                    window.LODOP.array.splice(index, 1);
                    for (let [subIndex, item] of window.LODOP.array.entries()) {
                        if (subIndex === 0) {
                            window.LODOP[item.id] = setTimeout(() => {
                                getPrintStatus('PRINT_STATUS_OK', item.val, subIndex);
                            }, 1000);
                            break;
                        }
                    }
                } else {
                    window.LODOP[`interVal${id}`] = setTimeout(() => {
                        num++;
                        getPrintStatus(type, id, index, num);
                    }, 1000);
                } 
            };  
            window.LODOP.GET_VALUE(type, id);
        };
        return new Promise((resolve, reject) => {
            if (window.LODOP.CVERSION) { // 查看是否支持clodop
                window.LODOP.On_Return_Remain = true;
                window.LODOP.On_Return = (TaskID, Value) => {
                    if (TaskID === jobId && Value) {
                        if (!window.LODOP.array) {
                            window.LODOP.array = [{
                                customer,
                                index: i,
                                id: `interVal${Value}`,
                                val: Value
                            }];
                        } else {
                            window.LODOP.array.push({
                                customer,
                                index: i,
                                id: `interVal${Value}`,
                                val: Value
                            });
                        }
                        window.LODOP[window.LODOP.array[0].id] = setTimeout(() => {
                            getPrintStatus('PRINT_STATUS_OK', window.LODOP.array[0].val, 0);
                        }, 1000);
                        resolve('print');
                    } else {
                        resolve('view');
                    }
                };  
            } else {
                resolve('print');
            }
        });
    }

    /**
     * 载入模板内容并返回
     * 需严格遵循约定的通用格式 template = {fields: [], tables: []} , data = [{field1:'', field2: '', table1: [], table2: []}]
     * @param {*模板编号} templateNo
     */
    async loadTemplate (templateNo) {
        let res;
        try {
            res = await Http(this.URL.template, {
                'no': templateNo
            });
        } catch (err) {
            res = err; 
        }
        return res;
    }

    /**
     * 加载打印项目
     * @param {*} billTypeNo 
     */
    async loadPrintItem (dictNumber, printTemplateType) {
        let res;
        try {
            res = await Http(this.URL.printItem, {
                'dictNumber': dictNumber,
                'printTemplateType': printTemplateType
            });
        } catch (err) {
            res = err; 
        }
        return res;
    }
    /**
     * 载入数据并返回
     * @param {*API别名} apiName
     * @param {*API请求入参} params
     */
    async loadData (apiName, params) {
        let res;
        try {
            res = await Http(apiName, params === undefined ? {} : params);
        } catch (err) {
            res = err; 
        }
        return res;
    }
    /**
     * 将数据填充到打印模板并返回
     * @param {*数据对象} dataObj
     * @param {*模板内容} templateContent
     */
    applyData (dataObj, templateContent, printItemObj) { 
        // console.log(dataObj);
        // console.log(templateContent); 
        // console.log(printItemObj); 
        if (dataObj === undefined || dataObj === null || 
            templateContent === undefined || templateContent === null || 
            printItemObj === undefined || printItemObj === null) {
            return {
                'code': 'ERROR',
                'message': '缺少必要的数据或模板配置'
            };
        }
        if (Array.isArray(dataObj)) {
            return {
                'code': '0',
                'message': '暂不支持批量打印'
            };
        }
        let fieldId = '';
        let regExp = '';
        let val = '';

        // console.log('data <');
        // console.log(dataObj);
        // console.log('>');

        // 公共数据
        for (let i = 0; i < this.commonFields.length; i++) {
            fieldId = this.commonFields[i].fieldId;
            regExp = new RegExp('{{' + fieldId + ',.*}}', 'gi');
            if (fieldId === 'time') {
                val = this.dateFormat(new Date(), 'yyyy年MM月dd日 hh:mm:ss');
            } else if (fieldId === 'date') {
                val = this.dateFormat(new Date(), 'yyyy年MM月dd日');
            } else if (fieldId === 'printerNo') {
                val = this.currentUser.userNo;
            } else if (fieldId === 'printerName') {
                val = this.currentUser.userName;
            }
            templateContent = templateContent.replace(regExp, val);
        }
        
        // 平面数据
        // 需遵守打印项目的定义
        for (let _index in dataObj) {
            // console.log(_index);
            if (Array.isArray(dataObj[_index]) ||
                typeof dataObj[_index] === 'function') {
                continue;
            }
            // console.log(dataObj[_index]);
            fieldId = _index;
            regExp = new RegExp('{{' + fieldId + ',((?!{{).)*}}', 'gi');
            val = dataObj[_index];
            templateContent = templateContent.replace(regExp, val);
        }

        // console.log(templateContent);

        regExp = new RegExp('{{.*,((?!{{).)*}}', 'gi');
        templateContent = templateContent.replace(regExp, '');

        // console.log(dataObj);

        // 从模板中找到所有的 table ，解析出 id ，从打印数据中取出数据，生成新的 table
        // <table id='id'>...</table>
        let tables = {};
        let tableNum = 0; 
        // if (true) { 
        let startStr = '<table ';  
        let endStr = '</table>'; 
        let idStartStr = 'id=\''; 
        let idEndStr = '\'';
        let startIndex = templateContent.indexOf(startStr);
        while (startIndex > -1) {
            let endIndex = templateContent.indexOf(endStr, startIndex);
            if (endIndex > startIndex) {
                let _thtml = templateContent.substr(startIndex, endIndex + endStr.length - startIndex);
                    // console.log(_thtml);
                let _idStartIndex = _thtml.indexOf(idStartStr);
                let _idEndIndex = _thtml.indexOf(idEndStr, _idStartIndex + idStartStr.length);
                if (_idStartIndex < _idEndIndex) {
                        // console.log(_idStartIndex + ',' + _idEndIndex);
                    let tableId = _thtml.substr(_idStartIndex + idStartStr.length, _idEndIndex - idStartStr.length - _idStartIndex);
                    if (tableId !== '') {
                            // console.log(tableId);
                        tables[tableId] = _thtml;
                        tableNum++;
                    } else {
                            // 对于没有指定id的表格不处理
                    }
                }
                startIndex = templateContent.indexOf('</table>', endIndex);
            } else {
                break;
            }  
        }   
        // }

        // console.log('发现了' + tableNum + '个表格');

        for (let _index in printItemObj.tables) { // 从打印项目入手，解析表格数据
            let piTable = printItemObj.tables[_index];
            let fontSize = piTable.fontSize ? piTable.fontSize : '1';
            // console.log('piTable=' + JSON.stringify(piTable, null, 4));
            // console.log('tables=' + JSON.stringify(tables, null, 4));
            // console.log('dataObj=' + JSON.stringify(dataObj, null, 4));
            if (piTable.id && tables[piTable.id] && dataObj[piTable.id]) {
                // console.log('parse data <');
                let tableHtml = '';
                tableHtml = '<table id=\'' + piTable.id + '\'  style=\'border:1px solid #000000;border-left:none;border-right:none;width:100%;\'>';
                tableHtml += '<thead><tr>';
                for (let _index in piTable.columns) {
                    var _align = '';
                    if (piTable.columns[_index].align) {
                        _align = ' align=\'' + piTable.columns[_index].align + '\'';
                    }
                    tableHtml += '<td' + _align + ' style=\'height:28px;font-weight:bold;\'><font size=\'' + fontSize + '\'>' + piTable.columns[_index].name + '</font></td>';
                }
                tableHtml += '</tr></thead>';
                tableHtml += '<tbody>';
                // console.log(tableHtml);
                let dataItem = dataObj[piTable.id];
                for (let _index in dataItem) {
                    let _data = dataItem[_index];
                    // console.log(_data);
                    tableHtml += '<tr>'; 
                    for (let _columnIndex in piTable.columns) {
                        let _align = '';
                        if (piTable.columns[_columnIndex].align) {
                            _align = ' align=\'' + piTable.columns[_columnIndex].align + '\'';
                        }
                        // console.log(piTable.columns[_columnIndex]);
                        if (_data[piTable.columns[_columnIndex].id]) { 
                            tableHtml += '<td' + _align + ' style=\'height:28px;\'><font size=\'' + fontSize + '\'>' + _data[piTable.columns[_columnIndex].id] + '</font></td>'; 
                        } else {
                            tableHtml += '<td' + _align + ' style=\'height:28px;\'><font size=\'' + fontSize + '\'> </font></td>';
                        }
                    }
                    tableHtml += '</tr>';
                }
                tableHtml += '</tbody>';
                tableHtml += '</table>';
                // console.log('生成的：' + tableHtml);
                // console.log('要替换：' + tables[piTable.id]);
                // console.log(templateContent.indexOf(tables[piTable.id]));
                // regExp = new RegExp(tables[piTable.id], 'gi');
                // templateContent = templateContent.replace(regExp, tableHtml);
                templateContent = this.replaceTableHtml(templateContent, tableHtml, tables[piTable.id]);
                // console.log(templateContent);
            }
        }

        return templateContent;
    }
    
    /**
     * 替换数据表格到模板
     * @param {*} templateContent 
     * @param {*} tableHtml 
     * @param {*} tableTempHtml 
     */
    replaceTableHtml (templateContent, tableHtml, tableTempHtml) {
        let startIndex = templateContent.indexOf(tableTempHtml);
        if (startIndex === -1) return templateContent;
        while (startIndex > -1) {
            let startContent = templateContent.substr(0, startIndex);
            let endContent = templateContent.substr(startIndex + tableTempHtml.length, templateContent.length - startIndex - tableTempHtml.length);
            // console.log(startContent);
            // console.log(endContent);
            templateContent = startContent + tableHtml.replace(/"/g, '\\"') + endContent;
            startIndex = templateContent.indexOf(tableTempHtml, startIndex + tableHtml.length);
        }
        return templateContent;
    }

    /**
     * 格式化日期
     * @param {*} date 
     * @param {*} formatStr 
     */
    dateFormat (date, formatStr) {
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds() // 毫秒 
        };

        let fmt = formatStr;
        
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        } 
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    }

    /**
     * 替代 eval
     * @param {*} fn
     */
    evil (fn) {
        var Fn = Function;
        return new Fn('return ' + fn)();
    }

    /**
     * 是否IE
     */
    isIE () {
        return (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
    }

    /**
     * 判断是否需要安装CLodop云打印服务器
     */
    needCLodop () {
        try {
            let ua = navigator.userAgent;
            let verTrident = ua.match(/Trident\D?\d+/i);
            let verIE = ua.match(/MSIE\D?\d+/i);
            let verOPR = ua.match(/OPR\D?\d+/i);
            let verFF = ua.match(/Firefox\D?\d+/i);
            let x64 = ua.match(/x64/i);
            let verChrome = ua.match(/Chrome\D?\d+/i);
            if (ua.match(/Windows\sPhone/i) != null) { return true; }
            if (ua.match(/iPhone|iPod/i) != null) { return true; }
            if (ua.match(/Android/i) != null) { return true; }
            if (ua.match(/Edge\D?\d+/i) != null) { return true; }
            if ((verTrident == null) && (verIE == null) && (x64 !== null)) {
                return true;
            } else if (verFF !== null) {
                verFF = verFF[0].match(/\d+/);
                if ((verFF[0] >= 42) || (x64 !== null)) { return true; }
            } else if (verOPR !== null) {
                verOPR = verOPR[0].match(/\d+/);
                if (verOPR[0] >= 32) { return true; }
            } else if ((verTrident == null) && (verIE == null)) {
                if (verChrome !== null) {
                    verChrome = verChrome[0].match(/\d+/);
                    if (verChrome[0] >= 42) { return true; }
                }
            }
            return false;
        } catch (err) {
            return true;
        }
    }
    /**
     * 页面引用CLodop云打印必须的JS文件
     */
    initCLodop () {
        return new Promise((resolve, reject) => {
            let $lodop1 = document.getElementById('lodop-1');
            let $lodop0 = document.getElementById('lodop-0');
            let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
            let oscript = document.createElement('script');
            if ($lodop1 && $lodop0) {
                resolve();
            } else {
                oscript.src = 'http://localhost:8000/CLodopfuncs.js?priority=1';
                oscript.id = 'lodop-1';
                head.insertBefore(oscript, head.firstElementChild || head.firstChild);
                oscript = document.createElement('script');
                oscript.src = 'http://localhost:18000/CLodopfuncs.js?priority=0';
                oscript.id = 'lodop-0';
                head.insertBefore(oscript, head.firstElementChild || head.firstChild);
                oscript.onload = oscript.onreadystatechange = function () {
                    if ((!oscript.readyState || /loaded|complete/.test(oscript.readyState))) {
                        resolve();
                    }
                };
                oscript.onerror = function () { reject(); }; // 加载失败
            }
        });
    }
    /**
     * 获取LODOP对象
     * @param {*} oOBJECT
     * @param {*} oEMBED
     */ 
    getLodop (oOBJECT, oEMBED) {
        let strHtmInstall = '<font color=\'#FF00FF\'>打印控件未安装! 请点击下载安装,安装后请刷新页面或重新进入。</font>';
        let strHtmUpdate = '<font color=\'#FF00FF\'>打印控件需要升级! 请点击下载安装,升级后请重新进入。</font>';
        let strHtm64Install = '<font color=\'#FF00FF\'>打印控件未安装! 请点击下载安装,安装后请刷新页面或重新进入。</font>';
        let strHtm64Update = '<font color=\'#FF00FF\'>打印控件需要升级! 请点击下载安装,升级后请重新进入。</font>';
        let strHtmFireFox = '<font color=\'#FF00FF\'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>';
        let strHtmChrome = '<font color=\'#FF00FF\'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>';
        let strCLodopInstall = '<font color=\'#FF00FF\'>CLodop云打印服务(localhost本地)未安装启动! 请点击下载安装,安装后请刷新页面。</font>';
        let strCLodopUpdate = '<font color=\'#FF00FF\'>CLodop云打印服务需升级!请点击下载安装,升级后请刷新页面。</font>';
        let LODOP;
        try {
            var isIE = this.isIE();
            let is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
            if (this.needCLodop()) {
                try {
                    LODOP = getCLodop(); // eslint-disable-line
                } catch (err) {
                    // nothing to do .....
                }
                if (!LODOP && document.readyState !== 'complete') {
                    msgbox('C-Lodop没准备好，请稍后再试！');
                    return;
                }
                if (!LODOP) {
                    msgbox(strCLodopInstall);
                    return;
                } else {
                    if (LODOP.CVERSION < '2.0.9.0') {
                        msgbox(strCLodopUpdate);
                    }
                    if (oEMBED && oEMBED.parentNode) {
                        oEMBED.parentNode.removeChild(oEMBED);
                    }
                    if (oOBJECT && oOBJECT.parentNode) {
                        oOBJECT.parentNode.removeChild(oOBJECT);
                    }
                }
            } else {
                if (oOBJECT !== undefined || oEMBED !== undefined) {
                    if (isIE) { LODOP = oOBJECT; } else { LODOP = oEMBED; }
                } else if (this.CreatedOKLodop7766 == null) {
                    LODOP = document.createElement('object');
                    LODOP.setAttribute('width', 0);
                    LODOP.setAttribute('height', 0);
                    LODOP.setAttribute('style', 'position:absolute;left:0px;top:-100px;width:0px;height:0px;');
                    if (isIE) { LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA'); } else { LODOP.setAttribute('type', 'application/x-print-lodop'); }
                    document.documentElement.appendChild(LODOP);
                    this.CreatedOKLodop7766 = LODOP;
                } else { LODOP = this.CreatedOKLodop7766; }
                if ((LODOP == null) || (typeof (LODOP.VERSION) === 'undefined')) {
                    if (navigator.userAgent.indexOf('Chrome') >= 0) {
                        msgbox(strHtmChrome);
                    }
                    if (navigator.userAgent.indexOf('Firefox') >= 0) {
                        msgbox(strHtmFireFox);
                    }
                    if (is64IE) {
                        msgbox(strHtm64Install);
                    } else if (isIE) {
                        msgbox(strHtmInstall);
                    } else {
                        msgbox(strHtmInstall);
                    }
                    return LODOP;
                }
            }
            if (LODOP.VERSION < '6.2.1.5') {
                if (this.needCLodop()) {
                    msgbox(strCLodopUpdate);
                } else if (is64IE) { msgbox(strHtm64Update); } else if (isIE) { msgbox(strHtmUpdate); } else {
                    msgbox(strHtmUpdate);
                }
                return LODOP;
            }
            LODOP.SET_LICENSES('', '13528A153BAEE3A0254B9507DCDE2839', '', '');
            return LODOP;
        } catch (err) {
            msgbox('getLodop出错:' + err);
        }
    }
}