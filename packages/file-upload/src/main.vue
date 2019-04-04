<template>
    <div ref="imgUpload" class="yl-upload">
        <el-upload :action="action" :headers="headers" :list-type="type" :on-success="success" :show-file-list="show" class="yl-upload-cont" :on-error="errors" :on-preview="review"
                   :before-upload="beforeUpload" :disabled="disabled" :multiple="multiple" :drag="drag" :file-list="fileLists" :on-remove="remove" :class="classx"
                   :before-remove="beforeRemove" :on-exceed="handleExceed" :limit="max" ref="elUpload">
            <slot name='imgs'></slot>
            <i class="el-icon-plus" v-if="show"></i>
        </el-upload>
        <div v-show="false" ref="boxer">
            <a v-for="item in files" :href="item.fullUrl" :key="item.fullUrl" v-boxer="item.fullUrl" :class="'link-view-'+item.uid"></a>
        </div>
    </div>
</template>
<script>
    import {getFileType, formatFile, mode} from '@/utils/global.common'; // 文件格式

    import emitter from '@/mixins/emitter.js';
    //import $ from 'jquery';
    export default {
        name: 'yl-file-upload',
        mixins: [emitter],
        data() {
            return {
                action: '/gateway/upload', // 上传地址
                userInfo: JSON.parse(sessionStorage.getItem('user')),
                fileLists: [],  // 默认已上传 文件地址[{name,url}]
                imgUrls: [],
                files: [],
                headers: {}, // 添加请求头{}
                maxLength: 0,
                clickItem: {
                    uid: '',
                    fullUrl: ''
                },
                isChange: false,
                drag: false, // 是否支持拖拽上传
            };
        },
        props: {
            readonly: {
                type: [Boolean, String]
            },
            // 支持多张上传
            multiple: {
                type: Boolean,
                default: true
            },
            value: { // 图片地址
                type: [String, Array],
                required: true
            },
            max: { // 最大上传数量
                type: [Number, String],
                default() {
                    return 5;
                }
            },
            classx: { // 自定义class
                type: String
            },
            type: { // 显示类型
                type: String,
                default: 'picture-card'
            },
            show: {   // 是否显示上传图片 默认显示
                type: Boolean,
                default: true
            },
            validateEvent: {
                type: Boolean,
                default: true
            },
            hideUploadBtn: {
                type: Boolean,
                default: false
            },
            beforeRemove: {
                type: Function
            }
        },
        beforeMount() {
            this.maxLength = Number(this.max); // 最大上传数
        },
        mounted() {
            let token = this.userInfo.token;
            if (token) {
                this.headers.jtoken = token;
            } else {
                this.$notify.error({
                    title: '错误',
                    message: '无法获取token'
                });
                return;
            }
            this.initFiles(this.value);
        },
        computed: {
            disabled() {
                return this.readonly ? JSON.parse(this.readonly) : false;
            }
        },
        watch: {
            max(){
                this.maxLength = Number(this.max);
            },
            value: {
                deep: true,
                handler: function (val, oldVal) {
                    val && !this.isChange && this.initFiles(val);
                }
            }
        },
        methods: {
            // 初始化file
            initFiles(val) {
                let splitCode = val.includes(',') ? ',' : val.includes(';') ? ';' : null;
                let src = (typeof val === 'string' ? val.split(splitCode) : (val instanceof Array ? val : null)),
                    list = [];
                this.imgUrls = [];
                src && src.forEach(item => {
                    if (item) {
                        let formatUrl = this._formatFile(item);
                        list.push(formatUrl);
                        this.imgUrls.push(formatUrl.reUrl);
                    }
                });
                this.files = this.fileLists = [...list];
                this.updateUploadBtn();
            },
            _getFileUrl(file){
                if(file.reUrl){
                    return file.reUrl;
                }else{
                    return JSON.parse(file.response).data;
                }
            },
            // 格式化文件
            _formatFile(item, uid) {
                let thumbnail = formatFile(item);
                return {
                    uid: (uid || parseInt(Math.random() * 1000000000)),
                    url: thumbnail, // 缩略图地址
                    fullUrl: mode.IMAGE_DOWNLOAD + item,
                    reUrl: item // 原地址
                };
            },
            //更新图片
            updateFiles(list) {
                this.imgUrls = list.map(item =>{
                    return this._getFileUrl(item);
                });
                this.files = list.map(item =>{
                    return {
                        uid: item.uid,
                        fullUrl: mode.IMAGE_DOWNLOAD + this._getFileUrl(item)
                    }
                });
                this.$emit('input', this.imgUrls);
                this.$emit('on-success', this.imgUrls + '');//上传完成钩子
                if (this.validateEvent) {
                    this.dispatch('ElFormItem', 'el.form.change', [this.imgUrls + '']);
                }
                this.updateUploadBtn();
            },
            // 更新上传按钮是否显示
            updateUploadBtn() {
                let $btn = this.$refs.imgUpload,
                    $card = $btn.querySelector('.el-upload'),
                    _flag = this.imgUrls.length >= this.maxLength;
                $card.style.display = _flag ? 'none' : 'inline-block';
                if (this.hideUploadBtn || this.readonly) {
                    $card.style.display = 'none';
                }
            },
            // 上传前
            beforeUpload(file) {
                // 文件类型
                if (!getFileType(file.name)) {
                    this.$notify.error({
                        title: '错误',
                        message: '暂不支持上传文件 ' + file.type + ' 格式。'
                    });
                    return false;
                }
                // 文件大小不能超过5M
                if (file.size > mode.IMG_SIZE_MAX) {
                    this.$notify.error({
                        title: '错误',
                        message: '文件大小不能超过 5MB。'
                    });
                    return false;
                }
                /*if (this.fileLists.length === this.maxLength) {
                    this.$notify.error({
                        title: '错误',
                        message: '最多上传' + this.maxLength + '个文件'
                    });
                    return false;
                }*/
                this.isChange = true;
                if (this.fileLists.length === this.maxLength - 1) {
                    this.$refs.imgUpload.querySelector('.el-upload').style.display = 'none';
                }
            },
            // 上传失败错误
            errors() {
                this.$notify.error({
                    title: '错误',
                    message: '文件上传失败。'
                });
                this.updateUploadBtn();
            },
            // 上传成功
            success(response, file, fileList) {
                let res;
                if (typeof response === 'string') {
                    res = JSON.parse(response);
                } else {
                    res = response;
                }
                //pdf 不能预览，需要替换
                if(file.name.includes('.pdf')){
                    let formatUrl = this._formatFile(file.name);
                    file.url = formatUrl.url;
                }
                if (res.code.toUpperCase() === 'SUCCESS') {
                    let isAllSuccess = fileList.every(item => item.status === 'success');
                    if (isAllSuccess) {
                        this.updateFiles(fileList);
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.message
                    });
                }
            },
            // 删除
            remove(file, fileList) {
                this.updateFiles(fileList);
            },
            // 点击放大镜查看
            review(file) {
                this.$refs.boxer.querySelector(`.link-view-${file.uid}`).click();
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 ${this.maxLength}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            }

        }
    };
</script>

<style lang="scss" scoped>
    $width: 90px;
    .yl-upload {
        .yl-upload-cont {
            line-height: 1;
            padding-top: 5px;
        }
        /deep/ .el-upload--picture-card {
            background-color: #fbfdff;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            box-sizing: border-box;
            width: $width;
            height: $width;
            cursor: pointer;
            line-height: $width;
            vertical-align: top;
            margin-bottom: 8px;
        }
        /deep/ .el-upload-list--picture-card .el-upload-list__item {
            overflow: hidden;
            background-color: #fff;
            border: 1px solid #c0ccda;
            border-radius: 6px;
            box-sizing: border-box;
            width: $width;
            height: $width;
            margin: 0 8px 8px 0;
            display: inline-block;
        }
    }

</style>
 
 
 
