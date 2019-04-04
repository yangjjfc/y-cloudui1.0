<template>
    <VueMarkdown :source="source" table-class="el-table"></VueMarkdown>
</template>
<script>
    import Prism from 'prismjs';
    import dedent from 'dedent';
    import VueMarkdown from 'vue-markdown';
    export default {
        name: 'markdown',
        data() {
            return {
                source: ''
            };
        },
        components: {
            VueMarkdown
        },
        props: {
            content: {
                type: String,
                required: true
            }
        },
        mounted() {
            this.source = dedent(this.content || '没有内容');
            this.$nextTick(function(){
                Prism.highlightAll();
            });

        }
    };

</script>

<style lang="scss">

</style>