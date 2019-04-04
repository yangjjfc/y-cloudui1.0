<template>
    <section class="container_setion">
        <div class="demo">
            <h1>Example</h1>
            <br>
            <div v-if="imoprt.show">
                <yl-import-excel :show.sync="imoprt.show" :url="imoprt.url" :params="imoprt.params" @success="getList"></yl-import-excel>
            </div>
            <el-button type="primary" @click="importWare">导入</el-button>
        </div>
        <markdown  :content="md" />
    </section>
</template>
<script>
    import md from  './index.md';

    export default {
        data() {
            return {
                md,
                imoprt: {
                    show: false,
                    params: {
                        readParams: {},
                        importsParams: {},
                        checParams: {},
                        downParams: {}
                    },
                    url: {
                        read: 'cdc.customer.readExcel',
                        imports: 'cdc.customer.importExcel',
                        checExcel: 'cdc.customer.checkExcel',
                        downFile: 'cdc.customer.importExcelTemplate'
                    }
                }
            };
        },
        methods: {
            importWare(){
                this.imoprt.show = true;
            },
            getList(){
                console.log('导入成功');
            }
        },
        mounted() {
        }
    };
</script>

<style lang="scss" scoped>
.demo{
    /deep/ .el-select{
        width: 32.5%;
    }
    width: 500px;
    h3{
        padding: 10px 0;
    }
}
</style>