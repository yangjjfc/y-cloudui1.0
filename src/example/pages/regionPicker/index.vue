<template>
    <section class="container_setion">
        <markdown  :content="md" />
        <div class="demo">
            <h3>禁用 :disabled="true"</h3>
            <yl-region-picker :disabled="true"></yl-region-picker>
            <h3>默认选中 浙江省杭州市西湖区，编号：330106</h3>
            <yl-region-picker :codes="code" @change="getAreaId" @input="getAreaName"></yl-region-picker>
        </div>
        <markdown  :content="opt" />
    </section>
</template>
<script>
    import md from  './index.md';
    import opt from  './opt.md';

    export default {
        data() {
            return {
                code:'',
                md,
                opt
            };
        },
        methods: {
            getAreaId(val){
                console.log(val);
            },
            getAreaName(val){
                console.log(val);
            }
        },
        mounted() {
            setTimeout(()=>{
                this.code='330106'
            },200)
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