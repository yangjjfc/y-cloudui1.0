<template>
    <section class="container_setion">
        <el-button type="primary" size="small" @click="showDialog">DIALOG</el-button>
        <yl-dialog title="选择批号" :show.sync="show" width="1200px" @submit="submit">
            <div slot="content">
                <myTable></myTable>
            </div>
            <span slot='btns' style="margin-right:10px">
          <el-button type="primary" size="small">暂存</el-button>
          <el-button type="primary" size="small">暂存</el-button>
          <el-button type="primary" size="small">暂存</el-button>
          <el-button type="primary" size="small">暂存</el-button>
        </span>
        </yl-dialog>
        <el-progress :percentage="100" :show-text="false" style="margin:20px 0" :stroke-width="2"></el-progress>

        <markdown :content="md" />
    </section>
</template>
<script>
    import md from "./index.md";
    import myTable from '../table/index'

    export default {
        data() {
            return {
                md,
                show: false
            };
        },
        methods: {
            submit() {
                this.show = false
            },
            showDialog() {
                this.show = true
            },
        },
        mounted() {
        },
        components: {
            myTable
        }
    };
</script>