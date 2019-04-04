<template>
    <el-pagination  :total="total" 
                    :page-size="currentSize" 
                    @size-change="changeSize" 
                    :current-page="currentIndex" 
                    @current-change="changePage"
                    :page-sizes="pageSizes"
                    :disabled="disabled"
                    :layout="layout" 
                    class="pagination">
    </el-pagination>
</template>
<script>
export default {
    name: 'yl-pagination',
    data () {
        return {
            isChangeSizeEvent: false// 标记,避免重复更新
        };
    },
    // 需要传的参数
    props: {
        total: { // 总页数
            type: [String, Number],
            required: true
        },
        pageSize: { // 单页显示数量
            type: [String, Number],
            required: true
        },
        pageIndex: { // 页码
            type: [String, Number],
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        pageSizes: {
            type: Array,
            default: () => [10, 20, 30, 40, 50, 100] 
        },
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        }
        
    },
    computed: {
        currentIndex: {
            get () {
                return Number(this.pageIndex);
            },
            set (page) {
                this.$emit('update:pageIndex', page);
            }
        },
        currentSize: {
            get () {
                return Number(this.pageSize);
            },
            set (size) {
                this.$emit('update:pageSize', size);
            }
        }
    },
    methods: {      
        // 改变页码
        changePage (page) {
            if (this.isChangeSizeEvent) {
                this.isChangeSizeEvent = false;
                return; 
            }
            this.currentIndex = page;
            this.$emit('change', page, this.size);
        },
        // 改变总条数
        changeSize (size) {
            if (Number(this.total) / size < this.currentIndex) {
                this.isChangeSizeEvent = true;// 阻止changePage触发
            }
            this.currentSize = size;
            this.$emit('change', 1, size);
        }
    }
};
</script>


<style lang="scss" scoped>
.pagination{
    margin-top: 10px;
}
</style>