<template>
    <section class="container_setion">
        <markdown :content="md"></markdown>
        <!---->
        <h3 class="mgb10">应用实例</h3>
        <div>
            <yl-editor :height="300" v-model="content" :isUploadBtn="true"/>
        </div>
    </section>
</template>
<script>
    import md from './index.md';

    export default {
        data() {
            return {
                md,
                content: '默认内容'
            };
        },
        components:{
        },
        methods: {

        },
        mounted() {
        }
    };

</script>

<style lang="scss">

</style>