<template>
    <section class="container_setion">
        <markdown  :content="md" />
        <h3>示例图示：</h3>
        <br>
        <yl-icon class="block-icon" className="icon-tubiao-2"></yl-icon>
        <br>
        <br>
        <br>
        <br>
        <h3>其他</h3>
        <ul class="icon-list">
            <li v-for="(item, index) in list" :key="index">
                <yl-icon class="block-icon" :className="item"></yl-icon>
                <p>{{item}}</p>
            </li>
        </ul>
        <a href="https://www.iconfont.cn/" target="_blank">查看更多图标</a>
    </section>
</template>
<script>
    import md from  './index.md';

    export default {
        data() {
            return {
                md,
                list: ['icon-dingdanzhuangtai-3','icon-denglu-1','icon-denglu-','icon-tongyong-']
            };
        },
        methods: {
            
        },
        mounted() {
        }
    };

</script>

<style lang="scss" scoped>
.icon-list {
    overflow: hidden;
    list-style: none;
    li{
        float: left;
        text-align: center;
        padding: 10px;
        p {
            margin: 10px auto;
        }
    }
}
.block-icon{
    font-size: 30px;
}
</style>