<template>
    <section class="container_setion">
        <div class="demo">
            <h1>Example</h1>
            <br>
            <div v-if="print.show">
                <yl-print :show.sync="print.show" :data="print.data" type="view"></yl-print>
            </div>
            <el-button type="primary" @click="funcPrint">打印</el-button>
            <br><br>
            <a href="http://www.lodop.net/" target="_blank">了解CLodop</a>
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
                print: {
                    show: false,
                    data: {
                        no: 'ims-purchase-order'
                    }
                }
            };
        },
        methods: {
            funcPrint (msg, type) {
                this.print.show = true;
                let _json = {
                    params: {billNo: 'CGDD201808010006'},
                    url: 'ims.purchase.get'
                };
                this.print.data = {...this.print.data, ..._json};
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