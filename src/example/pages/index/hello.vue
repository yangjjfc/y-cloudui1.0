<template>
    <section class="container_setion">
        <div class="my-errors">
            <div class="e-icon"></div>
            <p>欢迎使用云ERP管理系统</p>
        </div>
    </section>
</template>
<script>
    export default {
        data () {
            return {
                search: {},
                list: []
            };
        },
        computed: {},
        methods: {
        }
    };

</script>

<style lang="scss" scoped>
    .my-errors{
        width: 100%;
        text-align: center;
        padding: 100px;
        .e-icon{
            background: url('./img/oms.png') no-repeat center center;
            min-height: 250px;
        }
        p {
            font-size: 18px;
            color: #666;
        }

    }
</style>