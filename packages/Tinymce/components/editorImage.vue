<template>
    <div class="upload-container">
        <el-button icon="el-icon-upload" size="mini" type="primary" @click="dialogVisible=true">上传图片
        </el-button>
        <yl-dialog :show.sync="dialogVisible" @submit="handleSubmit" title="上传图片" v-if="dialogVisible">
            <div slot="content">
                <yl-file-upload v-model="fileList"></yl-file-upload>
            </div>
        </yl-dialog>
    </div>
</template>

<script>
    export default {
        name: 'EditorSlideUpload',
        props: {

        },
        data() {
            return {
                dialogVisible: false,
                fileList: []
            }
        },
        methods: {
            handleSubmit() {
                this.$emit('successCBK', this.fileList);
                this.fileList = [];
                this.dialogVisible = false;
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .editor-slide-upload {
        margin-bottom: 20px;
        /deep/ .el-upload--picture-card {
            width: 100%;
        }
    }
</style>
