<template>
  <section class="container_setion">
     <el-tag class="tag-title" style="margin-bottom:20px">demo:</el-tag>
    <yl-pagination :total="page.total" :pageSize.sync="page.pageSize" :pageIndex.sync="page.pageIndex" @change="getList()"></yl-pagination>
    <el-progress :percentage="100" :show-text="false" style="margin:20px 0"  :stroke-width="2"></el-progress>
    <markdown  :content="md" />
  </section>
</template>
<script>
import md from "./index.md";
export default {
  data() {
    return {
      md,
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 100
      }
    };
  },
  methods: {
        getList(){}

  }
};
</script>

<style lang="scss">
</style>